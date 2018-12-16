const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 新增资源
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  resInfo = event
  console.log(resInfo)
  try {
    return await db.collection('resourceInfo').add(
      {
        data: resInfo
      }) 
  } catch (e) {
    console.error(e)
  }
}