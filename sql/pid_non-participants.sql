create table if not exists pid (id_from_patient int unsigned, patient_id varchar(36));

insert into pid
(select id, patient_id from patient where participant_number = "WITHDRAWN" and row_updated < DATE_SUB(NOW(), INTERVAL 1 DAY)); -- if the WITHDRAWN status was just added, don't delete them (yet)

insert into pid
(select id, patient_id from patient where (participant_number is null or participant_number = '') and id > 179 and row_created < DATE_SUB(NOW(), INTERVAL 2 MONTH)); -- patients 1 to 179 are test patients