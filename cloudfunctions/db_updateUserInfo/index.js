const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 修改用戶信息 
////{"_id":"","resInfo":{}}
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  data = event
  id = data["_id"]
  userInfo = data["_userInfo"]
  try {
    return await db.collection('userInfo').doc(id).update(
      {
        data: userInfo
      }
    )
  } catch (e) {
    console.error(e)
  }
}