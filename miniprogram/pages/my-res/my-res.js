Page({
  data: {},

  onLoad: function () { },

  getResDetail: function (event) {
    wx.navigateTo({
      url: '/pages/my-res-detail/my-res-detail?id=1'
    })
  }
})