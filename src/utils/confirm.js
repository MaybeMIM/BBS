import { ElMessageBox } from 'element-plus'

const confirm = (message, ok) => {
  ElMessageBox.confirm(message, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  })
    .then(async () => {
      ok()
    })
    .catch(() => {})
}

export default confirm
