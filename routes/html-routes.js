const db = require('../config/database')
const passport = require('../config/passport')
const isAuthenticated = require('../config/middleware/isAuthenticated')

module.exports = function(app) {
    app.get('/login', ({user}, res) => {
        if (user) redirect('/')
        res.render('login', {layout: false})
    })

    app.get('/', isAuthenticated, ({user}, res) => {
        res.render('index', {
            pageTitle: 'My Family Tree - Home',
            styleSheets: ['index'],
            scriptSheets: ['index'],
            user
        })
    })
    
    // app.post('/login', passport.authenticate('local', {
    //     successRedirect: '/',
    //     failureRedirect: '/login',
    //     failureFlash: true
    // }))

    // app.get('/test/:table/:id', (req, res) => {
    //     const {id, table} = req.params
    //     db[table].findById(id)
    //         .then(data => res.render(`test-${table.toLowerCase()}`, {
    //             pageTitle: `Post Family Tree - ${data.firstName} ${data.lastName}`,
    //             styleSheets: ['test'],
    //             scriptSheets: ['test'],
    //             user: JSON.parse(JSON.stringify(data))
    //         }))
    // })
}