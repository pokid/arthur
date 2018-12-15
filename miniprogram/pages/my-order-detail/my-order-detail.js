Page({
  data: {
    resID: 0
  },

  onLoad: function(option) {
    this.setData({
      resID: option.id
    })
  },

  cancel: function() {
    wx.showModal({
      title: '',
      content: '预约已取消',
      showCancel: false,
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.navigateBack({})
        } else {
          console.log('用户点击取消')
        }
      }
    })
  }
})