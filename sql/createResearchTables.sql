-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw/* These tables should ideally live in another database entirely,   but since that database doesn't exist yet, we'll start by making   the tables locally so we can start building the export.   The research data should be extracted to these tables 1x per day or so.   We can either extract the initial checkboxes only the first time that a   patient is extracted; to do this we need to read from the target DB.   We will want to extract the current state of the checkboxes as the   last_checkboxes (thus even if a patient isn't finalized) so these values   could change and should be updatable.   Once a patient is finalized (sent to portal = true) the data shouldn't    change any more so there's no real need to keep extracting them.   My aesthetic sense is that the smart way to do this is to run a cron job   that extracts the data at a fixed time every day.*/

CREATE TABLE `research_patient` (
  `research_patient_id` int unsigned NOT NULL AUTO_INCREMENT,  `location_id` int unsigned NOT NULL,  `participant_number` int unsigned NOT NULL,  `was_printed` tinyint(1) NOT NULL,  `time_printed` datetime DEFAULT NULL,  `was_copied` tinyint(1) NOT NULL,
  `time_copied` datetime DEFAULT NULL,  `ehr_text_was_copied` tinyint(1) NOT NULL,
  `time_ehr_text_copied` datetime DEFAULT NULL,
  `was_sent_to_portal` tinyint(1) NOT NULL,  `time_sent_to_portal` datetime DEFAULT NULL,
   PRIMARY KEY (`research_patient_id`)
--    , UNIQUE KEY `participant`(location_id,participant_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `research_initial_checkboxes` (
  `row_id` int unsigned NOT NULL AUTO_INCREMENT,  `location_id` int unsigned NOT NULL,  `participant_number` int unsigned NOT NULL,
  `initial_user_hash` char(56) NOT NULL,
  `initial_ATC_code` varchar(10) NOT NULL,
  `initial_medication_criteria_id` varchar(8) NOT NULL,
  `initial_select_box_num` smallint unsigned NOT NULL,
  `initial_selected` tinyint(1) NOT NULL,
  `initial_row_created` datetime DEFAULT NULL,   PRIMARY KEY (`row_id`)-- ,   UNIQUE KEY `participant-box`(location_id,participant_number,initial_ATC_code,initial_medication_criteria_id,initial_select_box_num)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;CREATE TABLE `research_last_checkboxes` (
  `row_id` int unsigned NOT NULL AUTO_INCREMENT,
  `location_id` int unsigned NOT NULL,
  `participant_number` int unsigned NOT NULL,
  `last_user_hash` char(56) NOT NULL,
  `last_ATC_code` varchar(10) NOT NULL,
  `last_medication_criteria_id` varchar(8) NOT NULL,
  `last_select_box_num` smallint unsigned NOT NULL,
  `last_selected` tinyint(1) NOT NULL,  `last_has_freetext` tinyint(1) NOT NULL,
  `last_row_created` datetime DEFAULT NULL,
   PRIMARY KEY (`row_id`)-- ,   UNIQUE KEY `participant-box`(location_id,participant_number,last_ATC_code,last_medication_criteria_id,last_select_box_num)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;