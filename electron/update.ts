import { app, dialog, shell } from 'electron';
import fetch from 'node-fetch';
import https from 'https';

export async function checkForUpdates() {
  return new Promise<boolean>(resolve => {
    const host = '127.0.0.1';
    fetch(`https://${host}/league-tool/updates/latest.json`, {
      agent: new https.Agent({ rejectUnauthorized: false }),
    })
      .then(res => res.text())
      .then(text => {
        const data = JSON.parse(text);
        if (data['version'] === app.getVersion()) {
          resolve(false);
        } else {
          dialog
            .showMessageBox({
              message: `LeagueTool 发现了新版本：${data['version']}，是否更新？`,
              detail: data['notice'],
              type: 'info',
              buttons: ['退出', '查看公告', ...data['download'].map((item: { name: string }) => item['name'])],
              defaultId: 1,
              cancelId: 0,
              title: app.name,
              noLink: true,
            })
            .then(returnValue => {
              if (returnValue.response === 1) {
                shell.openExternal(data['notice']);
              } else if (returnValue.response >= 2) {
                shell.openExternal(data.download[returnValue.response - 2]['url']);
              }
              app.quit();
            });
        }
      })
      .catch((err: Error) => {
        dialog
          .showMessageBox({
            message: 'LeagueTool 检查更新失败，请检查网络环境或重新安装',
            detail: `${err.message}\n${err.stack}`,
            type: 'error',
            title: app.name,
            noLink: true,
          })
          .then(() => app.quit());
      });
  });
}