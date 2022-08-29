<template>
  <div class="drag-bar" :class="{ blur: !props.wndActive }">
    <div class="division"></div>
    <div class="menu no-drag">
      <div class="menu-item" @click="setWnd('minimize')"><IconMinus /></div>
      <div class="menu-item" @click="setWnd('close')"><IconClose /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconClose from '@/components/icons/IconClose.vue';
import IconMinus from '@/components/icons/IconMinus.vue';

function setWnd(value: 'minimize' | 'close') {
  window.electronAPI.mainWnd.setWnd(value);
}

const props = defineProps({
  wndActive: Boolean,
});
</script>

<style lang="scss">
.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #171718;
  color: #cccccc;
  &.blur {
    color: #8e8e8e;

    .menu .menu-item .icon path {
      fill: #8e8e8e;
    }
  }

  .division {
    flex: 1;
  }

  .menu {
    display: flex;
    .menu-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
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
</style>
