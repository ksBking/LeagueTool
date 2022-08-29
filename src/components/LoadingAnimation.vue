<template>
  <div class="loading-animation">
    <div class="loading-img">
      <div class="loading-item"></div>
      <div class="loading-item"></div>
      <div class="loading-item"></div>
    </div>
    <div class="loading-title">正在加载…</div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss">
.loading-animation {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .loading-img {
    .loading-item {
      display: inline-block;
      height: 20px;
      width: 20px;
      padding: 4px;

      &::before {
        content: '';
        display: inline-block;
        height: 100%;
        width: 100%;
        background-color: #4d5bff;
        border-radius: 50%;
      }

      &:nth-child(1)::before {
        animation: animation 1s infinite 0s;
      }
      &:nth-child(2)::before {
        animation: animation 1s infinite 0.3s;
      }
      &:nth-child(3)::before {
        animation: animation 1s infinite 0.6s;
      }

      @keyframes animation {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(0.2);
        }
        100% {
          transform: scale(1);
        }
      }
    }
  }
  .loading-title {
    margin-top: 16px;
    font-size: 12px;
  }
}
</style>
