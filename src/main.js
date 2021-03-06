import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './elementUI'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import dayjs from 'dayjs'

// 全局样式
import './assets/global.less'
// 富文本编辑器样式文件
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false
Vue.use(VueQuillEditor) // 注册全局富文本编辑器VueQuillEditor组件

// 过滤器-时间格式化
Vue.filter('formatDate', function (date) {
  return dayjs(date).format('YYYY-MM-DD HH-mm-ss')
})

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
