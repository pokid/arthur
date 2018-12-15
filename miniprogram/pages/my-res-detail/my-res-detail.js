Page({
  data: {
    resID: 0,
    date: "2018-12-20",
    startTime: "09:00",
    endTime: "12:00"
  },

  onLoad: function(option) {
    this.setData({
      resID: option.id
    })
  },

  bindImageChange(e) {
    this.setData({})
  },

  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindStartTimeChange(e) {
    this.setData({
      startTime: e.detail.value
    })
  },

  bindEndTimeChange(e) {
    this.setData({
      endTime: e.detail.value
    })
  },

  save: function() {
    wx.showModal({
      title: '',
      content: '信息修改成功',
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
  },

  cancel: function() {
    wx.showModal({
      title: '',
      content: '项目已取消',
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