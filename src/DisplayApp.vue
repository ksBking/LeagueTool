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
import { useRouter } from 'vue-router';
import IconClose from '@/components/icons/IconClose.vue';

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
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .display-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
    width: 100%;
    height: 30px;
    background-color: #171718;
    color: #cccccc;

    .logo {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;

      img {
        width: 14px;
        height: 14px;
      }

      span {
        margin: 0 4px;
        font-family: 'logo-LeagueTool';
        font-size: 14px;
        background-image: linear-gradient(45deg, #00e6d2, #4d5bff);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .title {
      font-size: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #d1d1d1;
    }

    .menu {
      display: flex;
      .menu-item {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 16px;
        height: 16px;
        border-radius: 4px;

        .icon path {
          transition: fill 0.15s;
        }
        &:hover {
          .icon path {
            fill: #6673ff;
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
