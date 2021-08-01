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
          "SELECT department.id, department.name, SUM(role_table.salary) AS utilized_budget FROM department LEFT JOIN role_table ON role_table.department_id = department.id LEFT JOIN employee_table ON employee_table.role_id = role_table.id GROUP BY department.id, department.name"
        );
    }
    findAllEmployeesByDepartment(departmentId) {
        return this.connection.query(
            "SELECT employee_table.id, employee_table.firstname, employee_table.lastname, role_table.title FROM employee_table LEFT JOIN role_table on employee_table.role_id = role_table.id LEFT JOIN department department on role_table.department_id = department.id WHERE department.id = ?;",
          departmentId
        );
    }
    findAllPossibleManagers(employeeId) {
        return this.connection.promise().query(
          "SELECT id, first_name, last_name FROM employee_table WHERE id != ?",
          employeeId
        );
    }
    addEmployee(employee) {
        return this.connection.promise().query("INSERT INTO employee_table SET ?", employee);
    }
    removeEmployee(employeeId) {
        return this.connection.promise().query(
          "DELETE FROM employee_table WHERE id = ?",
          employeeId
        );
    }
    updateEmployeeRole(employeeId, roleId) {
        return this.connection.promise().query(
          "UPDATE employee_table SET role_id = ? WHERE id = ?",
          [roleId, employeeId]
        );
    }
    updateEmployeeManager(employeeId, managerId) {
        return this.connection.promise().query(
          "UPDATE employee_table SET manager_id = ? WHERE id = ?",
          [managerId, employeeId]
        );
    }
    findAllRoles() {
        return this.connection.promise().query(
          "SELECT role_table.id, role_table.title, department.name AS department, role_table.salary FROM role_table LEFT JOIN department on role_table.department_id = department.id;"
        );
    }
    createRole(role) {
        return this.connection.promise().query("INSERT INTO role_table SET ?", role);
    }
    removeRole(roleId) {
        return this.connection.promise().query("DELETE FROM role_table WHERE id = ?", roleId);
    }
    createDepartment(department) {
        return this.connection.promise().query("INSERT INTO department SET ?", department);
    }
    removeDepartment(departmentId) {
        return this.connection.promise().query(
          "DELETE FROM department WHERE id = ?",
          departmentId
        );
    }
    findAllEmployeesByManager(managerId) {
        return this.connection.promise().query(
          "SELECT employee_table.id, employee_table.first_name, employee_table.last_name, department.name AS department, role_table.title FROM employee_table LEFT JOIN role_table on role_table.id = employee_table.role_id LEFT JOIN department ON department.id = role_table.department_id WHERE manager_id = ?;",
          managerId
        );
    }
    
}


module.exports = new DB(connection);