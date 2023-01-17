-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw

/* These tables exist only for research purposes, and contain the data that
   will be used in the analysis. They will be populated by a script that is 
   run by hand.

   We can either extract the initial checkboxes only the first time that a
   patient is extracted. These values should not change after the initial extract.
   We will want to extract the current state of the checkboxes as the
   last_checkboxes (thus even if a patient isn't finalized) so these values
   could change and should be updatable.
   Once a patient is finalized (sent to portal = true) the data shouldn't 
   change any more.
*/

CREATE TABLE `research_patient` (
  `research_patient_id` int unsigned NOT NULL AUTO_INCREMENT,
  `location_id` int unsigned NOT NULL,
  `participant_number` varchar(50) DEFAULT NULL,
  `was_printed` tinyint(1) NOT NULL,
  `time_printed` datetime DEFAULT NULL,
  `was_copied` tinyint(1) NOT NULL,
  `time_copied` datetime DEFAULT NULL,
  `ehr_text_was_copied` tinyint(1) NOT NULL,
  `time_ehr_text_copied` datetime DEFAULT NULL,
  `was_sent_to_portal` tinyint(1) NOT NULL,
  `time_sent_to_portal` datetime DEFAULT NULL,
   PRIMARY KEY (`research_patient_id`), 
   UNIQUE KEY `participant`(location_id,participant_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `research_initial_rules_fired` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `location_id` int unsigned NOT NULL,
  `participant_number` varchar(50) DEFAULT NULL,
  `initial_ATC_code` varchar(10) DEFAULT NULL,
  `initial_rules_fired` varchar(100) DEFAULT NULL,
  `initial_row_created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `research_last_rules_fired` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `location_id` int unsigned NOT NULL,
  `participant_number` varchar(50) DEFAULT NULL,
  `last_ATC_code` varchar(10) DEFAULT NULL,
  `last_rules_fired` varchar(100) DEFAULT NULL,
  `last_row_created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `research_initial_checkboxes` (
  `row_id` int unsigned NOT NULL AUTO_INCREMENT,
  `location_id` int unsigned NOT NULL,
  `participant_number` varchar(50) DEFAULT NULL,
  `initial_user_hash` char(56) NOT NULL,
  `initial_ATC_code` varchar(10) NOT NULL,
  `initial_medication_criteria_id` varchar(8) NOT NULL,
  `initial_select_box_num` smallint unsigned NOT NULL,
  `initial_selected` tinyint(1) NOT NULL,
  `initial_row_created` datetime DEFAULT NULL,
   PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `research_last_checkboxes` (
  `row_id` int unsigned NOT NULL AUTO_INCREMENT,
  `location_id` int unsigned NOT NULL,
  `participant_number` varchar(50) DEFAULT NULL,
  `last_user_hash` char(56) NOT NULL,
  `last_ATC_code` varchar(10) NOT NULL,
  `last_medication_criteria_id` varchar(8) NOT NULL,
  `last_select_box_num` smallint unsigned NOT NULL,
  `last_selected` tinyint(1) NOT NULL,
  `last_has_freetext` tinyint(1) NOT NULL,
  `last_row_created` datetime DEFAULT NULL,
   PRIMARY KEY (`row_id`),   
   UNIQUE KEY `participant-box`(location_id,participant_number,last_ATC_code,last_medication_criteria_id,last_select_box_num)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `research_initial_patient_measurement` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `location_id` int unsigned NOT NULL,
  `participant_number` varchar(50) DEFAULT NULL,
  `initial_date_retrieved` datetime DEFAULT NULL,
  `initial_education_hml` smallint unsigned DEFAULT NULL,
  `initial_height_cm` decimal(5,2) DEFAULT NULL,
  `initial_height_date_measured` datetime DEFAULT NULL,
  `initial_weight_kg` decimal(5,2) DEFAULT NULL,
  `initial_weight_date_measured` datetime DEFAULT NULL,
  `initial_BMI` decimal(5,2) DEFAULT NULL,
  `initial_BMI_date_measured` datetime DEFAULT NULL,
  `initial_GDS_score` int unsigned DEFAULT NULL,
  `initial_GDS_date_measured` datetime DEFAULT NULL,
  `initial_grip_kg` decimal(5,2) DEFAULT NULL,
  `initial_grip_date_measured` datetime DEFAULT NULL,
  `initial_walking_speed_m_per_s` decimal(5,3) DEFAULT NULL,
  `initial_walking_date_measured` datetime DEFAULT NULL,
  `initial_systolic_bp_mmHg` int unsigned DEFAULT NULL,
  `initial_diastolic_bp_mmHg` int unsigned DEFAULT NULL,
  `initial_bp_date_measured` datetime DEFAULT NULL,
  `initial_number_of_limitations` smallint unsigned DEFAULT NULL,
  `initial_functional_limit_date_measured` datetime DEFAULT NULL,
  `initial_fear0` tinyint DEFAULT NULL,
  `initial_fear1` tinyint DEFAULT NULL,
  `initial_fear2` tinyint DEFAULT NULL,
  `initial_fear_of_falls_date_measured` datetime DEFAULT NULL,
  `initial_nr_falls_12m` int unsigned DEFAULT NULL,
  `initial_nr_falls_date_measured` datetime DEFAULT NULL,
  `initial_smoking` tinyint DEFAULT NULL,
  `initial_smoking_date_measured` datetime DEFAULT NULL,
  `initial_has_antiepileptica` tinyint DEFAULT NULL,
  `initial_has_ca_blocker` tinyint DEFAULT NULL,
  `initial_has_incont_med` tinyint DEFAULT NULL,
  `initial_prediction_result` int unsigned DEFAULT NULL,
  `initial_row_created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`), 
  UNIQUE KEY `participant`(location_id,participant_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `research_last_patient_measurement` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `location_id` int unsigned NOT NULL,
  `participant_number` varchar(50) DEFAULT NULL,
  `last_date_retrieved` datetime DEFAULT NULL,
  `last_user_education_hml` smallint unsigned DEFAULT NULL,
  `last_education_hml` smallint unsigned DEFAULT NULL,
  `last_user_height_cm` decimal(5,2) DEFAULT NULL,
  `last_height_cm` decimal(5,2) DEFAULT NULL,
  `last_height_date_measured` datetime DEFAULT NULL,
  `last_user_weight_kg` decimal(5,2) DEFAULT NULL,
  `last_weight_kg` decimal(5,2) DEFAULT NULL,
  `last_weight_date_measured` datetime DEFAULT NULL,
  `last_BMI` decimal(5,2) DEFAULT NULL,
  `last_BMI_date_measured` datetime DEFAULT NULL,
  `last_user_GDS_score` int unsigned DEFAULT NULL,
  `last_GDS_score` int unsigned DEFAULT NULL,
  `last_GDS_date_measured` datetime DEFAULT NULL,
  `last_user_grip_kg` decimal(5,2) DEFAULT NULL,
  `last_grip_kg` decimal(5,2) DEFAULT NULL,
  `last_grip_date_measured` datetime DEFAULT NULL,
  `last_user_walking_speed_m_per_s` decimal(5,3) DEFAULT NULL,
  `last_walking_speed_m_per_s` decimal(5,3) DEFAULT NULL,
  `last_walking_date_measured` datetime DEFAULT NULL,
  `last_user_systolic_bp_mmHg` int unsigned DEFAULT NULL,
  `last_systolic_bp_mmHg` int unsigned DEFAULT NULL,
  `last_diastolic_bp_mmHg` int unsigned DEFAULT NULL,
  `last_bp_date_measured` datetime DEFAULT NULL,
  `last_user_number_of_limitations` smallint unsigned DEFAULT NULL,
  `last_number_of_limitations` smallint unsigned DEFAULT NULL,
  `last_functional_limit_date_measured` datetime DEFAULT NULL,
  `last_user_fear0` tinyint DEFAULT NULL,
  `last_user_fear1` tinyint DEFAULT NULL,
  `last_user_fear2` tinyint DEFAULT NULL,
  `last_fear0` tinyint DEFAULT NULL,
  `last_fear1` tinyint DEFAULT NULL,
  `last_fear2` tinyint DEFAULT NULL,
  `last_fear_of_falls_date_measured` datetime DEFAULT NULL,
  `last_user_nr_falls_12m` int unsigned DEFAULT NULL,
  `last_nr_falls_12m` int unsigned DEFAULT NULL,
  `last_nr_falls_date_measured` datetime DEFAULT NULL,
  `last_user_smoking` tinyint DEFAULT NULL,
  `last_smoking` tinyint DEFAULT NULL,
  `last_smoking_date_measured` datetime DEFAULT NULL,
  `last_has_antiepileptica` tinyint DEFAULT NULL,
  `last_has_ca_blocker` tinyint DEFAULT NULL,
  `last_has_incont_med` tinyint DEFAULT NULL,
  `last_prediction_result` int unsigned DEFAULT NULL,
  `last_user_values_updated` datetime DEFAULT NULL,
  `last_row_created` datetime DEFAULT NULL,
  `last_row_updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`), 
  UNIQUE KEY `participant`(location_id,participant_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
