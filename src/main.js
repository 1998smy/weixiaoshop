import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/base.css'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'

// 引入 elemnet-ui
import './element-ui/element-ui.js'

// 导入 vue-table-with-tree-grid 树形控件
import TreeTable from 'vue-table-with-tree-grid'

// 导入 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false
// axios.prototype.$axios = axios
// axios.defaults.baseURL = '/api'
Vue.config.productionTip = false

// 树形表格
Vue.component('tree-table', TreeTable)

Vue.use(VueQuillEditor)

// 全局过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  // 如果某个字符串不够指定长度，会在头部或尾部补全。padStart()用于头部补全
  // getMonth 是从0开始的，所以要加 1
  const m = (dt.getMonth() + 1 + '').padStart('2', '0')
  const d = (dt.getDay() + '').padStart('2', '0')
  const hh = (dt.getHours() + '').padStart('2', '0')
  const mm = (dt.getMinutes() + '').padStart('2', '0')
  const ss = (dt.getSeconds() + '').padStart('2', '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
