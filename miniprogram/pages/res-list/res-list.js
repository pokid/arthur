const app = getApp()
var util = require('../../utils/utils.js');
Page({
  data: {
    resList: '',
  },
  onShow: function(){
    console.log(12123)
    getCurrentPages()[getCurrentPages().length - 1].onLoad()
  },

  onLoad: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.cloud.callFunction({
            name: 'db_getResList',
            success: res => {
              
              // this.setData({
              //   resList: res.result.data
              // })
              const _resList = res.result.data
              //imgUrl根据fileID生成，每次生成的imgUrl维持两个小时
              for (var i = 0; i < _resList.length;i++){
                const _i = i
                const resId = _resList[i]._id

                var time = util.formatTime(new Date())
                //为页面中time赋值
                //this.setData({
                //  isOverdue: time > _resList[i].timeRange.split("- ")[1]
                //})
                wx.cloud.callFunction({
                  name: 'db_updateResInfo',
                  data: {
                    _id: resId,
                    resInfo: {
                      isOverdue: time > _resList[i].timeRange.split("- ")[1]
                    }
                  },
                })  
                //打印

                if (_resList[i].fileID==undefined){
                  //给一个默认的imgUrl
                  wx.cloud.callFunction({
                    name: 'db_updateResInfo',
                    data: {
                      _id: resId,
                      resInfo: {
                        imgUrl: "/images/placeholder-list.png"
                      }
                    },
                  }) 
                  continue
                }
                
                wx.cloud.getTempFileURL({
                  fileList: [_resList[i].fileID],
                  success: res => {
                    const tempImgUrl =res.fileList[0].tempFileURL
                    _resList[_i].imgUrl = tempImgUrl
                    //imgUrl入库
                    wx.cloud.callFunction({
                      name: 'db_updateResInfo',
                      data: {
                        _id: resId,
                        resInfo: {
                          imgUrl: tempImgUrl
                        }
                      },
                    })  
                  }
                })
              }
            }
          })
          wx.cloud.callFunction({
            name: 'db_getResList',
            success: res => {
              this.setData({
                resList: res.result.data
              })
              console.log(this.data.resList[4].isOverdue == false)
              console.log(this.data.resList[4].canCount > 0)
              console.log(this.data.resList[4].isOverdue == false && this.data.resList[4].canCount > 0,111)
            }
          })
        }
      }
    })
  },

  getResDetail: function (event) {
    const resInfo = JSON.stringify(event.currentTarget.dataset.resinfo)
    wx.navigateTo({
      url: '/pages/res-detail/res-detail?resInfo=' + resInfo
    })
  }

  
})