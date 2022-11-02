// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

// render new page
router.get('/new', (req, res) => {
  return res.render('new')
})
// Create data
router.post('/', (req, res) => {
  const userId = req.user._id
  req.body.userId = userId
  return Restaurant.create(req.body)     // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => {
      console.log(error)
      res.render('error')
    }) // 錯誤處理
})
// 瀏覽特定資料 show page
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(error => {
      console.log(error)
      res.render('error')
    }) // 錯誤處理
})

// edit page
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => {
      console.log(error)
      res.render('error')
    }) // 錯誤處理
})
// 修改資料
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOneAndUpdate({ _id, userId }, req.body)
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => {
      console.log(error)
      res.render('error')
    }) // 錯誤處理
})
// 刪除資料
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .then((restaurant) => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
      res.render('error')
    }) // 錯誤處理
})
module.exports = router