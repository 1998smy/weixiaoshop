import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/base.css'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'
// import axios from 'axios'
// 引入 elemnet-ui
import './element-ui/element-ui.js'
Vue.config.productionTip = false
// axios.prototype.$axios = axios
// axios.defaults.baseURL = '/api'
Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
