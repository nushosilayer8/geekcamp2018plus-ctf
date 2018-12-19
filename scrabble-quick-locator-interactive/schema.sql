use scrabble;

create table users
(
    id INTEGER AUTO_INCREMENT,
    email TEXT,
    pass TEXT,
    PRIMARY KEY (id)
);

create table words
(
    name varchar(255),
    def TEXT,
    PRIMARY KEY (name)
);

insert into users values (1, "admin@admin.org", "flag{uN10n_d4_b3st}");

insert into words values ("ABACTERIAL", "not caused by or characterised by the presence of bacteria [adj]");
insert into words values ("ABACTINAL","remote from the actinal area (of a radiate animal) [adj ABACTINALLY]");
insert into words values ("ABACTINALLY","ABACTINAL, remote from the actinal area (of a radiate animal) [adv]");
insert into words values ("ABACTOR","(obsolete) a cattle thief [n -S]");
insert into words values ("ALUMINOTHERMY", "a process for reducing metallic oxides using finely divided aluminium powder [n ALUMINOTHERMIES]");
insert into words values ("ALUMINOUS", "pertaining to or containing alum, or alumina [adj]");
insert into words values ("ALUMINS", "ALUMIN, an oxide of aluminum, also ALUMINA, ALUMINE [n]");

create database scrabblematches;
use scrabblematches;

create table matches
(
    p1 TEXT,
    p2 TEXT,
    result TEXT
);

insert into matches values ("Brett Smitheram", "Mark Nyman", "flag{bl4ckl1st_d035_n0t_1mply_s3cur3}");

GRANT ALL privileges on scrabblematches.* to 'main'@'%' identified by 'supersecretmainpassword';

FLUSH PRIVILEGES;