import { BrowserWindow, Tray } from 'electron';
import { exec } from 'child_process';
import https from 'https';

import { getChampionAlias, getPosition } from './data';

export class LOL {
  win: BrowserWindow | null;
  lcu: { port: string; token: string; pid: string };
  tray: Tray | null;
  constructor(win: BrowserWindow | null) {
    this.win = win;
    this.tray = null;
    this.lcu = {
      port: '',
      token: '',
      pid: '',
    };
  }

  public updateWin(win: BrowserWindow | null): void {
    this.win = win;
  }

  public updateTray(tray: Tray): void {
    this.tray = tray;
  }

  private execShellCmdline(cmd: string) {
    return new Promise<string>(resolve => {
      exec(cmd, { shell: 'powershell' }, (error, stdout, stderr) => {
        if (error) {
          resolve('');
          throw new Error(stderr);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  private async getUxCmdline() {
    const cmd = `Get-CimInstance -Query "SELECT * from Win32_Process WHERE name LIKE 'LeagueClientUx.exe'" | Select-Object CommandLine | fl`;
    const rawStdout = await this.execShellCmdline(cmd);
    const stdout = rawStdout.replace(/\s/g, '');
    const port = stdout.match(/--app-port=([0-9]+)/);
    const token = stdout.match(/--remoting-auth-token=([\w-_]+)/);
    if (port && token) {
      this.lcu.port = port[1];
      this.lcu.token = token[1];
      return true;
    } else {
      this.lcu.port = '';
      this.lcu.token = '';
      return false;
    }
  }

  private callAPI(options: { url: string; method?: 'GET' | 'POST' | 'PUT'; body?: object; encoding?: 'utf8' | 'base64'; parse?: boolean }) {
    console.log('callAPI :>> ', options);
    return new Promise<string>(resolve => {
      const request = https.request(
        {
          host: '127.0.0.1',
          port: this.lcu.port,
          path: options.url,
          method: options.method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + Buffer.from(`riot:${this.lcu.token}`).toString('base64'),
          },
          agent: new https.Agent({ rejectUnauthorized: false }),
        },
        res => {
          const data: Buffer[] = [];
          res.on('data', chunk => data.push(chunk));
          res.on('end', () => resolve(Buffer.concat(data).toString(options.encoding)));
        }
      );
      if (options.body !== undefined) {
        request.write(JSON.stringify(options.body));
      }

      request.on('error', err => console.error(err));
      request.end();
    });
  }

  private async getClientPidByRequest() {
    const data = await this.callAPI({ url: '/performance/v1/report' });
    return JSON.parse(data).some((item: { ProcessType: string; ProcessId: number }) => {
      if (item.ProcessType === 'Primary') {
        this.lcu.pid = item.ProcessId.toString();
        return true;
      }
    });
  }

  private async getGameflowPhase() {
    const data = await this.callAPI({ url: '/lol-gameflow/v1/gameflow-phase' });
    return JSON.parse(data);
  }

  private async getIsInClient() {
    const cmd = `Get-CimInstance -Query "SELECT * from Win32_Process WHERE ProcessId = ${this.lcu.pid}" | Select-Object Name | fl`;
    const stdout = await this.execShellCmdline(cmd);
    if (stdout.includes('LeagueClient.exe')) {
      return true;
    }
    return false;
  }

  private getMyCellId(session, summonerId) {
    return session.myTeam.filter(item => item.summonerId === summonerId)[0].cellId;
  }

  private async getChampSelectSession() {
    // const data = await this.callAPI({ url: "/lol-champ-select/v1/session" });
    const data = await this.callAPI({
      url: '/lol-champ-select-legacy/v1/session',
    });
    return JSON.parse(data);
  }

  private async getSummoner(summonerId) {
    const data = await this.callAPI({
      url: `/lol-summoner/v1/summoners/${summonerId}`,
    });
    return JSON.parse(data);
  }

  private async getMatchHistory(puuid) {
    const data = await this.callAPI({
      url: `/lol-match-history/v1/products/lol/${puuid}/matches?begIndex=0&endIndex=6`,
    });
    console.log(data);

    return JSON.parse(data);
  }

  private getMatchHistoryDetial(games) {
    return games
      .sort((a, b) => b.gameCreation - a.gameCreation)
      .map(item => {
        return {
          queueId: item.queueId,
          championId: item.participants[0].championId,
          win: item.participants[0].stats.win,
          kills: item.participants[0].stats.kills,
          deaths: item.participants[0].stats.deaths,
          assists: item.participants[0].stats.assists,
        };
      });
  }

  private async getChampionMastery(summonerId) {
    const data = await this.callAPI({
      url: `/lol-collections/v1/inventories/${summonerId}/champion-mastery/top?limit=9`,
    });
    return JSON.parse(data);
  }

  private getChampionMasteryDetial(masteries) {
    return masteries.map(item => item.championId);
  }

  private async getRankedStats(puuids) {
    const data = await this.callAPI({
      url: `/lol-ranked/v1/ranked-stats?puuids=${puuids}`,
    });
    return JSON.parse(data);
  }

  private mergeRankedStats(arr, rankedStats) {
    return arr.map(item => {
      return {
        displayName: item.displayName,
        assignedPosition: item.assignedPosition,
        summonerId: item.summonerId,
        puuid: item.puuid,
        games: item.games,
        masteries: item.masteries,
        ranked: {
          RANKED_SOLO_5x5: {
            division: rankedStats[item.puuid].queueMap.RANKED_SOLO_5x5.division,
            leaguePoints: rankedStats[item.puuid].queueMap.RANKED_SOLO_5x5.leaguePoints,
            tier: rankedStats[item.puuid].queueMap.RANKED_SOLO_5x5.tier,
            wins: rankedStats[item.puuid].queueMap.RANKED_SOLO_5x5.wins,
          },
          RANKED_FLEX_SR: {
            division: rankedStats[item.puuid].queueMap.RANKED_FLEX_SR.division,
            leaguePoints: rankedStats[item.puuid].queueMap.RANKED_FLEX_SR.leaguePoints,
            tier: rankedStats[item.puuid].queueMap.RANKED_FLEX_SR.tier,
            wins: rankedStats[item.puuid].queueMap.RANKED_FLEX_SR.wins,
          },
        },
      };
    });
  }

  private async getConversationId() {
    const [{ id }] = JSON.parse(await this.callAPI({ url: '/lol-chat/v1/conversations' }));
    return id;
  }

  private async postMessage(id, msg) {
    const data = await this.callAPI({
      url: `/lol-chat/v1/conversations/${id}/messages`,
      method: 'POST',
      body: {
        body: msg,
        type: 'chat',
      },
    });
    return JSON.parse(data);
  }

  private async getInfo(session) {
    const arr: Array<object> = [];
    console.log(session);

    for await (const item of session.myTeam.filter(item => item.summonerId !== 0).sort((a, b) => a.cellId - b.cellId)) {
      const { displayName, puuid } = await this.getSummoner(item.summonerId);
      const {
        games: { games: rawGames },
      } = await this.getMatchHistory(puuid);
      const games = this.getMatchHistoryDetial(rawGames);
      const { masteries: rawMasteries } = await this.getChampionMastery(item.summonerId);
      const masteries = this.getChampionMasteryDetial(rawMasteries);

      arr.push({
        displayName,
        assignedPosition: item.assignedPosition,
        summonerId: item.summonerId,
        puuid,
        games,
        masteries,
      });
    }

    const rankedStats = await this.getRankedStats(JSON.stringify(arr.map(item => item['puuid'])));

    return this.mergeRankedStats(arr, rankedStats);
  }

  private formatInfo(info) {
    return info.map((item, cell) => {
      const header = `${getPosition(item.assignedPosition)}（${item.displayName}）:\n`;
      const games = `${item.games
        .map((game, index) => {
          return `|#${cell + 1}${getPosition(item.assignedPosition)}—战绩—${index + 1}.${game.win ? '√' : '×'} [${game.queueId}] ${getChampionAlias(game.championId)} (${game.kills}/${game.deaths}/${
            game.assists
          })`;
        })
        .join('\n')}\n`;

      const masteries =
        item.masteries
          .map((id, index) => {
            if (index % 3 === 0) {
              return `|#${cell + 1}${getPosition(item.assignedPosition)}—擅长—${item.masteries
                .slice(index, index + 3)
                .map(item => getChampionAlias(item))
                .join(' ')}`;
            }
          })
          .filter(item => item)
          .join('\n') + '\n';

      const RANKED_SOLO_5x5 = `|#${cell + 1}${getPosition(item.assignedPosition)}—段位—单双-${item.ranked.RANKED_SOLO_5x5.tier} ${item.ranked.RANKED_SOLO_5x5.division} ${
        item.ranked.RANKED_SOLO_5x5.leaguePoints
      } [胜场:${item.ranked.RANKED_SOLO_5x5.wins}]\n`;
      const RANKED_FLEX_SR = `|#${cell + 1}${getPosition(item.assignedPosition)}—段位—灵活-${item.ranked.RANKED_FLEX_SR.tier} ${item.ranked.RANKED_FLEX_SR.division} ${
        item.ranked.RANKED_FLEX_SR.leaguePoints
      } [胜场:${item.ranked.RANKED_FLEX_SR.wins}]\n`;
      return header + games + masteries + RANKED_SOLO_5x5 + RANKED_FLEX_SR;
    });
  }

  public loop() {
    let loopId = 0;
    let loadedInfo = false;
    setInterval(async () => {
      if (loopId >= 1 || (await this.getUxCmdline())) {
        // 获取到Ux命令行
        if (loopId >= 2 || (await this.getClientPidByRequest())) {
          // 获取到 client pid
          if (await this.getIsInClient()) {
            // client 存在
            loopId = 2;

            // console.log(loopId, this.lcu);

            const phase = await this.getGameflowPhase();

            if (phase !== 'ChampSelect') {
              loadedInfo = false;
            }
            if (phase === 'ChampSelect') {
              if (!loadedInfo) {
                const session = await this.getChampSelectSession();
                const conversationId = await this.getConversationId();
                const info = await this.getInfo(session);

                for (const item of this.formatInfo(info)) {
                  console.log(item);

                  await this.postMessage(conversationId, item);
                }

                loadedInfo = true;
              }

              // console.log("cellId :>> ", this.getMyCellId(session, 4116816171));
              // if (session.timer.phase === "PLANNING") {
              //   console.log("正在预选英雄");
              // } else if (session.timer.phase === "BAN_PICK") {
              //   console.log("正在禁用或选择英雄英雄");
              //   session.actions.forEach((round) => {
              //     round.forEach((item) => {
              //       console.log(item);
              //     });
              //   });
              // } else if (session.timer.phase === "FINALIZATION") {
              //   console.log("最后确认阶段");
              // }
            } else {
              console.log('phase', phase);
            }
          } else {
            //client 退出
            loopId = 0;
          }
        } else {
          // 无法获取到 client pid
          loopId = 1;
          console.log(loopId, '获取到Ux命令行', '无法获取到 client pid');
        }
      } else {
        // 无法获取到Ux命令行
        loopId = 0;
        console.log(loopId, '无法获取到Ux命令行');
      }
      console.log('------------------------');
    }, 5000);
  }
}
