const inquirer = require('inquirer')
// requiring the connection.js file as the const db
const db = require('./db/connection')

const connectToDb = () => {
    // returns a promise that handles the database connection
    return new Promise ((resolve,reject) =>{
        db.connect((err) => {
            // if there is an error while connecting
            if (err) {
                reject(err)
                // otherwise if connection is successful
            }else{
                console.log('Database connected')
                resolve()
            }
        })
    })
}
// funtion that initializes the employee tracker function
async function init() {
    // tries to await a successful connection to the database and runs the employeeTracker function
    try{
        await connectToDb()
        employeeTracker()
        // if there is an error connecting, employee tracker does not run and an error is logged to the console
    } catch (err) {
        console.error('Connection to database failed', err)
    }
}

init()

const employeeTracker = function () {
    
}

