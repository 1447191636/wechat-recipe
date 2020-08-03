import api from '../../../utils/api.js';

Page({
  data: {
    // 搜索内容
    search: '',
    // 搜索数据
    recipes: [],
    // 菜单
    menus: [],
    // Tab
    tab: '菜谱',
    recipePage: 1,
    menuPage: 1
  },

  onLoad: function (options) {
    let name = options.name;
    const {
      recipePage,
      menuPage
    } = this.data
    this.getData('/search/recipe', name, recipePage, data => {
      this.setData({
        recipes: data,
        search: name,
        recipePage: recipePage + 1
      })
    });
    this.getData('/search/menu', name, menuPage, data => {
      this.setData({
        menus: data,
        menuPage: menuPage + 1
      })
    });
  },

  onSearch(event) {
    let name = event.detail;
    if (!name) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      })
      return;
    }
    const {
      recipePage,
      menuPage
    } = this.data
    this.getData('/search/recipe', name, recipePage, data => {
      this.setData({
        recipes: data,
        search: name,
        recipePage: recipePage + 1
      })
    });
    this.getData('/search/menu', name, menuPage, data => {
      this.setData({
        menus: data,
        menuPage: menuPage + 1
      })
    });
  },

  recipeInfo(event) {
    let id = event.currentTarget.dataset['id'];
    wx.navigateTo({
      url: '../item/index?id=' + id,
    })
  },

  menuInfo(event) {
    let id = event.currentTarget.dataset['id'];
    wx.navigateTo({
      url: '../menu/index?id=' + id,
    })
  },

  tabChange(event) {
    const tab = event.detail.title
    this.setData({
      tab
    })
  },

  // 获取数据
  getData(url, name, page, fun) {
    api.post(url, {
      name: name,
      page: page,
      size: 10
    }).then(data => {
      fun(data.data)
    })
  },

  onReachBottom() {
    if (this.data.tab == '菜谱') {
      const {
        recipePage,
        recipes,
        search
      } = this.data;
      this.getData('/search/recipe', search, recipePage, data => {
        this.setData({
          recipes: recipes.concat(data),
          recipePage: recipePage + 1
        })
      })
    } else {
      const {
        menuPage,
        menus,
        search
      } = this.data;
      this.getData('/search/menu', search, menuPage, data => {
        this.setData({
          menus: menus.concat(data),
          menuPage: menuPage + 1
        })
      })
    }
  }
})