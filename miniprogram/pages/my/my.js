Page({
  data: {
    avatarUrl: "/images/avatar.png",
    nickName: "我的昵称"
  },

  onLoad: function() {},

  getMyInfo: function() {
    wx.navigateTo({
      url: '/pages/my-info/my-info',
    })
  },

  getMyOrder: function() {
    wx.navigateTo({
      url: '/pages/my-order/my-order',
    })
  },

  getMyRes: function() {
    wx.navigateTo({
      url: '/pages/my-res/my-res',
    })
  }
})