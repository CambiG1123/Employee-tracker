const inquirer = require('inquirer')
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


const employeeTracker = function () {
    inquirer.prompt([{
        type: 'list',
        name: 'prompt',
        message: 'Please make a selection',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Log Out']
    }])
    
    .then((answers)=>{
        if (answers.prompt === 'View All Departments'){
            db.query('SELECT * FROM DEPARTMENT', (err,result) => {
                if (err) throw err
                console.log('Viewing All Departments')
                console.table(result)
                employeeTracker()
            })
        } else if (answers.prompt === 'View All Roles') {
            db.query('SELECT * FROM role', (err,res) => {
                if (err) throw err 
                console.log('Viewing All Roles')
                console.table(res)
                employeeTracker()
            })
        }else if (answers.prompt === 'View All Employees') {
            db.query('SELECT * FROM employees', (err,res) => {
                if (err) throw err
                console.log('Viewing All Employees')
                console.table(res)
                employeeTracker()
            })
        } else if (answers.prompt === 'Add A Department') {
            inquirer.prompt ([{
                type: 'input',
                name: 'department',
                message: 'Department Name?',
                validate: departmentInput => {
                    if (departmentInput) {
                        return true
                    }else {
                        console.log('Please add a Department Name')
                        return false
                    }
                }
            }]).then((answers) => {
                db.query('INSERT INTO department (name) VALUES (?)', [answers.department], (err,res) =>{
                    if(err) throw err
                    console.log(`Added ${answers.department} to the Database`)
                    employeeTracker()
                })
            })
        } else if (answers.prompt === 'Add a Role') {
            db.query('SELECT * FROM department', (err,res) =>{
                if (err) throw err
                inquirer.prompt([
                {
                    type: 'input',
                    name: 'role',
                    validate: roleInput => {
                        if (roleInput) {
                            return true
                        } else {
                            console.log('Please add a Role')
                            return false
                        }
                    }
                },
                    {
                        type: 'input',
                        name: 'salary',
                        message: "What is this role's salary?",
                        validate: salaryInput => {
                            if(Number.isInteger(Number(salaryInput))) {
                                return true
                            } else {
                                console.log('Please use numbers to add a salary')
                                return false 
                                
                            }
                        }
                    },
                    {
                       type: 'input',
                       name: 'department',
                       message: 'Which Deparment does the Role belong to',
                       choices: () => {
                        let array = []
                        for (var i = 0; i < result.length; i++) {
                            array.push(result[i].name)

                        }
                        return array
                       } 
                    }
                 


                ]).then((answers) =>{
                    for(var i = 0; i < result.length; i++) {
                        if(result[i].name === answers.department) {
                            let department = result[i]
                        }
                    }
                    db.query('INSERT INTO role (title. salary, department_id) Valuses (?,?,?)', [answers.role, answers.salary, department.id], (err,res) => {
                        if(err) throw err
                        console.log(`Added ${answers.role} to the Database`)
                        employeeTracker()
                    })
                })
            })
        } else if(answers.prompt ==='Add An Employee')
    })
}


init()