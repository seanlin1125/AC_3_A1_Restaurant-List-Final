// require packages used in the project
const express = require('express')
const session = require('express-session')
// require express-handlebars here
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const routes = require('./routes')
require('./config/mongoose')

const app = express()
const port = 3000

// setting template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
// setting static files
app.use(express.static('public'))
// bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(routes)
// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})