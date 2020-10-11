const express = require("express");
const exphbs = require('express-handlebars');
var paginateHelper = require('express-handlebars-paginate');
const mysql = require('mysql');
const bodyParser = require("body-parser");
// const path = require('path');

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


let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'js'
});
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.render('form');
});

app.get('/result', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var page = req.query.page;
    var entry = req.query.pageName;
    var numPerPage = 10;
    var skip = (page - 1) * numPerPage;
    var limit = skip + ',' + numPerPage;
    if (entry != 'endefiend') {
        console.log('SELECT * FROM profiles WHERE pageName="' + entry + '" LIMIT ' + limit);
        connection.query('SELECT * FROM profiles WHERE pageName="' + entry + '" LIMIT ' + limit, function (error, data) {
            if (error) throw error;
            if ((data.length == 0) && (entry != "url: html")) {
                res.render("no-results");
            } else if (entry == "url: html") {
                // res.render('url-html', {urls: data, pagination: { page: 1, limit:10,totalRows: 11, queryParams: data }});
                // res.render("url-html", {
                //     urls: data
                // });
            } else {
                res.render('result', {pages: data, pagination: {page: 2, limit: 10, totalRows: 11}});

            }
        });
    }
});

app.listen(PORT, () => {
    console.log('Сервер запущен...')
})
