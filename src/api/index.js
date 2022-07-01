import request from '@/utils/request'

// 注册
export const registerAPI = ({ username, password, repassword }) => {
  return request({
    url: '/api/reg',
    method: 'post',
    data: {
      username,
      password,
      repassword
    }
  })
}

// 登录
export const loginAPI = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

// 获取用户信息
export const getUserInfoAPI = () => {
  return request({
    url: '/my/userinfo'
  })
}

// 侧边栏导航数据
export const getMenusAPI = () => {
  return request({
    url: '/my/menus'
  })
}
