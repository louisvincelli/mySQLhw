const { listenerCount } = require('events');
const { prompt } = require('inquirer');
const { exit } = require('process');
const db = require('./db');
require('console.table');

init();

function init() {
    console.log('Employee Manager');
    mainQuestions();
}

async function mainQuestions() {
    const { choice } = await prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                {
                    name: 'View All Employees',
                    value: 'view_employees'
                },
                {
                    name: 'View Employees by Department',
                    value: 'view_employees_by_department'
                },
                {
                    name: 'View employees by manager',
                    value: 'view_employees_by_manager'
                },
                {
                    name: 'Add Employee',
                    value: 'add_employee'
                },
                {
                    name: 'Remove Employee',
                    value: 'remove_employee'
                },
                {
                    name: 'Update Employee Role',
                    value: 'update_employee_role'
                },
                {
                    name: 'Update Employee Manager',
                    value: 'update_employee_manager'
                },
                {
                    name: 'View All Roles',
                    value: 'view_all_roles'
                },
                {
                    name: 'Add a Role',
                    value: 'add_role'
                },
                {
                    name: 'Remove a Role',
                    value: 'remove_role'
                },
                {
                    name: 'View all Departments',
                    value: 'view_all_departments'
                },
                {
                    name: 'Add Department',
                    value: 'add_department'
                },
                {
                    name: 'Remove Department',
                    value: 'remove_department'
                },
                {
                    name: 'Exit',
                    value: 'exit'
                }
            ]
        }
    ]);

    switch (choice) {
        case 'view_employees':
            return viewEmployees();

        case 'view_employees_by_department':
            return employeesByDepartment();

        case 'view_employees_by_manager':
            return employeesByManager();

        case 'add_employee':
            return addEmployee();

        case 'remove_employee':
            return removeEmployee();

        case 'update_employee_role':
            return updateEmployeeRole();

        case 'update_employee_manager':
            return updateEmployeeManager();

        case 'view_all_roles':
            return viewAllRoles();

        case 'add_role':
            return addRole();

        case 'remove_role':
            return removeRole();

        case 'view_all_departments':
            return viewAllDepartments();

        case 'add_department':
            return addDepartment();

        case 'remove_department':
            return removeDepartment();

        case 'exit':
            return exit();
    }
}

async function viewEmployees() {
    const employees = await db.findAllEmployees();
    console.table(employees);
    mainQuestions();
}

async function employeesByDepartment() {
    const departments = await db.findAllDepartments();
    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));
    const { departmentId } = await prompt([
        {
            type: "list",
            name: "departmentId",
            message: "Which department would you like to see employees for?",
            choices: departmentChoices
        }
    ]);
    const employees = await db.findAllEmployeesByDepartment(departmentId);
    console.log("\n");
    console.table(employees);
    mainQuestions();
}

function employeesByManager() {
    db.findAllEmployees()
        .then(([rows]) => {
            let managers = rows;
            const managerChoices = managers.map(({ id, firstname, lastname }) => ({
                name: `${firstname} ${lastname}`,
                value: id
            }));
            prompt([
                {
                    type: "list",
                    name: "managerId",
                    message: "Which employee do you want to see direct reports for?",
                    choices: managerChoices
                }
            ])
            .then(res => db.findAllEmployeesByManager(res.managerId))
            .then(([rows]) => {
                let employees = rows;
                console.log("\n");
                if (employees.length === 0) {
                    console.log("The selected employee has no direct reports");
                } else {
                    console.table(employees);
                }
            })
            .then(() => mainQuestions())
        });
}

function removeEmployee() {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));
            prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Which employee do you want to remove?",
                    choices: employeeChoices
                }
            ])
            .then(res => db.removeEmployee(res.employeeId))
            .then(() => console.log("Removed employee from the database"))
            .then(() => mainQuestions())
        })
}

function updateEmployeeRole() {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));
            prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Which employee's role do you want to update?",
                    choices: employeeChoices
                }
            ])
            .then(res => {
                let employeeId = res.employeeId;
                db.findAllRoles()
                .then(([rows]) => {
                    let roles = rows;
                    const roleChoices = roles.map(({ id, title }) => ({
                        name: title,
                        value: id
                    }));
                    prompt([
                        {
                            type: "list",
                            name: "roleId",
                            message: "Which role do you want to assign the selected employee?",
                            choices: roleChoices
                        }
                    ])
                    .then(res => db.updateEmployeeRole(employeeId, res.roleId))
                    .then(() => console.log("Updated employee's role"))
                    .then(() => mainQuestions())
                });
            });
        })
}

