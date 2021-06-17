-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
INSERT INTO education_levels (coded_level, level) VALUES (1, 'basisschool'),(1, 'lager beroepsonderwijs'),(1, 'LTS'), (1, 'LHNO'), (1, 'LEAO'),(1, 'handelsschool'),(1, 'handelsdagschool'),(1, 'huishoudschool'),(1, 'agrarische school'),(1, 'praktijkdiploma'),(1, 'middenstandsonderwijs'),(1, 'MULO'),(1, 'ULO'),(1, 'MACO'),(1, 'middelbaarberoepsonderwijs'),(1, 'MBA'),(1, 'LO-akten'),(1, 'MTS'),(1, 'MEAO'),(1, 'MMS'),(1, 'HBS'),(1, 'Lyceum 1 jaar'),(1, 'Lyceum 2 jaar'),(1, 'Lyceum 3 jaar'),(1, 'Atheneum 1 jaar'),(1, 'Atheneum 2 jaar'),(1, 'Atheneum 3 jaar'),(1, 'Gymnasium 1 jaar'),(1, 'Gymnasium 2 jaar'),(1, 'Gymnasium 3 jaar'),(2, 'BMMS'),(2, 'HBS'),(2, 'Lyceum'),(2, 'Atheneum'),(2, 'Gymnasium'),(3, 'hoger beroepsonderwijs'),(3, 'HTS'),(3, 'HEAO'),(3, 'MO-opleiding'),(3, 'kweekschool'),(3, 'sociale/pedagogische academie'),(3, 'universiteit'),(3, 'hogeschool');

INSERT INTO problems (id, problem_name) VALUES
(1,'hypertensie'),
(2,'myocardinfarct'),
(3,'orthostatische-hypotensie'),
(4,'depressie'),
(5,'hartfalen'),
(6,'autonoom falen'),
(7,'parkinson'),
(8,'lewy-bodies-dementia'),
(9,'multiple-system-atrophy'),
(10,'progressive-supranuclear-palsy'),
(11,'angststoornis'),
(12,'epilepsy'),
(13,'delier'),
(14,'dementie'),
(15,'schizofrenie'),
(16,'hyponatremia'),
(17,'tachycardia'),
(18,'arrhythmia'),
(19,'hypokalemia'),
(20,'hypercalciemie'),
(21,'jicht'),
(22,'atriumfibrilleren'),
(23,'angina-pectoris'),
(24,'paraplegia'),
(25,'dwaarslaesie'),
(26,'diabetes');


/*
According to the internet, Lewy-bodies should get ICD-10 code G31.83
https://www.icd10data.com/ICD10CM/Codes/G00-G99/G30-G32/G31-/G31.83
Our codes are not specified to the 2nd decimal.
*/