const app = getApp()
Page({
  data: {
    myPreResList:'',
    resList:''
  },

  onLoad: function() {
    wx.cloud.callFunction({
      name: 'db_getUserPreResList',
      data:{
        _id: app.globalData.openid
      },
      success: res => {
        this.setData({
          myPreResList: res.result
        })
      }
    })
  },

  getOrderDetail: function(event) {
    const resInfo = JSON.stringify(event.currentTarget.dataset.resinfo)
    wx.navigateTo({
      url: '/pages/my-order-detail/my-order-detail?resInfo=' + resInfo
    })
  }
})