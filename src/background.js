// 存储PDF请求信息
let pdfRequests = [];

// 监听网络请求
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.url.toLowerCase().includes('.pdf') && details.method === 'GET' &&
        !details.url.includes('#') && !details.url.includes('disablestream')) {
      const pdfInfo = {
        url: details.url,
        timestamp: Date.now(),
        tabId: details.tabId,
        method: details.method,
        requestHeaders: []
      };
      
      // 添加到存储
      pdfRequests.unshift(pdfInfo);
      // 只保留最近50个请求
      if (pdfRequests.length > 50) {
        pdfRequests = pdfRequests.slice(0, 50);
      }
      
      console.log('检测到PDF请求:', details.url);
    }
  },
  { urls: ["<all_urls>"] },
  []
);

// 监听请求头
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    if (details.url.toLowerCase().includes('.pdf') && details.method === 'GET' && 
        !details.url.includes('#') && !details.url.includes('disablestream') &&
        !details.requestHeaders.some(h => h.name === 'Access-Control-Request-Method')) {
      
      // 过滤Range请求（分片下载），只保留完整文件请求
      const hasRange = details.requestHeaders.some(h => h.name.toLowerCase() === 'range');
      if (hasRange) {
        console.log('过滤Range请求:', details.url);
        return;
      }
      
      console.log('捕获PDF完整请求头:', details.url, details.requestHeaders);
      
      // 查找并更新对应的请求
      const index = pdfRequests.findIndex(req => 
        req.url === details.url && Math.abs(req.timestamp - Date.now()) < 10000
      );
      
      if (index !== -1) {
        pdfRequests[index].requestHeaders = details.requestHeaders;
        pdfRequests[index].timestamp = Date.now();
      } else {
        // 创建新的请求记录
        const pdfInfo = {
          url: details.url,
          timestamp: Date.now(),
          tabId: details.tabId,
          method: details.method,
          requestHeaders: details.requestHeaders
        };
        pdfRequests.unshift(pdfInfo);
        if (pdfRequests.length > 50) {
          pdfRequests = pdfRequests.slice(0, 50);
        }
      }
      
      chrome.storage.local.set({ pdfRequests });
    }
  },
  { urls: ["<all_urls>"] },
  ["requestHeaders"]
);

// 处理来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('收到消息:', request);
  
  if (request.action === 'getPdfRequests') {
    console.log('返回PDF请求列表:', pdfRequests);
    sendResponse({ pdfRequests });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('PDF下载助手已安装');
});