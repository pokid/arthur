const app = getApp()
Page({
  data: {
    resID: '',
    resInfo: ''
  },

  onLoad: function(option) {
    if (option != undefined) {
      if (option._id != undefined) {
        // const resInfoObj = JSON.parse(option)
        this.setData({
          resID: option._id,
          resInfo: option,
        })
      }
      if (option.resInfo != undefined) {
        const resInfoObj = JSON.parse(option.resInfo)
        this.setData({
          resID: resInfoObj._id,
          resInfo: resInfoObj,
        })
      }
    }
  },

  //取消预约
  //資源：可預約資源+1  預約用戶-1
  //用戶：预约资源-1
  cancel: function() {
    const resInfo = this.data.resInfo
    //构造resData
    const resData = {}
    const _resInfo = {}
    resInfo.canCount = resInfo.canCount + 1
    _resInfo.canCount = resInfo.canCount
    resData._id = resInfo._id
    resData.resInfo = _resInfo
    this.setData(resInfo)
    console.log(resData)
    wx.showModal({
      title: '',
      content: '取消成功',   
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'db_updateResInfo',
            data: resData
          })
          //更新用户信息 先查已预约资源再改
          wx.cloud.callFunction({
            name: 'db_getUserInfoById',
            data: {
              _id: app.globalData.openid
            },
            success: res => {
              const preRes = Array.from(new Set(res.result.data.preResource))
              console.log(resInfo._id)
              console.log(preRes)
              for (var i = 0; i < preRes.length;i++){
                if (preRes[i] == resInfo._id){
                  preRes.splice(i, 1)
                  break
                }
              }
              console.log(preRes)
              wx.cloud.callFunction({
                name: 'db_updateUserInfo',
                data: {
                  _id: app.globalData.openid,
                  _userInfo: {
                    preResource: preRes
                  },
                },
                success:res=>{
                  getCurrentPages()[getCurrentPages().length - 2].onLoad()
                  wx.navigateBack({
                    url: '/pages/my-order/my-order',
                  })
                }
              })
            }
          })

          //必須先刷新上機頁面在刷新當前頁
          getCurrentPages()[getCurrentPages().length - 2].onLoad()
          getCurrentPages()[getCurrentPages().length - 1].onLoad(resInfo)
          console.log('用户点击确定')
        } else {
          console.log('用户点击取消')
        }
      }
    })
  }
})