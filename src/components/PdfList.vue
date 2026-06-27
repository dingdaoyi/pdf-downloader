<script setup>
import { Clipboard, Download, Eye, FileText, Globe2, LockKeyhole } from '@lucide/vue'
import { getFileName, getFileSize, getHost, hasAuth } from '../utils/pdfUtils.js'

defineProps({
  formatTime: {
    type: Function,
    required: true
  },
  hasRawRecords: {
    type: Boolean,
    required: true
  },
  items: {
    type: Array,
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

defineEmits(['copy-url', 'download-pdf', 'open-pdf'])
</script>

<template>
  <section class="list" :aria-busy="loading">
    <div v-if="loading && !items.length" class="skeleton-list" aria-hidden="true">
      <div v-for="index in 4" :key="index" class="skeleton-item"></div>
    </div>

    <div v-else-if="!items.length" class="empty-state">
      <FileText :size="34" />
      <h2>{{ hasRawRecords ? t('message.noMatch') : t('message.noRecords') }}</h2>
      <p>{{ t('message.emptyHint') }}</p>
    </div>

    <article v-for="pdf in items" v-else :key="pdf.id || pdf.url + pdf.timestamp" class="pdf-item">
      <div class="file-badge" aria-hidden="true">
        <FileText :size="20" />
      </div>

      <div class="pdf-body">
        <div class="pdf-title" :title="getFileName(pdf)">{{ getFileName(pdf) }}</div>
        <div class="pdf-host" :title="pdf.url">
          <Globe2 :size="13" />
          <span>{{ getHost(pdf.url) || pdf.url }}</span>
        </div>
        <div class="pdf-meta">
          <span>{{ formatTime(pdf.timestamp) }}</span>
          <span v-if="getFileSize(pdf)">{{ getFileSize(pdf) }}</span>
          <span v-if="hasAuth(pdf.requestHeaders)" class="auth-pill">
            <LockKeyhole :size="12" />
            {{ t('pdf.authenticated') }}
          </span>
        </div>
      </div>

      <div class="row-actions">
        <button type="button" :aria-label="t('app.copyUrl')" :title="t('app.copyUrl')" @click="$emit('copy-url', pdf.url)">
          <Clipboard :size="16" />
        </button>
        <button type="button" :aria-label="t('app.openPdf')" :title="t('app.openPdf')" @click="$emit('open-pdf', pdf)">
          <Eye :size="16" />
        </button>
        <button
          class="download-button"
          type="button"
          :aria-label="t('app.download')"
          :title="t('app.download')"
          @click="$emit('download-pdf', pdf)"
        >
          <Download :size="16" />
        </button>
      </div>
    </article>
  </section>
</template>
