Page({
  data: {
    avatarUrl: "/images/avatar.png",
    nickName: "我的昵称"
  },

  onLoad: function() {},

  update: function() {
    wx.navigateTo({
      url: '/pages/my-info-edit/my-info-edit',
    })
  }
})