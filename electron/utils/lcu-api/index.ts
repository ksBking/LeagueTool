import { LeagueClient, type Credentials, createWebSocketConnection, createHttpRequest } from '../league-connect';
import { ipcMain } from 'electron';
import { champSelect, champSelectSession } from './champSelect';
import '../../wnd/displayWnd';

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
  ipcMain.emit('main-wnd-lcu-phase', null, lcu.phase);
});

function phaseChange(phase: lcu['phase']) {
  if (lcu.phase !== phase) {
    lcu.phase = phase;
    console.log('phaseChange:', lcu.phase);
    ipcMain.emit('main-wnd-lcu-phase', null, lcu.phase);

    if (phase === 'None') {
      // 正常界面
      ipcMain.emit('display-wnd-show', null, phase);
    } else if (phase === 'Lobby') {
      // 房间内
      ipcMain.emit('display-wnd-show', null, phase);
    } else if (phase === 'Matchmaking') {
      // 队列中
      ipcMain.emit('display-wnd-show', null, phase);
    } else if (phase === 'CheckedIntoTournament') {
      // 回放
    } else if (phase === 'ReadyCheck') {
      // 找到对局
      ipcMain.emit('display-wnd-show', null, phase);
    } else if (phase === 'ChampSelect') {
      // 英雄选择
      champSelect();
      ipcMain.emit('display-wnd-show', null, phase);
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
      ipcMain.emit('display-wnd-show', null, phase);
    } else if (phase === 'TerminatedInError') {
      // 错误终止
    } else if (phase === null) {
      // 客户端退出
      ipcMain.emit('display-wnd-close');
    }
  }
}

async function initLcu(credentials: Credentials) {
  console.log('new lcu');
  lcu.credentials = credentials;
  const { data: phase } = await createHttpRequest({ url: '/lol-gameflow/v1/gameflow-phase' }, credentials);
  phaseChange(phase);
}

async function initSocket(credentials: Credentials) {
  console.log('new ws');
  const ws = await createWebSocketConnection(credentials);
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
    console.log('client connect', credentials);
    const interval = setInterval(async () => {
      // 防止 client 正在启动时，导致初始化失败
      if (await createHttpRequest({ url: '/' }, credentials)) {
        clearInterval(interval);
        console.log('initLcuApi');
        await initLcu(credentials); // 初始化 lcu
        await initSocket(credentials); // 初始化 ws
      }
    }, 1000);
  });

  client.on('disconnect', () => {
    console.log('client disconnect');
    phaseChange(null);
  });
  client.start();
}
