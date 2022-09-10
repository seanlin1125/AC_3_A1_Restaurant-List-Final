// require packages used in the project
const express = require('express')
const app = express()
const port = 3000
// require express-handlebars here
const exphbs = require('express-handlebars')

const methodOverride = require('method-override')
// 載入 mongoose
const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/restaurant-list", { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB
const bodyParser = require('body-parser')
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
// setting template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
// setting static files
app.use(express.static('public'))
// bodyParser
app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride('_method'))
// routes setting
app.get('/', (req, res) => {
  Restaurant.find() // 取出 Restaurant model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .sort({ name: 'asc' })
    .then(restaurants => res.render('index', { restaurants })) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})
// render new page
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})
// Create data
app.post('/restaurants', (req, res) => {
  const name = req.body.name       // 從 req.body 拿出表單裡的 name 資料
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description
  return Restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description })     // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})
// 瀏覽特定資料 show page
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})
// search
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  return Restaurant.find()
    .lean()
    .then((restaurant) => {
      const restaurantsSearch = restaurant.filter((data) => {
        return data.name.toLowerCase().includes(keyword) || data.category.includes(keyword)
      })
      res.render('index', { restaurants: restaurantsSearch, keyword: keyword })
    })
    .catch(error => console.log(error))
})
// edit page
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})
// 修改資料
app.put('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const name = req.body.name       // 從 req.body 拿出表單裡的 name 資料
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = name
      restaurant.name_en = name_en
      restaurant.category = category
      restaurant.image = image
      restaurant.location = location
      restaurant.phone = phone
      restaurant.google_map = google_map
      restaurant.rating = rating
      restaurant.description = description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})
// 刪除資料
app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then((restaurant) => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})