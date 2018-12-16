const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 根據Id查询用戶信息
exports.main = async (event, context) => {
  id = event._id
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('userInfo').doc(id).get()
  } catch (e) {
    console.error(e)
  }
}