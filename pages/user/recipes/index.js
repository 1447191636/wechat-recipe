import api from '../../../utils/api'

Page({
  data: {
    list: []
  },

  recipeInfo(event) {
    let id = event.currentTarget.dataset['id'];
    wx.navigateTo({
      url: '../../home/item/index?id=' + id,
    })
  },

  onShow: function () {
    api.post('/recipe/userRecipes').then(data => {
      this.setData({
        list: data.data
      })
    })
  }
})