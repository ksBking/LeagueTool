<template>
  <div class="overview-view">
    <div class="primary">
      <div class="promo" @mouseenter="promoStop" @mouseleave="promoStart">
        <div class="img-list">
          <transition-group name="promo">
            <a class="item" v-show="index === promoCurrentIndex" :href="formatURL(item.adUrl)" :title="item.ad_memo" target="_blank" v-for="(item, index) in promoList" :key="item.actionID">
              <img :src="formatURL(item.imgUrl)" :alt="item.Fname" />
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
            <img src="http://ossweb-img.qq.com/upload/adw/image/977/20220825/8db7d150219aa82a1fc20081a96b2ca7.webp" alt="" />
            <div class="cover">
              <div class="title">兽灵行者 乌迪尔</div>
              <div class="sub">他踏寒风而来，在平衡与纷争中探寻弗雷尔卓德的未来</div>
            </div>
          </a>
          <a class="item" href="" target="_blank">
            <img src="http://ossweb-img.qq.com/upload/adw/image/977/20220825/8db7d150219aa82a1fc20081a96b2ca7.webp" alt="" />
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
    overflow: hidden;
    flex-direction: column;
    width: 820px;
    height: 100%;

    .promo {
      display: flex;
      overflow: hidden;
      flex-direction: column;
      width: 820px;
      height: 370px;
      border-radius: 4px;
      .img-list {
        position: relative;
        overflow: hidden;
        width: 820px;
        height: 340px;
        .item {
          position: absolute;
          top: 0;
          left: 0;
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
          align-items: center;
          justify-content: center;
          width: 100%;
          transition: background-color 0.15s;
          span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            letter-spacing: 1px;
            font-size: 14px;
          }
          &.selected {
            background-color: #4d5bff;
            color: #d1d1d1;
          }
        }
      }
    }

    .news {
      display: flex;
      padding-top: 8px;
      width: 100%;
      height: calc(100% - 370px);

      .champions {
        display: flex;
        overflow: hidden;
        flex-direction: column;
        height: 100%;
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
            top: 0;
            left: 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 4px;
            width: 100%;
            height: 100%;
            border-width: thin;
            border-style: solid;
            border-image: linear-gradient(180deg, #ebe1c8, #b98b30) 1 stretch;
            background-image: linear-gradient(to bottom, hsla(0, 0%, 0%, 0), hsla(0, 0%, 0%, 0.6));
            .title {
              color: #cdbe91;
              font-size: 14px;
            }
            .sub {
              color: #9d9c9c;
              font-size: 12px;
            }
          }
        }
      }

      .game-notice {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 8px;
        padding-bottom: 4px;
        width: 300px;
        height: 100%;
        border: 1px solid hsla(0, 0%, 100%, 0.05);
        border-radius: 4px;
        background-color: #1e1e1f;
        .notice-title {
          padding: 4px 0;
          width: 100%;
          background-color: #232324;
          text-align: center;
          font-size: 14px;
        }
        .item {
          display: flex;
          justify-content: space-between;
          padding: 4px 8px;
          color: #cccccc;
          text-decoration: none;
          font-size: 14px;
          transition: background-color 0.15s;
          &:hover {
            background-color: #232324;
          }
          .title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
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
    padding: 0 8px;
    width: calc(100% - 820px - 160px);
    height: 100%;
    .item {
      display: inline-block;
      padding: 4px;
      border: 1px solid hsla(0, 0%, 100%, 0.05);
      border-radius: 4px;
      background-color: #1e1e1f;
      color: #cccccc;
      text-align: center;
      text-decoration: none;
      font-size: 12px;
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
    overflow: auto;
    padding-right: 4px;
    width: 160px;
    height: 100%;
    .item {
      position: relative;
      display: flex;
      overflow: hidden;
      align-items: center;
      flex-direction: column;
      margin-bottom: 8px;
      width: 100%;
      border-radius: 4px;
      color: #cccccc;
      text-decoration: none;
      &:last-child {
        margin-bottom: 0;
      }
      img {
        margin: 0;
        width: 100%;
        height: auto;
      }
      .cuntdown {
        position: absolute;
        top: 4px;
        right: 4px;
        padding: 0 4px;
        border-radius: 4px;
        background-color: #a47d33;
        color: #fff;
        font-size: 12px;
      }
      .cover {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        padding: 4px;
        width: 100%;
        height: 100%;
        background-color: hsla(0, 0%, 0%, 0.8);
        opacity: 0;
        transition: opacity 0.15s;
        .title {
          margin-bottom: 8px;
          color: #cdbe91;
          text-align: center;
          font-size: 14px;
        }
        .sub {
          color: #9d9c9c;
          text-align: center;
          font-size: 12px;
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
