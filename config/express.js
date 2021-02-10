if (process.env.NODE_ENV !== 'production') 
    require('dotenv').config()
const express = require('express')
const session = require('express-session')
const handlebars = require('express-handlebars')
const passport = require('./passport')

const PORT = process.env.PORT || 9057

const app = express()

/// EXPRESS ///
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

/// HANDLEBARS ///
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

/// PASSPORT ///
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

/// ROUTES ///
require('../routes/html-routes')(app)
require('../routes/api-routes')(app)

app.listen(PORT, () => {
    console.log('Server listening on: http://localhost:' + PORT)
})

module.exports = app