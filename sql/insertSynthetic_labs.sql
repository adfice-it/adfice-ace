-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
SET CHARACTER SET 'utf8'; -- enable unicode support in older clients

INSERT INTO patient_lab (patient_id, date_retrieved, date_measured, lab_test_name, lab_test_result, lab_test_units) VALUES
("00000000-0000-4000-8000-100000000027",(select NOW()),(select NOW()),"natrium",140,"mmol/l"),
("00000000-0000-4000-8000-100000000030",(select NOW()),'2019-02-11',"natrium",140,"mmol/l"),
("00000000-0000-4000-8000-100000000031",(select NOW()),(select NOW()),"natrium",125,"mmol/l"),
("00000000-0000-4000-8000-100000000031",(select NOW()),(select NOW()),"kalium",3.5,"mmol/l"),
("00000000-0000-4000-8000-100000000045",(select NOW()),(select NOW()),"kalium",2.5,"mmol/l"),
("00000000-0000-4000-8000-100000000046",(select NOW()),(select NOW()),"natrium",120,"mmol/l"),
("00000000-0000-4000-8000-100000000047",(select NOW()),(select NOW()),"calcium",3.0,"mmol/l"),
("00000000-0000-4000-8000-100000000078",(select NOW()),(select NOW()),"eGFR",40,"mL/min/1.73 m²"),
("00000000-0000-4000-8000-100000000079",(select NOW()),(select NOW()),"eGFR",20,"mL/min/1.73 m²"),
("00000000-0000-4000-8000-100000000080",(select NOW()),'2019-02-11',"eGFR",40,"mL/min/1.73 m²"),
("00000000-0000-4000-8000-100000000085",(select NOW()),(select NOW()),"eGFR",40,"mL/min/1.73 m²"),
("00000000-0000-4000-8000-100000000086",(select NOW()),(select NOW()),"eGFR",20,"mL/min/1.73 m²"),
("00000000-0000-4000-8000-100000000087",(select NOW()),'2019-02-11',"eGFR",40,"mL/min/1.73 m²"),
("00000000-0000-4000-8000-100000000092",(select NOW()),(select NOW()),"eGFR",40,"mL/min/1.73 m²"),
("00000000-0000-4000-8000-100000000093",(select NOW()),(select NOW()),"eGFR",20,"mL/min/1.73 m²"),
("00000000-0000-4000-8000-100000000094",(select NOW()),'2019-02-11',"eGFR",40,"mL/min/1.73 m²");

/* fake patients for validating rules */
INSERT INTO patient_lab (patient_id, date_retrieved, date_measured, lab_test_name, lab_test_result, lab_test_units) VALUES
("00000000-0000-4000-8000-100000000137",'2021-05-11','2020-05-11',"eGFR",35,"mL/min/1.73 m²"),
("00000000-0000-4000-8000-100000000139",'2021-05-11','2021-05-11',"natrium",140,"mmol/l"),
("00000000-0000-4000-8000-100000000140",'2021-05-11','2019-05-11',"natrium",140,"mmol/l");

/* fake patients for validation 2 */
INSERT INTO patient_lab (patient_id, date_retrieved, date_measured, lab_test_name, lab_test_result, lab_test_units) VALUES
("00000000-0000-4000-8000-100000000152",(select NOW()),(select NOW()),"eGFR",40,"mL/min/1.73 m²"),
("00000000-0000-4000-8000-100000000153",(select NOW()),(select NOW()),"eGFR",20,"mL/min/1.73 m²");

/* fake patient for data reload test */
INSERT INTO patient_lab (patient_id, date_retrieved, date_measured, lab_test_name, lab_test_result, lab_test_units) VALUES
("00000000-0000-4000-8000-100000000174",(select NOW()),(select NOW()),"eGFR",40,"mL/min/1.73 m²"),
("00000000-0000-4000-8000-100000000179",(select NOW()),(select NOW()),"eGFR",40,"mL/min/1.73 m²");
