import { createI18n } from 'vue-i18n'
import zhCn from './locales/zh-CN.js'
import en from './locales/en.js'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') || 'zh-CN',
  fallbackLocale: 'en',
  messages: {
    'zh-CN': zhCn,
    'en': en
  }
})

export default i18n
