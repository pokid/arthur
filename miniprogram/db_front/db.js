//新增资源
function addRes(resInfo){
  const db = wx.cloud.database()
  try {
    return db.collection('resourceInfo').add(
      {
        data: resInfo
      })
  } catch (e) {
    console.error(e)
  }
}
//新增用户
function addUser(userInfo) {
  const db = wx.cloud.database()
  try {
    return db.collection('userInfo').add(
      {
        data: userInfo
      })
  } catch (e) {
    console.error(e)
  }
}

//根据资源id查找资源信息
function getResInfoById(_id) {
  const db = wx.cloud.database()
  try {
    db.collection('resourceInfo').doc(_id).get({
      success(res) {
        console.log(res.data)
        return res.data
      }
  })
  } catch (e) {
    console.error(e)
  }
}

//查找全部资源
function getResList() {
  const db = wx.cloud.database()
  try {
    db.collection('resourceInfo').get({
      success(res) {
        console.log(res.data)
        return res.data
      }
    })
  } catch (e) {
    console.error(e)
  }
}

//根据用户Id查找用户信息
function getUserInfoById(_id) {
  const db = wx.cloud.database()
  try {
    const res = db.collection('userInfo').doc(_id).get(
      {
      success:res=> {
        console.log(res.data)
        this.setData({
          queryResult: res.data
        })
      }
    }
    )
  } catch (e) {
    console.error(e)
  }
}

//查询当前用户预约的全部资源
//根据当前用户id调用getUserInfoById，再根据预约资源id查询资源信息
function getUserPreResList(_id) {
  const db = wx.cloud.database()
  try {
    console.log(getUserInfoById(_id))
    preResIdList = getUserInfoById(_id).preResource
    preResInfoList = []
    for (i = 0; i < preResIdList.length; i++) {
      _id = preResIdList[i]
      getResInfoById(_id)
      preResInfoList.push(getResInfoById(_id))
    }
    return preResInfoList
  } catch (e) {
    console.error(e)
  }
}

//查询当前用户发布的全部资源
//根据当前用户id调用getUserInfoById，再根据发布资源id查询资源信息
function getUserPubResList(_id) {
  const db = wx.cloud.database()
  try {
    pubResIdList = getUserInfoById(_id)["pubResource"]
    pubResInfoList = []
    for (i = 0; i < pubResIdList.length; i++) {
      _id = pubResIdList[i]
      pubResInfoList.push(getResInfoById(_id))
    }
    return pubResInfoList
  } catch (e) {
    console.error(e)
  }
}

//更新用户信息 传入的数据不需带上用户id，默认当前用户
function updateUserInfo(userData) {
  const db = wx.cloud.database()
  _id = data["_id"]
  userInfo = userData
  try {
    return db.collection('userInfo').doc(_id).update(
      {
        data: userInfo
      }
    )
  } catch (e) {
    console.error(e)
  }
}

//更新资源信息,需带上资源id
//{"_id":"","resInfo":{}}
function updateResInfo(resData) {
  const db = wx.cloud.database()
  _id = resData["_id"]
  resInfo = resData["resInfo"]
  try {
    return db.collection('resInfo').doc(_id).update(
      {
        data: resInfo
      }
    )
  } catch (e) {
    console.error(e)
  }
}

module.exports = {
  addRes: addRes,
  addUser: addUser,
  getResInfoById: getResInfoById,
  getResList: getResList,
  getUserInfoById: getUserInfoById,
  getUserPreResList: getUserPreResList,
  getUserPubResList: getUserPubResList,
  updateUserInfo: updateUserInfo,
  updateResInfo: updateResInfo
}