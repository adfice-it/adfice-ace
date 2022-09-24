set @reloadtime = '2022-09-21 17:14:05';
set @patient_id = '00000000-0000-4000-8000-100000000174';

delete from patient_medication where patient_id = @patient_id;
delete from patient_advice_freetext where patient_id = @patient_id;
delete from patient_advice_selection where patient_id = @patient_id;

CREATE TEMPORARY TABLE tmpmed (
  `patient_id` varchar(36) NOT NULL,
  `date_retrieved` datetime DEFAULT NULL,
  `medication_name` varchar(100) DEFAULT NULL,
  `generic_name` varchar(100) DEFAULT NULL,
  `ATC_code` varchar(10) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `dose` varchar(100) DEFAULT NULL,
  `row_created` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

insert into tmpmed (patient_id, date_retrieved, medication_name, generic_name, ATC_code, start_date, dose, row_created)
SELECT distinct patient_id, date_retrieved, medication_name, generic_name, ATC_code, start_date, dose, row_created from patient_medication_history where patient_id = @patient_id and date_retrieved < @reloadtime;

insert into patient_medication (patient_id, date_retrieved, medication_name, generic_name, ATC_code, start_date, dose, row_created)
select * from tmpmed;

CREATE TEMPORARY TABLE tmpselection (
  doctor_id varchar(36) DEFAULT NULL,
  patient_id varchar(36) NOT NULL,
  ATC_code varchar(10) NOT NULL,
  medication_criteria_id varchar(8) NOT NULL,
  select_box_num smallint unsigned NOT NULL,
  selected tinyint(1) NOT NULL,
  row_created datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

insert into tmpselection (doctor_id, patient_id, ATC_code, medication_criteria_id, select_box_num, selected, row_created)
select doctor_id, patient_id, ATC_code, medication_criteria_id, select_box_num, selected, row_created from patient_advice_selection_history where log_id in(
SELECT max(log_id) from patient_advice_selection_history where patient_id = @patient_id and log_row_created <= @reloadtime and log_op = 2 group by ATC_code, medication_criteria_id, select_box_num);

insert into patient_advice_selection (doctor_id, patient_id, ATC_code, medication_criteria_id, select_box_num, selected, row_created)
select * from tmpselection;

CREATE TEMPORARY TABLE tmpfreetext (
  doctor_id varchar(36) DEFAULT NULL,
  patient_id varchar(36) NOT NULL,
  ATC_code varchar(10) NOT NULL,
  medication_criteria_id varchar(8) NOT NULL,
  select_box_num smallint unsigned NOT NULL,
  freetext_num smallint unsigned NOT NULL,
  freetext varchar(1000) NOT NULL,
  row_created datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

insert into tmpfreetext (doctor_id, patient_id, ATC_code, medication_criteria_id, select_box_num, freetext_num, freetext, row_created)
select doctor_id, patient_id, ATC_code, medication_criteria_id, select_box_num, freetext_num, freetext, row_created from patient_advice_freetext_history where log_id in(
SELECT max(log_id) from patient_advice_freetext_history where patient_id = @patient_id and log_row_created <= @reloadtime and log_op = 2 group by ATC_code, medication_criteria_id, select_box_num, freetext_num);

insert into patient_advice_freetext (doctor_id, patient_id, ATC_code, medication_criteria_id, select_box_num, freetext_num, freetext, row_created)
select * from tmpfreetext;

/* TODO add labs, problems, meas to this script */

drop table tmpmed;
drop table tmpselection;
drop table tmpfreetext;

