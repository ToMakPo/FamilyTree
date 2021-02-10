const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const {User} = require('../config/database')

passport.use(new LocalStrategy({ usernameField: 'username' },
    (username, password, done) => {
        console.log('passport.use' ,{username, password});
        const loginName = username.toLowerCase()
        User.findOne().or([{loginName}, {email: loginName}]).then(user => {
            console.log('Authentacating User:', {username, password});
            if (user == null) {
                console.log('Failed to find username');
                return done(null, false, {message: 'Incorrect login name'})
            }
            if (!user.verifyPassword(password)) {
                console.log('Password was wrong');
                return done(null, false, {message: 'Incorrect password'})
            }
            console.log('Passed:', {user});
            return done(null, user)
        })
    }
))

module.exports = passport