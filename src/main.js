import './assets/base.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// 引入cookies
import VueCookies from 'vue-cookies'
// 引入element
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//图标 图标在附件中
import '@/assets/icon/iconfont.css'

// 全局组件
import Dialog from '@/components/dialog.vue'
import Avatar from '@/components/avatar.vue'

const app = createApp(App)

app.use(router)
app.use(ElementPlus)

app.config.globalProperties.VueCookies = VueCookies
app.config.globalProperties.globalInfo = {
  bodyWidth: 1300,
  // 获取头像
  avatarUrl: '/api/file/getAvatar/',
  // 获取图片
  imageUrl: '/api/file/getImage/'
}

app.component('Dialog', Dialog)
app.component('Avatar', Avatar)

app.mount('#app')
