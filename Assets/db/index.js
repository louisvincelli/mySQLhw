const connection = require('./connection');

class DB {
    //reference to connection on class
    constructor(connection) {
        this.connection = connection;
    }
    findAllEmployees() {
        return this.connection.query(
            'SELECT employee_table.id, employee_table.firstname, employee_table.lastname, role_table.title, department.name AS department, role_table.salary, CONCAT(manager.firstname, " ", manager.lastname) AS manager FROM employee_table LEFT JOIN role_table on employee_table.role_id = role_table.id LEFT JOIN department on role_table.department_id = department.id LEFT JOIN employee_table manager on manager.id = employee_table.manager_id;'
        );
    }
    findAllDepartments() {
        return this.connection.query(
          "SELECT department.id, department.name, SUM(role_table.salary) AS utilized_budget FROM department LEFT JOIN role_table ON role_table.department_id = department.id LEFT JOIN employee_table ON employee.role_id = role_table.id GROUP BY department.id, department.name"
        );
    }
    findAllEmployeesByDepartment(departmentId) {
        return this.connection.query(
          "SELECT employee_table.id, employee_table.first_name, employee_table.last_name, role_table.title FROM employee_table LEFT JOIN role on employee_table.role_id = role_table.id LEFT JOIN department department on role_table.department_id = department.id WHERE department.id = ?;",
          departmentId
        );
    }
}

module.exports = new DB(connection);