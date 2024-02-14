import axios from 'axios'
import { ElLoading } from 'element-plus'
import Message from './message'
import router from '@/router'

const instance = axios.create({
  baseURL: '/api',
  timeout: 10 * 1000
})

const contentTypeForm = 'application/x-www-form-urlencoded;charset=UTF-8'
const contentTypeJson = 'application/json'

// 请求前过滤器
let loading = null
instance.interceptors.request.use(
  config => {
    if (config.showLoading) {
      // loading加载
      loading = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0,0,0,0.7)'
      })
    }
    return config
  },
  error => {
    if (config.showLoading && loading) {
      loading.close()
    }
    Message.error('请求发送失败')
    return Promise.reject('请求发送失败')
  }
)

// 请求后过滤器
instance.interceptors.response.use(
  response => {
    // 打印请求回来的数据和请求地址
    console.log(`Response: ${response.config.url}`)
    // 发送错误时的回调(用于登录账号密码错误 需刷新验证码) 错误信息默认显示
    const { showLoading, errorCallback, showError } = response.config
    if (showLoading && loading) {
      // 请求回来 关闭遮罩
      loading.close()
    }
    const responseDate = response.data
    console.log(responseDate)
    if (responseDate.code === 200) {
      return responseDate
    } else if (responseDate.code === 901) {
      setTimeout(() => {
        router.push('/login')
      }, 1500)
      // 不显示错误信息 直接弹框
      return Promise.reject({ showError: false, msg: '登录超时' })
    } else {
      if (errorCallback) {
        errorCallback(responseDate)
      }
      return Promise.reject({ showError, msg: responseDate.info })
    }
  },
  error => {
    if (error.config.showLoading && loading) {
      loading.close()
    }
    return Promise.reject({ showError: true, msg: '网络异常' })
  }
)

const request = config => {
  const {
    url,
    params,
    dataType,
    showLoading = true,
    errorCallback,
    showError = true
  } = config
  //  表单(默认) json
  let contentType = contentTypeForm
  let fromData = new FormData()
  // 遍历 params 用于form提交
  for (let key in params) {
    fromData.append(key, params[key] ?? '')
  }
  if (dataType !== null && dataType === 'json') {
    contentType = contentTypeJson
  }
  let headers = {
    // 发原生axios请求
    'Content-Type': contentType,
    'X-Requested-With': 'XMLHttpRequest'
  }
  return instance
    .post(url, fromData, {
      headers,
      showLoading,
      errorCallback,
      showError
    })
    .catch(error => {
      if (error.showError) {
        Message.error(error.msg)
      }
      return null
    })
}

export default request
