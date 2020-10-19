const express = require("express");
const exphbs = require('express-handlebars');
var paginateHelper = require('express-handlebars-paginate');
const mysql = require('mysql');
const bodyParser = require("body-parser");

const urlencodedParser = bodyParser.urlencoded({extended: false});

const PORT = process.env.PORT || 3000

let app = express();

const hbs = exphbs.create({
    defaultLayout: 'index',
    extname: 'hbs'
})
hbs.handlebars.registerHelper('paginateHelper', paginateHelper.createPagination);

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: true }));

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'js',
    multipleStatements: true,
});

app.get('/', function (req, res) {

    connection.query('SELECT * FROM products where id = 1;SELECT * FROM categories where id = 1', function (error, data) {
        console.log(data);
        res.render('form', {products: data[0], categories: data[1]});
    });

});

app.get('/result', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    let page = req.query.page;
    if (!page) page = 1
    let entry = req.query.pageName;
    let numPerPage = 5;
    let skip = (page - 1) * numPerPage;
    let limit = skip + ',' + numPerPage;
    let queryParams = {
        'pageName': entry
    }
    console.log(entry);
    connection.query('SELECT * FROM profiles WHERE pageName="' + entry + '" LIMIT ' + limit + '; SELECT COUNT(1) FROM profiles', function (error, data) {
        let totalRows = data[1][0]['COUNT(1)'];
        if (error) throw error;
        if ((data[0].length == 0) && (entry != "url: html")) {
            res.render("no-results");
        } else if (entry == "url: html") {
            connection.query('SELECT * FROM profiles LIMIT ' + limit + '; SELECT COUNT(1) FROM profiles', function (error, data) {
                res.render('url-html', {urls:data[0], pagination: {page: page, limit: numPerPage, totalRows: totalRows, queryParams: queryParams}});
            });
        } else {
            res.render('result', {pages:data[0], pagination: {page: page, limit: numPerPage, totalRows: totalRows, queryParams: queryParams}});
        }
    });
});

app.listen(PORT, () => {
    console.log('Сервер запущен...')
})
