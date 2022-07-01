import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: ''
  },
  mutations: {
    // 保存token
    updateToken (state, newToken) {
      state.token = newToken
    }
  },
  actions: {},
  modules: {},
  // vuex持久化配置
  plugins: [createPersistedState()]
})
