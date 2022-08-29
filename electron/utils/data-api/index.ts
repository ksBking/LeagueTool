import fetch from 'node-fetch';

export function getGameNotice() {
  return new Promise<any>(resolve => {
    fetch(`https://apps.game.qq.com/cmc/zmMcnTargetContentList?page=1&num=7&target=24`)
      .then(res => res.json())
      .then(data => resolve(data));
  });
}
