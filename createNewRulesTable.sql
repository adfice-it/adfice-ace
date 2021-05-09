use fakeadfice;
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
reference int
);

CREATE TABLE med_advice_text (
id INT AUTO_INCREMENT PRIMARY KEY,
medication_criteria_id varchar(8),
selectBoxNum int, 
selectBoxCategory varchar(20), 
selectBoxDesignator varchar(20), 
cdss varchar(2000), 
epic varchar(1000), 
patient varchar(5000)
);

