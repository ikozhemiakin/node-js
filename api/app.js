var createError = require("http-errors");
const express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const exphbs = require('express-handlebars');
var paginateHelper = require('express-handlebars-paginate');
const mysql = require('mysql');
const bodyParser = require("body-parser");
const { createProxyMiddleware } = require('http-proxy-middleware');


const urlencodedParser = bodyParser.urlencoded({extended: false});

const PORT = process.env.PORT || 9000
const hbs = exphbs.create({
    defaultLayout: 'index',
    extname: 'hbs'
})
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var testAPIRouter = require("./routes/testAPI");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");


hbs.handlebars.registerHelper('paginateHelper', paginateHelper.createPagination);

app.use(bodyParser.urlencoded({extended: true}));

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'js',
    multipleStatements: true,
});
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/testAPI", testAPIRouter);

app.get('/', function (req, res) {
    connection.query('SELECT * FROM categories; ', function (error, data) {
        console.log(data);
        res.send({ categories: data });
    });
});


// app.listen(PORT, () => {
//     console.log('Сервер запущен...')
// })
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

app.listen(PORT, () => console.log("Backend server live on " + PORT));

module.exports = app;
