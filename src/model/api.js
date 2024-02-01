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
export function loadComment (params, showLoading) {
  return Request({ url: '/comment/loadComment', params, showLoading })
}

// 发布评论
export function postComment (params) {
  return Request({ url: '/comment/postComment', params })
}

// 评论点赞
export function commentDoLike (params, showLoading) {
  return Request({ url: '/comment/doLike', params, showLoading })
}

// 置顶评论
export function changeTopType (params) {
  return Request({ url: '/comment/changeTopType', params })
}

// 图片上传
export function uploadImage (params) {
  return Request({ url: '/file/uploadImage', params })
}

// 发布文章获取的板块信息
export function postCommentBoardList () {
  return Request({ url: '/forum/loadBoard4Post' })
}

// 发布文章获取的文章详情
export function editArticleDetail (params, showError, errorCallback) {
  return Request({
    url: '/forum/articleDetail4Update',
    params,
    showError,
    errorCallback
  })
}

// 发布文章
export function postArticle (params) {
  return Request({ url: '/forum/postArticle', params })
}

// 编辑文章
export function updateArticle (params) {
  return Request({ url: '/forum/updateArticle', params })
}

// 获取用户信息(个人中心)
export function getUserInfo (params, errorCallback) {
  return Request({ url: '/ucenter/getUserInfo', params, errorCallback })
}

// 获取用户发帖(个人中心)
export function loadUserArticle (params, showLoading) {
  return Request({ url: '/ucenter/loadUserArticle', params, showLoading })
}

// 更新用户信息(个人中心)
export function updateUserInfo (params) {
  return Request({ url: '/ucenter/updateUserInfo', params })
}

// 用户积分记录(个人中心)
export function loadUserIntegralRecord (params, showLoading) {
  return Request({
    url: '/ucenter/loadUserIntegralRecord',
    params,
    showLoading
  })
}

// 获取消息数量(消息中心)
export function getMessageCount () {
  return Request({ url: '/ucenter/getMessageCount' })
}

// 获取消息数量(消息中心)
export function loadMessageList (params, showLoading) {
  return Request({ url: '/ucenter/loadMessageList', params, showLoading })
}

// 退出登录
export function logout () {
  return Request({ url: '/logout' })
}
