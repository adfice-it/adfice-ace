SET CHARACTER SET 'utf8'; -- enable unicode support in older clients
BEGIN;

DELETE FROM patient WHERE patient_id = "00000000-0000-4000-8000-100000000161";
DELETE FROM patient_measurement WHERE patient_id = "00000000-0000-4000-8000-100000000161";
DELETE FROM patient_lab WHERE patient_id = "00000000-0000-4000-8000-100000000161";
DELETE FROM patient_medication WHERE patient_id = "00000000-0000-4000-8000-100000000161";
DELETE FROM patient_problem WHERE patient_id = "00000000-0000-4000-8000-100000000161";

INSERT INTO patient (patient_id,display_name,birth_date,age) VALUES
("00000000-0000-4000-8000-100000000161","Mw.Test1",'1940-06-16',81);

COMMIT;
