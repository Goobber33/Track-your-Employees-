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

function addRole() {
  inquirer
    .prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Enter the title of the role:'
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Enter the salary for the role:'
      },
      {
        name: 'department_id',
        type: 'input',
        message: 'Enter the department id for the role:'
      }
    ])
    .then(function(answers) {
      connection.query(
        'INSERT INTO roles SET ?',
        {
          title: answers.title,
          salary: answers.salary,
          department_id: answers.department_id
        },
        function(err) {
          if (err) throw err;
          console.log(`Added role: ${answers.title}`);
          mainMenu();
        }
      );
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: 'first_name',
        type: 'input',
        message: 'Enter the first name of the employee:'
      },
      {
        name: 'last_name',
        type: 'input',
        message: 'Enter the last name of the employee:'
      },
      {
        name: 'role_id',
        type: 'input',
        message: 'Enter the role id for the employee:'
      },
      {
        name: 'manager_id',
        type: 'input',
        message: 'Enter the manager id for the employee (null if no manager):'
      }
    ])
    .then(function(answers) {
      connection.query(
        'INSERT INTO employees SET ?',
        {
          first_name: answers.first_name,
          last_name: answers.last_name,
          role_id: answers.role_id,
          manager_id: answers.manager_id
        },
        function(err) {
          if (err) throw err;
          console.log(`Added employee: ${answers.first_name} ${answers.last_name}`);
          mainMenu();
        }
      );
    });
}
function updateEmployeeRole() {
    inquirer
        .prompt([
            {
                name: 'employee_id',
                type: 'input',
                message: 'Enter the id of the employee to update:'
            },
            {
                name: 'role_id',
                type: 'input',
                message: 'Enter the new role id for the employee:'
            }
        ])
        .then(function (answers) {
            connection.query(
                'UPDATE employees SET role_id = ? WHERE id = ?',
                [answers.role_id, answers.employee_id],
                function (err) {
                    if (err) throw err;
                    console.log(`Updated employee role`);
                    mainMenu();
                }
            );
        });
}

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
        'Exit'
      ]
    })
    .then(function(answer) {
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

        case 'Exit':
          connection.end();
          break;
      }
    });
}


module.exports = {
    connection,
    viewDepartments,
    viewRoles,
    viewEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole
};