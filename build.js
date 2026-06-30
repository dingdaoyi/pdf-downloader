import { build } from 'vite'
import { resolve } from 'path'
import fs from 'fs'

function copyDirectory(source, target) {
  fs.mkdirSync(target, { recursive: true })
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = resolve(source, entry.name)
    const targetPath = resolve(target, entry.name)
    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath)
    } else {
      fs.copyFileSync(sourcePath, targetPath)
    }
  }
}

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
  copyDirectory(resolve('public/icons'), resolve('dist/icons'))
  
  console.log('Chrome插件构建完成！')
  console.log('请将dist目录加载到Chrome扩展程序中')
}

buildExtension().catch((error) => {
  console.error(error)
  process.exit(1)
})
