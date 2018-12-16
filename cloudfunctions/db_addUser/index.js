const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 新增用戶
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  userInfo = event
  console.log(userInfo)
  try {
    return await db.collection('userInfo').add(
      {
        data: userInfo
      })
  } catch (e) {
    console.error(e)
  }
}