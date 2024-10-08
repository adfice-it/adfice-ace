-- SPDX-License-Identifier: GPL-3.0-or-later

-- Copyright (C) 2021-2024 Stichting Open Electronics Lab

/*
This SQL file should *not* be run with the others.

The bash script should be something like:
USER=XXX
PASS=XXX
LOCATION=XXX
mysqldump --opt --user=${USER} --password=${PASS} adfice research_patient research_initial_rules_fired research_last_rules_fired research_initial_checkboxes research_last_checkboxes research_initial_patient_measurement research_last_patient_measurement > $(date "+%b_%d_%Y_%H_%M_%S")adfice_${LOCATION}.sql
*/

drop table if exists research_map;

truncate table research_patient;
truncate table research_initial_rules_fired;
truncate table research_last_rules_fired;
truncate table research_initial_checkboxes;
truncate table research_last_checkboxes;
truncate table research_last_patient_measurement;

CREATE TABLE research_map
SELECT participant_number, patient.patient_id, mrn, patient.id as patient_pk
FROM patient join etl_mrn_patient on patient.patient_id=etl_mrn_patient.patient_id;

-- we don't have the most consistent naming scheme...
DELETE FROM research_map where mrn like 'Dummy%' or mrn like 'sir%' or mrn = 'mrn0279429439' or mrn = 'mrn8849259164' or participant_number like 'TEST%';

SET @location_id = if(@location_id is null, 99, @location_id); -- choose 99 as location id for Standalone
SET @lookback = if(@lookback is null, '2022-08-01', @lookback); 
-- @lookback is used so we can extract data in batches (without duplication)
-- if @lookback is not set, default to 1st day of the trial at AMC

INSERT INTO research_patient (
     research_patient_id, 
     location_id,
     participant_number,
     was_printed,
     time_printed,
     was_copied,
     time_copied,
     ehr_text_was_copied,
     time_ehr_text_copied,
     was_sent_to_portal,
     was_renewed,
	 time_renewed
)
SELECT 
     null,
     @location_id, -- location_id; will be different for each location
     research_map.participant_number, 
     if(printed_pid is null,0,1) as was_printed,
     printed_rc, -- time_printed
     if(copied_pid is null,0,1) as was_copied,
     copied_rc, -- time_copied
     if(ehr_copy_pid is null,0,1) as ehr_text_was_copied,
     ehr_copy_rc, -- time_ehr_text_copied
     if(patient.is_final,1,0) as was_sent_to_portal,
	 if(renew_pid is null,0,1) as was_renewed,
     renew_rc -- time_copied
from research_map 
	join patient on research_map.patient_id = patient.patient_id
    left join (select patient_id as printed_pid, max(row_created) as printed_rc 
          from logged_events 
          where event_type = 1 group by patient_id) as printed 
          on research_map.patient_id = printed_pid
    left join (select patient_id as copied_pid, max(row_created) as copied_rc 
          from logged_events 
          where event_type = 2 group by patient_id) as copied 
          on research_map.patient_id = copied_pid
    left join (select patient_id as ehr_copy_pid, max(row_created) as ehr_copy_rc 
          from logged_events 
          where event_type = 3 group by patient_id) as ehr_copy 
          on research_map.patient_id = ehr_copy_pid
	left join (select patient_id as renew_pid, max(row_created) as renew_rc 
          from logged_events 
          where event_type = 4 group by patient_id) as renew 
          on research_map.patient_id = renew_pid
WHERE research_map.participant_number is not null and research_map.participant_number != '' and patient.row_updated >= @lookback;
-- I'm not sure why I had an "on duplicate key" here....
/* ON DUPLICATE KEY UPDATE 
     was_printed = if(printed_pid is null,0,1),
     time_printed = printed_rc,
     was_copied = if(copied_pid is null,0,1),
     time_copied = copied_rc,
     ehr_text_was_copied = if(ehr_copy_pid is null,0,1),
     time_ehr_text_copied = ehr_copy_rc,
     was_sent_to_portal = if(patient.is_final,1,0),
     time_sent_to_portal = (if(patient.is_final,patient.row_updated,null));
*/


INSERT INTO research_initial_rules_fired (
  id,
  location_id,
  participant_number,
  initial_ATC_code,
  initial_rules_fired,
  initial_row_created
)
SELECT 
     null,
     @location_id,
     participant_number,
     ATC_code,
     rules_fired,
     initial_rules.row_created
FROM research_map 
join (select rules_fired.* from rules_fired 
     join (select patient_id, min(row_created) as minRC 
          from rules_fired group by patient_id) as first_date 
     on rules_fired.patient_id = first_date.patient_id and rules_fired.row_created = first_date.minRC) as initial_rules
