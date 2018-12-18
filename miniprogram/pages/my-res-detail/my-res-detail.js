Page({
  data: {
    resId: 0,
    resInfo:'',
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
    this.setData({
      resId: _resInfo._id,
      resInfo: _resInfo,
      date: _resInfo.date,
      startTime: _resInfo.resStartTime ,
      endTime: _resInfo.resEndTime
    })
  },

  bindImageChange(e) {
    this.setData({})
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

    // resInfo.timeRange = subResInfo.resDate + " " + subResInfo.resStartTime + " - " + subResInfo.resDate + " " + subResInfo.resEndTime

    const moreUserInfo = option.detail.value
    wx.showModal({
      title: '',
      content: '信息修改成功',
      showCancel: false,
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
    wx.showModal({
      title: '',
      content: '项目已取消',
      showCancel: false,
      success: function(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'db_getResInfoById',
            data: {
              _id: resId
            },
            success: res => {
              console.log(res)
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
              console.log("del")
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