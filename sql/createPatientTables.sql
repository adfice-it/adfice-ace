-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw

--
-- creating patient table, log table, and triggers
--
CREATE TABLE `patient` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `display_name` varchar(100) DEFAULT NULL,
  `birth_date` date,
  `education_level` varchar(100),
  `age` int unsigned,
  `is_fake` tinyint,
  `is_final` tinyint(1),
  `row_created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `row_updated` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `patient_history` (
  `log_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `log_row_created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `log_op` tinyint NOT NULL,
  `id` int unsigned NOT NULL,
  `display_name` varchar(100),
  `birth_date` date,
  `education_level` varchar(100),
  `age` int unsigned,
  `is_fake` tinyint,
  `is_final` tinyint(1),
  `row_created` timestamp NOT NULL,
  `row_updated` timestamp NOT NULL,
  PRIMARY KEY (`log_id`),
  INDEX (log_row_created),
  INDEX (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TRIGGER patient_history_insert
  AFTER INSERT ON patient
      FOR EACH ROW
        INSERT INTO patient_history
        VALUES (
          NULL,
          NULL,
          0,
          NEW.id,
          NEW.display_name,
          NEW.birth_date,
          NEW.education_level,
          NEW.age,
          NEW.is_fake,
          NEW.is_final,
          NEW.row_created,
          NEW.row_updated
        );

CREATE TRIGGER patient_history_update
  AFTER UPDATE ON patient
      FOR EACH ROW
        INSERT INTO patient_history
        VALUES (
          NULL,
          NULL,
          1,
          OLD.id,
          OLD.display_name,
          OLD.birth_date,
          OLD.education_level,
          OLD.age,
          OLD.is_fake,
          OLD.is_final,
          OLD.row_created,
          OLD.row_updated
        );

CREATE TRIGGER patient_history_delete
  AFTER DELETE ON patient
      FOR EACH ROW
        INSERT INTO patient_history
        VALUES (
          NULL,
          NULL,
          2,
          OLD.id,
          OLD.display_name,
          OLD.birth_date,
          OLD.education_level,
          OLD.age,
          OLD.is_fake,
          OLD.is_final,
          OLD.row_created,
          OLD.row_updated
        );

--
-- creating patient_lab table, log table, and triggers
--
CREATE TABLE `patient_lab` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` int unsigned DEFAULT NULL,
  `date_retrieved` datetime DEFAULT NULL,
  `date_measured` datetime DEFAULT NULL,
  `lab_test_name` varchar(100) DEFAULT NULL,
  `lab_test_code` varchar(15) DEFAULT NULL,
  `lab_test_result` varchar(100) DEFAULT NULL,
  `lab_test_units` varchar(15) DEFAULT NULL,
  `row_created` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY (patient_id, lab_test_name),
  KEY (patient_id, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `patient_lab_history` (
  `log_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `log_row_created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `log_op` tinyint NOT NULL,
  `id` int unsigned NOT NULL,
  `patient_id` int unsigned DEFAULT NULL,
  `date_retrieved` datetime DEFAULT NULL,
  `date_measured` datetime DEFAULT NULL,
  `lab_test_name` varchar(100) DEFAULT NULL,
  `lab_test_code` varchar(15) DEFAULT NULL,
  `lab_test_result` varchar(100) DEFAULT NULL,
  `lab_test_units` varchar(15) DEFAULT NULL,
  `row_created` timestamp NOT NULL,
  PRIMARY KEY (`log_id`),
  INDEX (log_row_created),
  INDEX (id),
  INDEX (patient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TRIGGER patient_lab_history_insert
  AFTER INSERT ON patient_lab
      FOR EACH ROW
        INSERT INTO patient_lab_history
        VALUES (
          NULL,
          NULL,
          0,
          NEW.id,
          NEW.patient_id,
          NEW.date_retrieved,
          NEW.date_measured,
          NEW.lab_test_name,
          NEW.lab_test_code,
          NEW.lab_test_result,
          NEW.lab_test_units,
          NEW.row_created
        );

CREATE TRIGGER patient_lab_history_update
  AFTER UPDATE ON patient_lab
      FOR EACH ROW
        INSERT INTO patient_lab_history
        VALUES (
          NULL,
          NULL,
          1,
          OLD.id,
          OLD.patient_id,
          OLD.date_retrieved,
          OLD.date_measured,
          OLD.lab_test_name,
          OLD.lab_test_code,
          OLD.lab_test_result,
          OLD.lab_test_units,
          OLD.row_created
        );

CREATE TRIGGER patient_lab_history_delete
  AFTER DELETE ON patient_lab
      FOR EACH ROW
        INSERT INTO patient_lab_history
        VALUES (
          NULL,
          NULL,
          2,
          OLD.id,
          OLD.patient_id,
          OLD.date_retrieved,
          OLD.date_measured,
          OLD.lab_test_name,
          OLD.lab_test_code,
          OLD.lab_test_result,
          OLD.lab_test_units,
          OLD.row_created
        );

--
-- creating patient_measurement, log and triggers
--
CREATE TABLE `patient_measurement` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` int unsigned NOT NULL,
  `date_retrieved` datetime DEFAULT NULL,
  `user_education_hml` smallint unsigned DEFAULT NULL,
  `education_hml` smallint unsigned DEFAULT NULL,
  `user_height_cm` decimal(5,2) DEFAULT NULL,
  `height_cm` decimal(5,2) DEFAULT NULL,
  `height_date_measured` datetime DEFAULT NULL,
  `user_weight_kg` decimal(5,2) DEFAULT NULL,
  `weight_kg` decimal(5,2) DEFAULT NULL,
  `weight_date_measured` datetime DEFAULT NULL,
  `BMI` decimal(5,2) DEFAULT NULL,
  `BMI_date_measured` datetime DEFAULT NULL,
  `user_GDS_score` int unsigned DEFAULT NULL,
  `GDS_score` int unsigned DEFAULT NULL,
  `GDS_date_measured` datetime DEFAULT NULL,
  `user_grip_kg` decimal(5,2) DEFAULT NULL,
  `grip_kg` decimal(5,2) DEFAULT NULL,
  `grip_date_measured` datetime DEFAULT NULL,
  `user_walking_speed_m_per_s` decimal(5,3) DEFAULT NULL,
  `walking_speed_m_per_s` decimal(5,3) DEFAULT NULL,
  `walking_date_measured` datetime DEFAULT NULL,
  `user_systolic_bp_mmHg` int unsigned DEFAULT NULL,
  `systolic_bp_mmHg` int unsigned DEFAULT NULL,
  `diastolic_bp_mmHg` int unsigned DEFAULT NULL,
  `bp_date_measured` datetime DEFAULT NULL,
  `user_number_of_limitations` smallint unsigned DEFAULT NULL,
  `number_of_limitations` smallint unsigned DEFAULT NULL,
  `functional_limit_date_measured` datetime DEFAULT NULL,
  `user_fear0` tinyint DEFAULT NULL,
  `user_fear1` tinyint DEFAULT NULL,
  `user_fear2` tinyint DEFAULT NULL,
  `fear0` tinyint DEFAULT NULL,
  `fear1` tinyint DEFAULT NULL,
  `fear2` tinyint DEFAULT NULL,
  `fear_of_falls_date_measured` datetime DEFAULT NULL,
  `user_nr_falls_12m` int unsigned DEFAULT NULL,
  `nr_falls_12m` int unsigned DEFAULT NULL,
  `nr_falls_date_measured` datetime DEFAULT NULL,
  `user_smoking` tinyint DEFAULT NULL,
  `smoking` tinyint DEFAULT NULL,
  `smoking_date_measured` datetime DEFAULT NULL,
  `has_antiepileptica` tinyint DEFAULT NULL,
  `has_ca_blocker` tinyint DEFAULT NULL,
  `has_incont_med` tinyint DEFAULT NULL,
  `prediction_result` int unsigned DEFAULT NULL,
  `user_values_updated` datetime DEFAULT NULL,
  `row_created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `row_updated` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `patient_id` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `patient_measurement_history` (
  `log_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `log_row_created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `log_op` tinyint NOT NULL,
  `id` int unsigned NOT NULL,
  `patient_id` int unsigned NOT NULL,
  `date_retrieved` datetime DEFAULT NULL,
  `user_education_hml` smallint unsigned DEFAULT NULL,
  `education_hml` smallint unsigned DEFAULT NULL,
  `user_height_cm` decimal(5,2) DEFAULT NULL,
  `height_cm` decimal(5,2) DEFAULT NULL,
  `height_date_measured` datetime DEFAULT NULL,
  `user_weight_kg` decimal(5,2) DEFAULT NULL,
  `weight_kg` decimal(5,2) DEFAULT NULL,
  `weight_date_measured` datetime DEFAULT NULL,
  `BMI` decimal(5,2) DEFAULT NULL,
  `BMI_date_measured` datetime DEFAULT NULL,
  `user_GDS_score` int unsigned DEFAULT NULL,
  `GDS_score` int unsigned DEFAULT NULL,
  `GDS_date_measured` datetime DEFAULT NULL,
  `user_grip_kg` decimal(5,2) DEFAULT NULL,
  `grip_kg` decimal(5,2) DEFAULT NULL,
  `grip_date_measured` datetime DEFAULT NULL,
  `user_walking_speed_m_per_s` decimal(5,3) DEFAULT NULL,
  `walking_speed_m_per_s` decimal(5,3) DEFAULT NULL,
  `walking_date_measured` datetime DEFAULT NULL,
  `user_systolic_bp_mmHg` int unsigned DEFAULT NULL,
  `systolic_bp_mmHg` int unsigned DEFAULT NULL,
  `diastolic_bp_mmHg` int unsigned DEFAULT NULL,
  `bp_date_measured` datetime DEFAULT NULL,
  `user_number_of_limitations` smallint unsigned DEFAULT NULL,
  `number_of_limitations` smallint unsigned DEFAULT NULL,
  `functional_limit_date_measured` datetime DEFAULT NULL,
  `user_fear0` tinyint DEFAULT NULL,
  `user_fear1` tinyint DEFAULT NULL,
  `user_fear2` tinyint DEFAULT NULL,
  `fear0` tinyint DEFAULT NULL,
  `fear1` tinyint DEFAULT NULL,
  `fear2` tinyint DEFAULT NULL,
  `fear_of_falls_date_measured` datetime DEFAULT NULL,
  `user_nr_falls_12m` int unsigned DEFAULT NULL,
  `nr_falls_12m` int unsigned DEFAULT NULL,
  `nr_falls_date_measured` datetime DEFAULT NULL,
  `user_smoking` tinyint DEFAULT NULL,
  `smoking` tinyint DEFAULT NULL,
  `smoking_date_measured` datetime DEFAULT NULL,
  `has_antiepileptica` tinyint DEFAULT NULL,
  `has_ca_blocker` tinyint DEFAULT NULL,
  `has_incont_med` tinyint DEFAULT NULL,
  `prediction_result` int unsigned DEFAULT NULL,
  `user_values_updated` datetime DEFAULT NULL,
  `row_created` timestamp NOT NULL,
  `row_updated` timestamp NOT NULL,
  PRIMARY KEY (`log_id`),
  INDEX (log_row_created),
  INDEX (id),
  INDEX (patient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TRIGGER patient_measurement_history_insert
  AFTER INSERT ON patient_measurement
      FOR EACH ROW
        INSERT INTO patient_measurement_history
        VALUES (
          NULL,
          NULL,
          0,
          NEW.id,
          NEW.patient_id,
          NEW.date_retrieved,
          NEW.user_education_hml,
          NEW.education_hml,
          NEW.user_height_cm,
          NEW.height_cm,
          NEW.height_date_measured,
          NEW.user_weight_kg,
          NEW.weight_kg,
          NEW.weight_date_measured,
          NEW.BMI,
          NEW.BMI_date_measured,
          NEW.user_GDS_score,
          NEW.GDS_score,
          NEW.GDS_date_measured,
          NEW.user_grip_kg,
          NEW.grip_kg,
          NEW.grip_date_measured,
          NEW.user_walking_speed_m_per_s,
          NEW.walking_speed_m_per_s,
          NEW.walking_date_measured,
          NEW.user_systolic_bp_mmHg,
          NEW.systolic_bp_mmHg,
          NEW.diastolic_bp_mmHg,
          NEW.bp_date_measured,
          NEW.user_number_of_limitations,
          NEW.number_of_limitations,
          NEW.functional_limit_date_measured,
          NEW.user_fear0,
          NEW.user_fear1,
          NEW.user_fear2,
          NEW.fear0,
          NEW.fear1,
          NEW.fear2,
          NEW.fear_of_falls_date_measured,
          NEW.user_nr_falls_12m,
          NEW.nr_falls_12m,
          NEW.nr_falls_date_measured,
          NEW.user_smoking,
          NEW.smoking,
          NEW.smoking_date_measured,
          NEW.has_antiepileptica,
          NEW.has_ca_blocker,
          NEW.has_incont_med,
          NEW.prediction_result,
		  NEW.user_values_updated,
          NEW.row_created,
          NEW.row_updated
        );

CREATE TRIGGER patient_measurement_history_update
  AFTER UPDATE ON patient_measurement
      FOR EACH ROW
        INSERT INTO patient_measurement_history
        VALUES (
          NULL,
          NULL,
          1,
          OLD.id,
          OLD.patient_id,
          OLD.date_retrieved,
          OLD.user_education_hml,
          OLD.education_hml,
          OLD.user_height_cm,
          OLD.height_cm,
          OLD.height_date_measured,
          OLD.user_weight_kg,
          OLD.weight_kg,
          OLD.weight_date_measured,
          OLD.BMI,
          OLD.BMI_date_measured,
          OLD.user_GDS_score,
          OLD.GDS_score,
          OLD.GDS_date_measured,
          OLD.user_grip_kg,
          OLD.grip_kg,
          OLD.grip_date_measured,
          OLD.user_walking_speed_m_per_s,
          OLD.walking_speed_m_per_s,
          OLD.walking_date_measured,
          OLD.user_systolic_bp_mmHg,
          OLD.systolic_bp_mmHg,
          OLD.diastolic_bp_mmHg,
          OLD.bp_date_measured,
          OLD.user_number_of_limitations,
          OLD.number_of_limitations,
          OLD.functional_limit_date_measured,
          OLD.user_fear0,
          OLD.user_fear1,
          OLD.user_fear2,
          OLD.fear0,
          OLD.fear1,
          OLD.fear2,
          OLD.fear_of_falls_date_measured,
          OLD.user_nr_falls_12m,
          OLD.nr_falls_12m,
          OLD.nr_falls_date_measured,
          OLD.user_smoking,
          OLD.smoking,
          OLD.smoking_date_measured,
          OLD.has_antiepileptica,
          OLD.has_ca_blocker,
          OLD.has_incont_med,
          OLD.prediction_result,
		  OLD.user_values_updated,
          OLD.row_created,
          OLD.row_updated
        );

CREATE TRIGGER patient_measurement_history_delete
  AFTER DELETE ON patient_measurement
      FOR EACH ROW
        INSERT INTO patient_measurement_history
        VALUES (
          NULL,
          NULL,
          2,
          OLD.id,
          OLD.patient_id,
          OLD.date_retrieved,
          OLD.user_education_hml,
          OLD.education_hml,
          OLD.user_height_cm,
          OLD.height_cm,
          OLD.height_date_measured,
          OLD.user_weight_kg,
          OLD.weight_kg,
          OLD.weight_date_measured,
          OLD.BMI,
          OLD.BMI_date_measured,
          OLD.user_GDS_score,
          OLD.GDS_score,
          OLD.GDS_date_measured,
          OLD.user_grip_kg,
          OLD.grip_kg,
          OLD.grip_date_measured,
          OLD.user_walking_speed_m_per_s,
          OLD.walking_speed_m_per_s,
          OLD.walking_date_measured,
          OLD.user_systolic_bp_mmHg,
          OLD.systolic_bp_mmHg,
          OLD.diastolic_bp_mmHg,
          OLD.bp_date_measured,
          OLD.user_number_of_limitations,
          OLD.number_of_limitations,
          OLD.functional_limit_date_measured,
          OLD.user_fear0,
          OLD.user_fear1,
          OLD.user_fear2,
          OLD.fear0,
          OLD.fear1,
          OLD.fear2,
          OLD.fear_of_falls_date_measured,
          OLD.user_nr_falls_12m,
          OLD.nr_falls_12m,
          OLD.nr_falls_date_measured,
          OLD.user_smoking,
          OLD.smoking,
          OLD.smoking_date_measured,
          OLD.has_antiepileptica,
          OLD.has_ca_blocker,
          OLD.has_incont_med,
          OLD.prediction_result,
		  OLD.user_values_updated,
          OLD.row_created,
          OLD.row_updated
        );

--
-- creating patient medication table, log table, and triggers
--
CREATE TABLE `patient_medication` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` int unsigned NOT NULL,
  `date_retrieved` datetime DEFAULT NULL,
  `medication_name` varchar(100) DEFAULT NULL,
  `generic_name` varchar(100) DEFAULT NULL,
  `ATC_code` varchar(10) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `dose` varchar(100) DEFAULT NULL,
  `row_created` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `patient_id` (`patient_id`,`medication_name`),
  INDEX (`patient_id`, `ATC_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `patient_medication_history` (
  `log_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `log_row_created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `log_op` tinyint NOT NULL,
  `id` int unsigned NOT NULL,
  `patient_id` int unsigned NOT NULL,
  `date_retrieved` datetime DEFAULT NULL,
  `medication_name` varchar(100) DEFAULT NULL,
  `generic_name` varchar(100) DEFAULT NULL,
  `ATC_code` varchar(10) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `dose` varchar(100) DEFAULT NULL,
  `row_created` timestamp NULL,
  PRIMARY KEY (`log_id`),
  INDEX (log_row_created),
  INDEX (id),
  INDEX (patient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TRIGGER patient_medication_history_insert
  AFTER INSERT ON patient_medication
      FOR EACH ROW
        INSERT INTO patient_medication_history
        VALUES (
          NULL,
          NULL,
          0,
          NEW.id,
          NEW.patient_id,
          NEW.date_retrieved,
          NEW.medication_name,
          NEW.generic_name,
          NEW.ATC_code,
          NEW.start_date,
          NEW.dose,
          NEW.row_created
        );

CREATE TRIGGER patient_medication_history_update
  AFTER UPDATE ON patient_medication
      FOR EACH ROW
        INSERT INTO patient_medication_history
        VALUES (
          NULL,
          NULL,
          1,
          OLD.id,
          OLD.patient_id,
          OLD.date_retrieved,
          OLD.medication_name,
          OLD.generic_name,
          OLD.ATC_code,
          OLD.start_date,
          OLD.dose,
          OLD.row_created
        );

CREATE TRIGGER patient_medication_history_delete
  AFTER DELETE ON patient_medication
      FOR EACH ROW
        INSERT INTO patient_medication_history
        VALUES (
          NULL,
          NULL,
          2,
          OLD.id,
          OLD.patient_id,
          OLD.date_retrieved,
          OLD.medication_name,
          OLD.generic_name,
          OLD.ATC_code,
          OLD.start_date,
          OLD.dose,
          OLD.row_created
        );

--
-- creating patient_problem table, log table, and triggers
--
CREATE TABLE `patient_problem` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` int unsigned NOT NULL,
  `date_retrieved` datetime DEFAULT NULL,
  `problem_id` smallint unsigned DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `display_name` varchar(200) DEFAULT NULL,
  `row_created` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `patient_id` (`patient_id`,`date_retrieved`,`problem_id`),
  INDEX (`patient_id`, `id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `patient_problem_history` (
  `log_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `log_row_created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `log_op` tinyint NOT NULL,
  `id` int unsigned NOT NULL,
  `patient_id` int unsigned NOT NULL,
  `date_retrieved` datetime DEFAULT NULL,
  `problem_id` smallint unsigned DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `display_name` varchar(200) DEFAULT NULL,
  `row_created` timestamp NOT NULL,
  PRIMARY KEY (`log_id`),
  INDEX (log_row_created),
  INDEX (id),
  INDEX (patient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TRIGGER patient_problem_history_insert
  AFTER INSERT ON patient_problem
      FOR EACH ROW
        INSERT INTO patient_problem_history
        VALUES (
          NULL,
          NULL,
          0,
          NEW.id,
          NEW.patient_id,
          NEW.date_retrieved,
          NEW.problem_id,
          NEW.start_date,
          NEW.name,
          NEW.display_name,
          NEW.row_created
        );

CREATE TRIGGER patient_problem_history_update
  AFTER UPDATE ON patient_problem
      FOR EACH ROW
        INSERT INTO patient_problem_history
        VALUES (
          NULL,
          NULL,
          1,
          OLD.id,
          OLD.patient_id,
          OLD.date_retrieved,
          OLD.problem_id,
          OLD.start_date,
          OLD.name,
          OLD.display_name,
          OLD.row_created
        );

CREATE TRIGGER patient_problem_history_delete
  AFTER DELETE ON patient_problem
      FOR EACH ROW
        INSERT INTO patient_problem_history
        VALUES (
          NULL,
          NULL,
          2,
          OLD.id,
          OLD.patient_id,
          OLD.date_retrieved,
          OLD.problem_id,
          OLD.start_date,
          OLD.name,
          OLD.display_name,
          OLD.row_created
        );

--
-- create patient_advice_selection table, log table, and triggers
--
CREATE TABLE patient_advice_selection (
  id int unsigned NOT NULL AUTO_INCREMENT,
  viewer_id int unsigned NOT NULL,
  patient_id int unsigned NOT NULL,
  ATC_code varchar(10) NOT NULL,
  medication_criteria_id varchar(8) NOT NULL,
  select_box_num smallint unsigned NOT NULL,
  selected tinyint(1) NOT NULL,
  row_created timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY (patient_id, ATC_code, medication_criteria_id, select_box_num)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE patient_advice_selection_history (
  log_id bigint unsigned NOT NULL AUTO_INCREMENT,
  log_row_created timestamp DEFAULT CURRENT_TIMESTAMP,
  log_op tinyint NOT NULL,
  id int unsigned NOT NULL,
  viewer_id int unsigned NOT NULL,
  patient_id int unsigned NOT NULL,
  ATC_code varchar(10) NOT NULL,
  medication_criteria_id varchar(8) NOT NULL,
  select_box_num smallint unsigned NOT NULL,
  selected tinyint(1) NOT NULL,
  row_created timestamp NOT NULL,
  PRIMARY KEY (log_id),
  INDEX (log_row_created),
  INDEX (id),
  INDEX (patient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TRIGGER patient_advice_selection_history_insert
  AFTER INSERT ON patient_advice_selection
      FOR EACH ROW
        INSERT INTO patient_advice_selection_history
        VALUES (
          NULL,
          NULL,
          0,
          NEW.id,
          NEW.viewer_id,
          NEW.patient_id,
          NEW.ATC_code,
          NEW.medication_criteria_id,
          NEW.select_box_num,
          NEW.selected,
          NEW.row_created
        );

DELIMITER PLEASE
CREATE TRIGGER patient_advice_selection_history_update
  AFTER UPDATE ON patient_advice_selection
    FOR EACH ROW
      IF OLD.selected != NEW.selected THEN
        INSERT INTO patient_advice_selection_history
        VALUES (
          NULL,
          NULL,
          1,
          OLD.id,
          OLD.viewer_id,
          OLD.patient_id,
          OLD.ATC_code,
          OLD.medication_criteria_id,
          OLD.select_box_num,
          OLD.selected,
          OLD.row_created
        );
      END IF;
    PLEASE
DELIMITER ;

CREATE TRIGGER patient_advice_selection_history_delete
  AFTER DELETE ON patient_advice_selection
      FOR EACH ROW
        INSERT INTO patient_advice_selection_history
        VALUES (
          NULL,
          NULL,
          2,
          OLD.id,
          OLD.viewer_id,
          OLD.patient_id,
          OLD.ATC_code,
          OLD.medication_criteria_id,
          OLD.select_box_num,
          OLD.selected,
          OLD.row_created
        );

--
-- creating patient_advice_freetext, log table, and triggers
--
CREATE TABLE patient_advice_freetext (
  id int unsigned NOT NULL AUTO_INCREMENT,
  viewer_id int unsigned NOT NULL,
  patient_id int unsigned NOT NULL,
  ATC_code varchar(10) NOT NULL,
  medication_criteria_id varchar(8) NOT NULL,
  select_box_num smallint unsigned NOT NULL,
  freetext_num smallint unsigned NOT NULL,
  freetext varchar(1000) NOT NULL,
  row_created timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY (patient_id, ATC_code, medication_criteria_id, select_box_num, freetext_num)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE patient_advice_freetext_history (
  log_id bigint unsigned NOT NULL AUTO_INCREMENT,
  log_row_created timestamp DEFAULT CURRENT_TIMESTAMP,
  log_op tinyint NOT NULL,
  id int unsigned NOT NULL,
  viewer_id int unsigned NOT NULL,
  patient_id int unsigned NOT NULL,
  ATC_code varchar(10) NOT NULL,
  medication_criteria_id varchar(8) NOT NULL,
  select_box_num smallint unsigned NOT NULL,
  freetext_num smallint unsigned NOT NULL,
  freetext varchar(1000) NOT NULL,
  row_created timestamp NOT NULL,
  PRIMARY KEY (log_id),
  INDEX (log_row_created),
  INDEX (id),
  INDEX (patient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TRIGGER patient_advice_freetext_history_insert
  AFTER INSERT ON patient_advice_freetext
      FOR EACH ROW
        INSERT INTO patient_advice_freetext_history
        VALUES (
          NULL,
          NULL,
          0,
          NEW.id,
          NEW.viewer_id,
          NEW.patient_id,
          NEW.ATC_code,
          NEW.medication_criteria_id,
          NEW.select_box_num,
          NEW.freetext_num,
          NEW.freetext,
          NEW.row_created
        );

DELIMITER PLEASE
CREATE TRIGGER patient_advice_freetext_history_update
  AFTER UPDATE ON patient_advice_freetext
    FOR EACH ROW
      IF OLD.freetext != NEW.freetext THEN
        INSERT INTO patient_advice_freetext_history
        VALUES (
          NULL,
          NULL,
          1,
          OLD.id,
          OLD.viewer_id,
          OLD.patient_id,
          OLD.ATC_code,
          OLD.medication_criteria_id,
          OLD.select_box_num,
          OLD.freetext_num,
          OLD.freetext,
          OLD.row_created
        );
      END IF;
    PLEASE
DELIMITER ;

CREATE TRIGGER patient_advice_freetext_history_delete
  AFTER DELETE ON patient_advice_freetext
      FOR EACH ROW
        INSERT INTO patient_advice_freetext_history
        VALUES (
          NULL,
          NULL,
          2,
          OLD.id,
          OLD.viewer_id,
          OLD.patient_id,
          OLD.ATC_code,
          OLD.medication_criteria_id,
          OLD.select_box_num,
          OLD.freetext_num,
          OLD.freetext,
          OLD.row_created
        );

--
-- no `row_updated` because it is append-only
--
CREATE TABLE `logged_events` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `viewer_id` int unsigned NOT NULL,
  `patient_id` int unsigned NOT NULL,
  `event_type` int unsigned NOT NULL,
  `row_created` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- END of patient table creation.
--
