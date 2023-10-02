require('dotenv').config()

const mysql = require('mysql2')
const password = process.env.SqlPass

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: password,
    database: 'employee_tracker_db'

})

module.exports = db