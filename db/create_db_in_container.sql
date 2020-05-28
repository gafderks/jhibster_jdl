use jhipster_jdl;

set foreign_key_checks=0;


create table tasks (
, 
	title VARCHAR(255), 
	description VARCHAR(255), 
	duedate DATETIME, 
	attachment VARCHAR(255)
) engine=InnoDB;

create user 'gafderks' identified with mysql_native_password by 'poedel';
grant all privileges on jhipster_jdl.* to 'gafderks';
flush privileges;

set foreign_key_checks=1;

