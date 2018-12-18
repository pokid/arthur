const app = getApp()
Page({
  data: {
    myPubResList: '',
  },

  onLoad: function () {
    wx.cloud.callFunction({
      name: 'db_getUserPubResList',
      data: {
        _id: app.globalData.openid
      },
      success: res => {
        console.log(app.globalData.openid)
        console.log(res)
        this.setData({
          myPubResList: res.result
        })
      }
    })
  },

  getResDetail: function (event) {
    const resInfo = JSON.stringify(event.currentTarget.dataset.resinfo)
    wx.navigateTo({
      url: '/pages/my-res-detail/my-res-detail?resInfo=' + resInfo
    })
  }
})