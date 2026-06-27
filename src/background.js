const MAX_RECORDS = 80

let pdfRequests = []
const storageReady = chrome.storage.local.get({ pdfRequests: [] }).then((result) => {
  const storedRequests = Array.isArray(result.pdfRequests) ? result.pdfRequests : []
  const currentUrls = new Set(pdfRequests.map((request) => request.url))
  const restoredRequests = storedRequests.filter((request) => !currentUrls.has(request.url))
  pdfRequests = [...pdfRequests, ...restoredRequests].slice(0, MAX_RECORDS)
})

const now = () => Date.now()

const isPdfUrl = (url = '') => {
  try {
    const parsed = new URL(url)
    return parsed.pathname.toLowerCase().endsWith('.pdf')
  } catch {
    return url.toLowerCase().includes('.pdf')
  }
}

const normalizeHeaders = (headers = []) => {
  return headers
    .filter((header) => header?.name && typeof header.value !== 'undefined')
    .map((header) => ({ name: header.name, value: String(header.value) }))
}

const extractFileName = (url = '') => {
  try {
    const parsed = new URL(url)
    const lastSegment = parsed.pathname.split('/').filter(Boolean).pop()
    const decoded = decodeURIComponent(lastSegment || 'download.pdf')
    return decoded.toLowerCase().endsWith('.pdf') ? decoded : `${decoded}.pdf`
  } catch {
    return 'download.pdf'
  }
}

const persistRequests = () => {
  chrome.storage.local.set({ pdfRequests })
}

const upsertPdfRequest = (details, requestHeaders = [], responseHeaders = []) => {
  const existingIndex = pdfRequests.findIndex((request) => request.url === details.url)
  const record = {
    id: details.requestId || `${details.url}-${now()}`,
    url: details.url,
    timestamp: now(),
    tabId: details.tabId,
    frameId: details.frameId,
    parentFrameId: details.parentFrameId,
    method: details.method,
    type: details.type,
    requestHeaders: normalizeHeaders(requestHeaders),
    responseHeaders: normalizeHeaders(responseHeaders),
    fileName: extractFileName(details.url)
  }

  if (existingIndex >= 0) {
    pdfRequests.splice(existingIndex, 1)
  }

  pdfRequests.unshift(record)
  pdfRequests = pdfRequests.slice(0, MAX_RECORDS)
  persistRequests()
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    if (details.method !== 'GET') {
      return
    }

    if (!isPdfUrl(details.url) || details.url.includes('#') || details.url.includes('disablestream')) {
      return
    }

    if (details.requestHeaders?.some((header) => header.name === 'Access-Control-Request-Method')) {
      return
    }

    const hasRange = details.requestHeaders?.some((header) => header.name.toLowerCase() === 'range')
    if (hasRange) {
      return
    }

    upsertPdfRequest(details, details.requestHeaders || [])
  },
  { urls: ['<all_urls>'] },
  ['requestHeaders', 'extraHeaders']
)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPdfRequests') {
    storageReady.then(() => {
      sendResponse({ pdfRequests })
    })
    return true
  }

  if (request.action === 'clearPdfRequests') {
    pdfRequests = []
    chrome.storage.local.set({ pdfRequests: [] }, () => {
      sendResponse({ success: true })
    })
    return true
  }

  return false
})

chrome.runtime.onInstalled.addListener(() => {
  storageReady.then(() => chrome.storage.local.get({ pdfRequests: [] }, (result) => {
    pdfRequests = Array.isArray(result.pdfRequests) ? result.pdfRequests.slice(0, MAX_RECORDS) : []
  }))
})
