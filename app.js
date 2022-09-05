// require packages used in the project
const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose') // 載入 mongoose
mongoose.connect(process.env.MONGODB_RESTAURANT_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB
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
const Restaurant = require('./models/restaurant') // 載入 restaurant model
// require express-handlebars here
const exphbs = require('express-handlebars')
// const restaurantList = require('./models/seeds/restaurant.json')
// setting template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')
// setting static files
app.use(express.static('public'))
// routes setting
app.get('/', (req, res) => {
  Restaurant.find() // 取出 Restaurant model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(restaurants => res.render('index', { restaurants })) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})
// show page
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find((restaurant) => restaurant.id.toString() === req.params.restaurant_id)
  res.render('show', { restaurant: restaurant })
})
// search
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  const restaurantsSearch = restaurantList.results.filter((restaurant) => {
    return restaurant.name.toLowerCase().includes(keyword) || restaurant.category.includes(keyword)
  })
  res.render('index', { restaurants: restaurantsSearch, keyword: keyword })
})
// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})