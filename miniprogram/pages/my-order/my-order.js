Page({
  data: {},

  onLoad: function() {},

  getOrderDetail: function(event) {
    wx.navigateTo({
      url: '/pages/my-order-detail/my-order-detail?id=1'
    })
  }
})