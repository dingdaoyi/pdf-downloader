export const isToday = (timestamp) => {
  const date = new Date(timestamp)
  const current = new Date()
  return date.toDateString() === current.toDateString()
}

export const getFileName = (pdfInfo) => {
  if (pdfInfo.fileName) {
    return pdfInfo.fileName
  }

  try {
    const parsed = new URL(pdfInfo.url)
    const name = decodeURIComponent(parsed.pathname.split('/').filter(Boolean).pop() || 'download.pdf')
    return name.toLowerCase().endsWith('.pdf') ? name : `${name}.pdf`
  } catch {
    return 'download.pdf'
  }
}

export const getHost = (url) => {
  try {
    return new URL(url).hostname
  } catch {
    return ''
  }
}

export const getFileSize = (pdfInfo) => {
  const headers = pdfInfo.responseHeaders?.length ? pdfInfo.responseHeaders : pdfInfo.requestHeaders || []
  const contentLength = headers.find((header) => header.name.toLowerCase() === 'content-length')
  if (!contentLength) {
    return ''
  }

  const bytes = Number.parseInt(contentLength.value, 10)
  if (!Number.isFinite(bytes)) {
    return ''
  }

  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${bytes} B`
}

export const hasAuth = (headers = []) => {
  return headers.some((header) => {
    const name = header.name.toLowerCase()
    return name.includes('auth') || name === 'cookie'
  })
}
