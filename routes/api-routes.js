const {User} = require('../config/database')
const passport = require('../config/passport')

module.exports = function(app) {
    // Checks login credentials to see if they match the records.
    app.post('/login_user', async ({body}, res) => {
        const loginName = body.username.toLowerCase()
        const password = body.password

        if (loginName.length == 0) {
            return res.json({passed: false, issue: 'username', error:'Please provide a username or email.'})
        }
        if (password.length == 0) {
            return res.json({passed: false, issue: 'password', error:'Please provide a password.'})
        }

        const user = await User.findOne().or([{loginName}, {email: loginName}])
        if (user == null) {
            return res.json({passed: false, issue: 'username', error:'That username or email did not match our records.'})
        }
        const passwordIsCorrect = user.verifyPassword(password)
        if (!passwordIsCorrect) {
            return res.json({passed: false, issue: 'password', error:'That password did not match our records.'})
        }
        
        console.log('Passed');
        res.json({passed: true})
    })

    app.post('/login', passport.authenticate('local'), (req, res) => {
    // app.post('/login', (req, res) => {
        console.log('Logging In');
        // const loggedIn = user.login(password)
    })

    app.post('/signup_user', async ({body}, res) => {
        const {firstName, lastName, username, email, password, confirm} = body
        
        // Validate values
        if (firstName.length == 0) {
            return res.json({passed: false, issue: 'first-name', error:'Please provide your first name.'})
        }
        if (lastName.length == 0) {
            return res.json({passed: false, issue: 'last-name', error:'Please provide your last name.'})
        }

        if (username.length == 0) {
            return res.json({passed: false, issue: 'username', error:'Please provide a username.'})
        }
        if (username.length < 5) {
            return res.json({passed: false, issue: 'username', error:'That username is too short.'})
        }
        if (username.length > 16) {
            return res.json({passed: false, issue: 'username', error:'That username is too long.'})
        }
        if (/[^a-zA-Z0-9_]/.test(username)) {
            return res.json({passed: false, issue: 'username', error:'Usernames can only have letters, numbers, and underscore (_).'})
        }
        const usernameExists = await User.findOne({loginName: username.toLowerCase()})
        if (usernameExists) {
            return res.json({passed: false, issue: 'username', error:'That username is already taken.'})
        }

        if (email.length == 0) {
            return res.json({passed: false, issue: 'email', error:'Please provide your email address.'})
        }
        const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        if (!emailRegex.test(email)) {
            return res.json({passed: false, issue: 'email', error:'That is not an email address.'})
        }
        const emailExists = await User.findOne({loginName: email.toLowerCase()})
        if (emailExists) {
            return res.json({passed: false, issue: 'email', error:'That email is already connected to an account.'})
        }

        if (password.length == 0) {
            return res.json({passed: false, issue: 'password', error:'Please provide a password.'})
        }
        if (password.length < 8) {
            return res.json({passed: false, issue: 'password', error:'Your password is too short.'})
        }
        if (!/[a-z]/.test(password)) {
            return res.json({passed: false, issue: 'password', error:'Your password needs at least one lower case letter.'})
        }
        if (!/[A-Z]/.test(password)) {
            return res.json({passed: false, issue: 'password', error:'Your password needs at least one upper case letter.'})
        }
        if (!/[0-9]/.test(password)) {
            return res.json({passed: false, issue: 'password', error:'Your password needs at least one number.'})
        }
        if (!/[@$!%*?&]/.test(password)) {
            return res.json({passed: false, issue: 'password', error:'Your password needs at least one special character.'})
        }
        if (/[^a-zA-Z0-9@$!%*?&]/.test(password)) {
            return res.json({passed: false, issue: 'password', error:'The password has restricted characters. ⭢ "' + password.match(/[^a-zA-Z0-9@$!%*?&]/).join('') + '"'})
        }

        if (confirm.length == 0) {
            return res.json({passed: false, issue: 'confirm', error:'Please confirm your password.'})
        }
        if (confirm != password) {
            return res.json({passed: false, issue: 'confirm', error:'Those passwords didn’t match. Try again.'})
        }

        const user = new User({firstName, lastName, username, email})
        await user.setup(password)
        const created = await user.save()

        res.json({passed: true})
    })
}