<script setup>
import { Trash2 } from '@lucide/vue'

defineProps({
  hasRecords: {
    type: Boolean,
    required: true
  },
  t: {
    type: Function,
    required: true
  }
})

defineEmits(['clear'])
</script>

<template>
  <section class="settings-strip">
    <span class="capture-note">{{ t('message.emptyHint') }}</span>
    <button class="clear-button" type="button" :disabled="!hasRecords" @click="$emit('clear')">
      <Trash2 :size="15" />
      <span>{{ t('app.clear') }}</span>
    </button>
  </section>
</template>
