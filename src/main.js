import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/base.css'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'
// import axios from 'axios'
// 引入 elemnet-ui
import './element-ui/element-ui.js'

// 导入 vue-table-with-tree-grid 树形控件
import TreeTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false
// axios.prototype.$axios = axios
// axios.defaults.baseURL = '/api'
Vue.config.productionTip = false


Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
