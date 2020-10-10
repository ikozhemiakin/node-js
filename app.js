'use strict';
const express = require("express");
const exphbs = require('express-handlebars');
const mysql = require('mysql');
const bodyParser = require("body-parser");

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
app.get('/result', urlencodedParser, function (req, res) {
    var page = req.body.page;
    var numPerPage = 10;
    var skip = (page-1) * numPerPage;
    var limit = skip + ',' + numPerPage; // Here we compute the LIMIT parameter for MySQL query
    connection.query('SELECT count(*) as numRows FROM profiles',function (err, rows, fields) {
        if(err) {
            console.log("error: ", err);
        }else{
            var numRows = rows[0].numRows;
            var numPages = Math.ceil(numRows / numPerPage);
            connection.query('SELECT * FROM profiles LIMIT ' + limit,function (err, rows, fields) {
                if(err) {
                    console.log("error: ", err);
                }else{

                    console.log(rows)
                    // result(null, rows,numPages);
                    res.render("result", {
                        pages: rows
                    });
                }
            });
        }
    });
});

app.listen(PORT, () => {
    console.log('Сервер запущен...')
})
