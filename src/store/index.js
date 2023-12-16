import { createStore } from "vuex";

export default createStore({
  state: {
    loginUserInfo: null
  },
  mutations: {
    updateLoginUserInfo: (state, value) => {
      state.loginUserInfo = value
    }
  },
  getters: {
    getLoginUserInfo: (state) => {
      return state.loginUserInfo
    },
  },
  actions: {},
  module: {}
})
