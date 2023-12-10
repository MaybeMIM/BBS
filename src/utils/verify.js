// 验证工具类

const regs = {
  email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  number: /^([0]|[1-9][0-9]*)$/,
  password: /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*_]{6,16}$/
}

function verify(rule, value, regs, cb) {
  if (value) {
    // 有值 且 正则匹配得上 校验
    if (regs.test(value)) {
      cb()
    } else {
      // 否则 校验失败信息
      cb(new Error(rule.message))
    }
  } else {
    cb()
  }
}

export default {
  email: (rule, value, cb) => {
    return verify(rule, value, regs.email, cb)
  },
  number: (rule, value, cb) => {
    return verify(rule, value, regs.number, cb)
  },
  password: (rule, value, cb) => {
    return verify(rule, value, regs.password, cb)
  },
}
