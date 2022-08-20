<template>
  <div class="test-view">
    <Suspense>
      <TestFetch />
      <template #fallback><LoadingView /></template>
    </Suspense>
  </div>
</template>

<script lang="ts" setup>
import TestFetch from './TestFetch.vue';
import LoadingView from '@/components/LoadingView.vue';
</script>
