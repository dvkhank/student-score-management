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
    password  varchar(120),
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
    location   varchar(100),
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


CREATE TABLE activity_kind
(
    id          serial primary key,
    description varchar(200),
    max_score   int,
    min_score   int default 0
);

