// 載入 mongoose
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/restaurant-list-final', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }) // 設定連線到 mongoDB
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