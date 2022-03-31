var express = require('express');
var bodyparse = require('body-parser');
var mysql = require('mysql2');

var conn = mysql.createConnection({
    host:'104.198.226.245',
    user:'root',
    database: 'classicmodels',
    password:'test1234',
});


var app = express();

app.get('/db', (req, res) => {
    var sqlQry = 'SELECT * FROM user LIMIT 3';
    conn.query(sqlQry, function(error,results) {
        console.log(error,results);
        if (error) {res.send(error);}
        else {
            res.json(results);
        }
    });
});

var http = require('http').Server(app);
var port = 3001;

http.listen(port, function() {
    console.log('Listening');
});