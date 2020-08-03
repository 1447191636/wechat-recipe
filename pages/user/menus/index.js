import api from '../../../utils/api'

Page({
  data: {
    createList: [],
    starList: []
  },

  onShow: function () {
    api.post('/menu/userMenus').then(data => {
      this.setData({
        createList: data.data
      })
    })

    api.post('/menu/starMenus').then(data => {
      this.setData({
        starList: data.data
      })
    })
  },

  menuInfo(event){
    let id = event.currentTarget.dataset['id'];
    wx.navigateTo({
      url: '../../home/menu/index?id=' + id,
    })
  }
})