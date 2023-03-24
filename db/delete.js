const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');
require('dotenv').config();

const dbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

function deleteDepartment() {
  dbConnection.query('SELECT * FROM departments', function (err, departments) {
    if (err) throw err;
    
    // Prompt the user to select a department to delete
    inquirer.prompt({
      name: 'departmentId',
      type: 'list',
      message: 'Select a department to delete:',
      choices: departments.map(department => ({ name: department.name, value: department.id }))
    }).then(answer => {
      // Delete the selected department
      dbConnection.query('DELETE FROM departments WHERE id = ?', [answer.departmentId], function (err) {
        if (err) throw err;
        console.log('Department deleted successfully!');
        mainMenu();
      });
    });
  });
}

function deleteRole() {
  dbConnection.query('SELECT * FROM roles', function (err, roles) {
    if (err) throw err;
    
    // Prompt the user to select a role to delete
    inquirer.prompt({
      name: 'roleId',
      type: 'list',
      message: 'Select a role to delete:',
      choices: roles.map(role => ({ name: role.title, value: role.id }))
    }).then(answer => {
      // Delete the selected role
      dbConnection.query('DELETE FROM roles WHERE id = ?', [answer.roleId], function (err) {
        if (err) throw err;
        console.log('Role deleted successfully!');
        mainMenu();
      });
    });
  });
}

function deleteEmployee() {
  dbConnection.query('SELECT * FROM employees', function (err, employees) {
    if (err) throw err;
    
    // Prompt the user to select an employee to delete
    inquirer.prompt({
      name: 'employeeId',
      type: 'list',
      message: 'Select an employee to delete:',
      choices: employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))
    }).then(answer => {
      // Delete the selected employee
      dbConnection.query('DELETE FROM employees WHERE id = ?', [answer.employeeId], function (err) {
        if (err) throw err;
        console.log('Employee deleted successfully!');
        mainMenu();
      });
    });
  });
}

module.exports = {
  deleteDepartment,
  deleteRole,
  deleteEmployee,
};
