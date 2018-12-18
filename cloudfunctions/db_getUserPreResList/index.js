const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 查询當前用戶預約的全部资源
// 根据当前用户id调用db_getUserInfoById，再根据预约资源id查询资源信息
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  id = event._id
  try {
    const res = await cloud.callFunction({
      name: 'db_getUserInfoById',
      data: {
       _id:id
      },
    })
    preResIdList = res["result"]["data"]["preResource"]
    preResInfoList = []
    for (i = 0; i < preResIdList.length; i++) {
      id = preResIdList[i]
      const res = await cloud.callFunction({
        name: 'db_getResInfoById',
        data: {
          _id: id
        },
      })
      preResInfoList.push(res["result"]["data"])
    }
    return preResInfoList
    
    // return await db.collection('resourceInfo').where(

    // ).get()
  } catch (e) {
    console.error(e)
  }
}