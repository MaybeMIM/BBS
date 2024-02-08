export default {
  sizeToStr: size => {
    var data = ''
    if (size < 0.1 * 1024) {
      // 小于0.1KB 转换为B
      data = size.toFixed(2) + 'B'
    } else if (size < 0.1 * 1024 * 1024) {
      // 小于0.1MB转换为KB
      data = (size / 1024).toFixed(2) + 'KB'
    } else if (size < 0.1 * 1024 * 1024 * 1024) {
      // 小于0.1GB转换为MB
      data = (size / (1024 * 1024)).toFixed(2) + 'MB'
    } else {
      // 转为GB
      data = (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
    }

    var sizeStr = data + ''
    var len = sizeStr.indexOf('.')
    var dec = sizeStr.substr(len + 1, 2)
    if (dec === '00') {
      // 小数后为00时 去除
      return sizeStr.substring(0, len) + sizeStr.substr(len + 3, 2)
    }
    return sizeStr
  }
}
