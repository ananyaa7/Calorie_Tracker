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
            res.json(results); //Displays results to the webpage
        }
    });
});

//Signup page 
//install bcrypt -> npm i bcrypt
app.post('/signup', async (req,res) => {
    var userID = req.body.userID;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    const email = req.body.email;
    const password = await bcrypt.hash(req.body.password,10);

    conn.getConnection( async (err, connection) => {
        
        if (err) throw (err)
        const sqlSearch = "SELECT * FROM user WHERE email = ?"
        const search_query = mysql.format(sqlSearch, [email])

        //Inserting into the database
        // var lastUserId = "SELECT MAX(userID) FROM user WHERE "
        var sqlInsert = "INSERT INTO user VALUES (?, ?, ?, ?, ?)"
        var insert_query = mysql.format(sqlInsert,[userID, firstName, lastName, email, password])

        await connection.query (search_query, async (err, result) => {
            if (err) throw (err)
            console.log("--> Search Results")
            console.log(result.length)

            if (result.length != 0) {
                connection.release()
                console.log("--> User already exists")
                res.sendStatus(409)
            } else {
                await connection.query (insert_query, (err,result) => {
                    connection.release()

                    if (err) throw (err)
                    console.log ("--> Created new User")
                    console.log(result.insertId)
                    res.sendStatus(201)
                })
            }
        }) // end of connection.query()
    }) // end of db.getConnection()
}) // end of app.post()

//LOGIN (AUTHENTICATE USER)
app.post("/login", (req, res)=> {
    const email = req.body.email
    const password = req.body.password
    db.getConnection ( async (err, connection)=> {
     if (err) throw (err)
     const sqlSearch = "Select * from email where email = ?"
     const search_query = mysql.format(sqlSearch,[email])
     await connection.query (search_query, async (err, result) => {
      connection.release()
      
      if (err) throw (err)
      if (result.length == 0) {
       console.log("--------> User does not exist")
       res.sendStatus(404)
      } 
      else {
         const hashedPassword = result[0].password
         //get the hashedPassword from result
        if (await bcrypt.compare(password, hashedPassword)) {
        console.log("---------> Login Successful")
        res.send(`${email} is logged in!`)
        } 
        else {
        console.log("---------> Password Incorrect")
        res.send("Password incorrect!")
        } //end of bcrypt.compare()
      }//end of User exists i.e. results.length==0
     }) //end of connection.query()
    }) //end of db.connection()
    }) //end of app.post()

//Submit Stats button for health_record
app.post("/submit", (req, res) => {
    var healthID = req.body.healthID;
    var healthUserID = req.body.healthUserID;
    var weight = req.body.weight;
    var height = req.body.height;
    var gender = req.body.gender;
    var BMI = req.body.BMI;
    var BMR = req.body.BMR;
    var CaloriesNeeded = req.body.CaloriesNeeded;
    var curr_date = req.body.curr_date;

    //Query to insert information to the health_record table
    var sqlInsert2 = "INSERT INTO health_record VALUES (?,?,?,?,?,?,?,?,?)"
    var insert_health_query = mysql.format(sqlInsert2, [healthID,healthUserID,gender,weight,height,BMI,BMR,CaloriesNeeded,curr_date])
    conn.getConnection((err, connection) => {

        connection.query(insert_health_query, (err,result) => {
            connection.release()

            //error checking to check for a successful insertion
            if(err) throw (err)
            console.log("--> Created new Health Record")
            console.log(result.insertId)
            res.sendStatus(201)
        })
    })
})

var http = require('http').Server(app);
var port = 8000;

http.listen(port, function() {
    console.log('Listening');
});