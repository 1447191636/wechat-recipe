import md5 from './md5'

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

//判断是否为空
const isEmpty = value => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//密码加密salt
const PASSWORD_SALT = "1a2b3c";

//输入密码加密
const inputToFormPass = input => {
  return md5(
    PASSWORD_SALT.charAt(0) +
    PASSWORD_SALT.charAt(2) +
    input +
    PASSWORD_SALT.charAt(5) +
    PASSWORD_SALT.charAt(4)
  );
}

module.exports = {
  formatTime,
  formatNumber,
  isEmpty,
  inputToFormPass
}