import Request from '@/utils/request'

// 获取文章列表
export function loadArticleList (params, showLoading) {
  return Request({ url: '/forum/loadArticle', params, showLoading })
}

// 获取用户信息
export function getUserInfos (params) {
  return Request({ url: '/getUserInfo', params })
}

// 获取用户信息
export function loadBoardList (params) {
  return Request({ url: '/board/loadBoard', params })
}

// 获取文章详情信息
export function getArticleDetail (params) {
  return Request({ url: '/forum/getArticleDetail', params })
}

// 点赞
export function articleDoLike (params) {
  return Request({ url: '/forum/doLike', params })
}

// 获取用户积分
export function getUserIntegral (params) {
  return Request({ url: '/forum/getUserDownloadInfo', params })
}

// // 附件下载
// export function attachmentDownload () {
//   return Request({ url: '/forum/attachmentDownload' })
// }

// 评论列表
export function loadComment (params) {
  return Request({ url: '/comment/loadComment', params })
}

// 发布评论
export function postComment (params) {
  return Request({ url: '/comment/postComment', params })
}

// 评论点赞
export function commentDoLike () {
  return Request({ url: '/comment/doLike' })
}

// 置顶评论
export function changeTopType () {
  return Request({ url: '/comment/changeTopType' })
}
