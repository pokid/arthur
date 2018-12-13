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

  changeDate(e) {
    this.setData({
      date: e.detail.value
    })
  },

  changeStartTime(e) {
    this.setData({
      startTime: e.detail.value
    })
  },

  changeEndTime(e) {
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
  }
})