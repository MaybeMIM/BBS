import Request from '@/utils/request'

// 登录
export function login (params, errorCallback) {
  return Request({ url: 'login', params, errorCallback })
}

// 获取文章数据
export function loadArticle (params) {
  return Request({ url: '/forum/loadArticle', params })
}

// 获取板块
export function loadBoard () {
  return Request({ url: '/board/loadBoard' })
}
// 获取板块
export function updateBoard (params) {
  return Request({ url: '/forum/updateBoard', params })
}
