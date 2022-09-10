const Restaurant = require('../restaurant') // 載入 restaurant model
const restaurantList = require('./restaurant.json')
const db = require('../../config/mongoose')

db.once('open', () => {
  Restaurant.create(restaurantList.results)
    .then(console.log('seeds imported!'))
    .catch(error => {
      console.log(error)
      res.render('error', { error: error.message })
    }) // 錯誤處理
    .finally(() => db.close())
})