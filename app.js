const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localHost",
  port: 3306,
  user: "root",
  password: "Ashereli1",
  database: "employee_db",
});

connection.connect((err) => {
  if (err) throw err;
  runApp();
});

const runApp = () => {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Roles",
        "View All Departments",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "Add Department",
        "Remove Department",
        "Add Role",
        "Remove Role",
        "Quit",
      ],
      name: "action",
    })
    .then((answer) => {
      switch (answer.action) {
        case "View All Employees":
          return allEmployees();
        case "View All Roles":
          return allRoles();
        case "View All Departments":
          return allDepts();
        case "Add Employee":
          return addEmployee();
        case "Remove Employee":
          return removeEmployee();
        case "Update Employee Role":
          return updateRole();
        case "Update Employee Manager":
          return updateManager();
        case "Add Department":
          return addDept();
        case "Remove Department":
          return removeDept();
        case "Add Role":
          return addRole();
        case "Remove Role":
          return removeRole();
        case "Quit":
          connection.end();
      }
    });
};

// View all employees
const allEmployees = () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    console.table(res);
    runApp();
  });
};
// View all roles
const allRoles = () => {
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    console.table(res);
    runApp();
  });
};

//View all departments
const allDepts = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    console.table(res);
    runApp();
  });
};

// Add employee
const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the employees first name?",
        name: "addEmpFirst",
      },
      {
        type: "input",
        message: "What is the employees last name?",
        name: "addEmpLast",
      },
      {
        type: "input",
        message: "What is the employee's role id?",
        name: "addEmpRole",
      },
      {
        type: "input",
        message: "What is the employee's manager id?",
        name: "addEmpMgr",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.addEmpFirst,
          last_name: answer.addEmpLast,
          role_id: answer.addEmpRole,
          manager_id: answer.addEmpMgr,
        },
        (err) => {
          if (err) throw err;
          console.log("Your employee was successfully added");
          runApp();
        }
      );
    });
};

// Remove employee
const removeEmployee = () => {
  inquirer
    .prompt({
      type: "input",
      message: "Please enter the employee ID you want to delete",
      name: "delete",
    })
    .then((answer) => {
      connection.query(`DELETE FROM employee WHERE id=${answer.delete}`),
        console.log("The employee was succesfully deleted");
    });
};

// Update employee role
const updateRole = () => {};

// Update employee manager
const updateManager = () => {};

// Add department
const addDept = () => {};

// Remove department
const removeDept = () => {};

// Add role
const addRole = () => {};

// Remove role
const removeRole = () => {};
