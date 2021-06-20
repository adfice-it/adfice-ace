-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
INSERT INTO patient_problem (patient_id, date_retrieved, problem_id, start_date, name, display_name) VALUES
(5,(select NOW()),11,'2019-02-11',"angststoornis","angststoornis"),
(6,(select NOW()),12,'2019-02-11',"epilepsy","epilepsy"),
(8,(select NOW()),7,'2019-02-11',"parkinson","Morbus Parkinson"),
(10,(select NOW()),11,'2019-02-11',"angststoornis","angststoornis"),
(10,(select NOW()),7,'2019-02-11',"parkinson","Morbus Parkinson"),
(11,(select NOW()),11,'2019-02-11',"angststoornis","angststoornis"),
(15,(select NOW()),13,'2019-02-11',"delier","delier"),
(16,(select NOW()),14,'2019-02-11',"dementie","dementie"),
(17,(select NOW()),15,'2019-02-11',"schizofrenie","schizofrenie"),
(18,(select NOW()),7,'2019-02-11',"parkinson","Morbus Parkinson"),
(19,(select NOW()),7,'2019-02-11',"parkinson","Morbus Parkinson"),
(21,(select NOW()),13,'2019-02-11',"delier","delier"),
(21,(select NOW()),7,'2019-02-11',"parkinson","Morbus Parkinson"),
(22,(select NOW()),14,'2019-02-11',"dementie","dementie"),
(22,(select NOW()),15,'2019-02-11',"schizofrenie","schizofrenie"),
(23,(select NOW()),13,'2019-02-11',"delier","delier"),
(24,(select NOW()),14,'2019-02-11',"dementie","dementie"),
(26,(select NOW()),4,'2019-02-11',"depressie","depressie"),
(27,(select NOW()),4,'2019-02-11',"depressie","depressie"),
(28,(select NOW()),11,'2019-02-11',"angststoornis","angststoornis"),
(32,(select NOW()),16,'2019-02-11',"hyponatremia","hyponatremia"),
(34,(select NOW()),7,'2019-02-11',"parkinson","Morbus Parkinson"),
(35,(select NOW()),7,'2019-02-11',"parkinson","Morbus Parkinson"),
(36,(select NOW()),7,'2019-02-11',"parkinson","Morbus Parkinson"),
(36,(select NOW()),3,'2019-02-11',"orthostatische-hypotensie", "orthostatische hypotensie"),
(42,(select NOW()),5,'2019-02-11',"hartfalen", "decompensatio cordis"),
(43,(select NOW()),5,'2019-02-11',"hartfalen", "decompensatio cordis"),
(44,(select NOW()),1,'2019-02-11',"hypertensie","hypertensie"),
(46,(select NOW()),16,'2019-02-11',"hyponatremia","hyponatremie"),
(48,(select NOW()),16,'2019-02-11',"jicht","jicht"),
(51,(select NOW()),7,'2019-02-11',"parkinson","Morbus Parkinson"),
(51,(select NOW()),3,'2019-02-11',"orthostatische-hypotensie", "orthostatische hypotensie"),
(55,(select NOW()),1,'2019-02-11',"hypertensie","hypertensie"),
(60,(select NOW()),26,'2019-02-11',"diabetes","diabetes"),
(61,(select NOW()),26,'2019-02-11',"diabetes","diabetes"),
(62,(select NOW()),22,'2019-02-11',"atriumfibrilleren","atriumfibrilleren"),
(70,(select NOW()),7,'2019-02-11',"parkinson","Morbus Parkinson"),
(70,(select NOW()),3,'2019-02-11',"orthostatische-hypotensie", "orthostatische hypotensie"),
(91,(select NOW()),25,'2019-02-11',"dwaarslaesie","dwaarslaesie"),
(96,(select NOW()),25,'2019-02-11',"dwaarslaesie","dwaarslaesie"),
(102,(select NOW()),7,'2019-02-11',"parkinson","Morbus Parkinson");

/* fake patients for validating rules */
INSERT INTO patient_problem (patient_id, date_retrieved, problem_id, start_date, name, display_name) VALUES
(131,(select NOW()),5,'2019-02-11',"hartfalen", "decompensatio cordis"),
(133,(select NOW()),1,'2019-02-11',"hypertensie", "hypertensie"),
(134,(select NOW()),1,'2019-02-11',"hypertensie", "hypertensie"),
(135,(select NOW()),5,'2019-02-11',"hartfalen", "decompensatio cordis"),
(139,(select NOW()),4,'2019-02-11',"depressie", "depressie"),
(140,(select NOW()),11,'2019-02-11',"angststoornis","angststoornis"),
(141,(select NOW()),11,'2019-02-11',"angststoornis","angststoornis");

/* fake patients for validation 2 */
INSERT INTO patient_problem (patient_id, date_retrieved, problem_id, start_date, name, display_name) VALUES
(144,(select NOW()),7,'2019-02-11',"parkinson","Morbus Parkinson"),
(144,(select NOW()),3,'2019-02-11',"orthostatische-hypotensie", "orthostatische hypotensie"),

(145,(select NOW()),13,'2019-02-11',"delier","delier"),

(146,(select NOW()),14,'2019-02-11',"dementie","dementie"),
(146,(select NOW()),26,'2019-02-11',"diabetes","diabetes"),
(146,(select NOW()),22,'2019-02-11',"atriumfibrilleren","atriumfibrilleren"),

(147,(select NOW()),15,'2019-02-11',"schizofrenie","schizofrenie"),

(149,(select NOW()),3,'2019-02-11',"orthostatische-hypotensie", "orthostatische hypotensie"),

(150,(select NOW()),7,'2019-02-11',"parkinson","Morbus Parkinson"),
(150,(select NOW()),3,'2019-02-11',"orthostatische-hypotensie", "orthostatische hypotensie"),
(150,(select NOW()),1,'2019-02-11',"hypertensie", "hypertensie");