const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 修改（发布）资源信息,需带上资源id
//{"_id":"","resInfo":{}}
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  data = event
  id = data["_id"]
  resInfo = data["resInfo"]
  try {
    return await db.collection('resourceInfo').doc(id).update(
      {
        data: resInfo
      }
    ) 
  } catch (e) {
    console.error(e)
  }
}