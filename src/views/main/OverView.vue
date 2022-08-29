<template>
  <div class="overview-view">
    <div class="primary">
      <div class="promo" @mouseenter="promoStop" @mouseleave="promoStart">
        <div class="img-list">
          <transition-group name="promo">
            <a class="item" v-show="index === promoCurrentIndex" :href="formatURL(item.adUrl)" :title="item.ad_memo" target="_blank" v-for="(item, index) in promoList" :key="item.actionID">
              <img :src="item.imgUrl" :alt="item.Fname" />
            </a>
          </transition-group>
        </div>
        <div class="title-list">
          <div class="item" :class="{ selected: promoCurrentIndex === index }" v-for="(item, index) in promoList" :key="item.adId" :title="item.Fname">
            <span @mouseenter="promsSlect(index)">{{ item.Fname }}</span>
          </div>
        </div>
      </div>
      <div class="news">
        <div class="champions">
          <a class="item" href="" target="_blank">
            <img src="//ossweb-img.qq.com/upload/adw/image/977/20220825/8db7d150219aa82a1fc20081a96b2ca7.webp" alt="" />
            <div class="cover">
              <div class="title">兽灵行者 乌迪尔</div>
              <div class="sub">他踏寒风而来，在平衡与纷争中探寻弗雷尔卓德的未来</div>
            </div>
          </a>
          <a class="item" href="" target="_blank">
            <img src="//ossweb-img.qq.com/upload/adw/image/977/20220825/8db7d150219aa82a1fc20081a96b2ca7.webp" alt="" />
            <div class="cover">
              <div class="title">兽灵行者 乌迪尔</div>
              <div class="sub">他踏寒风而来，在平衡与纷争中探寻弗雷尔卓德的未来</div>
            </div>
          </a>
        </div>
        <div class="game-notice">
          <div class="notice-title">游戏公告</div>
          <a class="item" :href="item.sRedirectURL" target="_blank" v-for="item in gameNotice" :key="item.iDocID" :title="item.sTitle">
            <span class="title">{{ item.sTitle }}</span>
            <span class="time">{{ formatNoticeTime(item.sIdxTime) }}</span>
          </a>
        </div>
        <div class="notice">
          <div class="notice-title">游戏公告</div>
          <a class="item" :href="item.sRedirectURL" target="_blank" v-for="item in gameNotice.slice(0, 3)" :key="item.iDocID" :title="item.sTitle">
            <span class="title">{{ item.sTitle }}</span>
            <span class="time">{{ formatNoticeTime(item.sIdxTime) }}</span>
          </a>
        </div>
      </div>
    </div>
    <div class="nav">
      <a class="item" href="https://ksbking.gitee.io/league-tool/" target="_blank" title="官方网站">官方网站</a>
      <a class="item" href="https://lol.qq.com/" target="_blank" title="游戏官网">游戏官网</a>
      <a class="item" href="https://101.qq.com/" target="_blank" title="攻略中心">攻略中心</a>
      <a class="item" href="https://lol.qq.com/news/index.shtml" target="_blank" title="新闻列表">新闻列表</a>
      <a class="item" href="https://lol.qq.com/gicp/news/423/2/1334/1.html" target="_blank" title="历史版本">历史版本</a>
      <a class="item" href="https://lol.qq.com/activity/index.shtml" target="_blank" title="活动中心">活动中心</a>
      <a class="item" href="https://lol.qq.com/v/" target="_blank" title="视频中心">视频中心</a>
      <a class="item" href="https://lol.qq.com/act/a20180929awards/index.html" target="_blank" title="领取中心">领取中心</a>
      <a class="item" href="https://lol.qq.com/act/a20210625icon/index.html" target="_blank" title="图标领取">图标领取</a>
      <a class="item" href="https://lol.qq.com/act/a20190528lolscore/" target="_blank" title="信誉分">信誉分</a>
      <a class="item" href="https://lol.qq.com/act/a20150326dqpd/" target="_blank" title="大区状态">大区状态</a>
      <a class="item" href="https://lol.qq.com/act/a20200710transferzone/index.html" target="_blank" title="转区系统">转区系统</a>
      <a class="item" href="https://lol.qq.com/act/a20200227logout/" target="_blank" title="账号注销">账号注销</a>
      <a class="item">占位</a>
      <a class="item">占位</a>
      <a class="item">占位</a>
      <a class="item">占位</a>
      <a class="item">占位</a>
      <a class="item">占位</a>
    </div>
    <div class="activity">
      <a class="item" :href="formatURL(item.sActDetailUrl)" target="_blank" v-for="item in activityList" :key="item.iActId">
        <img :src="formatURL(item.sSmallnewImgUrl)" :alt="item.sName" />
        <span class="cuntdown">{{ formatActivityCuntdown(item) }}</span>
        <div class="cover">
          <div class="title">{{ item.sName }}</div>
          <div class="sub">{{ item.sDescripion }}</div>
          <div class="sub">{{ formatActivityTime(item) }}</div>
        </div>
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

