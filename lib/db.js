var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'js'
});
 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
});

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) { // Свой запрос 
    if (error) throw error;
        console.log('The solution is: ', results[0].solution);
    });
   
connection.end();