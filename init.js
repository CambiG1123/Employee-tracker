const inquirer = require('inquirer');
const db = require('./db/connection');
const { connectToDb } = require('.');

// funtion that initializes the employee tracker function
async function init() {
    // tries to await a successful connection to the database and runs the employeeTracker function
    try {
        await connectToDb();
        employeeTracker();
        // if there is an error connecting, employee tracker does not run and an error is logged to the console
    } catch (err) {
        console.error('Connection to database failed', err);
    }
}
    const employeeTracker = promptFunction();
    function promptFunction() {
        const employeeTracker = function () {
            inquirer.prompt([{
                type: 'list',
                name: 'prompt',
                message: 'Please make a selection',
                choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Log Out']
            }])

                .then((answers) => {
                    if (answers.prompt === 'View All Departments') {
                        db.query('SELECT * FROM DEPARTMENT', (err, result) => {
                            if (err) throw err;
                            console.log('Viewing All Departments');
                            console.table(result);
                            employeeTracker();
                        });
                    } else if (answers.prompt === 'View All Roles') {
                        db.query('SELECT * FROM role', (err, res) => {
                            if (err) throw err;
                            console.log('Viewing All Roles');
                            console.table(res);
                            employeeTracker();
                        });
                    } else if (answers.prompt === 'View All Employees') {
                        db.query('SELECT * FROM employee', (err, res) => {
                            if (err) throw err;
                            console.log('Viewing All Employees');
                            console.table(res);
                            employeeTracker();
                        });
                    } else if (answers.prompt === 'Add A Department') {
                        inquirer.prompt([{
                            type: 'input',
                            name: 'department',
                            message: 'Department Name?',
                            validate: departmentInput => {
                                if (departmentInput) {
                                    return true;
                                } else {
                                    console.log('Please add a Department Name');
                                    return false;
                                }
                            }
                        }]).then((answers) => {
                            db.query('INSERT INTO department (name) VALUES (?)', [answers.department], (err, res) => {
                                if (err) throw err;
                                console.log(`Added ${answers.department} to the Database`);
                                employeeTracker();
                            });
                        });
                    } else if (answers.prompt === 'Add A Role') {
                        // Beginning with the database so that we may acquire the departments for the choice
                        db.query(`SELECT * FROM department`, (err, result) => {
                            if (err) throw err;

                            inquirer.prompt([
                                {
                                    // Adding A Role
                                    type: 'input',
                                    name: 'role',
                                    message: 'What is the name of the role?',
                                    validate: roleInput => {
                                        if (roleInput) {
                                            return true;
                                        } else {
                                            console.log('Please Add A Role!');
                                            return false;
                                        }
                                    }
                                },
                                {
                                    // Adding the Salary
                                    type: 'input',
                                    name: 'salary',
                                    message: 'What is the salary of the role?',
                                    validate: salaryInput => {
                                        if (Number.isInteger(Number(salaryInput))) {
                                            
                                            return true;
                                        } else {
                                            console.log('Please Add A Salary using Numbers');
                                            
                                            return false;
                                        }
                                    }
                                },
                                {
                                    // Department
                                    type: 'list',
                                    name: 'department',
                                    message: 'Which department does the role belong to?',
                                    choices: () => {
                                        var array = [];
                                        for (var i = 0; i < result.length; i++) {
                                            array.push(result[i].name);
                                        }
                                        return array;
                                    }
                                }
                            ]).then((answers) => {
                                // Comparing the result and storing it into the variable
                                for (var i = 0; i < result.length; i++) {
                                    if (result[i].name === answers.department) {
                                        var department = result[i];
                                    }
                                }

                                db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, department.id], (err, result) => {
                                    if (err) throw err;
                                    console.log(`Added ${answers.role} to the database.`);
                                    employeeTracker();
                                });
                            });
                        });
                    } else if (answers.prompt === 'Add An Employee') {

                        db.query(`SELECT * FROM employee, role`, (err, result) => {
                            if (err) throw err;

                            inquirer.prompt([
                                {
                                    type: 'input',
                                    name: 'firstName',
                                    message: 'What is the employees first name?',
                                    validate: firstNameInput => {
                                        if (firstNameInput) {
                                            return true;
                                        } else {
                                            console.log('Please Add A First Name');
                                            return false;
                                        }
                                    }
                                },
                                {
                                    type: 'input',
                                    name: 'lastName',
                                    message: 'What is the employees last name?',
                                    validate: lastNameInput => {
                                        if (lastNameInput) {
                                            return true;
                                        } else {
                                            console.log('Please Add A Last Name');
                                            return false;
                                        }
                                    }
                                },
                                {
                                    type: 'list',
                                    name: 'role',
                                    message: 'What is the employees role?',
                                    choices: () => {
                                        var array = [];
                                        for (var i = 0; i < result.length; i++) {
                                            array.push(result[i].title);
                                        }
                                        var newArray = [...new Set(array)];
                                        return newArray;
                                    }
                                },
                                {
                                    type: 'input',
                                    name: 'manager',
                                    message: 'Who is the employees manager?',
                                    validate: managerInput => {
                                        if (managerInput) {
                                            return true;
                                        } else {
                                            console.log('Please Add A Manager!');
                                            return false;
                                        }
                                    }
                                }
                            ]).then((answers) => {

                                for (var i = 0; i < result.length; i++) {
                                    if (result[i].title === answers.role) {
                                        var role = result[i];
                                    }
                                }

                                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, role.id, answers.manager], (err, result) => {
                                    if (err) throw err;
                                    console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`);
                                    employeeTracker();
                                });
                            });
                        });
                    } else if (answers.prompt === 'Update An Employee Role') {
                        db.query(`SELECT * FROM employee, role`, (err, result) => {
                            if (err) throw err;

                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'employee',
                                    message: 'Which employees role do you want to update?',
                                    choices: () => {
                                        var array = [];
                                        for (var i = 0; i < result.length; i++) {
                                            array.push(result[i].last_name);
                                        }
                                        var employeeArray = [...new Set(array)];
                                        return employeeArray;
                                    }
                                },
                                {
                                    type: 'list',
                                    name: 'role',
                                    message: 'What is their new role?',
                                    choices: () => {
                                        var array = [];
                                        for (var i = 0; i < result.length; i++) {
                                            array.push(result[i].title);
                                        }
                                        var newArray = [...new Set(array)];
                                        return newArray;
                                    }
                                }
                            ]).then((answers) => {

                                for (var i = 0; i < result.length; i++) {
                                    if (result[i].last_name === answers.employee) {
                                        var name = result[i];
                                    }
                                }

                                for (var i = 0; i < result.length; i++) {
                                    if (result[i].title === answers.role) {
                                        var role = result[i];
                                    }
                                }

                                db.query(`UPDATE employee SET ? WHERE ?`, [{ role_id: role }, { last_name: name }], (err, result) => {
                                    if (err) throw err;
                                    console.log(`Updated ${answers.employee} role to the database.`);
                                    employeeTracker();
                                });
                            });
                        });
                    } else if (answers.prompt === 'Log Out') {
                        db.end();
                        console.log("Good-Bye!");
                    }
                });

        };
        init();
        return employeeTracker;
    }

