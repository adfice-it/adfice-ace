/* The purpose of this script is to remove data from patients that have withdrawn from the study. */

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

create table ppid
select id from patient where patient_id in (select patient_id from pid)

delete from patient where patient_id in (select patient_id from pid);

delete from patient_history where id in (select id from ppid);

drop table ppid;
truncate table pid;
