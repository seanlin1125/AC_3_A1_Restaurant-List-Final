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
// require express-handlebars here
const exphbs = require('express-handlebars')
const restaurantList = require('//restaurant.json')
// setting template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')
// setting static files
app.use(express.static('public'))
// routes setting
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
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