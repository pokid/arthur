const app = getApp()
Page({
  data: {
    resInfo: '',
    imgPath: '/images/placeholder-detail.png',
    fileID:'',
    date: "请选择",
    startTime: "开始时间",
    endTime: "结束时间"
  },

  onLoad: function() {},

  onShow: function() {
    wx.hideTabBar({})
  },

  bindImageChange(e) {
    const _this = this
    wx.chooseImage({
      count: 1, // 默认9    
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        const cloudPath = filePath.split(".")[2] + ".png"
        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: filePath,
          success: res => {
            _this.setData({
              fileID: res.fileID,
              imgPath: filePath
            })
            wx.showToast({
              title: '上传成功',
            })
          },
        })
      }
    })  
  },

  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindStartTimeChange(e) {
    this.setData({
      startTime: e.detail.value
    })
  },

  bindEndTimeChange(e) {
    this.setData({
      endTime: e.detail.value
    })
  },

  //发布资源
  pubRes(e){
    const subResInfo = e.detail.value
    console.log(subResInfo)
    //校验信息
    if (subResInfo.resName == "") {
      wx.showModal({
        content: '请填写项目名',
        showCancel: false,
      })
      return
    }
    if (subResInfo.resDate == "请选择") {
      wx.showModal({
        content: '请填写日期',
        showCancel: false,
      })
      return
    }
    if (subResInfo.resStartTime == "开始时间") {
      wx.showModal({
        content: '请填写项目开始时间',
        showCancel: false,
      })
      return
    }
    if (subResInfo.resEndTime == "结束时间") {
      wx.showModal({
        content: '请填写项目结束时间',
        showCancel: false,
      })
      return
    }
    if (subResInfo.totalCount == "") {
      wx.showModal({
        content: '请填写资源总数',
        showCancel: false,
      })
      return
    }
    if (subResInfo.address == "") {
      wx.showModal({
        content: '请填写项目地点',
        showCancel: false,
      })
      return
    }
    //填充resInfo
    const resInfo = {}
    resInfo.resourceName = subResInfo.resName
    resInfo.address = subResInfo.address
    resInfo.totalCount = subResInfo.totalCount
    resInfo.canCount = subResInfo.totalCount
    resInfo.imgUrl = "http://test"
    resInfo.timeRange = subResInfo.resDate + " " + subResInfo.resStartTime + " - " + subResInfo.resDate + " " + subResInfo.resEndTime
    resInfo.remark = subResInfo.remark
    resInfo.fileID = this.data.fileID
    resInfo.imgUrl = this.data.imgPath
    resInfo.prePerson = null
    wx.showModal({
      title: '',
      content: '发布成功',
      showCancel: false,
      confirmColor: '#3f51b5',
      success: function (res) {
        if (res.confirm) {
          //资源入库，包含发布者信息
          console.log('用户点击确定')
          wx.getUserInfo({
            success: res => {
              const pubPerson = {}
              pubPerson.id = app.globalData.openid
              pubPerson.openid = app.globalData.openid
              pubPerson.name = res.userInfo.nickName
              resInfo.pubPerson = pubPerson
              wx.cloud.callFunction({
                name: 'db_addRes',
                data: resInfo,
                success:res=>{
                  const resId = res.result._id
                  console.log(res,123)
                  //更新用户信息 发布资源+1
                  wx.cloud.callFunction({
                    name: 'db_getUserInfoById',
                    data: {
                      _id: app.globalData.openid
                    },
                    success: res => {
                      var data = res.result.data
                      var pubRes = data.pubResource
                      if (pubRes == undefined) {
                        pubRes = []
                      }
                      pubRes.push(resId)
                      wx.cloud.callFunction({
                        name: 'db_updateUserInfo',
                        data: {
                          _id: app.globalData.openid,
                          _userInfo: {
                            pubResource: Array.from(new Set(pubRes))
                          },
                        },
                      })
                    }
                  })
                  wx.switchTab({
                    url: '/pages/res-list/res-list',
                    success: function () {
                      getCurrentPages().pop().onLoad()
                      wx.showTabBar({})
                    }
                  })
                }
              })
            }
          })
          
        } else {
          console.log('用户点击取消')
        }
      }
    })
  },

  cancel(e) {
    wx.showModal({
      title: '',
      content: '取消发布项目',
      showCancel: false,
      confirmColor: '#3f51b5',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.switchTab({
            url: '/pages/res-list/res-list',
            success: function() {
              wx.showTabBar({})
            }
          })
        } else {
          console.log('用户点击取消')
        }
      }
    })
  }
})