<template>
  <div class="sponsor-me-view">
    <div class="header">
      <div class="marquee">
        <div class="text" :text="slogan">{{ slogan }}</div>
      </div>
      <div class="title">感谢兄弟支持！您的支持是我们更新的动力！</div>
    </div>
    <div class="main">
      <div class="primary">
        <div class="qrcode">
          <img src="@/assets/img/qrcode/wechat.png" alt="" />
          <img src="@/assets/img/qrcode/alipay.png" alt="" />
          <img src="@/assets/img/qrcode/qq.png" alt="" />
        </div>
        <div class="description">
          <ul>
            <li>备注：打赏时可留下备注，将会把您添加到赞助名单里</li>
            <li>备注：赞助名单每周更新，如有漏添，请联系我们补添</li>
            <li>备注：赞助名单会永久保存并展示，这是您对我们的支持</li>
          </ul>
        </div>
      </div>
      <div class="roster">
        <div class="title">赞助名单（永久展示）</div>

        <ul class="list">
          <div class="list-header list-row">
            <span>#</span>
            <span>昵称</span>
            <span>方式</span>
            <span>金额</span>
            <span>时间</span>
          </div>
          <li class="list-row" v-for="(item, index) in sponsors" :key="index">
            <span>{{ sponsors.length - index }}</span>
            <span>{{ item.name }}</span>
            <span>{{ item.mode }}</span>
            <span>{{ item.amount }}</span>
            <span>{{ item.time }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const slogan = '打赏 ￥0.01 代表你来过；打赏 ￥0.99 感谢对我们的支持；打赏 ￥1.88 一路发发发；打赏 ￥6.66 祝老板排位把把有大爹；打赏 ￥8.88 祝老板把把MVP上大分！';
const sponsors: any[] = reactive([]);

window.electronAPI.mainWnd.onSponsors((event, data) => {
  sponsors.push(...data.reverse());
});
window.electronAPI.mainWnd.getSponsors();
</script>

<style lang="scss">
.sponsor-me-view {
  display: flex;
  flex-direction: column;

  .header {
    width: 100%;
    height: 100px;

    .marquee {
      overflow: hidden;
      width: 100%;

      .text {
        position: relative;
        padding-left: 50px;
        width: fit-content;
        background-image: linear-gradient(45deg, #00ffea, #4d5bff);
        -webkit-background-clip: text;
        background-clip: text;
        white-space: nowrap;
        font-size: 24px;
        font-family: 'Alimama_ShuHeiTi_Bold';
        animation: marquee 20s linear infinite;

        user-select: none;
        -webkit-text-fill-color: transparent;

        &::after {
          position: absolute;
          right: -100%;
          background-image: linear-gradient(45deg, #00ffea, #4d5bff);
          -webkit-background-clip: text;
          background-clip: text;
          content: attr(text);

          -webkit-text-fill-color: transparent;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      }
    }

    .title {
      margin: 16px 0;
      text-align: center;
      font-size: 24px;
      font-family: 'Alimama_ShuHeiTi_Bold';
    }
  }

  .main {
    display: flex;
    width: 100%;
    height: calc(100% - 100px);

    .primary {
      display: flex;
      overflow: hidden;
      flex-direction: column;
      width: 60%;
      height: 100%;

      .qrcode {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 50%;

        img {
          border-radius: 4px;
        }
      }

      .description {
        padding: 16px 0;
        width: 100%;
        height: 50%;
        font-size: 14px;
      }
    }

    .roster {
      display: flex;
      flex-direction: column;
      width: 40%;
      height: 100%;

      .title {
        margin-bottom: 8px;
        text-align: center;
        font-size: 20px;
        font-family: 'Alimama_ShuHeiTi_Bold';
      }

      .list-header {
        position: sticky;
        top: 0;
        padding: 8px 0;
        background-color: #1e1e1f;
        font-size: 16px;
        font-family: 'Alimama_ShuHeiTi_Bold';
      }

      .list {
        overflow-y: auto;
        padding: 0;
        list-style: none;

        .list-row {
          display: flex;
          margin-bottom: 8px;
          text-align: center;
          white-space: nowrap;

          :nth-child(1) {
            flex: 1;
          }
          :nth-child(2) {
            overflow: hidden;
            flex: 3;
            text-overflow: ellipsis;
          }
          :nth-child(3) {
            flex: 1;
          }
          :nth-child(4) {
            flex: 1;
          }
          :nth-child(5) {
            flex: 2;
          }
        }

        li {
          text-align: center;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
