import axios from 'axios'
import store from '../store'
import router from '../router'
import { Message } from 'element-ui'

// 白名单: 不需要携带token的api地址
const whiteAPIList = ['/api/reg', '/api/login']

// 创建一个自定的axios方法(比原axios多了个基地址)
// axios函数请求的url地址前面会被拼接基地址, 然后axios请求baseURL+url后台完整地址
const myAxios = axios.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net'
})

// 请求拦截器
myAxios.interceptors.request.use(config => {
  if (!whiteAPIList.includes(config.url)) {
    config.headers.Authorization = store.state.token
  }
  return config
}, err => {
  return Promise.reject(err)
})

// 响应拦截器
myAxios.interceptors.response.use(response => {
  return response
}, err => {
  if (err.response.status === 401) {
    store.commit('updateToken', '')
    store.commit('updateUserInfo', {})
    Message.error('用户身份过期')
    router.push('/login')
  }
  return Promise.reject(err)
})

// 导出自定义的axios方法, 供外面调用传参发请求
export default myAxios
