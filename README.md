# PDF下载助手

一个智能的Chrome扩展，专门用于监听和下载需要认证的PDF文件。

## ✨ 功能特性

- 🔍 **智能监听** - 自动检测网页中的PDF文件请求

## 🚀 快速开始

### 方式一：直接下载
1. 下载最新的 [Release](https://github.com/dingdaoyi/pdf-downloader/releases)
2. 解压文件
3. 在Chrome中加载：
   - 打开 `chrome://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择解压后的文件夹

### 方式二：从源码构建
```bash
# 克隆项目
git clone https://github.com/dingdaoyi/pdf-downloader.git
cd pdf-downloader

# 安装依赖
npm install

# 构建插件
bash package.sh

# 在Chrome中加载dist目录
```

## 📖 使用方法

1. 安装扩展后，正常浏览包含PDF的网页
2. 点击浏览器工具栏中的扩展图标
3. 查看检测到的PDF文件列表
4. 点击下载按钮即可保存到本地

## 🎯 适用场景

- 📚 教育平台课件下载
- 🏢 企业内部资料下载
- 📄 需要登录认证的文档下载
- 📑 学术论文和报告下载

## 🛠️ 技术栈

- Vue 3 + Element Plus
- Chrome Extension Manifest V3
- Vite 构建工具

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！