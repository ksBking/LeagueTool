import { lcu } from '../lcu-api';
import { createHttpRequest } from '../league-connect';
import { getChampionAlias, getPosition } from './data';

const config = {
  session: null,
  loadedInfo: false,
};

async function getSummonerById(summonerId) {
  const { data } = await createHttpRequest({ url: `/lol-summoner/v1/summoners/${summonerId}` }, lcu.credentials);
  return data;
}

export async function champSelect() {
  //
  if (!config.session) {
    config.session = await getChampSelectSession();
  }
  const conversationId = await getConversationId();
  const info = await getInfo(config.session);
  for (const item of formatInfo(info)) {
    console.log(item);

    await postMessage(conversationId, item);
  }
  await postMessage(conversationId, 'LeagueTool下载地址：\nhttps://ksbking.gitee.io/league-tool/');
}

export function champSelectSession(session) {
  console.log(session);
  config.session = session;
  //
}

async function getChampSelectSession() {
  const { data } = await createHttpRequest(
    {
      url: '/lol-champ-select/v1/session',
    },
    lcu.credentials
  );
  console.log(data);
  return data;
}

async function getMatchHistory(puuid) {
  const { data } = await createHttpRequest(
    {
      url: `/lol-match-history/v1/products/lol/${puuid}/matches?begIndex=0&endIndex=6`,
    },
    lcu.credentials
  );
  console.log(data);

  return data;
}

function getMatchHistoryDetial(games) {
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

async function getChampionMastery(summonerId) {
  const { data } = await createHttpRequest(
    {
      url: `/lol-collections/v1/inventories/${summonerId}/champion-mastery/top?limit=9`,
    },
    lcu.credentials
  );
  return data;
}

function getChampionMasteryDetial(masteries) {
  return masteries.map(item => item.championId);
}

async function getRankedStats(puuids) {
  const { data } = await createHttpRequest(
    {
      url: `/lol-ranked/v1/ranked-stats?puuids=${puuids}`,
    },
    lcu.credentials
  );
  return data;
}

function mergeRankedStats(arr, rankedStats) {
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

async function getConversationId() {
  return new Promise<void>((resolve, reject) => {
    const interval = setInterval(async () => {
      // 防止 client 正在启动时，导致初始化失败
      const {
        data: [{ id }],
      } = await createHttpRequest({ url: '/lol-chat/v1/conversations' }, lcu.credentials);
      if (id) {
        clearInterval(interval);
      }
      resolve(id);
    }, 1000);
  });
}

async function postMessage(id, msg) {
  const { data } = await createHttpRequest(
    {
      url: `/lol-chat/v1/conversations/${id}/messages`,
      method: 'POST',
      body: {
        body: msg,
        type: 'chat',
      },
    },
    lcu.credentials
  );
  return data;
}

async function getInfo(session) {
  const arr: Array<object> = [];
  console.log(session);

  for await (const item of session.myTeam.filter(item => item.summonerId !== 0).sort((a, b) => a.cellId - b.cellId)) {
    const { displayName, puuid } = await getSummonerById(item.summonerId);
    const {
      games: { games: rawGames },
    } = await getMatchHistory(puuid);
    const games = getMatchHistoryDetial(rawGames);
    const { masteries: rawMasteries } = await getChampionMastery(item.summonerId);
    const masteries = getChampionMasteryDetial(rawMasteries);

    arr.push({
      displayName,
      assignedPosition: item.assignedPosition,
      summonerId: item.summonerId,
      puuid,
      games,
      masteries,
    });
  }

  const rankedStats = await getRankedStats(JSON.stringify(arr.map(item => item['puuid'])));

  return mergeRankedStats(arr, rankedStats);
}

function formatInfo(info) {
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
