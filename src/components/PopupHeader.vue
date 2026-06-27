<script setup>
import { FileText, Languages, RefreshCw } from '@lucide/vue'

defineProps({
  currentLocale: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  },
  t: {
    type: Function,
    required: true
  }
})

defineEmits(['refresh', 'update:currentLocale'])
</script>

<template>
  <header class="header">
    <div class="brand">
      <div class="brand-mark" aria-hidden="true">
        <FileText :size="22" />
      </div>
      <div class="brand-copy">
        <h1>{{ t('app.title') }}</h1>
        <p>{{ t('app.subtitle') }}</p>
      </div>
    </div>

    <div class="header-actions">
      <label class="language" :title="t('app.language')">
        <Languages :size="15" />
        <select
          :value="currentLocale"
          :aria-label="t('app.language')"
          @change="$emit('update:currentLocale', $event.target.value)"
        >
          <option value="zh-CN">中文</option>
          <option value="en">EN</option>
        </select>
      </label>
      <button class="icon-button" type="button" :aria-label="t('app.refresh')" :title="t('app.refresh')" @click="$emit('refresh')">
        <RefreshCw :size="17" :class="{ spinning: loading }" />
      </button>
    </div>
  </header>
</template>
