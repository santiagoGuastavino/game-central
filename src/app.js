require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

// public y views path
const publicPath = path.resolve('./public')
const viewsPath = path.resolve('./src/views')

// set views
app.set('view engine', 'ejs')
app.set('views', viewsPath)

// set PUT & DELETE, session & cookies
const methodOverride = require('method-override')
const session = require('express-session')
const cookies = require('cookie-parser')

// middlewares para:
// public, req.body, PUT & DELETE, session & cookies, cors
app.use(express.static(publicPath))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(session({
  secret: 'session-secret',
  resave: false,
  saveUninitialized: true
}))
app.use(cookies())
app.use(cors())

// middleware global
const userAppMiddleware = require('./middlewares/userAppMiddleware') // p/ etiquetas html y ETC
const urlMiddleware = require('./middlewares/urlMiddleware') // p/ obtener URL

app.use(userAppMiddleware)
app.use(urlMiddleware)

// requiero ruteos
const mainRouter = require('./routes/main')
const productsRouter = require('./routes/products')
const usersRouter = require('./routes/users')

// middlewares de rutas
app.use(
  '/',
  mainRouter
)
app.use(
  '/products',
  productsRouter
)
app.use(
  '/users',
  usersRouter
)

// requiero ruteos para API REST
const apiMainRouter = require('./routes/api/main')
const apiUsersRouter = require('./routes/api/users')
const apiProductsRouter = require('./routes/api/products')

// middlewares de rutas API REST
app.use(
  '/api',
  apiMainRouter
)
app.use(
  '/api/users',
  apiUsersRouter
)
app.use(
  '/api/products',
  apiProductsRouter
)

// middleware error 404 not found handling
app.use((req, res, next) => {
  res.status(404).render('error', {
    status: 404,
    title: 'ERROR',
    errorDetail: 'Page Not Found'
  })
  next()
})

// levanto el server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running @ ${PORT}`))
