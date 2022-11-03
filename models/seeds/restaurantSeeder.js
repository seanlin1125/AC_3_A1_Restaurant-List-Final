const bcrypt = require('bcryptjs')

const Restaurant = require('../restaurant')
const User = require('../user')
const restaurantSeed = require('./restaurant.json')
const db = require('../../config/mongoose')

const users = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678'
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678'
  }
]
const restaurants = restaurantSeed.results

db.once('open', () => {
  Promise.all(
    users.map((user, userIndex) => {
      return bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(user.password, salt))
        .then((hash) => {
          return User.create({
            name: user.name,
            email: user.email,
            password: hash
          })
        })
        .then((user) => {
          const usedRestaurant = []
          restaurants.forEach((restaurant, restaurantIndex) => {
            if (restaurantIndex >= userIndex * 3 && restaurantIndex < (userIndex + 1) * 3) {
              restaurant.userId = user._id
              usedRestaurant.push(restaurant)
            }
          })
          return Restaurant.create(usedRestaurant)
        })
    })
  )
    .then(() => {
      console.log('Seeds are imported!')
      process.exit()
    })
    .catch((error) => {
      console.error(error)
      res.render('error')
    })
})