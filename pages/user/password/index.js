import api from '../../../utils/api'
import util from '../../../utils/util'

Page({
  data: {
    form: {
      oldPass: '',
      newPass: '',
      confirm: ''
    }
  },

  newChange(event) {
    const {
      form
    } = this.data
    form.newPass = event.detail
    this.setData({
      form
    })
  },

  oldChange(event) {
    const {
      form
    } = this.data
    form.oldPass = event.detail
    this.setData({
      form
    })
  },

  confirmChange(event) {
    const {
      form
    } = this.data
    form.confirm = event.detail
    this.setData({
      form
    })
  },

  validateForm(oldPass, newPass, confirm) {
    if (!oldPass) {
      this.sendMessage('旧密码不能为空')
      return false;
    }
    if (!newPass) {
      this.sendMessage('新密码不能为空')
      return false;
    }
    if (!confirm) {
      this.sendMessage('确认密码不能为空')
      return false;
    }
    if (confirm != newPass) {
      this.sendMessage('两次密码输入不一致')
      return false;
    }
    return true
  },

  sendMessage(message) {
    wx.showToast({
      title: message,
      icon: "none"
    })
  },

  save() {
    const {
      form
    } = this.data
    let validate = this.validateForm(form.oldPass, form.newPass, form.confirm);
    if (validate) {
      //密码md5加密
      form.oldSecret = util.inputToFormPass(form.oldPass);
      form.newSecret = util.inputToFormPass(form.newPass);
      api.post('/user/updatePassword', form).then(
        data => {
          this.sendMessage('修改成功,请退出重新登陆')
          // 清除token
          wx.removeStorageSync('token');
          wx.removeStorageSync('refreshToken');
          // 跳转
          setTimeout(() => {
            wx.switchTab({
              url: '../../user/index',
            })
          }, 1000);
        }
      );
    }
  }
})