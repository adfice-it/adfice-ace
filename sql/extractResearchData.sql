-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw/*This SQL file should *not* be run with the others.This file is meant to be run 1x or a few x per day by a cron job.It should eventually be pointed to another database entirely.The lookback is set to 7 days so it will be resiliant to 1 week ofsomething going wrong.*//* TODO figure out the "on duplicate key" syntax and the "unique key" syntax.It is meant to update the row if the unique keys are the same. */SET @location_id = if(@location_id is null, 0, @location_id);SET @lookback = if(@lookback is null, NOW() - INTERVAL 7 DAY, @lookback);INSERT INTO research_patient (	research_patient_id, 	location_id,	participant_number,
	was_printed,
	time_printed,
	was_copied,
	time_copied,
	ehr_text_was_copied,
	time_ehr_text_copied,
	was_sent_to_portal,
	time_sent_to_portal)SELECT 	null,	@location_id, -- location_id; will be different for each location	patient.participant_number, 	if(printed_pid is null,0,1), -- was_printed	printed_rc, -- time_printed	if(copied_pid is null,0,1), -- was_copied
	copied_rc, -- time_copied	if(ehr_copy_pid is null,0,1), -- ehr_text_was_copied
	ehr_copy_rc, -- time_ehr_text_copied	if(patient.is_final,1,0), -- was_sent_to_portal
	(if(patient.is_final,patient.row_updated,null)) -- time_sent_to_portalfrom patient     left join (select patient_id as printed_pid, row_created as printed_rc from logged_events where event_type = 1) as printed on patient.id = printed_pid    left join (select patient_id as copied_pid, row_created as copied_rc from logged_events where event_type = 2) as copied on patient.id = copied_pid	left join (select patient_id as ehr_copy_pid, row_created as ehr_copy_rc from logged_events where event_type = 3) as ehr_copy on patient.id = ehr_copy_pid
WHERE patient.is_final != 1 or patient.row_updated >= @lookback;-- ON DUPLICATE KEY UPDATE location_id=location_id, participant_number=participant_number;/* TODO since there are multiple rows in the initial state, check whether the row_updated time can be off by a few millis for the same UI event *//* TODO check that duplicate entries work as expected: duplicates are dropped on the floor but non-duplicates in the same statement are inserted *//* TODO check that the initial checkbox state is actually recorded */INSERT INTO research_initial_checkboxes (  row_id,
  location_id,  participant_number,
  initial_user_hash,
  initial_ATC_code,
  initial_medication_criteria_id,
  initial_select_box_num,
  initial_selected,
  initial_row_created)SELECT 	null,
	@location_id, -- location_id; will be different for each location
	patient.participant_number, 	sha2(initial_checkboxes.doctor_id,224),	initial_checkboxes.ATC_code,	initial_checkboxes.medication_criteria_id,	initial_checkboxes.select_box_num,	initial_checkboxes.selected,	initial_checkboxes.row_createdFROM patient join (select patient_advice_selection_history.* from patient_advice_selection_history join (select patient_id, min(row_created) as minRC from patient_advice_selection_history group by patient_id) as first_date on patient_advice_selection_history.patient_id = first_date.patient_id and patient_advice_selection_history.row_created = first_date.minRC) as initial_checkboxeson patient.id = initial_checkboxes.patient_idWHERE initial_checkboxes.row_created >= @lookback;-- no need to look for freetext; the initial state is machine-generated and does not have freetext./* TODO check that duplicates are handled as expected: if it's the same patient, ATC, etc. then update,if it's different then insert. This means that if data is reloaded from Epic there's a chance of some stale entries, but the timestamp should make that discernable */INSERT INTO research_last_checkboxes (  `row_id`,
  `location_id`,
  `participant_number`,
  `last_user_hash`,
  `last_ATC_code`,
  `last_medication_criteria_id`,
  `last_select_box_num`,
  `last_selected`,
  `last_has_freetext`,
  `last_row_created`)SELECT	null,	@location_id, -- location_id; will be different for each location
	patient.participant_number, 	sha2(patient_advice_selection.doctor_id,224),
	patient_advice_selection.ATC_code,
	patient_advice_selection.medication_criteria_id,
	patient_advice_selection.select_box_num,
	patient_advice_selection.selected,    if(patient_advice_freetext.freetext is null,0,1), -- was freetext box used
	patient_advice_selection.row_created
FROM patient join patient_advice_selection on patient.id = patient_advice_selection.patient_id
left join patient_advice_freetext on 
	patient_advice_selection.patient_id = patient_advice_freetext.patient_id AND
	patient_advice_selection.ATC_code = patient_advice_freetext.ATC_code AND
	patient_advice_selection.medication_criteria_id = patient_advice_freetext.medication_criteria_id AND
	patient_advice_selection.select_box_num = patient_advice_freetext.select_box_numWHERE patient_advice_selection.row_created >= @lookback
/*ON DUPLICATE KEY UPDATE 	location_id=location_id, 	participant_number=participant_number, 	last_ATC_code = last_ATC_code,	last_medication_criteria_id = last_medication_criteria_id,	last_select_box_num = last_select_box_num;*/