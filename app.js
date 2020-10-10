'use strict';
const express = require("express");
const exphbs = require('express-handlebars');
const mysql = require('mysql');
const bodyParser = require("body-parser");
const path = require('path');

const urlencodedParser = bodyParser.urlencoded({extended: false});

const PORT = process.env.PORT || 3000

let app = express();

const hbs = exphbs.create({
    defaultLayout: 'index',
    extname: 'hbs'
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')


let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'js'
});
app.use('/', require('./routes/myRouter'))

app.get('/', function (req, res) {
    res.render('form');
});

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.route('/result').get(function (req, res) {
    console.log("Не работает");
    res.send('GET request to the homepage');
    var page = req.query.page;
    console.log(page);
    var numPerPage = 10;
    var skip = (page - 1) * numPerPage;
    var limit = skip + ',' + numPerPage; // Here we compute the LIMIT parameter for MySQL query
    connection.query('SELECT count(*) as numRows FROM profiles', function (err, rows, fields) {
        if (err) {
            console.log("error: ", err);
        } else {
            var numRows = rows[0].numRows;
            var numPages = Math.ceil(numRows / numPerPage);
            connection.query('SELECT * FROM profiles LIMIT ' + limit, function (err, rows, fields) {
                if (err) {
                    console.log("error: ", err);
                } else {

                    console.log(rows)
                    // result(null, rows,numPages);
                    res.render("result", {
                        firstPage: 1,
                        numPages: numPages,
                        pages: rows
                    });
                }
            });
        }
    });
}).post(function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var entry = req.body.pageName;
    connection.query('SELECT * FROM profiles WHERE pageName="' + entry + '"', function (error, data) {
        if (error) throw error;
        if ((data.length == 0) && (entry != "url: html")) {
            res.render("no-results");
        } else if (entry == "url: html") {
            connection.query('SELECT * FROM profiles', function (error, data) {
                res.render("url-html", {
                    urls: data
                });
            });
        }
    });
});

app.listen(PORT, () => {
    console.log('Сервер запущен...')
})
