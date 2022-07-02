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

// 基本资料 - 提交修改
export const updateUserInfoAPI = ({ id, username, nickname, email, user_pic }) => {
  return request({
    url: '/my/userinfo',
    method: 'put',
    data: {
      id,
      username,
      nickname,
      email,
      user_pic
    }
  })
}

// 更新用户头像
export const updateUserAvatarAPI = (avatar) => {
  return request({
    url: '/my/update/avatar',
    method: 'patch',
    data: {
      avatar
    }
  })
}

// 修改密码
export const updatePwdAPI = ({ old_pwd, new_pwd, re_pwd }) => {
  return request({
    url: '/my/updatepwd',
    method: 'patch',
    data: {
      old_pwd,
      new_pwd,
      re_pwd
    }
  })
}
