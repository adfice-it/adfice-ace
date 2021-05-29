CREATE TABLE patient_advice_freetext (
  id int unsigned NOT NULL AUTO_INCREMENT,
  viewer_id int unsigned NOT NULL,
  patient_id int unsigned NOT NULL,
  ATC_code varchar(100) NOT NULL,
  medication_criteria_id varchar(8) NOT NULL,
  select_box_num smallint unsigned NOT NULL,
  freetext_num smallint unsigned NOT NULL,
  freetext varchar(1000) NOT NULL,
  row_created timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY (patient_id, ATC_code, medication_criteria_id, select_box_num, freetext_num)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
