import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../views/layout'),
    children: [
      { path: '', redirect: 'home' },
      { path: 'home', component: () => import('../views/home') }
    ]
  },
  { path: '/login', component: () => import('../views/login') },
  { path: '/reg', component: () => import('../views/register') }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

// 无需验证token的页面
const whiteList = ['/login', '/reg']

router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token) {
    if (!store.state.userInfo.username) {
      store.dispatch('initUserInfo')
    }
    next()
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
