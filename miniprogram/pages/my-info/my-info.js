const app = getApp()
Page({
  data: {
    userInfo:'',
  },

  onLoad: function() {
    const openid = app.globalData.openid
    wx.cloud.callFunction({
      name: 'db_getUserInfoById',
      data: {
        _id:openid
      },
      success: res => {
        const _userInfo = {}
        _userInfo._id = openid
        _userInfo.imgUrl = res.result.data.imgUrl
        _userInfo.nickName = res.result.data.nickName
        if (res.result.data.name!=null)
          _userInfo.name = res.result.data.name
        _userInfo.gender = res.result.data.gender==1?"男":"女"
        if (res.result.data.job != null)
          _userInfo.job = res.result.data.job
        if (res.result.data.identifier != null)
          _userInfo.identifier = res.result.data.identifier
        this.setData({
          userInfo: _userInfo
        })
      }
    })
    
  },

  update: function (option) {
    const userInfo= option.target.dataset.userinfo
    wx.navigateTo({
      url: '/pages/my-info-edit/my-info-edit?userInfo=' + JSON.stringify(userInfo),
    })
  }
})