<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Download, Refresh, View, Delete } from '@element-plus/icons-vue'

const pdfList = ref([])
const loading = ref(false)
const searchText = ref('')

// 过滤后的PDF列表
const filteredPdfList = computed(() => {
  if (!searchText.value) {
    // 只显示有完整请求头的PDF
    return pdfList.value.filter(pdf => pdf.requestHeaders && pdf.requestHeaders.length > 0)
  }
  return pdfList.value.filter(pdf => 
    pdf.requestHeaders && pdf.requestHeaders.length > 0 &&
    (getFileName(pdf.url).toLowerCase().includes(searchText.value.toLowerCase()) ||
    pdf.url.toLowerCase().includes(searchText.value.toLowerCase()))
  )
})

// 获取PDF请求列表
const loadPdfRequests = async () => {
  loading.value = true
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getPdfRequests' })
    pdfList.value = response.pdfRequests || []
  } catch (error) {
    ElMessage.error('获取PDF列表失败')
  } finally {
    loading.value = false
  }
}

// 下载PDF
const downloadPdf = async (pdfInfo) => {
  try {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true})
    if (!tab) {
      ElMessage.error('未找到活动标签页')
      return
    }
    
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'downloadWithHeaders',
      url: pdfInfo.url,
      headers: pdfInfo.requestHeaders
    })
    
    if (response && response.success) {
      ElMessage.success('下载成功')
    } else {
      ElMessage.error('下载失败: ' + (response?.error || '未知错误'))
    }
  } catch (error) {
    ElMessage.error('下载失败: ' + error.message)
  }
}

// 显示请求头详情
const showHeaders = async (headers) => {
  const headerText = headers?.map(h => `${h.name}: ${h.value}`).join('\n') || '无请求头'
  await ElMessageBox.alert(headerText, '请求头信息', {
    confirmButtonText: '确定',
    customStyle: { 'word-break': 'break-all' }
  })
}

// 清空列表
const clearList = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有PDF记录吗？', '确认清空', {
      type: 'warning'
    })
    pdfList.value = []
    ElMessage.success('列表已清空')
  } catch {
    // 用户取消
  }
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 获取文件名
const getFileName = (url) => {
  try {
    const decoded = decodeURIComponent(url)
    const parts = decoded.split('/')
    return parts[parts.length - 1] || 'unknown.pdf'
  } catch {
    const parts = url.split('/')
    return parts[parts.length - 1] || 'unknown.pdf'
  }
}

// 获取文件大小（从请求头中）
const getFileSize = (headers) => {
  const contentLength = headers?.find(h => h.name.toLowerCase() === 'content-length')
  if (contentLength) {
    const bytes = parseInt(contentLength.value)
    if (bytes > 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    } else if (bytes > 1024) {
      return (bytes / 1024).toFixed(1) + ' KB'
    }
    return bytes + ' B'
  }
  return ''
}

// 检查是否有认证头
const hasAuth = (headers) => {
  return headers?.some(h => 
    h.name.toLowerCase().includes('auth') || 
    h.name.toLowerCase().includes('authorization')
  )
}

onMounted(() => {
  loadPdfRequests()
  // 每30秒自动刷新一次
  setInterval(loadPdfRequests, 30000)
})
</script>

<template>
  <div class="pdf-downloader">
    <!-- 头部 -->
    <div class="header">
      <div class="title">
        <span>📄 PDF下载助手</span>
        <el-tag size="small" type="info">{{ filteredPdfList.length }}</el-tag>
      </div>
      <div class="actions">
        <el-button :icon="Refresh" size="small" @click="loadPdfRequests" :loading="loading" />
        <el-button :icon="Delete" size="small" type="danger" @click="clearList" :disabled="!pdfList.length" />
      </div>
    </div>

    <!-- 搜索框 -->
    <el-input 
      v-model="searchText" 
      placeholder="搜索PDF文件名或URL" 
      size="small" 
      clearable
      class="search-input"
    />

    <!-- PDF列表 -->
    <div class="pdf-list" v-loading="loading">
      <el-empty v-if="!filteredPdfList.length" 
        :description="pdfList.length ? '没有匹配的PDF文件' : '暂无PDF请求记录'" 
        :image-size="60" />
      
      <div v-for="pdf in filteredPdfList" :key="pdf.url + pdf.timestamp" class="pdf-item">
        <div class="pdf-icon">📄</div>
        <div class="pdf-info">
          <div class="pdf-name" :title="getFileName(pdf.url)">{{ getFileName(pdf.url) }}</div>
          <div class="pdf-meta">
            <span class="time">{{ formatTime(pdf.timestamp) }}</span>
            <span v-if="getFileSize(pdf.requestHeaders)" class="size">{{ getFileSize(pdf.requestHeaders) }}</span>
            <el-tag v-if="hasAuth(pdf.requestHeaders)" size="small" type="success">已认证</el-tag>
          </div>
        </div>
        <div class="pdf-actions">
          <el-button :icon="View" size="small" type="info" @click="showHeaders(pdf.requestHeaders)" />
          <el-button :icon="Download" size="small" type="primary" @click="downloadPdf(pdf)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pdf-downloader {
  width: 420px;
  max-height: 600px;
  padding: 16px;
  background: #f8f9fa;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
  color: #303133;
}

.actions {
  display: flex;
  gap: 8px;
}

.search-input {
  margin-bottom: 16px;
}

.pdf-list {
  max-height: 480px;
  overflow-y: auto;
  padding-right: 4px;
}

.pdf-list::-webkit-scrollbar {
  width: 6px;
}

.pdf-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.pdf-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.pdf-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.2s;
}

.pdf-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transform: translateY(-1px);
}

.pdf-icon {
  font-size: 24px;
  margin-right: 12px;
  flex-shrink: 0;
}

.pdf-info {
  flex: 1;
  min-width: 0;
}

.pdf-name {
  font-weight: 600;
  font-size: 14px;
  color: #303133;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pdf-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.time {
  font-size: 12px;
  color: #909399;
}

.size {
  font-size: 12px;
  color: #67c23a;
  font-weight: 500;
}

.pdf-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.el-empty {
  padding: 40px 20px;
}
</style>
