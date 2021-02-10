const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const {User} = require('../config/database')

passport.use(new LocalStrategy({ usernameField: 'username' },
    (username, password, done) => {
        const loginName = username.toLowerCase()
        User.findOne().or([{loginName}, {email: loginName}]).then(user => {
            if (user == null) {
                console.log('Failed to find username');
                return done(null, false, {message: 'Incorrect login name'})
            }
            if (!user.verifyPassword(password)) {
                console.log('Password was wrong');
                return done(null, false, {message: 'Incorrect password'})
            }
            return done(null, user)
        })
    }
))

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((obj, done) => done(null, obj))

module.exports = passport