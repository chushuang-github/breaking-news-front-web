import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getUserInfoAPI } from '../api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userInfo: {}
  },
  mutations: {
    // 保存token
    updateToken (state, newToken) {
      state.token = newToken
    },
    // 保存用户信息
    updateUserInfo (state, info) {
      state.userInfo = info
    }
  },
  getters: {
    user_pic: state => state.userInfo.user_pic,
    nickname: state => state.userInfo.nickname,
    username: state => state.userInfo.username
  },
  actions: {
    async initUserInfo ({ commit }) {
      const { data: res } = await getUserInfoAPI()
      if (res.code === 0) {
        commit('updateUserInfo', res.data)
      }
    }
  },
  modules: {},
  // vuex持久化配置
  plugins: [createPersistedState()]
})
