import api from '../../../utils/api'
import util from '../../../utils/util'
import jwt_decode from '../../../utils/jwt-decode'

const app = getApp()
const phonePattern = new RegExp(/^1[34578]\d{9}$/);
const mailPattern = new RegExp(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/);

Page({

  data: {
    fileList: [],
    userInfo: null,
    username: ''
  },

  onLoad: function () {
    api.post('/user/userInfo').then(data => {
      let fileList = []
      fileList.push({
        url: data.data['avatar'],
        isImage: true
      })
      this.setData({
        fileList,
        userInfo: data.data,
        username: data.data.username
      });
    });
  },

  afterRead(event) {
    const {
      file
    } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    api.upload('/upload/images', 'file', file.path).then(res => {
      const {
        fileList = []
      } = this.data;
      fileList.push({
        url: JSON.parse(res.data)['path']
      });
      this.setData({
        fileList
      });
    })
  },

  onDelete(event) {
    const {
      fileList = []
    } = this.data;
    fileList.splice(event.detail.index, 1);
    this.setData({
      fileList
    });
  },

  nameChange(event) {
    const userinfo = this.data.userInfo;
    userinfo.username = event.detail;
    this.setData({
      userInfo: userinfo
    })
  },

  phoneChange(event) {
    const userinfo = this.data.userInfo;
    userinfo.phone = event.detail;
    this.setData({
      userInfo: userinfo
    })
  },

  mailChange(event) {
    const userinfo = this.data.userInfo;
    userinfo.mail = event.detail;
    this.setData({
      userInfo: userinfo
    })
  },

  descriptionChange(event) {
    const userinfo = this.data.userInfo;
    userinfo.description = event.detail;
    this.setData({
      userInfo: userinfo
    })
  },

  signChange(event) {
    const userinfo = this.data.userInfo;
    userinfo.sign = event.detail;
    this.setData({
      userInfo: userinfo
    })
  },

  save() {
    const {
      userInfo,
      fileList
    } = this.data;
    this.validateForm(userInfo, fileList).then(validate => {
      if (validate) {
        userInfo.avatar = fileList[0].url
        api.post('/user/updateInfo', userInfo).then(data => {
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
            title: '修改成功',
            icon: "success"
          })
          // 跳转
          setTimeout(() => {
            wx.switchTab({
              url: '../../user/index',
            })
          }, 1000);
        })
      }
    })
  },

  async validateForm(userInfo, fileList) {
    if (fileList.length == 0) {
      this.sendMessage("请选择头像");
      return false;
    }
    if (!userInfo.username) {
      this.sendMessage("请填写用户名");
      return false;
    }
    if (userInfo.username) {
      if (userInfo.username != this.data.username) {
        let result = await this.getSameUserName(userInfo.username)
        if (result.data) {
          this.sendMessage("用户名已存在");
          return false;
        }
      }
    }
    if (userInfo.phone) {
      if (!phonePattern.test(userInfo.phone)) {
        this.sendMessage("手机号码格式不正确");
        return false;
      }
    }
    if (userInfo.mail) {
      if (!mailPattern.test(userInfo.mail)) {
        this.sendMessage("电子邮箱格式不正确");
        return false;
      }
    }
    return true;
  },

  getSameUserName(username) {
    return api.post('/user/findUsername', username);
  },

  sendMessage(message) {
    wx.showToast({
      title: message,
      icon: "none"
    })
  }
})