<template>
  <div class="display-view">
    <div class="display-header drag-bar">
      <div class="logo">
        <img src="@/assets/img/lol-colored-16.png" alt="" />
        <span>LeagueTool</span>
      </div>
      <div class="title" title="111">欢迎向我们提供建议和想法</div>
      <div class="menu no-drag">
        <div class="menu-item" @click="setWnd('close')"><IconClose /></div>
      </div>
    </div>
    <RouterView class="display-router-view" />
  </div>
</template>
<script setup lang="ts">
import IconClose from '@/components/icons/IconClose.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
window.electronAPI.displayWnd.onRedirect((event, phase) => {
  router.replace({ name: phase });
});

function setWnd(value: 'close') {
  window.electronAPI.displayWnd.setWnd(value);
}
</script>

<style lang="scss">
.display-view {
  display: flex;
  overflow: hidden;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .display-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
    width: 100%;
    height: 30px;
    background-color: #171718;
    color: #cccccc;

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;

      img {
        width: 14px;
        height: 14px;
      }

      span {
        margin: 0 4px;
        background-image: linear-gradient(45deg, #00e6d2, #4d5bff);
        -webkit-background-clip: text;
        background-clip: text;
        font-size: 14px;
        font-family: 'logo-LeagueTool';

        -webkit-text-fill-color: transparent;
      }
    }

    .title {
      overflow: hidden;
      color: #d1d1d1;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
    }

    .menu {
      display: flex;
      .menu-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border-radius: 4px;

        .icon path {
          transition: fill 0.15s;
        }
        &:hover {
          .icon path {
            fill: #4d5bff;
          }
        }
      }
    }
  }

  .display-router-view {
    padding: 8px;
    width: 100%;
    height: calc(100% - 30px);
  }
}
</style>
