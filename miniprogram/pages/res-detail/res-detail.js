const app = getApp()
Page({
  data: {
    resID: '',
    resInfo:'',
    imgUrl:'',
    canPre:true
  },

  onLoad: function(option) {
    wx.cloud.callFunction({
      name: 'db_getUserInfoById',
      data: {
        _id: app.globalData.openid
      },
      success: res => {
        var data = res.result.data
        var preRes = data.preResource
        if (preRes == undefined) {
          preRes = []
        }
        if (option != undefined) {
          if (option._id != undefined) {
            
            // const resInfoObj = JSON.parse(option)
            var _imgUrl = option.imgUrl
            if (_imgUrl == undefined || _imgUrl.length < 10) {
              _imgUrl = "/images/placeholder-detail.png"
            }
            if (preRes.indexOf(option._id) == -1) {
              this.setData({
                canPre: false
              })
            }
            this.setData({
              resID: option._id,
              resInfo: option,
              imgUrl: _imgUrl
            })
          }
          if (option.resInfo != undefined) {
            const resInfoObj = JSON.parse(option.resInfo)
            if (preRes.indexOf(resInfoObj._id) != -1) {
              this.setData({
                canPre: false
              })
            }
            console.log(this.data.canPre,22)
            this.setData({
              resID: resInfoObj._id,
              resInfo: resInfoObj,
            })
          }
        }
      }
    })
    
  },

  //預約
  //如果已预约该资源提示已预约
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
          //更新用户信息 先查已预约资源再改
          //如果已预约该资源提示已预约
          wx.cloud.callFunction({
            name: 'db_getUserInfoById',
            data: {
              _id: app.globalData.openid
            },
            success:res=>{
              var data = res.result.data
              var preRes = data.preResource
              if (preRes==undefined){
                preRes = []
              }
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
          //更新资源信息
          wx.cloud.callFunction({
            name: 'db_updateResInfo',
            data: resData
          })
          //必須先刷新上层页面再刷新当前页
          getCurrentPages()[getCurrentPages().length - 1].onLoad(resInfo)
          console.log('用户点击确定')
        } else {
          console.log('用户点击取消')
        }
      }
    })
  }
})