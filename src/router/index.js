import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入路由组件
import Login from '@/views/login/index.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login }
]

const router = new VueRouter({
  routes
})

export default router
