-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw

CREATE TABLE `research_patient` (
  `research_patient_id` int unsigned NOT NULL AUTO_INCREMENT,
  `time_copied` datetime DEFAULT NULL,
  `time_ehr_text_copied` datetime DEFAULT NULL,
  `was_sent_to_portal` tinyint(1) NOT NULL,
   PRIMARY KEY (`research_patient_id`)
--    , UNIQUE KEY `participant`(location_id,participant_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `research_initial_checkboxes` (
  `row_id` int unsigned NOT NULL AUTO_INCREMENT,
  `initial_user_hash` char(56) NOT NULL,
  `initial_ATC_code` varchar(10) NOT NULL,
  `initial_medication_criteria_id` varchar(8) NOT NULL,
  `initial_select_box_num` smallint unsigned NOT NULL,
  `initial_selected` tinyint(1) NOT NULL,
  `initial_row_created` datetime DEFAULT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `row_id` int unsigned NOT NULL AUTO_INCREMENT,
  `location_id` int unsigned NOT NULL,
  `participant_number` int unsigned NOT NULL,
  `last_user_hash` char(56) NOT NULL,
  `last_ATC_code` varchar(10) NOT NULL,
  `last_medication_criteria_id` varchar(8) NOT NULL,
  `last_select_box_num` smallint unsigned NOT NULL,
  `last_selected` tinyint(1) NOT NULL,
  `last_row_created` datetime DEFAULT NULL,
   PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;