on research_map.patient_id = initial_rules.patient_id
WHERE initial_rules.row_created >= @lookback;

INSERT INTO research_last_rules_fired (
  id,
  location_id,
  participant_number,
  last_ATC_code,
  last_rules_fired,
  last_row_created
)
SELECT 
     null,
     @location_id,
     participant_number,
     ATC_code,
     rules_fired,
     last_rules.row_created
FROM research_map 
join (select rules_fired.* from rules_fired 
     join (select patient_id, max(row_created) as maxRC from rules_fired group by patient_id) as last_date 
     on rules_fired.patient_id = last_date.patient_id and rules_fired.row_created = last_date.maxRC) as last_rules
on research_map.patient_id = last_rules.patient_id
WHERE last_rules.row_created >= @lookback;

INSERT INTO research_initial_checkboxes (
  row_id,
  location_id,
  participant_number,
  initial_user_hash,
  initial_ATC_code,
  initial_medication_criteria_id,
  initial_select_box_num,
  initial_selected,
  initial_row_created
)
SELECT 
     null,
     @location_id, -- location_id; will be different for each location
     research_map.participant_number, 
     if(initial_checkboxes.doctor_id is null,0,sha2(initial_checkboxes.doctor_id,224)),
     initial_checkboxes.ATC_code,
     initial_checkboxes.medication_criteria_id,
     initial_checkboxes.select_box_num,
     initial_checkboxes.selected,
     initial_checkboxes.row_created
FROM research_map 
     join (select patient_advice_selection_history.* from patient_advice_selection_history 
          join (select patient_id, min(log_row_created) as minRC 
               from patient_advice_selection_history group by patient_id) as first_date 
          on patient_advice_selection_history.patient_id = first_date.patient_id 
          and patient_advice_selection_history.log_row_created = first_date.minRC
          ORDER BY patient_advice_selection_history.log_id) as initial_checkboxes
     on research_map.patient_id = initial_checkboxes.patient_id
WHERE initial_checkboxes.log_row_created >= @lookback;
-- no need to look for freetext; the initial state is machine-generated and does not have freetext.
-- in the history table row_created is the timestamp of the original creation, and row_updated has the timestamp of the latest change.
-- Checkbox 42b-2 is initially selected by more than one rule, so it has more than one entry with the same time stamp. We might actually want to know about this, so I have removed the unique-key constraint from this table.

UPDATE research_initial_checkboxes SET initial_user_hash = (SELECT sha2(ehr_user_id,224) from etl_user where etl_user.doctor_id = research_initial_checkboxes.initial_user_hash) where initial_user_hash != 0;

INSERT INTO research_last_checkboxes (
  `row_id`,
  `location_id`,
  `participant_number`,
  `last_user_hash`,
  `last_ATC_code`,
  `last_medication_criteria_id`,
  `last_select_box_num`,
  `last_selected`,
  `last_has_freetext`,
  `last_row_created`
)
SELECT
     null,
     @location_id, -- location_id; will be different for each location
     research_map.participant_number, 
     if(patient_advice_selection.doctor_id is null,0,sha2(patient_advice_selection.doctor_id,224)),
     patient_advice_selection.ATC_code,
     patient_advice_selection.medication_criteria_id,
     patient_advice_selection.select_box_num,
     patient_advice_selection.selected,
    if(patient_advice_freetext.freetext is null,0,1), -- was freetext box used
     patient_advice_selection.row_created
FROM research_map 
join patient_advice_selection on research_map.patient_id = patient_advice_selection.patient_id
left join patient_advice_freetext on 
     patient_advice_selection.patient_id = patient_advice_freetext.patient_id AND
     patient_advice_selection.ATC_code = patient_advice_freetext.ATC_code AND
     patient_advice_selection.medication_criteria_id = patient_advice_freetext.medication_criteria_id AND
     patient_advice_selection.select_box_num = patient_advice_freetext.select_box_num
WHERE patient_advice_selection.row_created >= @lookback;
-- This ought to have only the latest advice, so should not be any duplicates here.


