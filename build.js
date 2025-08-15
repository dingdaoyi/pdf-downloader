import { build } from 'vite'
import { resolve } from 'path'
import fs from 'fs'

// 构建插件
async function buildExtension() {
  // 构建主应用
  await build({
    configFile: 'vite.extension.config.js'
  })
  
  // 复制manifest.json到dist目录
  fs.copyFileSync(
    resolve('public/manifest.json'),
    resolve('dist/manifest.json')
  )
  
  // 复制图标文件
  fs.copyFileSync(
    resolve('public/pdf-icon.png'),
    resolve('dist/pdf-icon.png')
  )
  
  console.log('Chrome插件构建完成！')
  console.log('请将dist目录加载到Chrome扩展程序中')
}

buildExtension().catch(console.error)