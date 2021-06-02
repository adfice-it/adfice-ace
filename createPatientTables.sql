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
  PRIMARY KEY (`id`),
  UNIQUE KEY `login_token` (`login_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `patient_labs` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` int unsigned DEFAULT NULL,
  `date_retrieved` datetime DEFAULT NULL,
  `date_measured` datetime DEFAULT NULL,
  `lab_test_name` varchar(100) DEFAULT NULL,
  `lab_test_code` varchar(15) DEFAULT NULL,
  `lab_test_result` varchar(100) DEFAULT NULL,
  `lab_test_units` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `patient_measurements` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` int unsigned NOT NULL,
  `date_retrieved` datetime DEFAULT NULL,
  `height_cm` decimal(5,2)DEFAULT NULL,
  `height_date_measured` datetime DEFAULT NULL,
  `weight_kg` decimal(5,2)DEFAULT NULL,
  `weight_date_measured` datetime DEFAULT NULL,
  `BMI` decimal(5,2) DEFAULT NULL,
  `BMI_date_measured` datetime DEFAULT NULL,
  `GDS_score` int unsigned DEFAULT NULL,
  `GDS_date_measured` datetime DEFAULT NULL,
  `grip_kg` decimal(5,2)DEFAULT NULL,
  `grip_date_measured` datetime DEFAULT NULL,
  `walking_speed_m_per_s` decimal(5,3) DEFAULT NULL,
  `walking_date_measured` datetime DEFAULT NULL,
  `systolic_bp_mmHg` int unsigned DEFAULT NULL,
  `diastolic_bp_mmHg` int unsigned DEFAULT NULL,
  `bp_date_measured` datetime DEFAULT NULL,
  `functional_limit_trap` varchar(100) DEFAULT NULL,
  `functional_limit_kleding` varchar(100) DEFAULT NULL,
  `functional_limit_stoel` varchar(100) DEFAULT NULL,
  `functional_limit_nagels` varchar(100) DEFAULT NULL,
  `functional_limit_lopen` varchar(100) DEFAULT NULL,
  `functional_limit_date_measured` datetime DEFAULT NULL,
  `FES_kleding` varchar(100) DEFAULT NULL,
  `FES_bad` varchar(100) DEFAULT NULL,
  `FES_stoel` varchar(100) DEFAULT NULL,
  `FES_trap` varchar(100) DEFAULT NULL,
  `FES_reiken` varchar(100) DEFAULT NULL,
  `FES_helling` varchar(100) DEFAULT NULL,
  `FES_sociale` varchar(100) DEFAULT NULL,
  `fear_of_falls_date_measured` datetime DEFAULT NULL,
  `nr_falls_12m` int unsigned DEFAULT NULL,
  `nr_falls_date_measured` datetime DEFAULT NULL,
  `smoking` tinyint DEFAULT NULL,
  `smoking_date_measured` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `patient_id` (`patient_id`,`date_retrieved`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `patient_medications` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` int unsigned NOT NULL,
  `date_retrieved` datetime DEFAULT NULL,
  `medication_name` varchar(100) DEFAULT NULL,
  `generic_name` varchar(100) DEFAULT NULL,
  `ATC_code` varchar(100) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `dose` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `patient_id` (`patient_id`,`date_retrieved`,`medication_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `patient_problems` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` int unsigned NOT NULL,
  `date_retrieved` datetime DEFAULT NULL,
  `problem_id` smallint unsigned NOT NULL,
  `start_date` datetime DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `patient_id` (`patient_id`,`date_retrieved`,`problem_id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `problems` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `problem_name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `education_levels` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `coded_level` tinyint NOT NULL DEFAULT '0',
  `level` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `coded_level` (`coded_level`,`level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `problem_map` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `amc_icd_id` int unsigned,
  `adfice_nr` smallint unsigned,
  `problem_name` varchar(100),
  `icd_10` varchar(10),
  `icd_name` varchar(256),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
