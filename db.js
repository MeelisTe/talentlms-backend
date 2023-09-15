const mysql = require("mysql2/promise");

console.log("Creating connection pool...")
const pool = mysql.createPool({
    host: 'localhost',
    user: 'test',
    database: 'skillaby',
    password: 'test',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

module.exports = pool;