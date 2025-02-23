const transactionService = require('./TransactionService');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');
const mysql = require("mysql2");

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Health Check Route
app.get('/health', (req, res) => {
    res.json({ message: "This is the health check" });
});

// Root Route
app.get('/', (req, res) => {
    res.json({ message: "Backend is running successfully!" });
});

// ✅ ADD TRANSACTION
app.post('/api/transactions', (req, res) => {
    const { amount, description } = req.body;

    if (!amount || isNaN(amount) || !description) {
        return res.status(400).json({ message: "Invalid amount or description" });
    }

    console.log(`Adding transaction: ${amount}, ${description}`);
    transactionService.addTransaction(amount, description, (result) => {
        if (result.error) {
            return res.status(500).json({ message: 'Failed to add transaction', error: result.error });
        }
        res.json({ message: 'Transaction added successfully', transactionId: result.transactionId });
    });
});

// ✅ GET ALL TRANSACTIONS
app.get('/api/transactions', (req, res) => {
    transactionService.getAllTransactions((results) => {
        if (results.error) {
            return res.status(500).json({ message: "Database error", error: results.error });
        }
        res.json({ transactions: results });
    });
});

// ✅ GET SINGLE TRANSACTION
app.get('/api/transactions/:id', (req, res) => {
    const id = req.params.id;
    transactionService.findTransactionById(id, (result) => {
        if (result.error || result.length === 0) {
            return res.status(404).json({ message: "Transaction not found", error: result.error });
        }
        res.json(result[0]);
    });
});

// ✅ DELETE ALL TRANSACTIONS
app.delete('/api/transactions', (req, res) => {
    transactionService.deleteAllTransactions((result) => {
        if (result.error) {
            return res.status(500).json({ message: "Failed to delete transactions", error: result.error });
        }
        res.json({ message: "All transactions deleted", affectedRows: result.affectedRows });
    });
});

// ✅ DELETE A TRANSACTION BY ID
app.delete('/api/transactions/:id', (req, res) => {
    const id = req.params.id;
    transactionService.deleteTransactionById(id, (result) => {
        if (result.error) {
            return res.status(500).json({ message: "Failed to delete transaction", error: result.error });
        }
        res.json({ message: `Transaction with ID ${id} deleted`, affectedRows: result.affectedRows });
    });
});

// ✅ MySQL Connection Handling
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

// Start the Server
app.listen(port, () => {
    console.log(`App Started on Port ${port}`);
});
