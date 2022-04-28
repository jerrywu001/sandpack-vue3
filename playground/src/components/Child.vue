<template>
  <button :class="[c('title', 'motion', 'other')]" p-3 rounded-md>{{ outer ? '' : 'In provide:' }} child</button>
</template>

<script setup lang="ts">
import { useClasser } from 'code-hike-classer-vue3';

defineProps({
  outer: Boolean,
});

const c = useClasser('sp', { 'sp-other': 'custom-class' });
</script>
