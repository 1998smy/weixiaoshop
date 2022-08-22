import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 按需引入 element-ui
import { Button } from 'element-ui'
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }
Vue.use(Button)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
