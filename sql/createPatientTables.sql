-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
-- Note that collation gives a warning. Not sure why this collation is used but we should probably use a different one.

CREATE TABLE `patient` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `display_name` varchar(100) DEFAULT NULL,
  `login_token` varchar(100) NOT NULL,
  `birth_date` date,
  `education_level` varchar(100) ,
  `age` int unsigned,
  `is_fake` tinyint,
  `is_final` tinyint(1),
  `row_created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `row_updated` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login_token` (`login_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `patient_measurement` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` int unsigned NOT NULL,
  `date_retrieved` datetime DEFAULT NULL,
  `user_education_hml` smallint unsigned DEFAULT NULL,
  `education_hml` smallint unsigned DEFAULT NULL,
  `user_height_cm` decimal(5,2)DEFAULT NULL,
  `height_cm` decimal(5,2)DEFAULT NULL,
  `height_date_measured` datetime DEFAULT NULL,
  `user_weight_kg` decimal(5,2)DEFAULT NULL,
  `weight_kg` decimal(5,2)DEFAULT NULL,
  `weight_date_measured` datetime DEFAULT NULL,
  `BMI` decimal(5,2) DEFAULT NULL,
  `BMI_date_measured` datetime DEFAULT NULL,
  `user_GDS_score` int unsigned DEFAULT NULL,
  `GDS_score` int unsigned DEFAULT NULL,
  `GDS_date_measured` datetime DEFAULT NULL,
  `user_grip_kg` decimal(5,2)DEFAULT NULL,
  `grip_kg` decimal(5,2)DEFAULT NULL,
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
  `row_created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `row_updated` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `patient_id` (`patient_id`,`date_retrieved`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `patient_medication` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` int unsigned NOT NULL,
  `date_retrieved` datetime DEFAULT NULL,
  `medication_name` varchar(100) DEFAULT NULL,
  `generic_name` varchar(100) DEFAULT NULL,
  `ATC_code` varchar(100) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `dose` varchar(100) DEFAULT NULL,
  `row_created` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `patient_id` (`patient_id`,`date_retrieved`,`medication_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `patient_problem` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` int unsigned NOT NULL,
  `date_retrieved` datetime DEFAULT NULL,
  `problem_id` smallint unsigned NOT NULL,
  `start_date` datetime DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `display_name` varchar(200) DEFAULT NULL,
  `row_created` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `patient_id` (`patient_id`,`date_retrieved`,`problem_id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE patient_advice_selection (
  id int unsigned NOT NULL AUTO_INCREMENT,
  viewer_id int unsigned NOT NULL,
  patient_id int unsigned NOT NULL,
  ATC_code varchar(100) NOT NULL,
  medication_criteria_id varchar(8) NOT NULL,
  select_box_num smallint unsigned NOT NULL,
  selected tinyint(1) NOT NULL,
  row_created timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY (patient_id, ATC_code, medication_criteria_id, select_box_num)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
