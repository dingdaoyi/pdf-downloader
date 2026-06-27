<script setup>
import { Download } from '@lucide/vue'

defineProps({
  canBatchDownload: {
    type: Boolean,
    required: true
  },
  filteredCount: {
    type: Number,
    required: true
  },
  stats: {
    type: Object,
    required: true
  },
  t: {
    type: Function,
    required: true
  }
})

defineEmits(['batch-download'])
</script>

<template>
  <section class="hero">
    <div>
      <span class="eyebrow">{{ t('status.kept', { count: stats.total }) }}</span>
      <strong>{{ t('status.showing', { count: filteredCount }) }}</strong>
    </div>
    <button class="primary-action" type="button" :disabled="!canBatchDownload" @click="$emit('batch-download')">
      <Download :size="17" />
      <span>{{ t('app.downloadAll') }}</span>
    </button>
  </section>
</template>
