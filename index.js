// Require the necessary modules and files

const inquirer = require('inquirer'); // Adds inquirer to promnpt for user input
const database = require('./db/database'); // Accessing MySQL Database
const logo = require("asciiart-logo"); // For creating ASCII art logo
const logoText = logo({ name: "Track your Employees!" }).render(); // Define the ASCII art logo and store it in a variable

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
        'Quit'
      ]
    })
    .then(function (answer) {

      // Call the appropriate function based on the user's selection

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

// Call the mainMenu function to start the application

mainMenu();

// Export the mainMenu function for testing purposes

module.exports = {
  mainMenu
};