-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
INSERT INTO patient_labs (patient_id, date_retrieved, date_measured, lab_test_name, lab_test_result, lab_test_units) VALUES
(27,'2021-02-11','2021-02-11',"natrium",140,"mmol/l "),
(30,'2021-02-11','2020-02-11',"natrium",140,"mmol/l "),
(78,'2021-02-11','2020-02-11',"eGFR",40,"mL/min/1.73 m² "),
(79,'2021-02-11','2020-02-11',"eGFR",20,"mL/min/1.73 m² "),
(80,'2021-02-11','2020-02-11',"eGFR",40,"mL/min/1.73 m² "),
(85,'2021-02-11','2020-02-11',"eGFR",40,"mL/min/1.73 m² "),
(86,'2021-02-11','2020-02-11',"eGFR",20,"mL/min/1.73 m² "),
(87,'2021-02-11','2020-02-11',"eGFR",40,"mL/min/1.73 m² ");

/* fake patients for validating rules */
INSERT INTO patient_labs (patient_id, date_retrieved, date_measured, lab_test_name, lab_test_result, lab_test_units) VALUES
(137,'2021-05-11','2020-05-11',"eGFR",35,"mL/min/1.73 m² "),
(139,'2021-05-11','2021-05-11',"natrium",140,"mmol/l "),
(140,'2021-05-11','2019-05-11',"natrium",140,"mmol/l ");
