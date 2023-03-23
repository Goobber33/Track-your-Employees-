const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Blackjack22!',
  database: 'employee_tracker'
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