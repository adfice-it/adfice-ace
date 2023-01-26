/* The purpose of this script is to remove data from patients that have withdrawn from the study. */

create table pid (id_from_patient int unsigned, patient_id varchar(36));

insert into pid
(select id, patient_id from patient where participant_number = "WITHDRAWN" and row_updated < DATE_SUB(NOW(), INTERVAL 1 DAY)); -- if the WITHDRAWN status was just added, don't delete them (yet)

insert into pid
(select id, patient_id from patient where participant_number is null and id > 179 and row_created < DATE_SUB(NOW(), INTERVAL 2 MONTH)); -- patients 1 to 179 are test patients

delete from etl_bsn_patient where patient_id in (select patient_id from pid);

delete from etl_mrn_patient where patient_id in (select patient_id from pid);

delete from logged_events where patient_id in (select patient_id from pid);

delete from patient_advice_freetext where patient_id in (select patient_id from pid);

delete from patient_advice_freetext_history where patient_id in (select patient_id from pid);

delete from patient_advice_selection where patient_id in (select patient_id from pid);

delete from patient_advice_selection_history where patient_id in (select patient_id from pid);

delete from patient_lab where patient_id in (select patient_id from pid);

delete from patient_lab_history where patient_id in (select patient_id from pid);

delete from patient_measurement where patient_id in (select patient_id from pid);

delete from patient_measurement_history where patient_id in (select patient_id from pid);

delete from patient_medication where patient_id in (select patient_id from pid);

delete from patient_medication_history where patient_id in (select patient_id from pid);

delete from patient_problem where patient_id in (select patient_id from pid);

delete from patient_problem_history where patient_id in (select patient_id from pid);

delete from patient_problem where patient_id in (select patient_id from pid);

delete from patient where patient_id in (select patient_id from pid);

delete from patient_history where id in (select id_from_patient from pid);

drop table pid;
