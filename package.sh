#!/bin/bash

echo "🔨 开始构建PDF下载助手..."

# 构建插件
node build.js

if [ $? -eq 0 ]; then
    echo "✅ 构建完成"
    
    # 删除旧的打包文件
    rm -f pdf-downloader-extension.zip
    
    # 进入dist目录打包
    cd dist
    zip -r ../pdf-downloader-extension.zip .
    cd ..
    
    echo "📦 打包完成: pdf-downloader-extension.zip"
    echo "📊 文件大小: $(du -h pdf-downloader-extension.zip | cut -f1)"
else
    echo "❌ 构建失败"
    exit 1
fi