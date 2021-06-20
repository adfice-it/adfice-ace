BEGIN;

DELETE FROM patient WHERE id = 160;
DELETE FROM patient_measurements WHERE patient_id = 160;
DELETE FROM patient_labs WHERE patient_id = 160;
DELETE FROM patient_medications WHERE patient_id = 160;
DELETE FROM patient_problems WHERE patient_id = 160;

INSERT INTO patient (id,display_name,login_token,birth_date,age) VALUES
(161,"Mw.Test1","ltoken1",'1940-06-16',81);

COMMIT;
