<template>
  <div>
    <div class="logo drag-bar">
      <img :src="lcuPhase ? getLogoUrl('lol-colored') : getLogoUrl('lol')" alt="" />
      <span :class="{ blur: !props.wndActive }">LeagueTool</span>
    </div>
    <div class="menu">
      <div class="menu-item">
        <div class="menu-title">主页{{ lcuPhase ? lcuPhase : '离线' }}</div>
        <router-link class="menu-href" :to="{ name: 'Overview' }">
          <IconOverView />
          <span>总览</span>
        </router-link>
        <router-link class="menu-href" :to="{ name: 'Test' }">
          <IconTest />
          <span>测试</span>
        </router-link>
      </div>
      <div class="menu-item">
        <div class="menu-title">功能</div>
        <router-link class="menu-href" :to="{ name: 'AutoMatch' }">
          <IconAutoMatch />
          <span>自动对局</span>
        </router-link>
        <router-link class="menu-href" :to="{ name: 'PickAndBan' }">
          <IconPickAndBan />
          <span>选禁英雄</span>
        </router-link>
        <router-link class="menu-href" :to="{ name: 'AutoConfig' }">
          <IconAutoConfig />
          <span>自动配置</span>
        </router-link>
      </div>
      <div class="menu-item">
        <div class="menu-title">其他</div>
        <router-link class="menu-href" :to="{ name: 'SponsorMe' }">
          <IconSponsorMe />
          <span>赞助</span>
        </router-link>
        <router-link class="menu-href" :to="{ name: 'FeedBack' }">
          <IconFeedBack />
          <span>反馈与帮助</span>
        </router-link>
        <router-link class="menu-href" :to="{ name: 'AboutMe' }">
          <IconAboutMe />
          <span>关于</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import IconOverView from '@/components/icons/IconOverView.vue';
import IconTest from '@/components/icons/IconTest.vue';
import IconAutoMatch from '@/components/icons/IconAutoMatch.vue';
import IconPickAndBan from '@/components/icons/IconPickAndBan.vue';
import IconAutoConfig from '@/components/icons/IconAutoConfig.vue';
import IconSponsorMe from '@/components/icons/IconSponsorMe.vue';
import IconFeedBack from '@/components/icons/IconFeedBack.vue';
import IconAboutMe from '@/components/icons/IconAboutMe.vue';

const props = defineProps<{
  wndActive: boolean;
}>();

const lcuPhase: Ref<string | null> = ref(null);
window.electronAPI.mainWnd.onLcuPhase((event, phase) => {
  lcuPhase.value = phase;
});
window.electronAPI.mainWnd.getLcuPhase();

function getLogoUrl(name: string) {
  return new URL(`../assets/img/${name}.png`, import.meta.url).href;
}
</script>

<style lang="scss">
.main-side {
  display: flex;
  flex-direction: column;
  user-select: none;
  -webkit-user-drag: none;

  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 60px;

    img {
      width: 24px;
      height: 24px;
    }

    span {
      margin: 0 8px;
      font-family: 'logo-LeagueTool';
      font-size: 20px;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-image: linear-gradient(45deg, #00ffea, #6673ff);

      &.blur {
        background-image: linear-gradient(45deg, #00e6d2, #4d5bff);
      }
    }
  }

  .menu {
    display: flex;
    flex-direction: column;
    padding: 0 16px;

    .menu-item {
      padding: 8px;

      .menu-title {
        margin: 8px;
        font-size: 12px;
        color: #8e8e8e;
      }

      .menu-href {
        display: flex;
        align-items: center;
        margin: 8px 0;
        padding: 0 8px;
        height: 30px;
        font-size: 14px;
        text-decoration: none;
        border-radius: 4px;
        transition: background-color 0.15s;
        cursor: default;
        color: #d1d1d1;

        &.router-link-active {
          background-color: #4d5bff;
        }

        .icon {
          width: 16px;
          height: 16px;
        }

        span {
          margin: 0 8px;
        }
      }
    }
  }
}
</style>
