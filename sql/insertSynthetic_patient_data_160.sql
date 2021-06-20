BEGIN;

DELETE FROM patient WHERE id = 160;
DELETE FROM patient_measurement WHERE patient_id = 160;
DELETE FROM patient_lab WHERE patient_id = 160;
DELETE FROM patient_medication WHERE patient_id = 160;
DELETE FROM patient_problems WHERE patient_id = 160;

INSERT INTO patient (id,display_name,login_token,birth_date,age) VALUES
(160,"Mr.Test0","ltoken0",'1941-04-01',80);

COMMIT;
