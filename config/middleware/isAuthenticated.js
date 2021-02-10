module.exports = ({user}, res, next) => {
    console.log('isAuthenticated', {user});
    user != null ? next() : res.redirect('/login')
}