-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
SET CHARACTER SET 'utf8'; -- enable unicode support in older clients
INSERT INTO patient_problem (patient_id, date_retrieved, start_date, name) VALUES
(5,(select NOW()),'2019-02-11',"angststoornis"),
(6,(select NOW()),'2019-02-11',"epilepsy"),
(8,(select NOW()),'2019-02-11',"parkinson"),
(10,(select NOW()),'2019-02-11',"angststoornis"),
(10,(select NOW()),'2019-02-11',"parkinson"),
(11,(select NOW()),'2019-02-11',"angststoornis"),
(15,(select NOW()),'2019-02-11',"delier"),
(16,(select NOW()),'2019-02-11',"dementie"),
(17,(select NOW()),'2019-02-11',"schizofrenie"),
(18,(select NOW()),'2019-02-11',"parkinson"),
(19,(select NOW()),'2019-02-11',"parkinson"),
(21,(select NOW()),'2019-02-11',"delier"),
(21,(select NOW()),'2019-02-11',"parkinson"),
(22,(select NOW()),'2019-02-11',"dementie"),
(22,(select NOW()),'2019-02-11',"schizofrenie"),
(23,(select NOW()),'2019-02-11',"delier"),
(24,(select NOW()),'2019-02-11',"dementie"),
(26,(select NOW()),'2019-02-11',"depressie"),
(27,(select NOW()),'2019-02-11',"depressie"),
(28,(select NOW()),'2019-02-11',"angststoornis"),
(32,(select NOW()),'2019-02-11',"hyponatremia"),
(34,(select NOW()),'2019-02-11',"parkinson"),
(35,(select NOW()),'2019-02-11',"parkinson"),
(36,(select NOW()),'2019-02-11',"parkinson"),
(36,(select NOW()),'2019-02-11',"orthostatische-hypotensie"),
(42,(select NOW()),'2019-02-11',"hartfalen"),
(43,(select NOW()),'2019-02-11',"hartfalen"),
(44,(select NOW()),'2019-02-11',"hypertensie"),
(46,(select NOW()),'2019-02-11',"hyponatremia"),
(48,(select NOW()),'2019-02-11',"jicht"),
(51,(select NOW()),'2019-02-11',"parkinson"),
(51,(select NOW()),'2019-02-11',"orthostatische-hypotensie"),
(55,(select NOW()),'2019-02-11',"hypertensie"),
(60,(select NOW()),'2019-02-11',"diabetes"),
(61,(select NOW()),'2019-02-11',"diabetes"),
(62,(select NOW()),'2019-02-11',"atriumfibrilleren"),
(70,(select NOW()),'2019-02-11',"parkinson"),
(70,(select NOW()),'2019-02-11',"orthostatische-hypotensie"),
(91,(select NOW()),'2019-02-11',"dwaarslaesie"),
(96,(select NOW()),'2019-02-11',"dwaarslaesie"),
(102,(select NOW()),'2019-02-11',"parkinson");

/* fake patients for validating rules */
INSERT INTO patient_problem (patient_id, date_retrieved, start_date, name) VALUES
(131,(select NOW()),'2019-02-11',"hartfalen"),
(133,(select NOW()),'2019-02-11',"hypertensie"),
(134,(select NOW()),'2019-02-11',"hypertensie"),
(135,(select NOW()),'2019-02-11',"hartfalen"),
(139,(select NOW()),'2019-02-11',"depressie"),
(140,(select NOW()),'2019-02-11',"angststoornis"),
(141,(select NOW()),'2019-02-11',"angststoornis");

/* fake patients for validation 2 */
INSERT INTO patient_problem (patient_id, date_retrieved, start_date, name) VALUES
(144,(select NOW()),'2019-02-11',"parkinson"),
(144,(select NOW()),'2019-02-11',"orthostatische-hypotensie"),

(145,(select NOW()),'2019-02-11',"delier"),

(146,(select NOW()),'2019-02-11',"dementie"),
(146,(select NOW()),'2019-02-11',"diabetes"),
(146,(select NOW()),'2019-02-11',"atriumfibrilleren"),

(147,(select NOW()),'2019-02-11',"schizofrenie"),

(149,(select NOW()),'2019-02-11',"orthostatische-hypotensie"),

(150,(select NOW()),'2019-02-11',"parkinson"),
(150,(select NOW()),'2019-02-11',"orthostatische-hypotensie"),
(150,(select NOW()),'2019-02-11',"hypertensie"),/* fake patient for data reload test */(174,(select NOW()),'2019-02-11',"parkinson"),
(174,(select NOW()),'2019-02-11',"orthostatische-hypotensie");
