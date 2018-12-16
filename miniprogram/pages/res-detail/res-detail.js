Page({
  data: {
    resID: '',
    resInfo:''
  },

  onLoad: function(option) {
    if (option!=undefined){
      if (option._id !=undefined){
        // const resInfoObj = JSON.parse(option)
        this.setData({
          resID: option._id,
          resInfo: option,
        })
      }
      if (option.resInfo!=undefined){
        const resInfoObj = JSON.parse(option.resInfo)  
        this.setData({
          resID: resInfoObj._id,
          resInfo: resInfoObj,
        })
      }
    }
  },
 

  //預約
  //資源：可預約資源-1  預約用戶+1
  //用戶：預約資源-1
  preOrder: function () {
    const resInfo = this.data.resInfo
    //構造resData
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
      success: function(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'db_updateResInfo',
            data: resData
          })
          //必須先刷新上機頁面在刷新當前頁
          getCurrentPages()[getCurrentPages().length - 2].onLoad()
          getCurrentPages()[getCurrentPages().length - 1].onLoad(resInfo)
          console.log('用户点击确定')
        } else {
          console.log('用户点击取消')
        }
      }
    })
  }
})