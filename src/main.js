import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/base.css'
// 按需引入 element-ui
import { Form, FormItem, Input, Button, Message } from 'element-ui'

import axios from 'axios'
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.prototype.$message = Message // 全局配置

Vue.config.productionTip = false
axios.prototype.$axios = axios
axios.defaults.baseURL = '/api'
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
