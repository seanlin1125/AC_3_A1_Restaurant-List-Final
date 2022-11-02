// 載入 mongoose
const mongoose = require('mongoose')
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/restaurant-list'
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB
// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})
module.exports = db