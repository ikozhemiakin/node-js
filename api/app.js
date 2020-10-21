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


app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
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
    connection.query('SELECT * FROM categories', function (error, data) {
        res.render('home', {categories: data});
    });
});

app.get('/category', function (req, res) {
    let page = req.query.page;
    let categoryId = req.query.id;
    if (!page) page = 1
    let entry = req.query.pageName;
    let numPerPage = 5;
    let skip = (page - 1) * numPerPage;
    let limit = skip + ',' + numPerPage;
    let queryParams = {
        'id': categoryId
    }
    // console.log('SELECT * FROM products LIMIT ' + limit + ');
    connection.query('SELECT * FROM products where category_id=' + categoryId + ' LIMIT ' + limit + '; SELECT * FROM categories where id=' + categoryId + '; SELECT COUNT(1) FROM products where category_id=' + categoryId, function (error, data) {
        let totalRows = data[2][0]['COUNT(1)'];
        console.log(totalRows);
        res.render('category', {
            products: data[0],
            categories: data[1],
            pagination: {page: page, limit: numPerPage, totalRows: totalRows, queryParams: queryParams}
        });

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
                res.render('url-html', {
                    urls: data[0],
                    pagination: {page: page, limit: numPerPage, totalRows: totalRows, queryParams: queryParams}
                });
            });
        } else {
            res.render('result', {
                pages: data[0],
                pagination: {page: page, limit: numPerPage, totalRows: totalRows, queryParams: queryParams}
            });
        }
    });
});

app.listen(PORT, () => {
    console.log('Сервер запущен...')
})
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


module.exports = app;
