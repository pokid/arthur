//app.js
App({
  globalData: {
    openid: '',
  },

  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    wx.getSetting({
      success: res => {
        console.log(res)
        if (!res.authSetting['scope.userInfo']) {
          wx.showModal({
            title: '警告',
            content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateTo({
                  url: '/auth',
                })
              }
            }
          })
        }
      }
    })
      // 登錄
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log(res, 1)
          const openid = res.result.openid
          this.globalData.openid = openid
          //个人信息入库
          wx.getUserInfo({
            success: res => {
              console.log(res, 111)
              const userInfo = res.userInfo
            
              wx.cloud.callFunction({
                name: 'db_getUserInfoById',
                data: {
                  _id: openid,
                },
                success:res=>{
                  console.log(res, 222)

                  //如果庫里已經存在則不需再存
                  if (res == null ||res.result==undefined){
                    wx.cloud.callFunction({
                      name: 'db_addUser',
                      data: {
                        _id: openid,
                        openid: openid,
                        nickName: userInfo.nickName,
                        gender: userInfo.gender,
                        city: userInfo.city,
                        imgUrl: userInfo.avatarUrl
                      },
                    })
                  }
                }
              })
            },
          })
     
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    }
  
})
