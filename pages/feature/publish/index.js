import api from '../../../utils/api.js'
Page({

  data: {
    fileList: [],
    title: '',
    content: ''
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

  titleChange(event) {
    this.setData({
      title: event.detail
    })
  },

  contentChange(event) {
    this.setData({
      content: event.detail
    })
  },

  publish() {
    const {
      title,
      content,
      fileList
    } = this.data;

    // 拼装图片
    let picture = '';
    fileList.forEach(item => picture += (item.url + '&$&'));
    api.post('/feature/publish', {
      title: title,
      content: content,
      picture: picture
    }).then(data => {
      wx.showToast({
        title: '发布成功',
        icon: 'none'
      })

      // 返回圈子
      setTimeout(() => {
        wx.navigateBack()
      }, 1000);
    });
  }
})