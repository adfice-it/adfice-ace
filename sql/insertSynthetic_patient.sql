-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
SET CHARACTER SET 'utf8'; -- enable unicode support in older clients

INSERT INTO etl_mrn_patient (mrn, patient_id) VALUES
('DummyMRN-641923847', 163);

INSERT INTO patient (id,display_name,birth_date,education_level) VALUES
(1,"Mevr. Empty",'1940-02-10',NULL),
(2,"Mevr. Predict",'1940-02-11',"HEAO"),
(3,"Mr. Predict",'1942-01-01',"Gymnasium 1 jaar");

INSERT INTO patient (id,display_name,birth_date) VALUES
(4,"Mevr. Benzo-NoComorbid",'1940-02-12'),
(5,"Mevr. Benzo-angst",'1940-02-13'),
(6,"Mevr. Benzo-epilepsy",'1940-02-14'),
(7,"Mevr. Benzo-allergy",'1940-02-15'),
(8,"Mevr. Benzo-parkinson",'1940-02-16'),
(9,"Mevr. CYP3A",'1940-02-17'),
(10,"Mevr. Benzo-angst-park",'1940-02-18'),
(11,"Mevr. Scopolamine-angst",'1940-02-19'),
(12,"Mevr. Anxiolytic-NoComorbid",'1940-02-20'),
(13,"Mevr. Anxiolytic-allergy",'1940-02-21'),
(14,"Mr. Antipsy-NoComorbid",'1940-02-22'),
(15,"Mr. Antipsy-delier",'1940-02-23'),
(16,"Mr. Antipsy-dement",'1940-02-24'),
(17,"Mr. Antipsy-schiz",'1940-02-25'),
(18,"Mr. Antipsy-park",'1940-02-26'),
(19,"Mr. Clozapine-park",'1940-02-27'),
(20,"Mr. Antipsy-allergy",'1940-02-28'),
(21,"Mr. Antipsy-delier-park",'1940-02-29'),
(22,"Mr. Anitpsy-dement-schiz",'1940-03-01'),
(23,"Mr. Haldol-delier",'1940-03-02'),
(24,"Mr. Risperidon-dement",'1940-03-03'),
(25,"Mevr. Antidepr-NoComorbid-70y",'1950-01-01'),
(26,"Mevr. Antidepr-depr2mos",'1940-03-04'),
(27,"Mevr. Antidepr-depr8mos-natrium",'1940-03-05'),
(28,"Mevr. Antidepr-angst",'1940-03-06'),
(29,"Mevr. Fluoxetine",'1940-03-07'),
(30,"Mevr. Antidepr-oldNatrium",'1940-03-08'),
(31,"Mevr. Antidepr-allergy",'1940-03-09'),
(32,"Mevr. Antidepr-hyponatremia",'1940-03-10'),
(33,"Mr. ParkmedsAntichol-NoComorbid",'1940-03-11'),
(34,"Mr. Parkmeds-park",'1940-03-12'),
(35,"Mr. Parkmeds-allergy",'1940-03-13'),
(36,"Mr. Parkmeds-park-OH",'1940-03-14'),
(37,"Mevr. Antiep-NoComorbid",'1940-03-15'),
(38,"Mevr. AntiepBarbituate",'1940-03-16'),
(39,"Mevr. AntiepLevetiracetam",'1940-03-17'),
(40,"Mevr. Antiep-allergy",'1940-03-18'),
(41,"Mr. Diuretic-NoComorbid",'1940-03-19'),
(42,"Mr. Lisdiuretic-hartfalen",'1940-03-20'),
(43,"Mr. Bumetanide-hartfalen",'1940-03-21'),
(44,"Mr. Lisdiuretic-hypert",'1940-03-22'),
(45,"Mr. Thiazide-hypokalemia",'1940-03-23'),
(46,"Mr. Thiazide-hyponatremia",'1940-03-24'),
(47,"Mr. Thiazide-hypercalcemia",'1940-03-25'),
(48,"Mr. Thiazide-jicht",'1940-03-26'),
(49,"Mr. Diuretic-allergy",'1940-03-27'),
(50,"Mr. Antihypert-NoComorbid",'1940-03-28'),
(51,"Mr. Antihypert-park-OH",'1940-03-29'),-- are other antihypertensives and parkinson covered somewhere?
(52,"Mr. Antihypert-allergy",'1940-03-30'),
(53,"Mr. Antiarryth-NoComorbid",'1940-03-31'),
(54,"Mr. Antiarryth-allergy",'1940-04-01'),
(55,"Mr. Vasodilat-hypert",'1940-04-02'),
(56,"Mr. Vasodilat-NoComorbid",'1940-04-03'),
(57,"Mr. Nicorandil",'1940-04-04'),
(58,"Mr. Nicorandil-allergy",'1940-04-05'),
(59,"Mr. BetaB-NoComorbid",'1940-04-06'),
(60,"Mr. BetaBNS-diabetes",'1940-04-07'),
(61,"Mr. BetaBSel-diabetes",'1940-04-08'),
(62,"Mr. BetaB-AFib",'1940-04-09'),
(63,"Mr. BetaB-allergy",'1940-04-10'),
(64,"Mr. ACEi-NoComorbid",'1940-04-11'),
(65,"Mr. ACEi-allergy",'1940-04-12'),
(66,"Mr. Statin-NoComorbid",'1940-04-13'),
(67,"Mr. Statin-allergy",'1940-04-14'),
(68,"Mr. Diuretic-ACEi",'1940-04-15'),
(69,"Mr. Amlodipine",'1940-04-16'),
(70,"Mr. Diuretic-park-OH",'1940-04-17'),
(71,"Mr. PeriphVasodil",'1940-04-18'),
(72,"Mr. BBThiaz",'1940-04-19'),
(73,"Mr. BBOtherDiuretic",'1940-04-20'),
(74,"Mr. StatinAmlodipine",'1940-04-21'),
(75,"Mr. StatinAmlodipineACEi",'1940-04-22'),
(76,"Mevr. Opiate-NoComorbid",'1940-04-23'),
(77,"Mevr. Oxymorphone",'1940-04-24'),
(78,"Mevr. Opiate-NormEGFR",'1940-04-25'),
(79,"Mevr. Opiate-LowEGFR",'1940-04-26'),
(80,"Mevr. Opiate-OldEGFR",'1940-04-27'),
(81,"Mevr. Tramadol",'1940-04-28'),
(82,"Mevr. Opiate-allergy",'1940-04-29'),
(83,"Mr. NSAID-NoComorbid",'1940-04-30'),
(84,"Mr. NSAID-Paracetamol",'1940-05-01'),
(85,"Mr. NSAID-NormEGFR",'1940-05-02'),
(86,"Mr. NSAID-LowEGFR",'1940-05-03'),
(87,"Mr. NSAID-OldEGFR",'1940-05-04'),
(88,"Mr. NSAID-allergy",'1940-05-05'),
(89,"Mr. Indometacin",'1940-05-06'),
(90,"Mevr. Relax-NoComorbid",'1940-05-07'),
(91,"Mevr. Relax-Dwarslesie",'1940-05-08'),
(92,"Mevr. Relax-NormEGFR",'1940-05-09'),
(93,"Mevr. Relax-LowEGFR",'1940-05-10'),
(94,"Mevr. Relax-OldEGFR",'1940-05-11'),
(95,"Mevr. Relax-allergy",'1940-05-12'),
(96,"Mevr. Methocarbamol",'1940-05-13'),
(97,"Mr. Neuropath-NoComorbid",'1940-05-14'),
(98,"Mr. Neuropath-Allergy",'1940-05-15'),
(99,"Mevr. Antihist-NoComorbid",'1940-05-16'),
(100,"Mevr. Promethazine",'1940-05-17'),
(101,"Mevr. Cyproheptadine",'1940-05-18'),
(102,"Mevr. Cyproheptadine-Parkinson",'1940-05-19'),
(103,"Mevr. Antihist-Allergy",'1940-05-20'),
(104,"Mr. Antichol-NoComorbid",'1940-05-21'),
(105,"Mr. Antichol-Allergy",'1940-05-22'),
(106,"Mr. Butylscopolamine-NoComorbid",'1940-05-23'),
(107,"Mr. Butylscopolamine-Allergy",'1940-05-24'),
(108,"Mevr. Spasmolytic-NoComorbid",'1940-05-25'),
(109,"Mevr. Spasmolytic-Allergy",'1940-05-26'),
(110,"Mr. Alphablokker-NoComorbid",'1940-05-27'),
(111,"Mr. Terazosin-allergy",'1940-05-28'),
(112,"Mevr. Ulcermed-NoComorbid",'1940-05-29'),
(113,"Mevr. Pantoprazole",'1940-05-30'),
(114,"Mevr. Ulcermed-AllergyNoComorbid",'1940-05-31'),
(115,"Mr. Diabetesmed-NoComorbid",'1940-06-01'),
(116,"Mr. Sulfonylureumderiv",'1940-06-02'),
(117,"Mr. DPP4",'1940-06-03'),
(118,"Mr. GLP-1",'1940-06-04'),
(119,"Mr. SGLT2",'1940-06-05'),
(120,"Mr. Diabetesmed-Allergy",'1940-06-06'),
(121,"Mevr. Cholinesterase-NoComorbid",'1940-06-07'),
(122,"Mevr. Cholinesterase-Allergy",'1940-06-08'),
(123,"Mr. Avertigo-NoComorbid",'1940-06-09'),
(124,"Mr. Avertigo-Allergy",'1940-06-10'),
(125,"Mevr. Sympathomimetic-NoComorbid",'1940-06-11'),
(126,"Mr. CombiC09BA",'1940-06-13'),
(127,"Mr. CombiBB",'1940-06-14'),
(128,"Mr. CombiNSAID",'1940-06-15'),
(129,"Mr. CombiNaproxPPI",'1940-06-16');

