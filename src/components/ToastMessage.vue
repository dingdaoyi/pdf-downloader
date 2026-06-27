<script setup>
import { Check, X } from '@lucide/vue'

defineProps({
  toast: {
    type: Object,
    default: null
  }
})
</script>

<template>
  <div v-if="toast" class="toast" :class="toast.type" role="status">
    <Check v-if="toast.type === 'success'" :size="16" />
    <X v-else :size="16" />
    <span>{{ toast.message }}</span>
  </div>
</template>
