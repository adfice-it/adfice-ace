-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
SET CHARACTER SET 'utf8'; -- enable unicode support in older clients
INSERT INTO patient_lab (patient_id, date_retrieved, date_measured, lab_test_name, lab_test_result, lab_test_units) VALUES
(27,(select NOW()),(select NOW()),"natrium",140,"mmol/l "),
(30,(select NOW()),'2019-02-11',"natrium",140,"mmol/l "),
(31,(select NOW()),(select NOW()),"natrium",125,"mmol/l "),
(31,(select NOW()),(select NOW()),"kalium",3.5,"mmol/l "),
(45,(select NOW()),(select NOW()),"kalium",2.5,"mmol/l "),
(46,(select NOW()),(select NOW()),"natrium",120,"mmol/l "),
(47,(select NOW()),(select NOW()),"calcium",3.0,"mmol/l "),
(78,(select NOW()),(select NOW()),"eGFR",40,"mL/min/1.73 m² "),
(79,(select NOW()),(select NOW()),"eGFR",20,"mL/min/1.73 m² "),
(80,(select NOW()),'2019-02-11',"eGFR",40,"mL/min/1.73 m² "),
(85,(select NOW()),(select NOW()),"eGFR",40,"mL/min/1.73 m² "),
(86,(select NOW()),(select NOW()),"eGFR",20,"mL/min/1.73 m² "),
(87,(select NOW()),'2019-02-11',"eGFR",40,"mL/min/1.73 m² "),
(92,(select NOW()),(select NOW()),"eGFR",40,"mL/min/1.73 m² "),
(93,(select NOW()),(select NOW()),"eGFR",20,"mL/min/1.73 m² "),
(94,(select NOW()),'2019-02-11',"eGFR",40,"mL/min/1.73 m² ");

/* fake patients for validating rules */
INSERT INTO patient_lab (patient_id, date_retrieved, date_measured, lab_test_name, lab_test_result, lab_test_units) VALUES
(137,'2021-05-11','2020-05-11',"eGFR",35,"mL/min/1.73 m² "),
(139,'2021-05-11','2021-05-11',"natrium",140,"mmol/l "),
(140,'2021-05-11','2019-05-11',"natrium",140,"mmol/l ");

/* fake patients for validation 2 */
INSERT INTO patient_lab (patient_id, date_retrieved, date_measured, lab_test_name, lab_test_result, lab_test_units) VALUES
(152,(select NOW()),(select NOW()),"eGFR",40,"mL/min/1.73 m² "),
(153,(select NOW()),(select NOW()),"eGFR",20,"mL/min/1.73 m² "),/* fake patient for data reload test */
(174,(select NOW()),(select NOW()),"eGFR",40,"mL/min/1.73 m² "),;
