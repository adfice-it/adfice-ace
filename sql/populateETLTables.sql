-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
SET CHARACTER SET 'utf8'; -- enable unicode support in older clients
INSERT INTO education_level (coded_level, level) VALUES (1, 'basisschool'),(1, 'lager beroepsonderwijs'),(1, 'LTS'), (1, 'LHNO'), (1, 'LEAO'),(1, 'handelsschool'),(1, 'handelsdagschool'),(1, 'huishoudschool'),(1, 'agrarische school'),(1, 'praktijkdiploma'),(1, 'middenstandsonderwijs'),(1, 'MULO'),(1, 'ULO'),(1, 'MACO'),(1, 'middelbaarberoepsonderwijs'),(1, 'MBA'),(1, 'LO-akten'),(1, 'MTS'),(1, 'MEAO'),(1, 'MMS'),(1, 'HBS'),(1, 'Lyceum 1 jaar'),(1, 'Lyceum 2 jaar'),(1, 'Lyceum 3 jaar'),(1, 'Atheneum 1 jaar'),(1, 'Atheneum 2 jaar'),(1, 'Atheneum 3 jaar'),(1, 'Gymnasium 1 jaar'),(1, 'Gymnasium 2 jaar'),(1, 'Gymnasium 3 jaar'),(2, 'BMMS'),(2, 'HBS'),(2, 'Lyceum'),(2, 'Atheneum'),(2, 'Gymnasium'),(3, 'hoger beroepsonderwijs'),(3, 'HTS'),(3, 'HEAO'),(3, 'MO-opleiding'),(3, 'kweekschool'),(3, 'sociale/pedagogische academie'),(3, 'universiteit'),(3, 'hogeschool');

INSERT INTO problem (id, problem_name, display_name) VALUES
(1,'hypertensie', 'Hypertensie'),
(2,'angina-pectoris','Angina pectoris'),
(3,'myocardinfarct','Myocardinfarct'),
(4,'hartfalen','Decompensatio cordis'),
(5,'tachycardia','Tachycardie'),
(6,'arrhythmia','Hartritmestoornis'),
(7,'atriumfibrilleren','Atriumfibrilleren'),
(8,'orthostatische-hypotensie','Orthostatische hypotensie'),
(9,'autonoom-falen','Autonoom falen'),
(10,'diabetes','Diabetes mellitus'),
(11,'hyponatremia','Hyponatriëmie'),
(12,'hypokalemia','Hypokaliëmie'),
(13,'hypercalciemie','Hypercalciëmie'),
(14,'jicht','Jicht'),
(15,'delier','Delier'),
(16,'depressie','Depressie'),
(17,'angststoornis','Angststoornis'),
(18,'schizofrenie','Schizofrenie'),
(19,'dementie','Dementie'),
(20,'lewy-bodies-dementia','Lewy body dementie'),
(21,'parkinson','Ziekte van Parkinson'),
(22,'multiple-system-atrophy','Multisysteematrofie'),
(23,'progressive-supranuclear-palsy','Progressieve supranucleaire parese'),
(24,'epilepsy','Epilepsie'),
(25,'paraplegia','Paraplegie'),
(26,'dwaarslaesie','Dwarslaesie');


INSERT INTO lab (id, lab_name) VALUES
(1,'natrium'),
(2,'kalium'),
(3,'calcium'),
(4,'eGFR');


/*
According to the internet, Lewy-bodies should get ICD-10 code G31.83
https://www.icd10data.com/ICD10CM/Codes/G00-G99/G30-G32/G31-/G31.83
Our codes are not specified to the 2nd decimal.
*/
