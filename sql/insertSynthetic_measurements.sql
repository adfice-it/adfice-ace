-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
SET CHARACTER SET 'utf8'; -- enable unicode support in older clients
INSERT INTO patient_measurement
(patient_id, date_retrieved, education_hml, height_cm, height_date_measured, weight_kg,
weight_date_measured, BMI, BMI_date_measured, GDS_score, GDS_date_measured, grip_kg,
grip_date_measured, walking_speed_m_per_s, walking_date_measured,
systolic_bp_mmHg, bp_date_measured, number_of_limitations,
functional_limit_date_measured, fear0, fear1, fear2,
fear_of_falls_date_measured, nr_falls_12m, nr_falls_date_measured,
smoking, smoking_date_measured, has_antiepileptica, has_ca_blocker,
has_incont_med) VALUES

("00000000-0000-4000-8000-100000000002", (select NOW()), 3, 160, (select NOW()), 55, (select NOW()),  21.5,(select NOW()), 1, (select NOW()), 21.5, (select NOW()), 0.6, (select NOW()), 140, (select NOW()), 1, (select NOW()), 0, 0, 1, (select NOW()), 3, (select NOW()), 1, (select NOW()),0,0,1),

("00000000-0000-4000-8000-100000000003", (select NOW()), 1, 180, (select NOW()), 70, (select NOW()), 21.6,(select NOW()), 3, (select NOW()), 30, (select NOW()), 1, (select NOW()), 130, (select NOW()), 3, (select NOW()), 0, 1, 0, (select NOW()), 5, (select NOW()), 1, (select NOW()),0,0,0),

("00000000-0000-4000-8000-100000000142", (select NOW()), 3, 160, (select NOW()), 55, (select NOW()),  21.5,(select NOW()), 1, (select NOW()), 21.5, (select NOW()), 0.6, (select NOW()), 140, (select NOW()), 1, (select NOW()), 0, 0, 1, (select NOW()), 3, (select NOW()), 1, (select NOW()),0,0,1),

("00000000-0000-4000-8000-100000000143", (select NOW()), 3, 160, (select NOW()), 55, (select NOW()),  21.5,(select NOW()), 1, (select NOW()), 21.5, (select NOW()), 0.6, (select NOW()), 140, (select NOW()), 1, (select NOW()), 0, 0, 1, (select NOW()), 3, (select NOW()), 1, (select NOW()),0,0,1);

-- complete data, user-entered
INSERT INTO patient_measurement
(patient_id,date_retrieved,user_education_hml,user_height_cm,
user_weight_kg,user_GDS_score,user_grip_kg,user_walking_speed_m_per_s,
user_systolic_bp_mmHg,user_number_of_limitations,user_fear0,user_fear1,
user_fear2,user_nr_falls_12m,user_smoking,has_antiepileptica,
has_ca_blocker,has_incont_med,user_values_updated, prediction_result) VALUES
("00000000-0000-4000-8000-100000000170", (select NOW()),3,160,50,0,25,0.3,120,2,0,1,0,1,0,0,0,0, (select NOW()), 57);

-- complete data, mix of user-entered and EHR-extracted
INSERT INTO patient_measurement
(patient_id,date_retrieved,user_education_hml,BMI,
user_GDS_score,user_grip_kg,user_walking_speed_m_per_s,
user_systolic_bp_mmHg,user_number_of_limitations,user_fear0,user_fear1,
user_fear2,user_nr_falls_12m,smoking,has_antiepileptica,
has_ca_blocker,has_incont_med,user_values_updated, prediction_result) VALUES
("00000000-0000-4000-8000-100000000171", (select NOW()),3,25,0,25,0.3,120,2,0,1,0,1,0,0,0,0, (select NOW()), 45);

-- incomplete data
INSERT INTO patient_measurement
(patient_id,date_retrieved,BMI,BMI_date_measured, smoking, smoking_date_measured,has_antiepileptica,
has_ca_blocker,has_incont_med) VALUES
("00000000-0000-4000-8000-100000000172", (select NOW()),25,(select NOW()),1, (select NOW()),0,0,0),
("00000000-0000-4000-8000-100000000176", (select NOW()),25,(select NOW()),1, (select NOW()),0,0,0);

INSERT INTO patient_measurement
(patient_id, date_retrieved, education_hml, height_cm, height_date_measured, weight_kg,
weight_date_measured, BMI, BMI_date_measured, GDS_score, GDS_date_measured, grip_kg,
grip_date_measured, walking_speed_m_per_s, walking_date_measured,
systolic_bp_mmHg, bp_date_measured, number_of_limitations,
functional_limit_date_measured, fear0, fear1, fear2,
fear_of_falls_date_measured, nr_falls_12m, nr_falls_date_measured,
has_antiepileptica, has_ca_blocker,
has_incont_med) VALUES

("00000000-0000-4000-8000-100000000173", (select NOW()), 3, 160, (select NOW()), 55, (select NOW()),  21.5,(select NOW()), 1, (select NOW()), 21.5, (select NOW()), 0.6, (select NOW()), 140, (select NOW()), 1, (select NOW()), 0, 0, 1, (select NOW()), 3, (select NOW()),0,0,1),

/* fake patient for data reload test */
("00000000-0000-4000-8000-100000000174", (select NOW()), 3, 160, (select NOW()), 55, (select NOW()),  21.5,(select NOW()), 1, (select NOW()), 21.5, (select NOW()), 0.6, (select NOW()), 140, (select NOW()), 1, (select NOW()), 0, 0, 1, (select NOW()), 3, (select NOW()),0,0,1),
("00000000-0000-4000-8000-100000000179", (select NOW()), 3, 160, (select NOW()), 55, (select NOW()),  21.5,(select NOW()), 1, (select NOW()), 21.5, (select NOW()), 0.6, (select NOW()), 140, (select NOW()), 1, (select NOW()), 0, 0, 1, (select NOW()), 3, (select NOW()),0,0,1);

INSERT INTO patient_measurement (patient_id, date_retrieved) VALUES
("00000000-0000-4000-8000-100000000180", (select NOW()));