module.exports = function(app) {
    app.get('/', (req, res) => {
        const user = {
            _id: 'adf24233asdf5646adsf645asdf',
            discription: 'Makai Post',
            first_name: 'Makai',
            last_name: 'Post',
            username: 'MakPo',
            password_hash: 'jh1234ljk23h4kjl23h4j3242hj4g23kjh4g123kjh4g2k3jh4g21',
            email: 'post.makai@gmail.com',
            // family_members: [125, 321, 42, 842, 214, 235],
            created: '2021-01-05T15:25:42.325'
        }

        res.render('index', {
            style_sheets: ['index'],
            script_sheets: ['home'],
            user_profile: user
        })
    })
}