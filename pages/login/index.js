import api from '../../utils/api';
import util from '../../utils/util'
import jwt_decode from '../../utils/jwt-decode'

const app = getApp();

Page({

  data: {},

  onLoad: function (options) {
    const {
      isAuthenticated
    } = app.globalData;

    if (isAuthenticated) {
      wx.switchTab({
        url: '/pages/home/index',
      })
    }
  },

  login(event) {
    if (event.detail.userInfo) {
      // 设置用户
      app.globalData.userInfo = event.detail.userInfo;
      let userInfo = event.detail.userInfo;
      // 请求后台
      wx.login({
        success: res => {
          //授权成功后，从后台获取数据
          api.post('/weChat/login', {
            code: res.code,
            avatar: userInfo.avatarUrl,
            username: userInfo.nickName
          }).then(data => {
            //获取token,rToken
            const {
              token,
              refreshToken
            } = data;
            wx.setStorageSync('token', token)
            wx.setStorageSync('refreshToken', refreshToken)
            //解析token
            const decoded = jwt_decode(token);
            app.globalData.user = decoded;
            app.globalData.isAuthenticated = !util.isEmpty(decoded);
            // 显示
            wx.showToast({
              title: '登录成功',
              icon: "success"
            })
            // 跳转首页
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/home/index',
              })
            }, 1000);
          });
        }
      })
    } else {
      wx.showModal({
        content: "您已拒绝授权",
        showCancel: false,
        confirmText: '知道了'
      })
    }
  }
})