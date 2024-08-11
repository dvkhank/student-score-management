drop
    database if exists ssm; -- student score management
create
    database ssm;
use
    ssm;

CREATE TABLE users
(
    id        serial PRIMARY KEY,
    firstname varchar(120),
    lastname  varchar(120),
    username  varchar(120),
    password  varchar(200),
    avatar    varchar(120),
    role      varchar(10)
);


CREATE TABLE faculties
(
    id   serial primary key,
    name varchar(50)
);

CREATE TABLE classes
(
    id         serial primary key,
    name       varchar(50),
    start_year YEAR,
    faculty_id bigint unsigned,
    CONSTRAINT fk_classes_faculty_id FOREIGN KEY (faculty_id) REFERENCES faculties (id)
);

CREATE TABLE students
(
    id       serial primary key,
    user_id  bigint unsigned,
    class_id bigint unsigned,
    CONSTRAINT fk_student_user_id FOREIGN KEY (user_id) references users (id),
    CONSTRAINT fk_student_class_id FOREIGN KEY (class_id) references classes (id)
);


CREATE TABLE activity_kinds
(
    id          serial primary key,
    description varchar(200),
    max_score   int
);

CREATE TABLE periods
(
    id serial primary key,
    semester int,
    year YEAR
);


CREATE TABLE activies
(
    id serial primary key,
    name varchar(100),
    description varchar(100),
    start_date Date,
    score int,
    activity_kind_id bigint unsigned,
    CONSTRAINT fk_activity_activity_kind_id FOREIGN KEY(activity_kind_id) references activity_kinds (id),
    faculty_id bigint unsigned,
    CONSTRAINT fk_activity_faculty_id FOREIGN KEY (faculty_id) references faculties(id),
    period_id bigint unsigned,
    CONSTRAINT fk_activity_period_id FOREIGN KEY (period_id) references periods(id),
    money int
);

CREATE TABLE participation
(
    student_id bigint unsigned,
    activity_id bigint unsigned,
    parcipated_date Date,
    request boolean default false,
    description varchar(200),
    evidence varchar(200),
    FOREIGN KEY(student_id) references students(id),
    FOREIGN KEY (activity_id) references activies(id),
    PRIMARY KEY (student_id,activity_id)
);


-- Insert data into users
INSERT INTO users (firstname, lastname, username, password, avatar, role) VALUES
('John', 'Doe', 'johndoe', 'password123', 'avatar1.jpg', 'admin'),
('Jane', 'Smith', 'janesmith', 'password123', 'avatar2.jpg', 'student'),
('Alice', 'Johnson', 'alicejohnson', 'password123', 'avatar3.jpg', 'student'),
('Bob', 'Brown', 'bobbrown', 'password123', 'avatar4.jpg', 'student'),
('Charlie', 'Davis', 'charliedavis', 'password123', 'avatar5.jpg', 'student'),
('Eve', 'Clark', 'eveclark', 'password123', 'avatar6.jpg', 'student'),
('Frank', 'Taylor', 'franktaylor', 'password123', 'avatar7.jpg', 'student'),
('Grace', 'Martinez', 'gracemartinez', 'password123', 'avatar8.jpg', 'student'),
('Hannah', 'Lewis', 'hannahlewis', 'password123', 'avatar9.jpg', 'student'),
('Ian', 'Walker', 'ianwalker', 'password123', 'avatar10.jpg', 'student');

-- Insert data into faculties
INSERT INTO faculties (name) VALUES
('Science'),
('Information Technology'),
('Arts'),
('Business'),
('Education');

-- Insert data into classes
INSERT INTO classes (name, start_year, faculty_id) VALUES
('Computer Science 101', 2024, 2),
('Mathematics 101', 2024, 1),
('History 101', 2024, 3),
('Economics 101', 2024, 4),
('Literature 101', 2024, 3);

-- Insert data into students
INSERT INTO students (user_id, class_id) VALUES
(2, 1),
(3, 1),
(4, 2),
(5, 2),
(6, 3),
(7, 3),
(8, 4),
(9, 4),
(10, 5);

-- Insert data into activity_kinds
INSERT INTO activity_kinds (description, max_score) VALUES
('Assessment of study habits', 20),
('Assessment of compliance with school rules and regulations', 25),
('Assessment of participation in political-social, cultural, arts, sports activities, and anti-social vices', 25),
('Assessment of citizenship qualities and community relations', 25),
('Special cases', 10);
-- Insert data into periods
INSERT INTO periods (semester, year) VALUES
(1, 2024),
(2, 2024);

-- Insert data into activities
INSERT INTO activies (name, description, start_date, score, activity_kind_id, faculty_id, period_id, money) VALUES
('Homework 1', 'Homework on algorithms', '2024-01-10', 5, 1, 2, 1, 0),
('Project 1', 'Group project on data science', '2024-02-15', 5, 2, 2, 1, 0),
('Presentation 1', 'Presentation on AI', '2024-03-20', 5, 3, 2, 1, 0),
('Quiz 1', 'Quiz on calculus', '2024-01-30', 5, 4, 1, 1, 0),
('Exam 1', 'Final exam in computer science', '2024-04-10', 5, 5, 2, 1, 0);

-- Insert data into participation
INSERT INTO participation (student_id, activity_id, parcipated_date, request, description, evidence) VALUES
(1, 1, '2024-01-12', false, 'Completed homework', 'homework1.jpg'),
(1, 2, '2024-02-17', false, 'Completed project', 'project1.jpg'),
(2, 3, '2024-03-22', false, 'Gave presentation', 'presentation1.jpg'),
(3, 4, '2024-02-01', false, 'Participated in quiz', 'quiz1.jpg'),
(4, 5, '2024-04-12', false, 'Took the exam', 'exam1.jpg'),
(5, 1, '2024-01-14', false, 'Completed homework', 'homework1.jpg'),
(6, 2, '2024-02-18', false, 'Completed project', 'project1.jpg'),
(7, 3, '2024-03-25', false, 'Gave presentation', 'presentation1.jpg'),
(8, 4, '2024-02-02', false, 'Participated in quiz', 'quiz1.jpg'),
(9, 5, '2024-04-15', false, 'Took the exam', 'exam1.jpg');
