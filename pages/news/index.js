import Dialog from '../../vant-weapp/dist/dialog/dialog';
import api from '../../utils/api'

// 动作类型
const ACTION = {
  0: "评论",
  1: "点赞",
  2: "喜欢"
};
// 目标类型
const TYPE = {
  0: "菜谱",
  1: "圈子"
};

Page({
  data: {
    list: []
  },

  onShow() {
    this.getTabBar().init();
    // 访问接口
    api.post('/notify/userNotifies').then(data => {
      data.data.forEach(item => {
        item.content = ACTION[item.action] + "了你的" + TYPE[item.type]
      })
      this.setData({
        list: data.data
      })
    });
  },

  onClose(event) {
    const {
      position,
      instance
    } = event.detail;
    switch (position) {
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？',
        }).then(() => {
          this.deleteNews(event.currentTarget.dataset['id']);
          // 关闭右滑
          instance.close();
        });
        break;
    }
  },

  deleteNews(id) {
    api.post('/notify/deleteNotify', id).then(data => {
      // 处理页面变化
      let comments = this.data.list;
      comments.forEach((item, index) => {
        if (item.id == id) {
          comments.splice(index, 1)
        }
      });
      this.setData({
        list: comments
      })
    });
  }
})