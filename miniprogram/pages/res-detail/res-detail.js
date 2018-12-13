Page({
  data: {
    resID: 0
  },

  onLoad: function(option) {
    this.setData({
      resID: option.id
    })
  },

  order: function() {
    wx.showModal({
      title: '',
      content: '预约成功',
      showCancel: false,
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else {
          console.log('用户点击取消')
        }
      }
    })
  }
})