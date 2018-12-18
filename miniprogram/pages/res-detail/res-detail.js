const app = getApp()
Page({
  data: {
    resID: '',
    resInfo:'',
    imgUrl:''
  },

  onLoad: function(option) {
    if (option!=undefined){
      if (option._id !=undefined){
        // const resInfoObj = JSON.parse(option)
        var _imgUrl = option.imgUrl
        if (_imgUrl == undefined || _imgUrl.length<10){
          _imgUrl ="/images/placeholder-detail.png"
        }
        this.setData({
          resID: option._id,
          resInfo: option,
          imgUrl: _imgUrl
        })
      }
      if (option.resInfo!=undefined){
        const resInfoObj = JSON.parse(option.resInfo)  
        this.setData({
          resID: resInfoObj._id,
          resInfo: resInfoObj,
        })
      }
    }
  },

  //預約
  //資源：可預約資源-1  預約用戶+1
  //用戶：預約資源+1
  preOrder: function () {
    const resInfo = this.data.resInfo
    //构造resData update
    const resData = {}
    const _resInfo = {}
    resInfo.canCount = resInfo.canCount - 1
    _resInfo.canCount = resInfo.canCount
    resData._id = resInfo._id
    resData.resInfo = _resInfo 
    this.setData(resInfo)
    wx.showModal({
      title: '',
      content: '预约成功',
      showCancel: false,
      confirmColor: '#3f51b5',
      success: function(res) {
        if (res.confirm) {
          //更新资源信息
          wx.cloud.callFunction({
            name: 'db_updateResInfo',
            data: resData
          })

          //更新用户信息 先查已预约资源再改
          const db = wx.cloud.database()
          const _ = db.command
          wx.cloud.callFunction({
            name: 'db_getUserInfoById',
            data: {
              _id: app.globalData.openid
            },
            success:res=>{
              const preRes = res.result.data.preResource
              preRes.push(resInfo._id)
              wx.cloud.callFunction({
                name: 'db_updateUserInfo',
                data: {
                  _id: app.globalData.openid,
                  _userInfo:{
                    preResource: Array.from(new Set(preRes))
                  },
                },
              })
            }
          })
          //必須先刷新上层页面再刷新当前页
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