CREATE TABLE IF NOT EXISTS `research_initial_patient_measurement_standalone` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `location_id` int unsigned NOT NULL,
  `participant_number` varchar(50) DEFAULT NULL,
  `initial_date_retrieved` datetime DEFAULT NULL,
  `initial_user_education_hml` smallint unsigned DEFAULT NULL,
  `initial_education_hml` smallint unsigned DEFAULT NULL,
  `initial_user_height_cm` decimal(5,2) DEFAULT NULL,
  `initial_height_cm` decimal(5,2) DEFAULT NULL,
  `initial_height_date_measured` datetime DEFAULT NULL,
  `initial_user_weight_kg` decimal(5,2) DEFAULT NULL,
  `initial_weight_kg` decimal(5,2) DEFAULT NULL,
  `initial_weight_date_measured` datetime DEFAULT NULL,
  `initial_BMI` decimal(5,2) DEFAULT NULL,
  `initial_BMI_date_measured` datetime DEFAULT NULL,
  `initial_user_GDS_score` int unsigned DEFAULT NULL,
  `initial_GDS_score` int unsigned DEFAULT NULL,
  `initial_GDS_date_measured` datetime DEFAULT NULL,
  `initial_user_grip_kg` decimal(5,2) DEFAULT NULL,
  `initial_grip_kg` decimal(5,2) DEFAULT NULL,
  `initial_grip_date_measured` datetime DEFAULT NULL,
  `initial_user_walking_speed_m_per_s` decimal(5,3) DEFAULT NULL,
  `initial_walking_speed_m_per_s` decimal(5,3) DEFAULT NULL,
  `initial_walking_date_measured` datetime DEFAULT NULL,
  `initial_user_systolic_bp_mmHg` int unsigned DEFAULT NULL,
  `initial_systolic_bp_mmHg` int unsigned DEFAULT NULL,
  `initial_diastolic_bp_mmHg` int unsigned DEFAULT NULL,
  `initial_bp_date_measured` datetime DEFAULT NULL,
  `initial_user_number_of_limitations` smallint unsigned DEFAULT NULL,
  `initial_number_of_limitations` smallint unsigned DEFAULT NULL,
  `initial_functional_limit_date_measured` datetime DEFAULT NULL,
  `initial_user_fear0` tinyint DEFAULT NULL,
  `initial_user_fear1` tinyint DEFAULT NULL,
  `initial_user_fear2` tinyint DEFAULT NULL,
  `initial_fear0` tinyint DEFAULT NULL,
  `initial_fear1` tinyint DEFAULT NULL,
  `initial_fear2` tinyint DEFAULT NULL,
  `initial_fear_of_falls_date_measured` datetime DEFAULT NULL,
  `initial_user_nr_falls_12m` int unsigned DEFAULT NULL,
  `initial_nr_falls_12m` int unsigned DEFAULT NULL,
  `initial_nr_falls_date_measured` datetime DEFAULT NULL,
  `initial_user_smoking` tinyint DEFAULT NULL,
  `initial_smoking` tinyint DEFAULT NULL,
  `initial_smoking_date_measured` datetime DEFAULT NULL,
  `initial_has_antiepileptica` tinyint DEFAULT NULL,
  `initial_has_ca_blocker` tinyint DEFAULT NULL,
  `initial_has_incont_med` tinyint DEFAULT NULL,
  `initial_prediction_result` int unsigned DEFAULT NULL,
  `initial_user_values_updated` datetime DEFAULT NULL,
  `initial_row_updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`), 
  UNIQUE KEY `participant`(location_id,participant_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

truncate table research_initial_patient_measurement_standalone; -- put this here so it doesn't throw an error on the first run

INSERT INTO research_initial_patient_measurement_standalone (
  id,
  location_id,
  participant_number,
  initial_date_retrieved,
  initial_user_education_hml,
  initial_education_hml,
  initial_user_height_cm,
  initial_height_cm,
  initial_height_date_measured,
  initial_user_weight_kg,
  initial_weight_kg,
  initial_weight_date_measured,
  initial_BMI,
  initial_BMI_date_measured,
  initial_user_GDS_score,
  initial_GDS_score,
  initial_GDS_date_measured,
  initial_user_grip_kg,
  initial_grip_kg,
  initial_grip_date_measured,
  initial_user_walking_speed_m_per_s,
  initial_walking_speed_m_per_s,
  initial_walking_date_measured,
  initial_user_systolic_bp_mmHg,
  initial_systolic_bp_mmHg,
  initial_diastolic_bp_mmHg,
  initial_bp_date_measured,
  initial_user_number_of_limitations,
  initial_number_of_limitations,
  initial_functional_limit_date_measured,
  initial_user_fear0,
  initial_user_fear1,
  initial_user_fear2,
  initial_fear0,
  initial_fear1,
  initial_fear2,
  initial_fear_of_falls_date_measured,
  initial_user_nr_falls_12m,
  initial_nr_falls_12m,
  initial_nr_falls_date_measured,
  initial_user_smoking,
  initial_smoking,
  initial_smoking_date_measured,
  initial_has_antiepileptica,
  initial_has_ca_blocker,
  initial_has_incont_med,
  initial_prediction_result,
  initial_user_values_updated,
  initial_row_updated
)
SELECT
  null,
  @location_id,
  participant_number,
  date_retrieved,
  user_education_hml,
  education_hml,
  user_height_cm,
  height_cm,
  height_date_measured,
  user_weight_kg,
  weight_kg,
  weight_date_measured,
  BMI,
  BMI_date_measured,
  user_GDS_score,
  GDS_score,
  GDS_date_measured,
  user_grip_kg,
  grip_kg,
  grip_date_measured,
  user_walking_speed_m_per_s,
  walking_speed_m_per_s,
  walking_date_measured,
  user_systolic_bp_mmHg,
  systolic_bp_mmHg,
  diastolic_bp_mmHg,
  bp_date_measured,
  user_number_of_limitations,
  number_of_limitations,
  functional_limit_date_measured,
  user_fear0,
  user_fear1,
  user_fear2,
  fear0,
  fear1,
  fear2,
  fear_of_falls_date_measured,
  user_nr_falls_12m,
  nr_falls_12m,
  nr_falls_date_measured,
  user_smoking,
  smoking,
  smoking_date_measured,
  has_antiepileptica,
  has_ca_blocker,
  has_incont_med,
  prediction_result,
  user_values_updated,
  initial_measurements.row_updated
FROM research_map 
left join (select patient_measurement_history.* from patient_measurement_history 
     join (select patient_id, min(row_updated) as minRU, min(log_id) as minLI
          from patient_measurement_history group by patient_id) as first_date 
     on patient_measurement_history.patient_id = first_date.patient_id and patient_measurement_history.row_updated = first_date.minRU and patient_measurement_history.log_id = minLI) as initial_measurements
on research_map.patient_id = initial_measurements.patient_id
WHERE initial_measurements.row_updated >= @lookback;
-- Use row-updated here - row_created in the history tables records the initial creation date of the row; row_updated has the timestamp of the latest change
-- We get duplicate entries in the test data, but I think this is because the patient is used in tests that occur in the same second as the data is created. I think this won't happen in real data. In any case, the order-by ought to ensure we get the initial state.

INSERT INTO research_last_patient_measurement (
  id,
  location_id,
  participant_number,
  last_date_retrieved,
  last_user_education_hml,
  last_education_hml,
  last_user_height_cm,
  last_height_cm,
  last_height_date_measured,
  last_user_weight_kg,
  last_weight_kg,
  last_weight_date_measured,
  last_BMI,
  last_BMI_date_measured,
  last_user_GDS_score,
  last_GDS_score,
  last_GDS_date_measured,
  last_user_grip_kg,
  last_grip_kg,
  last_grip_date_measured,
  last_user_walking_speed_m_per_s,
  last_walking_speed_m_per_s,
  last_walking_date_measured,
  last_user_systolic_bp_mmHg,
  last_systolic_bp_mmHg,
  last_diastolic_bp_mmHg,
  last_bp_date_measured,
  last_user_number_of_limitations,
  last_number_of_limitations,
  last_functional_limit_date_measured,
  last_user_fear0,
  last_user_fear1,
  last_user_fear2,
  last_fear0,
  last_fear1,
  last_fear2,
  last_fear_of_falls_date_measured,
  last_user_nr_falls_12m,
  last_nr_falls_12m,
  last_nr_falls_date_measured,
  last_user_smoking,
  last_smoking,
  last_smoking_date_measured,
  last_has_antiepileptica,
  last_has_ca_blocker,
  last_has_incont_med,
  last_prediction_result,
  last_user_values_updated,
  last_row_created,
  last_row_updated
)
SELECT
  null,
  @location_id,
  participant_number,
  date_retrieved,
  user_education_hml,
  education_hml,
  user_height_cm,
  height_cm,
  height_date_measured,
  user_weight_kg,
  weight_kg,
  weight_date_measured,
  BMI,
  BMI_date_measured,
  user_GDS_score,
  GDS_score,
  GDS_date_measured,
  user_grip_kg,
  grip_kg,
  grip_date_measured,
  user_walking_speed_m_per_s,
  walking_speed_m_per_s,
  walking_date_measured,
  user_systolic_bp_mmHg,
  systolic_bp_mmHg,
  diastolic_bp_mmHg,
  bp_date_measured,
  user_number_of_limitations,
  number_of_limitations,
  functional_limit_date_measured,
  user_fear0,
  user_fear1,
  user_fear2,
  fear0,
  fear1,
  fear2,
  fear_of_falls_date_measured,
  user_nr_falls_12m,
  nr_falls_12m,
  nr_falls_date_measured,
  user_smoking,
  smoking,
  smoking_date_measured,
  has_antiepileptica,
  has_ca_blocker,
  has_incont_med,
  prediction_result,
  user_values_updated,
  patient_measurement.row_created,
  patient_measurement.row_updated
from research_map 
left join patient_measurement 
on research_map.patient_id = patient_measurement.patient_id
where patient_measurement.row_created >= @lookback;
-- Should not be any duplicates here; this table should have one row per patient.