UPDATE patient SET age = FLOOR(DATEDIFF(NOW(), birth_date)/365.25);

/* fake patients for validating rules */
INSERT INTO patient (id,display_name,birth_date,age) VALUES
(131,"Mr. ACEThiaz + Hartfalen",'1940-06-16',81),
(132,"Mw. Cardio-NoProb",'1940-06-16',81),
(133,"Mr. Diuretic-noACEi",'1940-06-16',81),
(134,"Mr. BBlis",'1940-06-16',81),
(135,"Mw. Digoxine",'1940-06-16',81),
(136,"Mr. Statin",'1940-06-16',81),
(137,"Mr. Painladder",'1940-06-16',81),
(138,"Mw. SSRI-NoProb",'1940-06-16',81),
(139,"Mr. TCA-depress",'1940-06-16',81),
(140,"Mw. TCA-anxiety",'1942-06-16',79),
(141,"Mr. Benzo-anxiety",'1940-06-16',81),
(142,"Mr. Benzo-noreason",'1940-06-16',81);

/* fake patients for usability */
INSERT INTO patient (id,display_name,birth_date,age) VALUES
(143,"Mw. Usability",'1940-06-16',81);

/* fake patients for validation 2 */
INSERT INTO patient (id,display_name,birth_date,age) VALUES
(144,"Mr.SedPark",'1940-06-16',81),
(145,"Mw.AntipsyDelier",'1940-06-16',81),
(146,"Mr.AntipsyDement",'1940-06-16',81),
(147,"Mr.AntipsySchizo",'1940-06-16',81),
(148,"Mr.AntipsyNoReason",'1940-06-16',81),
(149,"Mw.Prozac",'1940-06-16',81),
(150,"Mr.Antiep",'1940-06-16',81),
(151,"Mr.CombiStatin",'1940-06-16',81),
(152,"Mw.NormalRenal",'1940-06-16',81),
(153,"Mw.LowRenal",'1940-06-16',81),
(154,"Mw.Neuropath",'1940-06-16',81),
(155,"Mw.Antihist",'1940-06-16',81),
(156,"Mr.ED",'1940-06-16',81),
(157,"Mr.DPP4",'1940-06-16',81),
(158,"Mr.GLP1",'1940-06-16',81),
(159,"Mr.SGLT2",'1940-06-16',81);

/* fake patients for automated tests */
INSERT INTO patient (id,display_name,birth_date,age) VALUES
(160,"Mr.Test0",'1940-06-16',81),
(161,"Mw.Test1",'1940-06-16',81),
(162,"Mr.Test2",'1940-06-16',81),
(163,"Mw.Test3",'1940-06-16',81),
(164,"Mw.Test4",'1940-06-16',81),
(165,"Mw.Test5",'1940-06-16',81),
(166,"Mw.Test6",'1940-06-16',81),
(167,"Mw.Test7",'1940-06-16',81),
(168,"Mw.Test8",'1940-06-16',81),
(169,"Mw.Test9",'1940-06-16',81);

/* fake patients for prediction model tests */
INSERT INTO patient (id,display_name,birth_date,age) VALUES
(170,"Mevr. User-Entered",'1940-06-16',81),
(171,"Mevr. User-Entered1",'1940-06-16',81),
(172,"Mevr. User-Entered2",'1940-06-16',81),
(173,"Mevr. User-Entered3",'1940-06-16',81);
