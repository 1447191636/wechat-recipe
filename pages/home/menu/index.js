import api from '../../../utils/api'

Page({
  data: {
    id: '',
    menu: {},
    publishDate: ''
  },

  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },

  onShow: function () {
    api.post('/menu/menuInfo', this.data.id).then(data => {
      this.setData({
        menu: data.data,
        publishDate: new Date(data.data.createDate).toLocaleString()
      })
    });
  },

  recipeInfo(event){
    let id = event.currentTarget.dataset['id'];
    wx.navigateTo({
      url: '../item/index?id=' + id,
    })
  }
})