function formatURL(url: string) {
  if (url.slice(0, 2) === '//') {
    return 'https:' + url;
  } else {
    return url;
  }
}

// 轮播图
const promoCurrentIndex = ref(0);
const promoList: any[] = reactive([]);
let promoInterval: number | undefined;
fetch(`https://ossweb-img.qq.com/images/clientpop/idata_ad/idata_ad_15282.js?d=${Date.now()}`)
  .then(res => res.text())
  .then(data => {
    const obj = JSON.parse(data.slice(data.indexOf('{'))).common;
    promoList.push(
      ...Object.values(obj)
        .sort((a: any, b: any) => a.adId - b.adId)
        .slice(-5)
    );
    promoStart();
  });

function promoStart() {
  promoInterval = setInterval(() => {
    if (promoCurrentIndex.value >= promoList.length - 1) {
      promoCurrentIndex.value = 0;
    } else {
      promoCurrentIndex.value++;
    }
  }, 3000);
}
function promsSlect(index: number) {
  promoStop();
  promoCurrentIndex.value = index;
}
function promoStop() {
  clearInterval(promoInterval);
}

promoInterval;

// 活动列表
const activityList: any[] = reactive([]);
fetch(`https://ossweb-img.qq.com/images/clientpop/act/lol/lol_act_1_index.js?v=18&_=${Date.now()}`)
  .then(res => res.text())
  .then(data => {
    activityList.push(...JSON.parse(data.slice(data.indexOf('['), data.indexOf('];') + 1)).filter((item: { iStatus: number }) => item.iStatus > -1));
  });
function formatActivityCuntdown(item: { iStatus: number; iDate: number }) {
  if (item.iStatus === 999) {
    return '长期活动';
  } else if (item.iStatus === 998) {
    return '限时活动';
  } else if (item.iDate > 1) {
    return `${item.iDate}天后结束`;
  } else {
    return '今天结束';
  }
}
function formatActivityTime(item: { dtBegin: any; dtEnd: any; iStatus: number }) {
  if (item.iStatus === 999 || item.iStatus === 998) {
    return `开启时间：${item.dtBegin}`;
  } else {
    return `${item.dtBegin}-${item.dtEnd}`;
  }
}

// 左侧小图
const popList: any[] = reactive([]);
fetch('https://ossweb-img.qq.com/images/clientpop/idata_ad/16576.json')
  .then(res => res.text())
  .then(data => {
    console.log(Object.values(JSON.parse(data)).filter((item: any) => item.length));

    popList.push();
  });

// 游戏公告
const gameNotice: any[] = reactive([]);
window.electronAPI.mainWnd.onGameNotice((event, data: { data: any }) => {
  gameNotice.push(...data.data.result);
  console.log(gameNotice);
});
window.electronAPI.mainWnd.getGameNotice();

function formatNoticeTime(time: string) {
  const date = new Date(time);
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;
}
</script>

