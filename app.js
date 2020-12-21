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
  connection.query(
    "SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      runApp();
    }
  );
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
          console.log(
            `Employee ${answer.addEmpFirst} ${answer.addEmpLast} was successfully created`
          );
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
      message: "Please enter the ID of the employee you wish to delete",
      name: "delete",
    })
    .then((answer) => {
      connection.query(
        `DELETE FROM employee WHERE id=${answer.delete}`,
        (err) => {
          if (err) {
            console.log(
              `Unable to delete employee number ${answer.delete}. Please make sure you entered a valid ID.`
            );
          }
          console.log(`Employee ${answer.delete} was succesfully deleted`);
          runApp();
        }
      );
    });
};

// Update employee role
const updateRole = () => {
  let empArray = [];
  let roleArray = [];
  const sql =
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary FROM employee INNER JOIN role ON employee.role_id = role.id";

  const sql2 = "SELECT role.title FROM role";
  connection.query(sql, function (err, res) {
    if (err) throw err;
    empArray = res;
    let empNames = empArray.map(
      (user) => user.first_name + " " + user.last_name + ", " + user.title
    );
    inquirer
      .prompt([
        {
          type: "list",
          message: "Which employee would you like to update?",
          choices: empNames,
          name: "empRole",
        },
      ])
      .then((answer) => {
          connection.query(sql2, function (err, res) {
            let result = answer.empRole
          if (err) throw err;
          roleArray = res;
          let roleList = roleArray.map((roles) => roles.title);
          inquirer.prompt([
            {
              type: "list",
              message: "What would you like to change their role to?",
              name: "newEmpRole",
              choices: roleList,
            },
          ])
              .then((answer) => {
                //   console.log(answer.newEmpRole)
                //   console.log(result)
              connection.query(`UPDATE employee SET role_id = ${answer.roleList} WHERE id = ${result}`)
          })
        })
        
      });
  });

  // .then((answer) => {
  //     connection.query(
  //         `UPDATE employee SET role_id = ${answer.roleUpdateID} WHERE id = ${answer.empUpd}`
  //     )
  //     runApp();
};

// Update employee manager
const updateManager = () => {};

// Add department
const addDept = () => {
  inquirer
    .prompt({
      type: "input",
      message: "What department would you like to add?",
      name: "deptName",
    })
    .then((answer) => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.deptName,
        },
        (err) => {
          if (err) {
            console.log(`Unable to create ${answer.deptName} department`);
          }
          console.log(`${answer.deptName} department was successfully created`);
          runApp();
        }
      );
    });
};

// Remove department
const removeDept = () => {
  inquirer
    .prompt({
      type: "input",
      message: "Please enter the ID of the department you wish to delete",
      name: "deptDelName",
    })
    .then((answer) => {
      connection.query(`DELETE FROM department WHERE id=${answer.deptDelName}`);
      console.log(
        `Department ID #${answer.deptDelName} was succesfully deleted`
      );
      runApp();
    });
};

// Add role
const addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What role would you like to add?",
        name: "roleName",
      },
      {
        type: "input",
        message: "What is the salary for this role?",
        name: "roleSalary",
      },
      {
        type: "input",
        message: "What department ID does this role belong to?",
        name: "roleDept",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.roleName,
          salary: answer.roleSalary,
          department_id: answer.roleDept,
        },
        (err) => {
          if (err) throw err;
          console.log(`${answer.roleName} role was succesfully created`);
          runApp();
        }
      );
    });
};

// Remove role
const removeRole = () => {
  inquirer
    .prompt({
      type: "input",
      message: "Please enter the ID of the role you wish to delete",
      name: "roleDel",
    })
    .then((answer) => {
      connection.query(`DELETE FROM role WHERE id=${answer.roleDel}`);
      console.log(`Role ID #${answer.roleDel} was successfully deleted`);
      runApp();
    });
};
