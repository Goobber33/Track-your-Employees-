const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

function viewDepartments() {
  connection.query(
    'SELECT * FROM departments',
    function(err, res) {
      if (err) throw err;
      console.table(res);
      mainMenu();
    }
  );
}

function viewRoles() {
  connection.query(
    'SELECT * FROM roles',
    function(err, res) {
      if (err) throw err;
      console.table(res);
      mainMenu();
    }
  );
}

function viewEmployees() {
  connection.query(
    'SELECT * FROM employees',
    function(err, res) {
      if (err) throw err;
      console.table(res);
      mainMenu();
    }
  );
}

function addDepartment() {
  inquirer
    .prompt({
      name: 'name',
      type: 'input',
      message: 'Enter the name of the department:'
    })
    .then(function(answer) {
      connection.query(
        'INSERT INTO departments SET ?',
        {
          name: answer.name
        },
        function(err) {
          if (err) throw err;
          console.log(`Added department: ${answer.name}`);
          mainMenu();
        }
      );
    });
}

