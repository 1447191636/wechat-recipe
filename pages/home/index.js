import api from '../../utils/api.js';

Page({
  data: {
    list: [],
    page: 1
  },

  onShow() {
    this.getTabBar().init();
  },

  onLoad() {
    const {
      page
    } = this.data;
    // 获取数据
    api.post('/recipe/new', {
      page: page,
      size: 10
    }).then(data => {
      this.setData({
        list: data.data,
        page: page + 1
      });
    });
  },

  onReachBottom() {
    const {
      page,
      list
    } = this.data;
    // 获取数据
    api.post('/recipe/new', {
      page: page,
      size: 10
    }).then(data => {
      this.setData({
        list: list.concat(data.data),
        page: page + 1
      });
    });
  },

  onSearch(event) {
    if (!event.detail) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      })
      return;
    }
    wx.navigateTo({
      url: 'search/index?name=' + event.detail
    })
  },

  recipeInfo(event) {
    let id = event.currentTarget.dataset['id'];
    wx.navigateTo({
      url: 'item/index?id=' + id,
    })
  }
})