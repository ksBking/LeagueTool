import { ipcMain } from 'electron';
import '../../wnd/displayWnd';
import { createHttpRequest, createWebSocketConnection, LeagueClient, type Credentials } from '../league-connect';
import { champSelect, champSelectSession } from './champSelect';

interface lcu {
  credentials: Credentials;
  phase: string | null;
}

export const lcu: lcu = {
  credentials: {
    port: 0,
    token: '',
    pid: 0,
  },
  phase: null,
};

ipcMain.on('get-lcu-phase', () => {
  ipcMain.emit('main-wnd-lcu-phase', lcu.phase);
});

function phaseChange(phase: lcu['phase']) {
  if (lcu.phase !== phase) {
    lcu.phase = phase;
    console.log('LcuApi: phaseChange:', lcu.phase);
    ipcMain.emit('main-wnd-lcu-phase', lcu.phase);

    if (phase === 'None') {
      // 正常界面
      ipcMain.emit('display-wnd-show', phase);
    } else if (phase === 'Lobby') {
      // 房间内
      ipcMain.emit('display-wnd-show', phase);
    } else if (phase === 'Matchmaking') {
      // 队列中
      ipcMain.emit('display-wnd-show', phase);
    } else if (phase === 'CheckedIntoTournament') {
      // 回放
    } else if (phase === 'ReadyCheck') {
      // 找到对局
      ipcMain.emit('display-wnd-show', phase);
    } else if (phase === 'ChampSelect') {
      // 英雄选择
      champSelect();
      ipcMain.emit('display-wnd-show', phase);
    } else if (phase === 'GameStart') {
      // 游戏开始
      ipcMain.emit('display-wnd-close');
      ipcMain.emit('main-wnd-close');
    } else if (phase === 'FailedToLaunch') {
      // 运行失败
    } else if (phase === 'InProgress') {
      // 游戏内
    } else if (phase === 'Reconnect') {
      // 重连
    } else if (phase === 'WaitingForStats') {
      // 正在等待统计
    } else if (phase === 'PreEndOfGame') {
      // 游戏结束前
    } else if (phase === 'EndOfGame') {
      // 游戏结束
      ipcMain.emit('display-wnd-show', phase);
    } else if (phase === 'TerminatedInError') {
      // 错误终止
    } else if (phase === null) {
      // 客户端退出
      ipcMain.emit('display-wnd-close');
    }
  }
}

async function initPhase(credentials: Credentials) {
  console.log('初始化 LcuApi: new phase');
  lcu.credentials = credentials;
  const { data: phase } = await createHttpRequest({ url: '/lol-gameflow/v1/gameflow-phase' }, credentials);
  phaseChange(phase);
}

async function initSocket(credentials: Credentials) {
  console.log('初始化 LcuApi: new ws');
  const ws = await createWebSocketConnection(credentials);
  ws.on('message', (binary: Buffer) => {
    if (binary.length) {
      try {
        // const [, , res] = JSON.parse(binary.toString());
        // console.log(res);
      } catch (err) {
        console.error(err);
      }
    }
  });
  ws.subscribe('/lol-gameflow/v1/gameflow-phase', phase => {
    phaseChange(phase);
  });
  ws.subscribe('/lol-champ-select/v1/session', session => {
    champSelectSession(session);
  });
}

export async function initLcuApi() {
  const client = new LeagueClient();
  client.on('connect', async credentials => {
    console.log('LcuApi: client connect', credentials);
    const interval = setInterval(async () => {
      // 防止 client 正在启动时，导致初始化失败
      if (await createHttpRequest({ url: '/' }, credentials).catch(() => console.warn('初始化 LcuApi: 正在等待客户端加载完成...'))) {
        clearInterval(interval);
        await initPhase(credentials); // 初始化 phase
        await initSocket(credentials); // 初始化 ws
      }
    }, 1000);
  });

  client.on('disconnect', () => {
    console.log('LcuApi: client disconnect');
    phaseChange(null);
  });
  client.start();
}
