# PDF下载助手 - PDF Downloader

一个用于 Chrome / Edge 的 PDF 捕获下载扩展。它会自动发现网页里的 PDF 文档，并提供搜索、筛选、浏览器阅读、批量下载等功能，适合整理课程课件、论文、报告、企业内部资料等 PDF 文件。

## 功能特性

- 自动捕获 PDF：监听页面中的 `.pdf` 文档请求，并记录最近捕获到的 PDF。
- 搜索和筛选：按文件名、站点、URL 搜索，支持全部、已认证、今日记录筛选。
- 浏览器阅读：点击打开按钮，在当前登录上下文中读取 PDF 后交给浏览器阅读器查看。
- 批量下载：一键下载当前筛选结果。
- 本地处理：捕获记录保存在浏览器本地，不上传浏览记录或文件内容。

## 安装使用

### 从 Release 安装

1. 下载最新的 [Release](https://github.com/dingdaoyi/pdf-downloader/releases)。
2. 解压发布包。
3. 打开 Chrome / Edge 的扩展管理页面：
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
4. 开启开发者模式。
5. 点击“加载已解压的扩展程序”，选择解压后的 `dist` 目录。

### 从源码构建

```bash
git clone https://github.com/dingdaoyi/pdf-downloader.git
cd pdf-downloader

pnpm install
bash package.sh
```

构建完成后会生成：

- `dist/`：可直接加载到浏览器的扩展目录。
- `pdf-downloader-extension.zip`：可用于 GitHub Release 或 Chrome Web Store 上传的压缩包。

## 使用方法

1. 安装扩展后，打开包含 PDF 预览或 PDF 链接的网页。
2. 等页面加载或预览 PDF 后，点击浏览器工具栏里的“PDF下载助手”。
3. 在弹窗里搜索或筛选目标文件。
4. 点击阅读按钮在浏览器里打开 PDF。
5. 点击单个下载按钮，或点击“下载当前列表”批量下载。

## 适用场景

- 教育平台课件、讲义、教材 PDF 下载
- 学术论文、研究报告、行业白皮书下载
- 企业内部门户、OA、知识库文档下载
- 登录后才能访问的 PDF 预览文件保存

## Chrome Web Store 发布建议

### 商店标题

PDF下载助手 - PDF Downloader

### 简短描述

自动捕获网页中的 PDF 文档，支持搜索、阅读和一键下载课程课件、论文、报告和内部资料。

### 详细描述

PDF下载助手是一款面向学习、办公和资料整理场景的浏览器扩展。它可以自动发现网页中的 PDF 文档，并通过浏览器阅读器打开或保存到本地。

适合教育平台课件、企业内部资料、学术论文、研究报告、白皮书等 PDF 文件整理。扩展提供文件搜索、今日记录筛选、浏览器阅读、批量下载等功能。

扩展不会上传你的浏览记录或文件内容。PDF 请求记录仅保存在本机浏览器的本地存储中，可随时在扩展弹窗里清空。

### 搜索关键词

PDF下载, PDF downloader, PDF download helper, 下载PDF, 课件下载, 论文下载, 报告下载, 文档下载, PDF阅读, PDF捕获, browser extension

### 权限说明

- `webRequest`：用于识别网页中的 PDF 文档请求。
- `storage`：用于在本地保存最近捕获的 PDF 请求记录。
- `activeTab`：用户点击扩展弹窗后，用于把下载或阅读指令发送到当前网页，在当前登录上下文中读取 PDF。
- `<all_urls>`：用于在不同网站上识别 PDF 请求。扩展只在本机处理请求记录，不会上传数据。

## 开发

```bash
pnpm install
pnpm run build:extension
pnpm run package
```

技术栈：

- Vue 3
- Vue I18n
- Lucide Vue
- Chrome Extension Manifest V3
- Vite

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request。
