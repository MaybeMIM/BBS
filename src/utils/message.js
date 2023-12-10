// message组件
import { ElMessage } from "element-plus";


const message = {
  success: (msg, cb) => {
    showMessage(msg, cb, 'success')
  },
  error: (msg, cb) => {
    showMessage(msg, cb, 'error')
  },
  warning: (msg, cb) => {
    showMessage(msg, cb, 'warning')
  }
}

function showMessage(msg, cb, type) {
  ElMessage({
    type: type,
    message: msg,
    duration: 2000,
    onClose: () => {
      if (cb) {
        cb()
      }
    }
  })
}

export default message
