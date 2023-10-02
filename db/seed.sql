INSERT INTO department (name)
  
VALUES
  ('R&D'),
  ('Development'),
  ('Marketing'),
  ('Finance');

-- Inserts roles of employee into role table
INSERT INTO role
  (title, salary, department_id)
VALUES
  ('Researcher', 50000, 1),
  ('Junior Developer', 80000, 2),
  ('Marketer', 90000, 3),
  ('Accountant', 1000000, 4);

-- Inserts employee information into employee table
INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES
  ('Campbell', 'Gilliland', 1, 1),
  ('Christian', 'Jacobson', 2, 2),
  ('Jules', 'Condes', 3, 3),
  ('Darien', 'Wygant', 4, 4);