'use strict';
const express = require("express");
const exphbs = require('express-handlebars');
// const hbs1 = require("hbs");
const mysql = require('mysql');
const bodyParser = require("body-parser");
//const search = require("./search");
const urlencodedParser = bodyParser.urlencoded({extended: false});

const PORT = process.env.PORT || 3000

let app = express();

const hbs = exphbs.create({
    defaultLayout: 'index',
    extname: 'hbs'
  })

// let search1 = new search();

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
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'js'
});

app.get('/', function (req, res) {
    res.render('form');
});

function validate(data){
    if (data != 'error'){
        return true;
    } else{
        return false;
    }
}

app.post('/result', urlencodedParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);

    let entry = req.body.pageName;
    // search1.validate(entry);

    if (validate(entry)) {
        connection.query('SELECT * FROM profiles WHERE pageName="'+entry+'"', function (error, data) {
            if (error) throw error;

            if (data.length != 0) {
                res.render("success", {
                    pages: data
                });
            } else {
                res.render("no-results");
            }

        });
    } else {
        res.render("error");
    }


});

app.listen(PORT, () => {
    console.log('Сервер запущен...')
})
