const transactionService = require('./TransactionService');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const os = require('os');
const fetch = require('node-fetch');
const moment = require('moment');

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// ROUTES FOR OUR API
// =======================================================

//Health Checking
app.get('/health',(req,res)=>{
    res.json("This is the health check");
});

// ADD TRANSACTION
app.post('/transaction', (req, res) => {
    var response = "";
    try {
        var t = moment().unix();
        console.log(`{ "timestamp" : ${t}, "msg": "Adding Expense", "amount" : ${req.body.amount}, "Description": "${req.body.desc}" }`);
        var result = transactionService.addTransaction(req.body.amount, req.body.desc);
        if (result.error) {
            res.status(400).json({ message: 'Failed to add transaction', error: result.error });
            return;
        }
        res.json({ message: 'Added transaction successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
});


// GET ALL TRANSACTIONS
app.get('/transaction',(req,res)=>{
    try{
        var transactionList = [];
       transactionService.getAllTransactions(function (results) {
            //console.log("we are in the call back:");
            for (const row of results) {
                transactionList.push({ "id": row.id, "amount": row.amount, "description": row.description });
            }
            t=moment().unix()
            console.log("{ \"timestamp\" : %d, \"msg\" : \"Getting All Expenses\" }", t);
            console.log("{ \"expenses\" : %j }", transactionList);
            res.statusCode = 200;
            res.json({"result":transactionList});
        });
    }catch (err){
        res.json({message:"could not get all transactions",error: err.message});
    }
});

//DELETE ALL TRANSACTIONS
app.delete('/transaction',(req,res)=>{
    try{
        transactionService.deleteAllTransactions(function(result){
            t=moment().unix()
            console.log("{ \"timestamp\" : %d, \"msg\" : \"Deleted All Expenses\" }", t);
            res.statusCode = 200;
            res.json({message:"delete function execution finished."})
        })
    }catch (err){
        res.json({message: "Deleting all transactions may have failed.", error:err.message});
    }
});

//DELETE ONE TRANSACTION
app.delete('/transaction/id', (req,res)=>{
    try{
        //probably need to do some kind of parameter checking
        transactionService.deleteTransactionById(req.body.id, function(result){
            res.statusCode = 200;
            res.json({message: `transaction with id ${req.body.id} seemingly deleted`});
        })
    } catch (err){
        res.json({message:"error deleting transaction", error: err.message});
    }
});

//GET SINGLE TRANSACTION
app.get('/transaction/id',(req,res)=>{
    //also probably do some kind of parameter checking here
    try{
        transactionService.findTransactionById(req.body.id,function(result){
            res.statusCode = 200;
            var id = result[0].id;
            var amt = result[0].amount;
            var desc= result[0].desc;
            res.json({"id":id,"amount":amt,"desc":desc});
        });

    }catch(err){
        res.json({message:"error retrieving transaction", error: err.message});
    }
});

  app.listen(port, () => {
    t=moment().unix()
    console.log("{ \"timestamp\" : %d, \"msg\" : \"App Started on Port %s\" }", t,  port)
  })
  const mysql = require("mysql2");

  const config = {
    host: process.env.DB_HOST || "mysql-db",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "expense",
    password: process.env.DB_PASSWORD || "ExpenseApp@1",
    database: process.env.DB_NAME || "transactions",
  };

  let connection;

  function connectWithRetry() {
    connection = mysql.createConnection(config);

    connection.connect((err) => {
      if (err) {
        console.error("Database connection failed. Retrying in 5 seconds...");
        setTimeout(connectWithRetry, 5000);
      } else {
        console.log("Connected to MySQL successfully!");
      }
    });
  }

  connectWithRetry();

//