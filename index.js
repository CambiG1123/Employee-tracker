// requiring the connection.js file as the const db
const db = require('./db/connection')


function connectToDb() {
    // returns a promise that handles the database connection
    return new Promise((resolve, reject) => {
        db.connect((err) => {
            // if there is an error while connecting
            if (err) {
                reject(err)
                // otherwise if connection is successful
            } else {
                console.log('Database connected')
                resolve()
            }
        })
    })
}
exports.connectToDb = connectToDb
