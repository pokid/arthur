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
      
      // 登錄
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          const openid = res.result.openid
          this.globalData.openid = openid
          //個任信息入庫
          wx.getUserInfo({
            success: res => {
              const userInfo = res.userInfo
              wx.cloud.callFunction({
                name: 'db_getUserInfoById',
                data: {
                  _id: openid,
                },
                success:res=>{
                  //如果庫里已經存在則不需再存
                  if (res.result!=null){
                    wx.cloud.callFunction({
                      name: 'db_addUser',
                      data: {
                        _id: openid,
                        openid: openid,
                        nickName: userInfo.nickName,
                        name: userInfo.nickName,
                        gender: userInfo.gender,
                        city: userInfo.city,
                        imgUrl: userInfo.avatarUrl
                      },
                    })
                  }
                }
              })
            }
          })
     
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    }

  },

})
