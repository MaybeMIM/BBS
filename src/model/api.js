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
// 修改板块
export function updateBoard () {
  return Request({ url: '/forum/updateBoard', params })
}
// 批量审核
export function auditArticle (params) {
  return Request({ url: '/forum/auditArticle', params })
}

// 批量删除
export function delArticle (params) {
  return Request({ url: '/forum/delArticle', params })
}

// 置顶
export function topArticle (params) {
  return Request({ url: '/forum/topArticle', params })
}
