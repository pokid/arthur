const app = getApp()
Page({
  data: {
    userInfo:'',
    role_index: 0,
    role: ["请选择","学生", "教师"]
  },

  onLoad: function(option) {
    const _userInfo = JSON.parse(option.userInfo)
    if (_userInfo.job!=""){
      for (var i = 0; i < this.data.role.length; i++) {
        if (this.data.role[i] == _userInfo.job) {
          this.setData({
            role_index: i
          })
          break
        }
      }
    }
    this.setData({
      userInfo: _userInfo
    })
  },

  bindGenderPickerChange(e) {
    this.setData({
      gender_index: e.detail.value
    })
  },

  bindRolePickerChange(e) {
    this.setData({
      role_index: e.detail.value
    })
  },

  save: function(option) {
    console.log(option)
    const moreUserInfo = option.detail.value
    //构造update个人信息
    const _moreUserInfo = {}
    if (moreUserInfo.identifier!="")
      _moreUserInfo.identifier = moreUserInfo.identifier
    if (moreUserInfo.userName != "")
      _moreUserInfo.name = moreUserInfo.userName
    if (moreUserInfo.jobIndex != 0)
      _moreUserInfo.job = this.data.role[parseInt(moreUserInfo.jobIndex)]

    if(JSON.stringify(_moreUserInfo)!="{}"){
      const userData = {}
      userData._id = app.globalData.openid
      userData._userInfo = _moreUserInfo
      console.log(userData)
      wx.cloud.callFunction({
        name: 'db_updateUserInfo',
        data: userData,
        success:res=>{
          getCurrentPages()[getCurrentPages().length - 2].onLoad()
        }
      })
    }
    wx.showModal({
      title: '',
      content: '信息修改成功',
      showCancel: false,
      confirmColor: '#3f51b5',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.navigateBack({
            delta: 1
          })
        } else {
          console.log('用户点击取消')
        }
      }
    })
  }
})