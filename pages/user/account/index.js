import api from '../../../utils/api'
import util from '../../../utils/util'

Page({
  data: {
    form: {
      username: '',
      password: ''
    }
  },

  nameChange(event) {
    const {
      form
    } = this.data;
    form.username = event.detail.value;
    this.setData({
      form
    })
  },

  passChange(event) {
    const {
      form
    } = this.data;
    form.password = event.detail.value;
    this.setData({
      form
    })
  },

  bind() {
    const {
      form
    } = this.data;
    let validate = this.validateForm(form.username, form.password);
    if (validate) {
      form.secret = util.inputToFormPass(form.password);
      api.post('/weChat/bind', form).then(data => {
        this.sendMessage('绑定成功,请退出重新登陆');
        // 清除token
        wx.removeStorageSync('token');
        wx.removeStorageSync('refreshToken');
        // 跳转
        setTimeout(() => {
          wx.switchTab({
            url: '../../user/index',
          })
        }, 1000);
      });
    }
  },

  validateForm(username, password) {
    if (!username) {
      this.sendMessage('用户名不能为空')
      return false;
    }
    if (!password) {
      this.sendMessage('密码不能为空')
      return false;
    }
    return true;
  },

  sendMessage(message) {
    wx.showToast({
      title: message,
      icon: 'none'
    })
  }
})