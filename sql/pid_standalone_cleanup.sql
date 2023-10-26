create table if not exists pid (id_from_patient int unsigned, patient_id varchar(36));

insert into pid
(select id, patient_id from patient where patient_id in (select patient_id from research_map) and row_created < DATE_SUB(NOW(), INTERVAL 14 DAY))
