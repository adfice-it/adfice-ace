-- use fakeadfice;

CREATE TABLE med_rules(
id INT AUTO_INCREMENT PRIMARY KEY,
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
condition_labs varchar(500),
condition_allergy varchar(500),
reference int
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE med_advice_text (
id INT AUTO_INCREMENT PRIMARY KEY,
medication_criteria_id varchar(8),
selectBoxNum int,
selectBoxCategory varchar(20),
selectBoxDesignator varchar(20),
precheck_or varchar(500),
precheck_not varchar(500),
precheck_problem varchar(500),
precheck_age varchar(20),
precheck_drug varchar(500),
precheck_labs varchar(500),
precheck_allergy varchar(500),
cdss varchar(3000),
epic varchar(2000),
patient varchar(5000)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

