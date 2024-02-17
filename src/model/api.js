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
export function updateBoard (params) {
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

// 下载附件
export function getAttachment (params) {
  return Request({ url: '/forum/getAttachment', params })
}

// 查看评论
export function loadComment (params) {
  return Request({ url: '/forum/loadComment4Article', params })
}

// 获取评论列表
export function loadCommentList (params) {
  return Request({ url: '/forum/loadComment', params })
}

// 删除评论
export function delComment (params) {
  return Request({ url: '/forum/delComment', params })
}

// 编辑评论
export function auditComment (params) {
  return Request({ url: '/forum/auditComment', params })
}

// 用户列表
export function loadUserList (params) {
  return Request({ url: '/user/loadUserList', params })
}

// 编辑用户
export function updateUserStatus (params) {
  return Request({ url: '/user/updateUserStatus', params })
}

// 发送系统消息
export function sendMessage (params) {
  return Request({ url: '/user/sendMessage', params })
}

// 获取系统配置
export function getSetting () {
  return Request({ url: '/setting/getSetting' })
}

// 保存系统配置
export function saveSetting (params) {
  return Request({ url: '/setting/saveSetting', params })
}

// 编辑板块
export function saveBoard (params) {
  return Request({ url: '/board/saveBoard', params })
}

// 删除板块
export function delBoard (params) {
  return Request({ url: '/board/delBoard', params })
}

// 改变板块排序
export function changeBoardSort (params) {
  return Request({ url: '/board/changeBoardSort', params })
}
