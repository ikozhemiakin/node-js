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
 

let connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'js'
});

app.get('/', function (req, res) {
    res.render('form');
});



app.post('/result', urlencodedParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);

    const id = req.body.id;

    connection.query('SELECT * FROM profiles WHERE id='+id, function (error, data) {
        if (error) throw error;
        res.render("result", {
            users: data
        });
    });
});




app.listen(PORT, () => {
    console.log('Сервер запущен...')
})
