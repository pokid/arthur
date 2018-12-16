const app = getApp()
Page({
  data: {

    resList: '',
  },

  onLoad: function () {
    console.log(111)
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.cloud.callFunction({
            name: 'db_getResList',
            success: res => {
              this.setData({
                resList: res.result.data
              })
              console.log(res.result.data)
            }
          })
        }
      }
    })
  },
  
  getResDetail: function(event) {
    const resInfo = JSON.stringify(event.currentTarget.dataset.resinfo)
    wx.navigateTo({
      url: '/pages/res-detail/res-detail?resInfo=' + resInfo
    })
  }
})