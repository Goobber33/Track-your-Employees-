INSERT INTO departments (name) VALUES ('Sales');
INSERT INTO departments (name) VALUES ('Marketing');
INSERT INTO departments (name) VALUES ('Engineering');

INSERT INTO roles (title, salary, department_id) VALUES ('Sales Manager', 100000, 1);
INSERT INTO roles (title, salary, department_id) VALUES ('Sales Representative', 50000, 1);
INSERT INTO roles (title, salary, department_id) VALUES ('Marketing Manager', 90000, 2);
INSERT INTO roles (title, salary, department_id) VALUES ('Engineering Manager', 110000, 3);
INSERT INTO roles (title, salary, department_id) VALUES ('Software Engineer', 80000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, null);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Jane', 'Doe', 2, 1);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Jim', 'Smith', 3, null);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Lisa', 'Johnson', 4, null);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Mike', 'Williams', 5, 4);