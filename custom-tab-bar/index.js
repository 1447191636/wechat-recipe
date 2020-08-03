Component({
	data: {
		active: 0,
		list: [{
				icon: 'home-o',
				text: '主页',
				url: '/pages/home/index'
			},
			{
				icon: 'friends-o',
				text: '圈子',
				url: '/pages/feature/index'
			},
			{
				icon: 'chat-o',
				text: '消息',
				url: '/pages/news/index'
			},
			{
				icon: 'user-o',
				text: '我的',
				url: '/pages/user/index'
			}
		]
	},

	methods: {
		onChange(event) {
			this.setData({
				active: event.detail
			});
			wx.switchTab({
				url: this.data.list[event.detail].url
			});
		},

		init() {
			const page = getCurrentPages().pop();
			this.setData({
				active: this.data.list.findIndex(item => item.url === `/${page.route}`)
			});
		}
	}
});