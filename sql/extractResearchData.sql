-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
	was_printed,
	time_printed,
	was_copied,
	time_copied,
	ehr_text_was_copied,
	time_ehr_text_copied,
	was_sent_to_portal,
	time_sent_to_portal
	copied_rc, -- time_copied
	ehr_copy_rc, -- time_ehr_text_copied
	(if(patient.is_final,patient.row_updated,null)) -- time_sent_to_portal
WHERE patient.is_final != 1 or patient.row_updated >= @lookback;
  location_id,
  initial_user_hash,
  initial_ATC_code,
  initial_medication_criteria_id,
  initial_select_box_num,
  initial_selected,
  initial_row_created
	@location_id, -- location_id; will be different for each location
	patient.participant_number, 
  `location_id`,
  `participant_number`,
  `last_user_hash`,
  `last_ATC_code`,
  `last_medication_criteria_id`,
  `last_select_box_num`,
  `last_selected`,
  `last_has_freetext`,
  `last_row_created`
	patient.participant_number, 
	patient_advice_selection.ATC_code,
	patient_advice_selection.medication_criteria_id,
	patient_advice_selection.select_box_num,
	patient_advice_selection.selected,
	patient_advice_selection.row_created
FROM patient join patient_advice_selection on patient.id = patient_advice_selection.patient_id
left join patient_advice_freetext on 
	patient_advice_selection.patient_id = patient_advice_freetext.patient_id AND
	patient_advice_selection.ATC_code = patient_advice_freetext.ATC_code AND
	patient_advice_selection.medication_criteria_id = patient_advice_freetext.medication_criteria_id AND
	patient_advice_selection.select_box_num = patient_advice_freetext.select_box_num
/*