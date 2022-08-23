import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/base.css'
import './assets/fonts/iconfont.css'
// import axios from 'axios'
// 按需引入 element-ui
import { Form, FormItem, Input, Button, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Table, TableColumn, Tooltip, Switch, Pagination } from 'element-ui'
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(Pagination)
Vue.prototype.$message = Message // 全局配置

Vue.config.productionTip = false
// axios.prototype.$axios = axios
// axios.defaults.baseURL = '/api'
Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
