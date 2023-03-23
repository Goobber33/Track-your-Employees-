const inquirer = require('inquirer');
const database = require('./db/database');
const logo = require ("asciiart-logo");
const logoText = logo({ name: "Track your Employees!" }).render();

console.log(logoText);

function mainMenu() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Quit'
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case 'View all departments':
          database.viewDepartments();
          break;
        case 'View all roles':
          database.viewRoles();
          break;
        case 'View all employees':
          database.viewEmployees();
          break;
        case 'Add a department':
          database.addDepartment();
          break;
        case 'Add a role':
          database.addRole();
          break;
        case 'Add an employee':
          database.addEmployee();
          break;
        case 'Update an employee role':
          database.updateEmployeeRole();
          break;
        case 'Quit':
          database.connection.end();
          break;
      }
    });
}

mainMenu();
