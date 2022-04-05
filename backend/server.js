var express = require('express');
var bodyparse = require('body-parser');
var mysql = require('mysql2');
const { getMaxListeners } = require('process');

const logger = require('morgan');

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

app.use(bodyparse.json())
app.use(logger("dev"));

var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
};
app.use(allowCrossDomain);

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

/* GLOBAL VARIABLES */

var global_userID;
var global_healthID;

/* SIGN UP PAGE */

app.post('/signup', (req,res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    conn.getConnection( (err, connection) => {
        
        if (err) throw (err)
        const sqlSearch = "SELECT * FROM user WHERE email = ?"
        const search_query = mysql.format(sqlSearch, [email])
        
        //Inserting into the database
        var sqlInsert = "INSERT INTO user VALUES (0,?, ?, ?, ?)"
        var insert_query = mysql.format(sqlInsert,[firstName, lastName, email, password])

        connection.query (search_query, (err, result) => {
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
                    global_userID = result.insertId;
                    res.sendStatus(201)
                })
            }
        }) // end of connection.query()
    }) // end of db.getConnection()
}) // end of app.post()

/* LOGIN PAGE */

app.post("/login", (req, res)=> {
    const email = req.body.email
    const password = req.body.password
    conn.getConnection ( (err, connection)=> {
     if (err) throw (err)
     const sqlSearch = "Select * from user where email LIKE ?"
     const search_query = mysql.format(sqlSearch,[email])
     console.log(search_query)
     connection.query (search_query, (err, result) => {
      connection.release()
      
      if (err) throw (err)
      if (result.length == 0) {
       console.log("--------> User does not exist")
       res.sendStatus(404)
      } 
      else {
         const hashedPassword = result[0].pass
         console.log(result)
        //  console.log(result[0].pass)
        //  console.log(result[0].userID)
        if (password === hashedPassword) {
            console.log("---------> Login Successful")
            global_userID = result[0].userID
            res.send(`${email} is logged in!`)
        }
        else {
        console.log("---------> Password Incorrect")
        res.send("Password incorrect!")
        // res.status(200).render()
        } //end of bcrypt.compare()
      }//end of User exists i.e. results.length==0
     }) //end of connection.query()
    }) //end of db.connection()
    }) //end of app.post()

/* LANDING PAGE */

app.post("/submitstats", (req, res) => {
    var healthUserID = global_userID;
    var weight = req.body.weight;
    var height = req.body.height;
    var gender = req.body.gender;
    var BMI = req.body.BMI;
    var BMR = req.body.BMR;
    var CaloriesNeeded = req.body.CaloriesNeeded;
    var curr_date = req.body.curr_date;

    //Query to insert information to the health_record table
    var sqlInsert2 = "INSERT INTO health_record VALUES (NULL, ?,?,?,?,?,?,?,?)"
    var insert_health_query = mysql.format(sqlInsert2, [healthUserID, gender, weight, height, BMI, BMR, CaloriesNeeded, curr_date])
    console.log(insert_health_query)

    conn.getConnection((err, connection) => {
        if(err) throw (err)
        connection.query(insert_health_query, (err,result) => {
            connection.release()
            // console.log(result)
            //error checking to check for a successful insertion
            if(err) throw (err)
            console.log("--> Created new Health Record")
            console.log(result.insertId)
            global_healthID = result.insertId
            res.sendStatus(201)
        })
    })
})

// TO DO: Display food based on search bar

app.get('/search', (req,res) => {
    var foodName = '%' + req.query.foodName + '%';
    conn.getConnection( (err, connection) => {

        if (err) throw (err)

        const sqlSearch = "SELECT f1.foodName, f1.carbsCalories, f1.proteinCalories, f1.fiberCalories FROM Food f1 WHERE f1.foodName LIKE ?"
        const search_query2 = mysql.format(sqlSearch, [foodName])

        connection.query (search_query2, (err, result) => {

            if (err) throw (err)
            console.log("--> Search Results");
            console.log(result)
            res.json(result)
		})
    })
})

//Forgot Password Api
app.post('/forgotpassword', () => {

})

app.post("/submitorder", (req, res) => {
    var orderHealthID = global_healthID;
    var totalOrderCalories = req.body.totalOrderCalories;
    var userID = global_userID;

    var query = "INSERT INTO order_record VALUES (NULL, ?, ?, ?)"
    var sql_query = mysql.format(query, [orderHealthID, totalOrderCalories, userID])
    console.log(sql_query)

    conn.getConnection((err, connection) => {
        if(err) throw (err)
        connection.query(sql_query, (err,result) => {
            connection.release()
            console.log(result)
            //error checking to check for a successful insertion
            if(err) throw (err)
            console.log("--> Created new order record")
            console.log(result.insertId)
            res.sendStatus(201)
        })
    })
})

