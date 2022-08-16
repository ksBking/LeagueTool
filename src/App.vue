<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';

function setWnd(value: string) {
  window.electronAPI.setWnd(value);
}
</script>

<template>
  <button @click="setWnd('minimize')">-</button>
  <button @click="setWnd('close')">x</button>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about/">About</RouterLink>
  </nav>

  <RouterView />
</template>

<style lang="scss"></style>
