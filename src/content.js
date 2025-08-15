// Content script - 在页面中运行
console.log('PDF下载助手 Content Script 已加载');

// 监听来自background的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'downloadWithHeaders') {
    console.log('收到下载请求:', request);
    
    const filename = decodeURIComponent(request.url.split('/').pop() || 'download.pdf');
    
    // 必须使用fetch获取数据后下载
    if (request.headers && request.headers.length > 0) {
      const headerObj = {};
      request.headers.forEach(h => {
        // 过滤一些不能设置的请求头和Range请求头
        const name = h.name.toLowerCase();
        if (!['host', 'content-length', 'connection', 'origin', 'referer', 'sec-fetch-site', 'sec-fetch-mode', 'sec-fetch-dest', 'range'].includes(name)) {
          headerObj[h.name] = h.value;
        }
      });
      
      console.log('使用请求头下载:', headerObj);
      console.log('请求URL:', request.url);
      
      fetch(request.url, {
        method: 'GET',
        headers: headerObj,
        credentials: 'same-origin'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        console.log('响应头:', response.headers);
        console.log('Content-Type:', response.headers.get('content-type'));
        console.log('Content-Length:', response.headers.get('content-length'));
        return response.blob();
      })
      .then(blob => {
        console.log('获取到数据，大小:', blob.size, '类型:', blob.type);
        
        // 检查是否为PDF文件
        if (blob.type && !blob.type.includes('pdf') && !blob.type.includes('application/octet-stream')) {
          console.warn('文件类型不是PDF:', blob.type);
        }
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        sendResponse({ success: true });
      })
      .catch(error => {
        console.error('Fetch下载错误:', error);
        sendResponse({ success: false, error: error.message });
      });
    } else {
      sendResponse({ success: false, error: '缺少请求头' });
    }
    
    return true; // 保持消息通道开放
  }
});

// 监听页面中的PDF链接点击
document.addEventListener('click', (event) => {
  const target = event.target;
  const href = target.href || target.closest('a')?.href;
  
  if (href && href.toLowerCase().includes('.pdf')) {
    console.log('检测到PDF链接点击:', href);
  }
});

// 监听页面中的PDF资源加载
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) { // Element node
        if (node.tagName === 'EMBED' || node.tagName === 'OBJECT' || node.tagName === 'IFRAME') {
          const src = node.src || node.data;
          if (src && src.toLowerCase().includes('.pdf')) {
            console.log('检测到PDF嵌入:', src);
          }
        }
      }
    });
  });
});

if (document.body) {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}