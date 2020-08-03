import api from '../../../utils/api.js';

const app = getApp();
const user = app.globalData.user;

Page({

  data: {
    id: '',
    feature: {},
    publishDate: '',
    comment: '',
    placeholder: '我想说两句',
    target: ''
  },

  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },

  onShow: function () {
    api.post('/feature/featureInfo', this.data.id).then(data => {
      // 处理评论日期
      data.data.comments.forEach(
        item => {
          // 回复用户
          if (item.target) {
            item.content = "@" + item.target.username + " " + item.content;
          }
          item.publishDate = new Date(item.publishDate).toLocaleString()
        }
      );
      // 处理圈子日期,数据渲染
      this.setData({
        feature: data.data,
        publishDate: new Date(data.data.publishDate).toLocaleString()
      });
    })
  },

  commentChange(event) {
    this.setData({
      comment: event.detail
    })
  },

  // 评论
  submitComment() {
    const {
      feature,
      comment,
      target,
      id
    } = this.data;
    if (!comment) {
      wx.showToast({
        title: '请输入评论内容',
        icon: 'none'
      })
      return;
    }
    let params = {
      id: id,
      content: comment
    }
    if (target) {
      params.targetId = target.id;
    }
    // 访问接口
    api.post('/feature/comment', params).then(data => {
      // 刷新评论列表
      let tempComment = comment;
      if (target) {
        tempComment = "@" + target.username + " " + comment;
      }
      feature.comments.unshift({
        author: {
          username: user.username,
          avatar: user.avatar
        },
        content: tempComment,
        publishDate: new Date().toLocaleString()
      });
      // 清空表单,刷新数据
      this.setData({
        feature: feature,
        comment: '',
        target: '',
        placeholder: '我想说两句'
      })

      wx.showToast({
        title: '发布评论成功',
        icon: 'success'
      })
    });
  },

  // 回复
  backComment(event) {
    let comments = this.data.feature.comments;
    let index = event.currentTarget.dataset['index'];
    this.setData({
      placeholder: "@" + comments[index].author.username,
      target: comments[index].author
    })
  }
})