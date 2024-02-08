import Request from '@/utils/request'

// 获取文章列表
export function login (params, errorCallback) {
  return Request({ url: 'login', params, errorCallback })
}
