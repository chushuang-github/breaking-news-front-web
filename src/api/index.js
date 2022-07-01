import request from '@/utils/request'

export const getListAPI = () => {
  // 这里先用这个接口测试下, 如果url以http开头会忽略baseURL, axios直接请求此地址
  return request({
    url: 'http://geek.itheima.net/v1_0/channels'
  })
}
