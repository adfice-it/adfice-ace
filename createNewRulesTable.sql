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
condition_problem varchar(500),
condition_age varchar(200),
condition_drug varchar(500),
condition_lab varchar(500),
condition_allergy varchar(500),
reference int unsigned,
PRIMARY KEY (`id`),
UNIQUE KEY `medication_criteria_id` (`medication_criteria_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE med_advice_text (
id int unsigned AUTO_INCREMENT PRIMARY KEY,
medication_criteria_id varchar(8),
selectBoxNum smallint unsigned,
selectBoxCategory varchar(20),
selectBoxDesignator varchar(20),
cdss varchar(3000),
epic varchar(2000),
patient varchar(5000),
PRIMARY KEY (`id`),
UNIQUE KEY `medication_criteria_id` (`medication_criteria_id`,`selectBoxNum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE preselect_rules (
id int unsigned AUTO_INCREMENT PRIMARY KEY,
medication_criteria_id varchar(8),
selectBoxNum smallint unsigned,
preselect_or varchar(500),
preselect_not varchar(500),
preselect_problem varchar(500),
preselect_age varchar(20),
preselect_drug varchar(500),
preselect_lab varchar(500),
preselect_allergy varchar(500),
preselect_vervolg tinyint,
PRIMARY KEY (`id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
