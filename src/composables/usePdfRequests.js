import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { getFileName, getHost, hasAuth, isToday } from '../utils/pdfUtils.js'

export const usePdfRequests = ({ t, locale }) => {
  const pdfList = ref([])
  const loading = ref(false)
  const searchText = ref('')
  const filter = ref('all')
  const toast = ref(null)
  let refreshTimer
  let toastTimer

  const currentLocale = computed({
    get: () => locale.value,
    set: (val) => {
      locale.value = val
      localStorage.setItem('language', val)
    }
  })

  const downloadableList = computed(() => {
    return pdfList.value.filter((pdf) => pdf.requestHeaders?.length || pdf.responseHeaders?.length)
  })

  const stats = computed(() => {
    const items = downloadableList.value
    return {
      total: items.length,
      auth: items.filter((pdf) => hasAuth(pdf.requestHeaders)).length,
      today: items.filter((pdf) => isToday(pdf.timestamp)).length
    }
  })

  const filterOptions = computed(() => [
    { label: t('filter.all'), value: 'all', count: stats.value.total },
    { label: t('filter.auth'), value: 'auth', count: stats.value.auth },
    { label: t('filter.today'), value: 'today', count: stats.value.today }
  ])

  const filteredPdfList = computed(() => {
    const keyword = searchText.value.trim().toLowerCase()

    return downloadableList.value.filter((pdf) => {
      const matchesKeyword =
        !keyword ||
        getFileName(pdf).toLowerCase().includes(keyword) ||
        pdf.url.toLowerCase().includes(keyword) ||
        getHost(pdf.url).toLowerCase().includes(keyword)

      if (!matchesKeyword) {
        return false
      }

      if (filter.value === 'auth') {
        return hasAuth(pdf.requestHeaders)
      }

      if (filter.value === 'today') {
        return isToday(pdf.timestamp)
      }

      return true
    })
  })

  const canBatchDownload = computed(() => filteredPdfList.value.length > 0 && !loading.value)

  const showToast = (message, type = 'success') => {
    window.clearTimeout(toastTimer)
    toast.value = { message, type }
    toastTimer = window.setTimeout(() => {
      toast.value = null
    }, 2600)
  }

  const loadPdfRequests = async () => {
    loading.value = true
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getPdfRequests' })
      pdfList.value = response?.pdfRequests || []
    } catch {
      showToast(t('message.getFailed'), 'error')
    } finally {
      loading.value = false
    }
  }

  const sendToActiveTab = async (message) => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab) {
      throw new Error(t('message.noActiveTab'))
    }
    return chrome.tabs.sendMessage(tab.id, message)
  }

  const downloadPdf = async (pdfInfo, silent = false) => {
    try {
      const response = await sendToActiveTab({
        action: 'downloadWithHeaders',
        url: pdfInfo.url,
        fileName: pdfInfo.fileName,
        headers: pdfInfo.requestHeaders || []
      })

      if (response?.success) {
        if (!silent) {
          showToast(t('message.downloadSuccess'))
        }
        return true
      }

      showToast(`${t('message.downloadFailed')}: ${response?.error || t('message.unknownError')}`, 'error')
      return false
    } catch (error) {
      showToast(`${t('message.downloadFailed')}: ${error.message}`, 'error')
      return false
    }
  }

  const batchDownload = async () => {
    if (!canBatchDownload.value) {
      return
    }

    loading.value = true
    let successCount = 0
    for (const pdf of filteredPdfList.value) {
      const ok = await downloadPdf(pdf, true)
      if (ok) {
        successCount += 1
      }
    }
    loading.value = false
    showToast(t('message.batchDownloadDone', { count: successCount }), successCount ? 'success' : 'error')
  }

  const copyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url)
      showToast(t('message.urlCopied'))
    } catch {
      showToast(t('message.copyFailed'), 'error')
    }
  }

  const openPdf = async (pdfInfo) => {
    try {
      const response = await sendToActiveTab({
        action: 'openWithHeaders',
        url: pdfInfo.url,
        fileName: pdfInfo.fileName,
        headers: pdfInfo.requestHeaders || []
      })

      if (response?.success) {
        showToast(t('message.openedPdf'))
        return
      }

      showToast(`${t('message.openFailed')}: ${response?.error || t('message.unknownError')}`, 'error')
    } catch (error) {
      showToast(`${t('message.openFailed')}: ${error.message}`, 'error')
    }
  }

  const clearList = async () => {
    if (!window.confirm(t('message.confirmClear'))) {
      return
    }

    try {
      const response = await chrome.runtime.sendMessage({ action: 'clearPdfRequests' })
      if (response?.success) {
        pdfList.value = []
        showToast(t('message.listCleared'))
      }
    } catch {
      showToast(t('message.clearFailed'), 'error')
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString(locale.value === 'zh-CN' ? 'zh-CN' : 'en-US', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  onMounted(() => {
    loadPdfRequests()
    refreshTimer = window.setInterval(loadPdfRequests, 20000)
  })

  onBeforeUnmount(() => {
    window.clearInterval(refreshTimer)
    window.clearTimeout(toastTimer)
  })

  return {
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
  }
}
