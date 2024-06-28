import { createApp } from 'vue'
import { message } from 'ant-design-vue'
import App from './App.vue'
import pinia from '@renderer/store/index'
import 'dayjs/locale/zh-cn'
import 'uno.css'
import '@unocss/reset/sanitize/sanitize.css'
import '@unocss/reset/sanitize/assets.css'

message.config({
  top: `200px`
})

createApp(App).use(pinia).mount('#app')
