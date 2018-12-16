Page({
  data: {
    avatarUrl: "/images/avatar.png",
    nickName: "我的昵称",
    gender_index: 0,
    role_index: 0,
    gender: ["男", "女"],
    role: ["学生", "教师"]
  },

  onLoad: function() {},

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

  save: function() {
    wx.showModal({
      title: '',
      content: '信息修改成功',
      showCancel: false,
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.navigateBack({
            delta: 2
          })
        } else {
          console.log('用户点击取消')
        }
      }
    })
  }
})