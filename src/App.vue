<script setup>
import { useI18n } from 'vue-i18n'
import PdfList from './components/PdfList.vue'
import PopupActions from './components/PopupActions.vue'
import PopupHeader from './components/PopupHeader.vue'
import PopupHero from './components/PopupHero.vue'
import PopupToolbar from './components/PopupToolbar.vue'
import ToastMessage from './components/ToastMessage.vue'
import { usePdfRequests } from './composables/usePdfRequests.js'
import './styles/popup.css'

const { t, locale } = useI18n()

const {
  batchDownload,
  canBatchDownload,
  clearList,
  copyUrl,
  currentLocale,
  downloadPdf,
  filter,
  filterOptions,
  filteredPdfList,
  formatTime,
  loadPdfRequests,
  loading,
  openPdf,
  pdfList,
  searchText,
  stats,
  toast
} = usePdfRequests({ t, locale })
</script>

<template>
  <main class="shell">
    <PopupHeader v-model:current-locale="currentLocale" :loading="loading" :t="t" @refresh="loadPdfRequests" />
    <PopupHero
      :can-batch-download="canBatchDownload"
      :filtered-count="filteredPdfList.length"
      :stats="stats"
      :t="t"
      @batch-download="batchDownload"
    />
    <PopupToolbar v-model:filter="filter" v-model:search-text="searchText" :filter-options="filterOptions" :t="t" />
    <PopupActions :has-records="Boolean(pdfList.length)" :t="t" @clear="clearList" />
    <PdfList
      :format-time="formatTime"
      :has-raw-records="Boolean(pdfList.length)"
      :items="filteredPdfList"
      :loading="loading"
      :t="t"
      @copy-url="copyUrl"
      @download-pdf="downloadPdf"
      @open-pdf="openPdf"
    />
    <ToastMessage :toast="toast" />
  </main>
</template>