<style lang="scss">
.overview-view {
  display: flex;

  .primary {
    display: flex;
    flex-direction: column;
    width: 820px;
    height: 100%;
    overflow: hidden;

    .promo {
      display: flex;
      flex-direction: column;
      border-radius: 4px;
      overflow: hidden;
      width: 820px;
      height: 370px;
      .img-list {
        position: relative;
        width: 820px;
        height: 340px;
        overflow: hidden;
        .item {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .promo-enter-active,
        .promo-leave-active {
          transition: opacity 0.5s;
        }
        .promo-enter-from,
        .promo-leave-to {
          opacity: 0;
        }
      }
      .title-list {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: calc(100% - 340px);
        background-color: #171718;
        .item {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          transition: background-color 0.15s;
          span {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            font-size: 14px;
            letter-spacing: 1px;
          }
          &.selected {
            color: #d1d1d1;
            background-color: #4d5bff;
          }
        }
      }
    }

    .news {
      display: flex;
      width: 100%;
      height: calc(100% - 370px);
      padding-top: 8px;

      .champions {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
        .item {
          position: relative;
          display: flex;
          justify-content: center;

          width: 100%;
          color: #cccccc;
          &:first-child {
            margin-bottom: 4px;
          }
          &:last-child {
            margin-top: 4px;
          }
          img {
            width: 100%;
            border-radius: 4px;
          }
          .cover {
            position: absolute;
            left: 0;
            top: 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            width: 100%;
            height: 100%;
            padding: 4px;
            background-image: linear-gradient(to bottom, hsla(0, 0%, 0%, 0), hsla(0, 0%, 0%, 0.6));
            border-width: thin;
            border-style: solid;
            border-image: linear-gradient(180deg, #ebe1c8, #b98b30) 1 stretch;
            .title {
              font-size: 14px;
              color: #cdbe91;
            }
            .sub {
              font-size: 12px;
              color: #9d9c9c;
            }
          }
        }
      }

      .game-notice {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 300px;
        height: 100%;
        margin-left: 8px;
        padding-bottom: 4px;
        border-radius: 4px;
        border: 1px solid hsla(0, 0%, 100%, 0.05);
        background-color: #1e1e1f;
        .notice-title {
          width: 100%;
          padding: 4px 0;
          font-size: 14px;
          text-align: center;
          background-color: #232324;
        }
        .item {
          display: flex;
          text-decoration: none;
          justify-content: space-between;
          padding: 4px 8px;
          font-size: 14px;
          color: #cccccc;
          transition: background-color 0.15s;
          &:hover {
            background-color: #232324;
          }
          .title {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          .time {
            white-space: nowrap;
          }
        }
      }
    }
  }

  .nav {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: calc(100% - 820px - 160px);
    height: 100%;
    padding: 0 8px;
    .item {
      display: inline-block;
      padding: 4px;
      text-align: center;
      font-size: 12px;
      text-decoration: none;
      border-radius: 4px;
      border: 1px solid hsla(0, 0%, 100%, 0.05);
      background-color: #1e1e1f;
      color: #cccccc;
      transition: background-color 0.15s;
      &:hover {
        background-color: #232324;
      }
      &:active {
        background-color: #1e1e1f;
      }
    }
  }

  .activity {
    width: 160px;
    height: 100%;
    padding-right: 4px;
    overflow: auto;
    .item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      margin-bottom: 8px;
      border-radius: 4px;
      overflow: hidden;
      text-decoration: none;
      color: #cccccc;
      &:last-child {
        margin-bottom: 0;
      }
      img {
        width: 100%;
        height: auto;
        margin: 0;
      }
      .cuntdown {
        position: absolute;
        top: 4px;
        right: 4px;
        padding: 0 4px;
        font-size: 12px;
        border-radius: 4px;
        background-color: #a47d33;
        color: #fff;
      }
      .cover {
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        width: 100%;
        height: 100%;
        padding: 4px;
        opacity: 0;
        background-color: hsla(0, 0%, 0%, 0.8);
        transition: opacity 0.15s;
        .title {
          margin-bottom: 8px;
          text-align: center;
          font-size: 14px;
          color: #cdbe91;
        }
        .sub {
          text-align: center;
          font-size: 12px;
          color: #9d9c9c;
        }
      }
      &:hover {
        .cover {
          opacity: 1;
        }
      }
    }
  }
}
</style>
