import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入路由组件
import Login from '@/views/login/index.vue'
import Home from '@/views/home/Home.vue'
import Users from '@/components/users/users.vue'
import Rights from '@/components/power/rights.vue'
import Roles from '@/components/power/roles.vue'
import Reports from '@/components/reports/reports.vue'
import Orders from '@/components/orders/orders.vue'
import GoodsCate from '@/components/goods/goods_cate.vue'
import GoodsList from '@/components/goods/goods_list.vue'
import GoodsAdd from '@/components/goods/goods_add.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home', component: Home, redirect: '/home/users',
    children: [
      { path: 'users', component: Users },
      { path: 'roles', component: Roles },
      { path: 'rights', component: Rights },
      { path: 'reports', component: Reports },
      { path: 'orders', component: Orders },
      { path: 'categories', component: GoodsCate },
      { path: 'goods', component: GoodsList },
      { path: 'goods/add', component: GoodsAdd },
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
