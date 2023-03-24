// Require the necessary modules

const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');
require('dotenv').config();

// Create a MySQL connection taken from my .env file

const dbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const deleteFunctions = require('./delete');
const { deleteDepartment, deleteRole, deleteEmployee } = deleteFunctions;

// Function to view all departments in the database

function viewDepartments() {
  dbConnection.query(
    'SELECT id, name FROM departments',
    function (err, res) {
      if (err) throw err;
      console.table(res);
      mainMenu();
    }
  );
}

// Function to view all roles in the database

function viewRoles() {
  dbConnection.query(
    'SELECT roles.id, roles.title, departments.name AS department, FORMAT(roles.salary, 0) AS salary FROM roles JOIN departments ON roles.department_id = departments.id ORDER BY roles.id;',
    function (err, res) {
      if (err) throw err;
      console.table(res);
      mainMenu();
    }
  );
}

// Function to view all employees in the database

function viewEmployees() {
  dbConnection.query(
    `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, FORMAT(roles.salary, 0) AS salary,
    CONCAT_WS(" ", m.first_name, m.last_name) AS manager 
    FROM employees 
    LEFT JOIN roles ON employees.role_id = roles.id 
    LEFT JOIN departments ON roles.department_id = departments.id 
    LEFT JOIN employees m ON employees.manager_id = m.id 
    ORDER BY employees.id`,
    function (err, res) {
      if (err) throw err;

      // Replace empty manager names with null

      res.forEach(function (employee) {
        if (employee.manager === '') {
          employee.manager = 'null';
        }
      });
      console.table(res);
      mainMenu();
    }
  );
}

// Function to add a new department to the database

function addDepartment() {
  inquirer
    .prompt({
      name: 'name',
      type: 'input',
      message: 'Enter the name of the department:'
    })
    .then(function (answer) {
      dbConnection.query(
        'INSERT INTO departments SET ?',
        {
          name: answer.name
        },
        function (err) {
          if (err) throw err;
          console.log(`Added department: ${answer.name}`);
          mainMenu();
        }
      );
    });
}

// Function to add a new role to the database

function addRole() {
  // First fetch all departments from the database
  dbConnection.query('SELECT * FROM departments', function (err, departments) {
    if (err) throw err;

    // Prompt the user to select the department for the new role
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
          name: 'department',
          type: 'list',
          message: 'Select the department for the role:',
          choices: departments.map(department => ({
            name: department.name,
            value: department.id
          }))
        }
      ])
      .then(function (answers) {
        dbConnection.query(
          'INSERT INTO roles SET ?',
          {
            title: answers.title,
            salary: answers.salary,
            department_id: answers.department
          },
          function (err) {
            if (err) throw err;
            console.log(`Added role: ${answers.title}`);
            mainMenu();
          }
        );
      });
  });
}


// Function to add a new employee to the database

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
    .then(function (answers) {
      dbConnection.query(
        'INSERT INTO employees SET ?',
        {
          first_name: answers.first_name,
          last_name: answers.last_name,
          role_id: answers.role_id,
          manager_id: answers.manager_id
        },
        function (err) {
          if (err) throw err;
          console.log(`Added employee: ${answers.first_name} ${answers.last_name}`);
          mainMenu();
        }
      );
    });
}

// Function to update an employee's role in the database

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
      dbConnection.query(
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

// Function to update an employee's manager in the database

function updateEmployeeManager() {
  inquirer
    .prompt([
      {
        name: 'employee_id',
        type: 'input',
        message: 'Enter the id of the employee whose manager you want to update:'
      },
      {
        name: 'manager_id',
        type: 'input',
        message: 'Enter the new manager id for the employee (null if no manager):'
      }
    ])
    .then(function (answers) {
      dbConnection.query(
        'UPDATE employees SET manager_id = ? WHERE id = ?',
        [answers.manager_id === 'null' ? null : answers.manager_id, answers.employee_id],
        function (err) {
          if (err) throw err;
          console.log(`Updated employee manager`);
          mainMenu(); // Ensure this line is present
        }
      );
    });
}

// Function to view employees by manager

function viewEmployeesByManager() {
  dbConnection.query(
    `SELECT DISTINCT m.id, CONCAT_WS(" ", m.first_name, m.last_name) AS manager
    FROM employees 
    LEFT JOIN employees m ON employees.manager_id = m.id 
    WHERE m.id IS NOT NULL`,
    function (err, managers) {
      if (err) throw err;

      inquirer
        .prompt({
          name: 'manager',
          type: 'list',
          message: 'Select a manager to view their employees:',
          choices: managers.map(manager => ({
            name: manager.manager,
            value: manager.id
          }))
        })
        .then(function (answer) {
          dbConnection.query(
            `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, FORMAT(roles.salary, 0) AS salary 
            FROM employees 
            LEFT JOIN roles ON employees.role_id = roles.id 
            LEFT JOIN departments ON roles.department_id = departments.id 
            WHERE employees.manager_id = ?`,
            [answer.manager],
            function (err, res) {
              if (err) throw err;
              console.table(res);
              mainMenu();
            }
          );
        });
    }
  );
}

// Function to view employees by department

function viewEmployeesByDepartment() {
  dbConnection.query(
    `SELECT id, name FROM departments`,
    function (err, departments) {
      if (err) throw err;

      inquirer
        .prompt({
          name: 'department',
          type: 'list',
          message: 'Select a department to view its employees:',
          choices: departments.map(department => ({
            name: department.name,
            value: department.id
          }))
        })
        .then(function (answer) {
          dbConnection.query(
            `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, FORMAT(roles.salary, 0) AS salary, CONCAT_WS(" ", m.first_name, m.last_name) AS manager 
            FROM employees 
            LEFT JOIN roles ON employees.role_id = roles.id 
            LEFT JOIN departments ON roles.department_id = departments.id 
            LEFT JOIN employees m ON employees.manager_id = m.id 
            WHERE departments.id = ?`,
            [answer.department],
            function (err, res) {
              if (err) throw err;
              console.table(res);
              mainMenu();
            }
          );
        });
    }
  );
}

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

// Export the functions and the database connection for use in other modules

module.exports = {
  dbConnection,
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
  deleteDepartment, // Add this line
  deleteRole, // Add this line
  deleteEmployee // Add this line
};

