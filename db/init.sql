drop
database if exists ssm; -- student score management
create
database ssm;
use
ssm;

CREATE TABLE users
(
    id        int PRIMARY KEY,
    firstname varchar(120),
    lastname  varchar(120),
    username  varchar(120),
    password  varchar(120),
    avatar    varchar(120),
    role      varchar(10)
);

CREATE TABLE faculties
(
    id   int primary key,
    name varchar(50)
);

CREATE TABLE classes
(
    id         int primary key,
    name       varchar(50),
    location   varchar(100),
    faculty_id int,
    FOREIGN KEY (faculty_id) REFERENCES faculties (id)
);


CREATE TABLE students
(
    id       int primary key,
    class_id int,
    FOREIGN KEY (id) references users (id),
    FOREIGN KEY (class_id) references classes (id)

);

CREATE TABLE activity_kind
(

    id          int primary key,
    description varchar(200),
    max_score   int,
    min_score int default 0
);