'use strict';
const express = require("express");
const exphbs = require('express-handlebars');
// const hbs1 = require("hbs");
const mysql = require('mysql');
const bodyParser = require("body-parser");
const search = require("./search");
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
global.search1 = new search();

// hbs1.registerHelper("setNoResults", function () {
//     console.log(result);
//     console.log('No Results');
//     if (result.length == 0) {
//         return '<table width="90%" border="0" align="center"><tr><td valign="top">' +
//             '<font face="arial"><b><dl>' +
//             '<hr noshade width="100%">' +
//             '" returned no results.<hr noshade="" width="100%>' +
//             '</td></tr></table>';
//     }
// });

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'js'
});

app.get('/', function (req, res) {
    res.render('form');
});


app.post('/result', urlencodedParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    var entry = req.body.pageName;
    var reentry = search1.validate(entry);
    connection.query('SELECT * FROM profiles WHERE pageName="' + entry + '"', function (error, data) {
        if (error) throw error;
        if ((data.length != 0) && (entry != "url: html")) {
            res.render("result", {
                pages: data
            });
        } else if ((data.length == 0) && (entry != "url: html")) {
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
