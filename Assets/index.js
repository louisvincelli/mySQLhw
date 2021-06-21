const { listenerCount } = require('events');
const {prompt} = require('inquirer');
const { exit } = require('process');
const db = require('./db');
require('console.table');

init();

function init() {
    console.log('Employee Manager');
    mainQuestions();
}

async function mainQuestions() {
    const {choice} = await prompt([
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

    switch(choice){
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