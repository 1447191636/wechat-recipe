var jwt_decode = require('./utils/jwt-decode');
var util = require('./utils/util');

App({
  onLaunch: function () {
    // 初始化信息
    const token = wx.getStorageSync('token');
    if (token) {
      //解析token
      const decoded = jwt_decode(token);
      this.globalData.user = decoded;
      this.globalData.isAuthenticated = !util.isEmpty(decoded);
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    baseUrl: 'https://www.haloslv.top:8081/api',
    userInfo: null,
    user: null,
    isAuthenticated: false
  }
})