import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入路由组件
import Login from '@/views/login/index.vue'
import Home from '@/views/home/Home.vue'
import Users from '@/views/users/users.vue'
import Rights from '@/views/rights/rights.vue'
import Reports from '@/views/reports/reports.vue'
import Orders from '@/views/orders/orders.vue'
import Goods from '@/views/goods/goods.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home', component: Home, redirect: '/home/users',
    children: [
      { path: 'users', component: Users },
      { path: 'rights', component: Rights },
      { path: 'reports', component: Reports },
      { path: 'orders', component: Orders },
      { path: 'goods', component: Goods }
    ]


  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  }
  next()
})

export default router
