<template>
  <div class="test-view">
    以下内容无任何功能。
    <Suspense>
      <TestFetch />
      <template #fallback><LoadingView /></template>
    </Suspense>
  </div>
</template>

<script lang="ts" setup>
import LoadingView from '@/components/LoadingView.vue';
import TestFetch from './TestFetch.vue';
</script>
