var express = require('express');
var bodyparse = require('body-parser');
var mysql = require('mysql2');
const { getMaxListeners } = require('process');

//Establishing a connection to the Database
var conn = mysql.createPool({
    host:'104.198.226.245',
    user:'root',
    database: 'classicmodels',
    password:'test1234',
});

// Verifying connection to the database
conn.getConnection( (err, connection) => {
    if (err) throw (err)
    console.log ("DB connected successful: " + connection.threadId)
})

var app = express();

//A test code block to test the connection of the database and get queried
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

//Signup page
app.get('/signup', (req,res) => {
    var userID = req.query.userID;
    // var userID = req.body.userID;
    var firstName = req.query.firstName;
    // var firstName = req.body.firstName;
    var lastName = req.query.lastName;
    // var lastName = req.body.lastName;
    var email = req.query.email;
    // var email = req.body.email;
    var password = req.query.password;
    // var password = req.body.password;

    conn.getConnection( (err, connection) => {

        if (err) throw (err)

        const sqlSearch = "SELECT * FROM user WHERE email = ?"
        const search_query = mysql.format(sqlSearch, [email])

        const sqlInsert = "INSERT INTO user VALUES (?, ?, ?, ?, ?)"
        const insert_query = mysql.format(sqlInsert,[userID, firstName, lastName, email, password])

        connection.query (search_query, async (err, result) => {

            if (err) throw (err)
            console.log("--> Search Results")
            console.log(result.length)

            if (result.length != 0) {
                connection.release()
                console.log("--> User already exists")
                res.sendStatus(409)
            } else {
                connection.query (insert_query, (err,result) => {
                    connection.release()

                    if (err) throw (err)
                    console.log ("--> Created new User")
                    console.log(result.insertId)
                    res.sendStatus(201)
                })
            }
        })

    })
})

app.post("/createUser", async (req,res) => {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;

    conn.getConnection( async (err, connection) => {
     if (err) throw (err)
     const sqlSearch = "SELECT * FROM user WHERE email= ?"
     const search_query = mysql.format(sqlSearch,[email])
     const sqlInsert = "INSERT INTO user VALUES (0,?,?)"
     const insert_query = mysql.format(sqlInsert,[userID, firstName, lastName, email, password])
     // ? will be replaced by values
     // ?? will be replaced by string
     await connection.query (search_query, async (err, result) => {
      if (err) throw (err)
      console.log("------> Search Results")
      console.log(result.length)
      if (result.length != 0) {
       connection.release()
       console.log("------> User already exists")
       res.sendStatus(409) 
      } 
      else {
       await connection.query (insert_query, (err, result)=> {
       connection.release()
       if (err) throw (err)
       console.log ("--------> Created new User")
       console.log(result.insertId)
       res.sendStatus(201)
      })
     }
    }) //end of connection.query()
    }) //end of db.getConnection()
    }) //end of app.post()

    

var http = require('http').Server(app);
var port = 8000;

http.listen(port, function() {
    console.log('Listening');
});