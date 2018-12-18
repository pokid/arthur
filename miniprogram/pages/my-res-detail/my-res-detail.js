const app = getApp()
Page({
  data: {
    resId: 0,
    resInfo:'',
    imgPath:'/images/placeholder-detail.png',
    date: "请选择",
    startTime: "开始时间",
    endTime: "结束时间"
  },

  onLoad: function(option) {
    const resInfo = JSON.parse(option.resInfo)
    //构造可填充页面的resInfo
    const _resInfo = {}
    _resInfo._id = resInfo._id
    _resInfo.resName = resInfo.resourceName
    const timeRange = resInfo.timeRange
    _resInfo.date = timeRange.split(" - ")[0].split(" ")[0]
    _resInfo.resStartTime = timeRange.split(" - ")[0].split(" ")[1]
    _resInfo.resEndTime = timeRange.split(" - ")[1].split(" ")[1]
    _resInfo.totalCount = resInfo.totalCount
    _resInfo.address = resInfo.address
    _resInfo.remark = resInfo.remark
    _resInfo.imgUrl = resInfo.imgUrl
    this.setData({
      resId: _resInfo._id,
      resInfo: _resInfo,
      date: _resInfo.date,
      startTime: _resInfo.resStartTime ,
      endTime: _resInfo.resEndTime,
      imgPath: _resInfo.imgUrl,
    })
  },

  bindImageChange(e) {
    const _this = this
    wx.chooseImage({
      count: 1, // 默认9    
      sizeType: ['original','compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        const cloudPath = filePath.split(".")[2]+".png"
        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: filePath,
          success: res => {
            _this.setData({
              imgPath: filePath
            })
            wx.showToast({
              title: '上传成功',
            })
            //fileId入库
            const _fileID = res.fileID
            console.log(_fileID)
            wx.cloud.callFunction({
              name: 'db_updateResInfo',
              data: {
                _id: _this.data.resId,
                resInfo:{
                  fileID: _fileID,
                  imgUrl: filePath
                }
              },
              success:res=>{
                getCurrentPages()[getCurrentPages().length - 2].onLoad()
              }
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

  save: function(option) {
    const submitResInfo = option.detail.value
    const orgResInfo = this.data.resInfo
    const moreUserInfo = option.detail.value

    wx.showModal({
      title: '',
      content: '信息修改成功',
      showCancel: false,
      confirmColor: '#3f51b5',
      success: function(res) {
        if (res.confirm) {
          //只有修改信息才需update
          if (!(submitResInfo.resName == orgResInfo.resName && submitResInfo.address == orgResInfo.address && submitResInfo.date == orgResInfo.date && submitResInfo.resStartTime == orgResInfo.resStartTime && submitResInfo.resEndTime == orgResInfo.resEndTime && submitResInfo.totalCount == orgResInfo.totalCount) && submitResInfo.remark == orgResInfo.remark) {
            const resData = {}
            const resInfo = {}
            resInfo.resName = submitResInfo.resName
            resInfo.address = submitResInfo.address
            resInfo.timeRange = submitResInfo.resDate + " " +submitResInfo.resStartTime + " - " + submitResInfo.resDate + " " + submitResInfo.resEndTime
            resInfo.totalCount = submitResInfo.totalCount
            resInfo.remark = submitResInfo.remark       
            resData._id = orgResInfo._id
            resData.resInfo = resInfo
            wx.cloud.callFunction({
              name: 'db_updateResInfo',
              data: resData,
            })          
          }
          getCurrentPages()[getCurrentPages().length - 2].onLoad()
          console.log('用户点击确定')
          wx.navigateBack({})
        } else {
          console.log('用户点击取消')
        }
      }
    })
  },

  //取消发布
  //用户：当前用户发布资源-1   所有预约该资源的用户资源-1
  //资源：删除该资源
  cancel: function() {
    const resId = this.data.resId
    const userId = app.globalData.openid
    wx.showModal({
      title: '',
      content: '项目已取消',
      showCancel: false,
      confirmColor: '#3f51b5',
      success: function(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'db_getResInfoById',
            data: {
              _id: resId
            },
            success: res => {
              const prePerson = res.result.data.prePerson
              if (prePerson!=undefined){
                //每个预约该资源的用户预约资源数-1
                for (var i = 0; i < prePerson.length; i++) {
                  if (prePerson[i] == null) {
                    continue
                  }
                  const id = prePerson[i].id
                  wx.cloud.callFunction({
                    name: 'db_getUserInfoById',
                    data: {
                      _id: id
                    },
                    success: res => {
                      if (res.result!=undefined){
                        const preResource = res.result.data.preResource
                        const preRes = Array.from(new Set(preResource))
                        for (var j = 0; j < preRes.length; j++) {
                          if (preRes[j] == resId) {
                            preRes.splice(j, 1)
                            break
                          }
                        }
                        wx.cloud.callFunction({
                          name: 'db_updateUserInfo',
                          data: {
                            _id: id,
                            _userInfo: {
                              preResource: preRes
                            },
                          },
                        })
                      }
                    }
                  })
                }
              }
              // 用户发布资源-1
              wx.cloud.callFunction({
                name: 'db_getUserInfoById',
                data: {
                  _id: userId
                },
                success: res => {
                  if (res.result != undefined) {
                    const pubResource = res.result.data.pubResource
                    const pubRes = Array.from(new Set(pubResource))
                    for (var j = 0; j < pubRes.length; j++) {
                      if (pubRes[j] == resId) {
                        pubRes.splice(j, 1)
                        break
                      }
                    }
                    wx.cloud.callFunction({
                      name: 'db_updateUserInfo',
                      data: {
                        _id: userId,
                        _userInfo: {
                          pubResource: pubRes
                        },
                      },
                    })
                  }
                }
              })
              // 删除该资源
              wx.cloud.callFunction({
                name: 'db_delResById',
                data: {
                  _id: resId
                },
              })
            }
          })
          getCurrentPages()[getCurrentPages().length - 2].onLoad()
          console.log('用户点击确定')
          wx.navigateBack({})
        } else {
          console.log('用户点击取消')
        }
      }
    })
  }
})