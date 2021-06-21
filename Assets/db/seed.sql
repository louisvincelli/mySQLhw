USE employees_db;
INSERT INTO department
    (name)
VALUES 
    ("Sales"),
    ('Engineering'),
    ("Finance"),
    ('Legal');

INSERT INTO role_table
    (title, salary, department_id)
VALUES
    ("Salesperson", 80000, 1),
    ("Engineerperson", 80000, 2),
    ("Financeperson", 80000, 3),
    ("Legalperson", 80000, 4);

INSERT INTO employee_table
    (firstname, lastname, role_id, manager_id)
VALUES  
    ("Michael", "Smith", 1, 1),
    ("Adam", "Johnson", 2, 2),
    ("Bob", "Ross", 3, 3),
    ("Jay", "Stevnes", 4, NULL);