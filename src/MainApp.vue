<template>
  <div class="main-view">
    <MainSide class="main-side" :wnd-active="wndActive" />
    <div class="main-content">
      <MainHeader class="main-header" :wnd-active="wndActive" />
      <RouterView class="main-router-view" v-slot="{ Component }">
        <template v-if="Component">
          <Transition name="fade">
            <KeepAlive>
              <component :is="Component"></component>
            </KeepAlive>
          </Transition>
        </template>
      </RouterView>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import MainHeader from './views/MainHeader.vue';
import MainSide from './views/MainSide.vue';

const wndActive = ref(true);
window.electronAPI.mainWnd.onWndStatus((event, status) => {
  if (status === 'focus') {
    wndActive.value = true;
  } else if (status === 'blur') {
    wndActive.value = false;
  }
});
</script>

<style lang="scss">
.main-view {
  display: flex;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.main-side {
  width: 200px;
  height: 100%;
  background-color: #171718;
}

.main-content {
  width: calc(100% - 200px);
  height: 100%;

  .main-header {
    width: 100%;
    height: 60px;
  }

  .main-router-view {
    padding: 8px;
    width: 100%;
    height: calc(100% - 60px);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
