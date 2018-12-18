const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  id = event._id
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('resourceInfo').doc(id).remove()
  } catch (e) {
    console.error(e)
  }
}