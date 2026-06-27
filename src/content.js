const BLOCKED_FETCH_HEADERS = new Set([
  'host',
  'content-length',
  'connection',
  'origin',
  'referer',
  'sec-fetch-site',
  'sec-fetch-mode',
  'sec-fetch-dest',
  'range'
])

const getFileName = (url) => {
  try {
    const parsed = new URL(url)
    const name = decodeURIComponent(parsed.pathname.split('/').filter(Boolean).pop() || 'download.pdf')
    return name.toLowerCase().endsWith('.pdf') ? name : `${name}.pdf`
  } catch {
    return 'download.pdf'
  }
}

const buildHeaderObject = (headers = []) => {
  const headerObj = {}
  headers.forEach((header) => {
    const name = header.name.toLowerCase()
    if (!BLOCKED_FETCH_HEADERS.has(name)) {
      headerObj[header.name] = header.value
    }
  })
  return headerObj
}

const fetchPdfBlob = async (url, headers) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: buildHeaderObject(headers),
    credentials: 'same-origin'
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.blob()
}

const downloadBlob = (blob, filename) => {
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(objectUrl)
}

const openBlob = (blob) => {
  const objectUrl = URL.createObjectURL(blob)
  window.open(objectUrl, '_blank', 'noopener,noreferrer')
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 10 * 60 * 1000)
}

const transferPdf = async ({ url, headers, fileName }, mode) => {
  if (!headers?.length) {
    throw new Error('缺少请求头')
  }

  const blob = await fetchPdfBlob(url, headers)
  if (mode === 'open') {
    openBlob(blob)
    return
  }

  downloadBlob(blob, fileName || getFileName(url))
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const actionModes = {
    downloadWithHeaders: 'download',
    openWithHeaders: 'open'
  }
  const mode = actionModes[request.action]

  if (!mode) {
    return false
  }

  transferPdf(request, mode)
    .then(() => {
      sendResponse({ success: true })
    })
    .catch((error) => {
      sendResponse({ success: false, error: error.message })
    })

  return true
})
