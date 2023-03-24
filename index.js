// Require the necessary modules and files

const inquirer = require('inquirer'); // Adds inquirer to prompt for user input
const database = require('./db/database'); // Accessing MySQL Database
const logo = require("asciiart-logo"); // For creating ASCII art logo
const logoText = logo({ name: "Track your Employees!" }).render(); // Define the ASCII art logo and store it in a variable

const {
  viewDepartments,
  viewRoles,
  viewEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
  updateEmployeeManager,
  viewEmployeesByManager,
  viewEmployeesByDepartment,
  deleteDepartment,
  deleteRole,
  deleteEmployee
} = require('./db/database');


console.log(logoText); // Display the ASCII art logo in the console

// Function to display the main menu and prompt the user for their selection

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
        'Update an employee manager',
        'View employees by manager',
        'View employees by department',
        'Delete a department',
        'Delete a role',
        'Delete an employee',
        'Quit'
      ]
    })
    .then(function (answer) {

      // Call the appropriate function based on the user's selection

      switch (answer.action) {
        case 'View all departments':
          viewDepartments();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Update an employee manager':
          updateEmployeeManager();
          break;
        case 'View employees by manager':
          viewEmployeesByManager();
          break;
        case 'View employees by department':
          viewEmployeesByDepartment();
          break;
        case 'Delete a department':
          deleteDepartment();
          break;
        case 'Delete a role':
          deleteRole();
          break;
        case 'Delete an employee':
          deleteEmployee();
          break;
        case 'Quit':
          dbConnection.end();
          break;
      }
    });
}

// Call the mainMenu function to start the application

mainMenu();

// Export the mainMenu function for testing purposes

module.exports = {
  mainMenu
};