function updateEmployeeManager() {
    db.findAllEmployees()
    .then(([rows]) => {
        let employees = rows;
        const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));
        prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Which employee's manager do you want to update?",
                choices: employeeChoices
            }
        ])
        .then(res => {
            let employeeId = res.employeeId
            db.findAllPossibleManagers(employeeId)
            .then(([rows]) => {
                let managers = rows;
                const managerChoices = managers.map(({ id, firstname, lastname }) => ({
                    name: `${firstname} ${lastname}`,
                    value: id
                }));
                prompt([
                    {
                        type: "list",
                        name: "managerId",
                        message: "Which employee do you want to set as manager for the selected employee?",
                        choices: managerChoices
                    }
                ])
                .then(res => db.updateEmployeeManager(employeeId, res.managerId))
                .then(() => console.log("Updated employee's manager"))
                .then(() => mainQuestions())
            })
        })
    })
}

function viewAllRoles() {
db.findAllRoles()
    .then(([rows]) => {
        let roles = rows;
        console.log("\n");
        console.table(roles);
    })
    .then(() => mainQuestions());
}

function addRole() {
db.findAllDepartments()
    .then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id
        }));
        prompt([
            {
                name: "title",
                message: "What is the name of the role?"
            },
            {
                name: "salary",
                message: "What is the salary of the role?"
            },
            {
                type: "list",
                name: "department_id",
                message: "Which department does the role belong to?",
                choices: departmentChoices
            }
        ])
        .then(role => {
        db.createRole(role)
        .then(() => console.log(`Added ${role.title} to the database`))
        .then(() => mainQuestions())
        })
    })
}

function removeRole() {
db.findAllRoles()
    .then(([rows]) => {
        let roles = rows;
        const roleChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id
        }));
        prompt([
            {
                type: "list",
                name: "roleId",
                message: "Which role do you want to remove? (Warning: This will also remove employees)",
                choices: roleChoices
            }
        ])
        .then(res => db.removeRole(res.roleId))
        .then(() => console.log("Removed role from the database"))
        .then(() => mainQuestions())
    })
}

function viewAllDepartments() {
db.findAllDepartments()
    .then(([rows]) => {
        let departments = rows;
        console.log("\n");
        console.table(departments);
    })
    .then(() => mainQuestions());
}

function addDepartment() {
    prompt([
        {
            name: "name",
            message: "What is the name of the department?"
        }
    ])
    .then(res => {
        let name = res;
        db.createDepartment(name)
        .then(() => console.log(`Added ${name.name} to the database`))
        .then(() => mainQuestions())
    })
}

function removeDepartment() {
db.findAllDepartments()
    .then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id
        }));
        prompt({
            type: "list",
            name: "departmentId",
            message: "Which department would you like to remove? (Warning: This will also remove associated roles and employees)",
            choices: departmentChoices
        })
        .then(res => db.removeDepartment(res.departmentId))
        .then(() => console.log(`Removed department from the database`))
        .then(() => mainQuestions())
    })
}

function addEmployee() {
    prompt([
        {
            name: "first_name",
            message: "What is the employee's first name?"
        },
        {
            name: "last_name",
            message: "What is the employee's last name?"
        }
    ])
    .then(res => {
    let firstName = res.first_name;
    let lastName = res.last_name;
    db.findAllRoles()
        .then(([rows]) => {
            let roles = rows;
            const roleChoices = roles.map(({ id, title }) => ({
                name: title,
                value: id
            }));
            prompt({
                type: "list",
                name: "roleId",
                message: "What is the employee's role?",
                choices: roleChoices
            })
            .then(res => {
                let roleId = res.roleId;
                db.findAllEmployees()
                .then(([rows]) => {
                    let employees = rows;
                    const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                        name: `${first_name} ${last_name}`,
                        value: id
                    }));
                    managerChoices.unshift({ name: "None", value: null });
                    prompt({
                        type: "list",
                        name: "managerId",
                        message: "Who is the employee's manager?",
                        choices: managerChoices
                    })
                    .then(res => {
                        let employee = {
                            manager_id: res.managerId,
                            role_id: roleId,
                            first_name: firstName,
                            last_name: lastName
                        }
                        db.createEmployee(employee);
                    })
                    .then(() => console.log(
                        `Added ${firstName} ${lastName} to the database`
                    ))
                    .then(() => mainQuestions())
                })
            })
        })
    })
}