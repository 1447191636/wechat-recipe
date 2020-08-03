import api from '../../utils/api'

Page({
  data: {
    user: ''
  },

  onLoad: function (options) {
    api.post('/user/userInfo').then(data => {
      this.setData({
        user: data.data
      });
    });
  },

  onShow() {
    this.getTabBar().init();
  }
})