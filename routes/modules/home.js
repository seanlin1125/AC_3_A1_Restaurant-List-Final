// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')
// 定義首頁路由
router.get('/', (req, res) => {
  Restaurant.find() // 取出 Restaurant model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .sort({ name: 'asc' })
    .then(restaurants => res.render('index', { restaurants })) // 將資料傳給 index 樣板
    .catch(error => {
      console.log(error)
      res.render('error', { error: error.message })
    }) // 錯誤處理
})
// search
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  return Restaurant.find()
    .lean()
    .then((restaurant) => {
      const restaurantsSearch = restaurant.filter((data) => {
        return data.name.toLowerCase().includes(keyword) || data.category.includes(keyword)
      })
      res.render('index', { restaurants: restaurantsSearch, keyword: keyword })
    })
    .catch(error => {
      console.log(error)
      res.render('error')
    }) // 錯誤處理
})
// 匯出路由模組
module.exports = router