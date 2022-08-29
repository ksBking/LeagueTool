import fetch from 'node-fetch';

export function getGameNotice() {
  return new Promise<any>(resolve => {
    fetch('https://apps.game.qq.com/cmc/zmMcnTargetContentList?page=1&num=10&target=24')
      .then(res => res.json())
      .then(data => resolve(data));
  });
}

export function getNotice() {
  return new Promise<any>(resolve => {
    fetch('https://ksbking.gitee.io/data/league-tool/notice.json')
      .then(res => res.json())
      .then(data => resolve(data));
  });
}
export function getSponsors() {
  return new Promise<any>(resolve => {
    fetch('https://ksbking.gitee.io/data/league-tool/sponsors.json')
      .then(res => res.json())
      .then(data => resolve(data));
  });
}
