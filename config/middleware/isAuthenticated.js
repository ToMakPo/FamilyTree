module.exports = ({user}, res, next) => {
    user != null ? next() : res.redirect('/login')
}