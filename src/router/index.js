import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: () => import('../views/layout') },
  { path: '/login', component: () => import('../views/login') },
  { path: '/reg', component: () => import('../views/register') }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