app.get("/gethistory", (req, res) => {
    var healthUserID = global_userID;

    var query = 'SELECT MAX(BMI) as maxBMI, MIN(BMI) as minBMI, AVG(BMI) as avgBMI FROM health_record JOIN user ON (healthUserID = userID) GROUP BY healthUserID HAVING healthUserID = ?';
    var sql_query = mysql.format(query, [healthUserID])
    console.log(sql_query)
    conn.query(sql_query, function(error,results) {
        console.log("--> History result")
        if (error) {res.send(error);}
        else {
            // res.json(results[0].maxBMI);
            // res.json(results[0].minBMI);
            // res.json(results[0].avgBMI);

            // console.log(results[0].maxBMI)
            // console.log(results[0].minBMI)
            // console.log(results[0].avgBMI)
            if (results[0] != null) {
                res.send({
                    maxBMI: results[0].maxBMI,
                    minBMI: results[0].minBMI,
                    avgBMI: results[0].avgBMI
                });
            } else {
                res.send({
                    maxBMI: 0,
                    minBMI: 0,
                    avgBMI: 0
                });
            }
            
        }
    });
});

app.post('/clearhistory', (req,res) => {
    var userID = global_userID;
    
    conn.getConnection( (err, connection) => {

        if (err) throw (err)
        var order_query = "DELETE FROM order_record WHERE userID = ?"
        var order_sql = mysql.format(order_query, [userID])
        console.log(order_sql)

        var health_query = "DELETE FROM health_record WHERE healthUserID = ?"
        var health_sql = mysql.format(health_query, [userID])
        console.log(health_sql)
        
        connection.query (order_sql, (err,result) => {
            if (err) throw (err)
            console.log("--> Deleted order record(s): ", result.affectedRows)
            connection.query (health_sql, (err,result) => {
                connection.release()
                if (err) throw (err)
                console.log("--> Deleted health record(s): ", result.affectedRows)
                res.send(201)
            })
        })
    })
})

/* FILTERS */

app.get('/highcarbohydrate', (req,res) => {
    var foodName = req.query.foodName;
    conn.getConnection( (err, connection) => {

        if (err) throw (err)

        const sqlSearch = "SELECT f1.foodName, f1.carbsCalories, f1.proteinCalories, f1.fiberCalories FROM Food f1 WHERE f1.carbsCalories > (SELECT AVG(f2.carbsCalories) From Food f2) LIMIT 300;"
        const search_query2 = mysql.format(sqlSearch, [foodName])

        connection.query (search_query2, (err, result) => {
            console.log(err,result);
            if (err) {res.send(err);}
            else {
                res.json(result); //Displays results to the webpage
            } 
		})
    })
})

app.get('/highprotein', (req,res) => {
    var foodName = req.query.foodName;
    conn.getConnection( (err, connection) => {

        if (err) throw (err)

        const sqlSearch = "SELECT f1.foodName, f1.carbsCalories, f1.proteinCalories, f1.fiberCalories FROM Food f1 WHERE f1.proteinCalories > (SELECT AVG(f2.proteinCalories) From Food f2) LIMIT 300;"
        const search_query2 = mysql.format(sqlSearch, [foodName])

        connection.query (search_query2, (err, result) => {
            console.log(err,result);
            if (err) {res.send(err);}
            else {
                res.json(result); //Displays results to the webpage
            } 
		})
    })
})

app.get('/highfiber', (req,res) => {
    var foodName = req.query.foodName;
    conn.getConnection( (err, connection) => {

        if (err) throw (err)

        const sqlSearch = "SELECT f1.foodName, f1.carbsCalories, f1.proteinCalories, f1.fiberCalories FROM Food f1 WHERE f1.fiberCalories > (SELECT AVG(f2.fiberCalories) From Food f2) LIMIT 300;"
        const search_query2 = mysql.format(sqlSearch, [foodName])

        connection.query (search_query2, (err, result) => {
            console.log(err,result);
            if (err) {res.send(err);}
            else {
                res.json(result); //Displays results to the webpage
            } 
		})
    })
})

//High Calories (> 300 kCal) STILL NOT WORKING
app.get('/highcalories', (req,res) => {
    var foodName = req.query.foodName;
    conn.getConnection( (err, connection) => {

        if (err) throw (err)

        const sqlSearch = "SELECT f1.foodName, SUM(f1.carbsCalories, f1.proteinCalories, f1.fiberCalories) as sum FROM Food f1 WHERE sum > 300;"
        const search_query2 = mysql.format(sqlSearch, [foodName])

        connection.query (search_query2, (err, result) => {
            console.log(err,result);
            if (err) {res.send(err);}
            else {
                res.json(result); //Displays results to the webpage
            } 
		})
    })
})



var http = require('http').Server(app);
var port = 8000;

http.listen(port, function() {
    console.log('Listening');
});