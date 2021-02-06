const express = require('express')
const handlebars = require('express-handlebars');
const path = require('path');
const asset_dir_path = 'assets/'

const PORT = process.env.PORT || 9057;

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/// ROUTES ///
require('../routes/html-routes')(app);

/// HANDLEBARS ///
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.listen(PORT, () => {
    console.log("Server listening on: http://localhost:" + PORT);
})

module.exports = app