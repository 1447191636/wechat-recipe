import api from '../../utils/api.js'

Page({

  data: {
    list: [],
    page: 1
  },

  onLoad() {
    const {
      page
    } = this.data;
    // 获取数据
    api.post('/feature/hot', page * 20).then(data => {
      let list = []
      // 封装数据
      for (let j = 0; j < 2; j++) {
        list[j] = data.list.filter((n, i) => {
          if ((i - j) % 2 == 0) {
            return n;
          }
        })
      }
      this.setData({
        list: list,
        page: page + 1
      });
    });
  },

  onShow() {
    this.getTabBar().init();
  },

  onReachBottom() {
    const {
      page,
      list
    } = this.data;
    // 获取数据
    api.post('/feature/hot', page * 20).then(data => {
      let result = []
      // 封装数据
      for (let j = 0; j < 2; j++) {
        result[j] = data.list.filter((n, i) => {
          if ((i - j) % 2 == 0) {
            return n;
          }
        })
        list[j] = list[j].concat(result[j])
      }
      this.setData({
        list: list,
        page: page + 1
      });
    });
  },

  onclick(event) {
    wx.navigateTo({
      url: 'publish/index',
    })
  },

  featureInfo(event) {
    let id = event.currentTarget.dataset['id'];
    wx.navigateTo({
      url: 'item/index?id=' + id,
    })
  }
})