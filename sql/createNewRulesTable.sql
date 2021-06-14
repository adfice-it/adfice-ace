-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
-- use fakeadfice;

CREATE TABLE med_rules(
id int unsigned AUTO_INCREMENT PRIMARY KEY,
medication_criteria_id varchar(8),
active varchar(5),
needs_review varchar(5),
medication_criteria varchar(1000),
patient_group_criteria varchar(1000),
preselect_criteria varchar(1000),
selector_logic varchar(1000),
condition_logic varchar(1000),
selector_or varchar(500),
selector_not varchar(500),
reference int unsigned,
UNIQUE KEY (medication_criteria_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE med_advice_text (
id int unsigned AUTO_INCREMENT PRIMARY KEY,
medication_criteria_id varchar(8),
select_box_num smallint unsigned,
select_box_category varchar(20),
select_box_designator varchar(20),
cdss varchar(3000),
epic varchar(2000),
patient varchar(5000),
UNIQUE KEY (medication_criteria_id, select_box_num)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE med_other_text (
id int unsigned AUTO_INCREMENT PRIMARY KEY,
medication_criteria_id varchar(8),
select_box_num smallint unsigned,
select_box_category varchar(20),
select_box_designator varchar(20),
cdss varchar(3000),
epic varchar(2000),
patient varchar(5000)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE preselect_rules (
id int unsigned AUTO_INCREMENT PRIMARY KEY,
medication_criteria_id varchar(8),
select_box_num smallint unsigned,
preselect_num smallint unsigned,
preselect_or varchar(500),
preselect_not varchar(500),
preselect_problem varchar(500),
preselect_age varchar(20),
preselect_drug varchar(500),
preselect_lab varchar(500),
preselect_allergy varchar(500),
UNIQUE KEY (medication_criteria_id, select_box_num, preselect_num)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE nonmed_header (
id int unsigned AUTO_INCREMENT PRIMARY KEY,
category_id varchar(8),
category_name varchar(50),
UNIQUE KEY (category_id),
UNIQUE KEY (category_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE nonmed_text (
id int unsigned AUTO_INCREMENT PRIMARY KEY,
category_id varchar(8),
select_box_num smallint unsigned,
preselected tinyint unsigned,
cdss varchar(3000),
epic varchar(2000),
patient varchar(5000),
UNIQUE KEY (category_id, select_box_num)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
