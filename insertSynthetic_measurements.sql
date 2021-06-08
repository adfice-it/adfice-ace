-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
INSERT INTO patient_measurements
(patient_id, date_retrieved, height_cm, height_date_measured, weight_kg,
weight_date_measured, GDS_score, GDS_date_measured, grip_kg,
grip_date_measured, walking_speed_m_per_s, walking_date_measured,
systolic_bp_mmHg, bp_date_measured, functional_limit_trap,
functional_limit_kleding, functional_limit_stoel,
functional_limit_nagels, functional_limit_lopen,
functional_limit_date_measured, FES_kleding, FES_bad, FES_stoel,
FES_trap, FES_reiken, FES_helling, FES_sociale,
fear_of_falls_date_measured, nr_falls_12m, nr_falls_date_measured,
smoking, smoking_date_measured) VALUES
(2, (select NOW()), 160, (select NOW()), 55, (select NOW()), 1, (select NOW()),
21.5, (select NOW()), 0.6, (select NOW()), 140, (select NOW()), 3, 1, 1, 1, 1,
(select NOW()), "Helemaal niet bezorgd" , "Erg bezorgd" , "Helemaal niet
bezorgd" , "Helemaal niet bezorgd" , "Helemaal niet bezorgd" , "Erg
bezorgd" , "Helemaal niet bezorgd" , (select NOW()), 3, (select NOW()), 1,
(select NOW())),
(3, (select NOW()), 180, (select NOW()), 70, (select NOW()), 3, (select NOW()),
30, (select NOW()), 1, (select NOW()), 130, (select NOW()), 3, 1, 2, 1, 3,
(select NOW()), "Helemaal niet bezorgd" , "Een beetje bezorgd", "Helemaal
niet bezorgd" , "Een beetje bezorgd", "Een beetje bezorgd", "Een beetje
bezorgd", "Helemaal niet bezorgd" , (select NOW()), 5, (select NOW()), 1,
(select NOW()));

-- seeding rule test patients with completely fictional prediction results
INSERT INTO patient_measurements
(patient_id, date_retrieved,prediction_result) VALUES
(4,(select now()),29),
(5,(select now()),70),
(6,(select now()),37),
(7,(select now()),30),
(8,(select now()),37),
(9,(select now()),26),
(10,(select now()),37),
(11,(select now()),33),
(12,(select now()),71),
(13,(select now()),73),
(14,(select now()),42),
(15,(select now()),34),
(16,(select now()),37),
(17,(select now()),75),
(18,(select now()),54),
(19,(select now()),31),
(20,(select now()),30),
(21,(select now()),67),
(22,(select now()),60),
(23,(select now()),70),
(24,(select now()),50),
(25,(select now()),53),
(26,(select now()),27),
(27,(select now()),59),
(28,(select now()),29),
(29,(select now()),75),
(30,(select now()),66),
(31,(select now()),35),
(32,(select now()),66),
(33,(select now()),68),
(34,(select now()),62),
(35,(select now()),39),
(36,(select now()),66),
(37,(select now()),34),
(38,(select now()),62),
(39,(select now()),27),
(40,(select now()),71),
(41,(select now()),30),
(42,(select now()),26),
(43,(select now()),74),
(44,(select now()),58),
(45,(select now()),45),
(46,(select now()),60),
(47,(select now()),52),
(48,(select now()),35),
(49,(select now()),62),
(50,(select now()),60),
(51,(select now()),62),
(52,(select now()),37),
(53,(select now()),50),
(54,(select now()),54),
(55,(select now()),51),
(56,(select now()),67),
(57,(select now()),58),
(58,(select now()),73),
(59,(select now()),46),
(60,(select now()),31),
(61,(select now()),41),
(62,(select now()),69),
(63,(select now()),41),
(64,(select now()),26),
(65,(select now()),56),
(66,(select now()),26),
(67,(select now()),34),
(68,(select now()),36),
(69,(select now()),44),
(70,(select now()),74),
(71,(select now()),63),
(72,(select now()),30),
(73,(select now()),30),
(74,(select now()),45),
(75,(select now()),46),
(76,(select now()),40),
(77,(select now()),27),
(78,(select now()),35),
(79,(select now()),54),
(80,(select now()),27),
(81,(select now()),42),
(82,(select now()),40),
(83,(select now()),55),
(84,(select now()),34),
(85,(select now()),42),
(86,(select now()),36),
(87,(select now()),39),
(88,(select now()),41),
(89,(select now()),32),
(90,(select now()),34),
(91,(select now()),63),
(92,(select now()),59),
(93,(select now()),25),
(94,(select now()),63),
(95,(select now()),41),
(96,(select now()),38),
(97,(select now()),71),
(98,(select now()),70),
(99,(select now()),55),
(100,(select now()),59),
(101,(select now()),25),
(102,(select now()),52),
(103,(select now()),64),
(104,(select now()),49),
(105,(select now()),26),
(106,(select now()),41),
(107,(select now()),43),
(108,(select now()),26),
(109,(select now()),49),
(110,(select now()),44),
(111,(select now()),54),
(112,(select now()),35),
(113,(select now()),27),
(114,(select now()),75),
(115,(select now()),56),
(116,(select now()),61),
(117,(select now()),74),
(118,(select now()),73),
(119,(select now()),56),
(120,(select now()),73),
(121,(select now()),43),
(122,(select now()),26),
(123,(select now()),66),
(124,(select now()),29),
(125,(select now()),38),
(126,(select now()),72),
(127,(select now()),36),
(128,(select now()),30),
(129,(select now()),51),
(131,(select now()),35),
(132,(select now()),25),
(133,(select now()),26),
(134,(select now()),72),
(135,(select now()),71),
(136,(select now()),39),
(137,(select now()),49),
(138,(select now()),42),
(139,(select now()),67),
(140,(select now()),40),
(141,(select now()),50),
(142,(select now()),74),
(143,(select now()),25);

/* fake patients for validation 2 */
INSERT INTO patient_measurements
(patient_id, date_retrieved,prediction_result) VALUES
(144,(select now()),58),
(145,(select now()),45),
(146,(select now()),60),
(147,(select now()),52),
(148,(select now()),35),
(149,(select now()),62),
(150,(select now()),60),
(151,(select now()),62),
(152,(select now()),37),
(153,(select now()),50),
(154,(select now()),54),
(155,(select now()),51),
(156,(select now()),67),
(157,(select now()),58),
(158,(select now()),73),
(159,(select now()),46);