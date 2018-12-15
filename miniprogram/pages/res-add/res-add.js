Page({
  data: {
    date: "请选择",
    startTime: "开始时间",
    endTime: "结束时间"
  },

  onLoad: function() {},

  onShow: function() {
    wx.hideTabBar({})
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

  release(e) {
    wx.showModal({
      title: '',
      content: '项目发布成功',
      showCancel: false,
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.switchTab({
            url: '/pages/res-list/res-list',
            success: function() {
              wx.showTabBar({})
            }
          })
        } else {
          console.log('用户点击取消')
        }
      }
    })
  },

  cancel(e) {
    wx.showModal({
      title: '',
      content: '取消发布项目',
      showCancel: false,
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.switchTab({
            url: '/pages/res-list/res-list',
            success: function() {
              wx.showTabBar({})
            }
          })
        } else {
          console.log('用户点击取消')
        }
      }
    })
  }
})