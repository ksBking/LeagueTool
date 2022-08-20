<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
window.electronAPI.update.onUpdateRequired((event, version) => {
  router.replace({ name: 'update', query: { version: version } });
});
</script>

<template>
  <RouterView class="router-view" />
</template>

<style lang="scss">
.router-view {
  width: 100%;
  height: 100%;
}
</style>
