import { createStore } from 'vuex'

export default createStore({
  state: {
    // 用户信息
    loginUserInfo: null,
    // 是否展示登录
    showLogin: false,
    // 二级板块信息
    boardList: [],
    // 当前一级板块 (用于同步layout与article-list选中的板块)
    activePBoardId: 0,
    // 当前二级板块
    activeBoardId: 0,
    // 消息数量
    messageCountInfo: {},
    // 系统设置
    sysSetting: {}
  },
  mutations: {
    // 点赞评论等操作 需要登录的状态，浏览文章等页面不需要登录 也就不需要登录弹框
    updateLoginUserInfo (state, value) {
      state.loginUserInfo = value
    },
    showLogin (state, value) {
      state.showLogin = value
    },
    saveBoardList (state, value) {
      state.boardList = value
    },
    setActivePBoardId: (state, value) => {
      state.activePBoardId = value
    },
    setActiveBoardId: (state, value) => {
      state.activeBoardId = value
    },
    // 设置消息数
    updateMessageCount: (state, value) => {
      state.messageCountInfo = value
    },
    // 查看消息 总数量 - 查看类型的消息数量
    readMessage: (state, value) => {
      state.messageCountInfo.total =
        state.messageCountInfo.total - state.messageCountInfo[value]
      state.messageCountInfo[value] = 0
    },
    saveSysSetting: (state, value) => {
      state.sysSetting = value
    }
  },
  getters: {
    getLoginUserInfo: state => {
      return state.loginUserInfo
    },
    getBoardList: state => {
      return state.boardList
    },
    // boardId 父级id
    getSubBoardList: state => boardId => {
      let board = state.boardList.find(item => {
        return item.boardId == boardId
      })
      return board ? board.children : []
    },
    getActivePBoardId: state => {
      return state.activePBoardId
    },
    getActiveBoardId: state => {
      return state.activeBoardId
    },
    getMessageCountInfo: state => {
      return state.messageCountInfo
    }
  },
  actions: {},
  module: {}
})
