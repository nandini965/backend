const dbcreds = require('./DbConfig');
const mysql = require('mysql2');

// Create MySQL connection
const con = mysql.createConnection({
    host: process.env.DB_HOST || dbcreds.DB_HOST,
    user: process.env.DB_USER || dbcreds.DB_USER,
    password: process.env.DB_PWD || dbcreds.DB_PWD,
    database: process.env.DB_DATABASE || dbcreds.DB_DATABASE
});

// Connect to MySQL
con.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err.message);
        return;
    }
    console.log("Connected to MySQL successfully!");
});

// Add a transaction
function addTransaction(amount, desc, callback) {
    if (!amount || isNaN(Number(amount))) {
        console.error("Invalid or empty amount provided.");
        return callback({ error: "Invalid or empty amount provided." });
    }

    const sql = "INSERT INTO transactions (amount, description) VALUES (?, ?)";
    con.query(sql, [amount, desc], (err, result) => {
        if (err) {
            console.error("Error adding transaction:", err.message);
            return callback({ error: err.message });
        }
        console.log("Transaction added successfully.");
        return callback({ success: true, transactionId: result.insertId });
    });
}

// Get all transactions
function getAllTransactions(callback) {
    const sql = "SELECT * FROM transactions";
    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error retrieving transactions:", err.message);
            return callback({ error: err.message });
        }
        return callback(result);
    });
}

// Find a transaction by ID
function findTransactionById(id, callback) {
    const sql = "SELECT * FROM transactions WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) {
            console.error(`Error retrieving transaction with ID ${id}:`, err.message);
            return callback({ error: err.message });
        }
        return callback(result);
    });
}

// Delete all transactions
function deleteAllTransactions(callback) {
    const sql = "DELETE FROM transactions";
    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error deleting all transactions:", err.message);
            return callback({ error: err.message });
        }
        return callback({ success: true, affectedRows: result.affectedRows });
    });
}

// Delete a transaction by ID
function deleteTransactionById(id, callback) {
    const sql = "DELETE FROM transactions WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) {
            console.error(`Error deleting transaction with ID ${id}:`, err.message);
            return callback({ error: err.message });
        }
        return callback({ success: true, affectedRows: result.affectedRows });
    });
}

module.exports = {
    addTransaction,
    getAllTransactions,
    findTransactionById,
    deleteAllTransactions,
    deleteTransactionById
};
/
