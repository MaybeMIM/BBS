import { createStore } from "vuex";

export default createStore({
  state: {
    // 用户信息
    loginUserInfo: null,
    // 是否展示登录
    showLogin: false
  },
  mutations: {
    // 点赞评论等操作 需要登录的状态，浏览文章等页面不需要登录 也就不需要登录弹框
    updateLoginUserInfo(state, value) {
      state.loginUserInfo = value
    },
    showLogin(state, value) {
      state.showLogin = value
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
