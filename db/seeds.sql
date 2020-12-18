USE employee_db;

INSERT INTO department (name)
VALUES ("Admin"), ("HR");

INSERT INTO role (title, salary, department_id)
VALUES ("CEO", 100000.00, 1), ("HR Coordinator", 75000.00, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Michael", "Li", 1, NULL), ("Bob", "Johnson", 2, 1);