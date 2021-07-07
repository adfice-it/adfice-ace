-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
SET CHARACTER SET 'utf8mb4'; -- enable unicode support in older clients
INSERT INTO patient (id,display_name,login_token,birth_date,education_level) VALUES
(1,"Mevr. Empty","mvempty",'1940-02-10',NULL),
(2,"Mevr. Predict","mvpredict",'1940-02-11',"HEAO"),
(3,"Mr. Predict","mrpredict",'1942-01-01',"Gymnasium 1 jaar");

INSERT INTO patient (id,display_name,login_token,birth_date) VALUES
(4,"Mevr. Benzo-NoComorbid","mvbenzonocomorbid",'1940-02-12'),
(5,"Mevr. Benzo-angst","mvbenzoangst",'1940-02-13'),
(6,"Mevr. Benzo-epilepsy","mvbenzoepilepsy",'1940-02-14'),
(7,"Mevr. Benzo-allergy","mvbenzoallergy",'1940-02-15'),
(8,"Mevr. Benzo-parkinson","mvbenzoparkinson",'1940-02-16'),
(9,"Mevr. CYP3A","mvcyp3a",'1940-02-17'),
(10,"Mevr. Benzo-angst-park","mvbenzoangstpark",'1940-02-18'),
(11,"Mevr. Scopolamine-angst","mvscopolamineangst",'1940-02-19'),
(12,"Mevr. Anxiolytic-NoComorbid","mvanxiolyticnocomorbid",'1940-02-20'),
(13,"Mevr. Anxiolytic-allergy","mvanxiolyticallergy",'1940-02-21'),
(14,"Mr. Antipsy-NoComorbid","mrantipsynocomorbid",'1940-02-22'),
(15,"Mr. Antipsy-delier","mrantipsydelier",'1940-02-23'),
(16,"Mr. Antipsy-dement","mrantipsydement",'1940-02-24'),
(17,"Mr. Antipsy-schiz","mrantipsyschiz",'1940-02-25'),
(18,"Mr. Antipsy-park","mrantipsypark",'1940-02-26'),
(19,"Mr. Clozapine-park","mrclozapinepark",'1940-02-27'),
(20,"Mr. Antipsy-allergy","mrantipsyallergy",'1940-02-28'),
(21,"Mr. Antipsy-delier-park","mrantipsydelierpark",'1940-02-29'),
(22,"Mr. Anitpsy-dement-schiz","mrantipsydementschiz",'1940-03-01'),
(23,"Mr. Haldol-delier","mrhaldoldelier",'1940-03-02'),
(24,"Mr. Risperidon-dement","mrrisperidondement",'1940-03-03'),
(25,"Mevr. Antidepr-NoComorbid-70y","mvantideprnocomorbid70y",'1950-01-01'),
(26,"Mevr. Antidepr-depr2mos","mvantideprdepr2mos",'1940-03-04'),
(27,"Mevr. Antidepr-depr8mos-natrium","mvantideprdepr8mosnatrium",'1940-03-05'),
(28,"Mevr. Antidepr-angst","mvantideprangst",'1940-03-06'),
(29,"Mevr. Fluoxetine","mvfluoxetine",'1940-03-07'),
(30,"Mevr. Antidepr-oldNatrium","mvantideproldnatrium",'1940-03-08'),
(31,"Mevr. Antidepr-allergy","mvantideprallergy",'1940-03-09'),
(32,"Mevr. Antidepr-hyponatremia","mvantideprhyponatremia",'1940-03-10'),
(33,"Mr. ParkmedsAntichol-NoComorbid","mrparkmedsanticholnocomorbid",'1940-03-11'),
(34,"Mr. Parkmeds-park","mrparkmedspark",'1940-03-12'),
(35,"Mr. Parkmeds-allergy","mrparkmedsallergy",'1940-03-13'),
(36,"Mr. Parkmeds-park-OH","mrparkmedsparkoh",'1940-03-14'),
(37,"Mevr. Antiep-NoComorbid","mvantiepnocomorbid",'1940-03-15'),
(38,"Mevr. AntiepBarbituate","mvantiepbarbituate",'1940-03-16'),
(39,"Mevr. AntiepLevetiracetam","mvantieplevetiracetam",'1940-03-17'),
(40,"Mevr. Antiep-allergy","mvantiepallergy",'1940-03-18'),
(41,"Mr. Diuretic-NoComorbid","mrdiureticnocomorbid",'1940-03-19'),
(42,"Mr. Lisdiuretic-hartfalen","mrlisdiuretichartfalen",'1940-03-20'),
(43,"Mr. Bumetanide-hartfalen","mrbumetanidehartfalen",'1940-03-21'),
(44,"Mr. Lisdiuretic-hypert","mrlisdiuretichypert",'1940-03-22'),
(45,"Mr. Thiazide-hypokalemia","mrthiazidehypokalemia",'1940-03-23'),
(46,"Mr. Thiazide-hyponatremia","mrthiazidehyponatremia",'1940-03-24'),
(47,"Mr. Thiazide-hypercalcemia","mrthiazidehypercalcemia",'1940-03-25'),
(48,"Mr. Thiazide-jicht","mrthiazidejicht",'1940-03-26'),
(49,"Mr. Diuretic-allergy","mrdiureticallergy",'1940-03-27'),
(50,"Mr. Antihypert-NoComorbid","mrantihypertnocomorbid",'1940-03-28'),
(51,"Mr. Antihypert-park-OH","mrantihypertparkoh",'1940-03-29'),-- are other antihypertensives and parkinson covered somewhere?
(52,"Mr. Antihypert-allergy","mrantihypertallergy",'1940-03-30'),
(53,"Mr. Antiarryth-NoComorbid","mrantiarrythnocomorbid",'1940-03-31'),
(54,"Mr. Antiarryth-allergy","mrantiarrythallergy",'1940-04-01'),
(55,"Mr. Vasodilat-hypert","mrvasodilathypert",'1940-04-02'),
(56,"Mr. Vasodilat-NoComorbid","mrvasodilatnocomorbid",'1940-04-03'),
(57,"Mr. Nicorandil","mrnicorandil",'1940-04-04'),
(58,"Mr. Nicorandil-allergy","mrnicorandilallergy",'1940-04-05'),
(59,"Mr. BetaB-NoComorbid","mrbetabnocomorbid",'1940-04-06'),
(60,"Mr. BetaBNS-diabetes","mrbetabnsdiabetes",'1940-04-07'),
(61,"Mr. BetaBSel-diabetes","mrbetabseldiabetes",'1940-04-08'),
(62,"Mr. BetaB-AFib","mrbetabafib",'1940-04-09'),
(63,"Mr. BetaB-allergy","mrbetaballergy",'1940-04-10'),
(64,"Mr. ACEi-NoComorbid","mraceinocomorbid",'1940-04-11'),
(65,"Mr. ACEi-allergy","mraceiallergy",'1940-04-12'),
(66,"Mr. Statin-NoComorbid","mrstatinnocomorbid",'1940-04-13'),
(67,"Mr. Statin-allergy","mrstatinallergy",'1940-04-14'),
(68,"Mr. Diuretic-ACEi","mrdiureticacei",'1940-04-15'),
(69,"Mr. Amlodipine","mramlodipine",'1940-04-16'),
(70,"Mr. Diuretic-park-OH","mrdiureticparkoh",'1940-04-17'),
(71,"Mr. PeriphVasodil","mrperiphvasodil",'1940-04-18'),
(72,"Mr. BBThiaz","mrbbthiaz",'1940-04-19'),
(73,"Mr. BBOtherDiuretic","mrbbotherdiuretic",'1940-04-20'),
(74,"Mr. StatinAmlodipine","mrstatinamlodipine",'1940-04-21'),
(75,"Mr. StatinAmlodipineACEi","mrstatinamlodipineacei",'1940-04-22'),
(76,"Mevr. Opiate-NoComorbid","mvopiatenocomorbid",'1940-04-23'),
(77,"Mevr. Oxymorphone","mvoxymorphone",'1940-04-24'),
(78,"Mevr. Opiate-NormEGFR","mvopiatenormegfr",'1940-04-25'),
(79,"Mevr. Opiate-LowEGFR","mvopiatelowegfr",'1940-04-26'),
(80,"Mevr. Opiate-OldEGFR","mvopiateoldegfr",'1940-04-27'),
(81,"Mevr. Tramadol","mvtramadol",'1940-04-28'),
(82,"Mevr. Opiate-allergy","mvopiateallergy",'1940-04-29'),
(83,"Mr. NSAID-NoComorbid","mrnsaidnocomorbid",'1940-04-30'),
(84,"Mr. NSAID-Paracetamol","mrnsaidparacetamol",'1940-05-01'),
(85,"Mr. NSAID-NormEGFR","mrnsaidnormegfr",'1940-05-02'),
(86,"Mr. NSAID-LowEGFR","mrnsaidlowegfr",'1940-05-03'),
(87,"Mr. NSAID-OldEGFR","mrnsaidoldegfr",'1940-05-04'),
(88,"Mr. NSAID-allergy","mrnsaidallergy",'1940-05-05'),
(89,"Mr. Indometacin","mrindometacin",'1940-05-06'),
(90,"Mevr. Relax-NoComorbid","mvrelaxnocomorbid",'1940-05-07'),
(91,"Mevr. Relax-Dwarslesie","mvrelaxdwarslesie",'1940-05-08'),
(92,"Mevr. Relax-NormEGFR","mvrelaxnormegfr",'1940-05-09'),
(93,"Mevr. Relax-LowEGFR","mvrelaxlowegfr",'1940-05-10'),
(94,"Mevr. Relax-OldEGFR","mvrelaxoldegfr",'1940-05-11'),
(95,"Mevr. Relax-allergy","mvrelaxallergy",'1940-05-12'),
(96,"Mevr. Methocarbamol","mvmethocarbamol",'1940-05-13'),
(97,"Mr. Neuropath-NoComorbid","mrneuropathnocomorbid",'1940-05-14'),
(98,"Mr. Neuropath-Allergy","mrneuropathallergy",'1940-05-15'),
(99,"Mevr. Antihist-NoComorbid","mvantihistnocomorbid",'1940-05-16'),
(100,"Mevr. Promethazine","mvpromethazine",'1940-05-17'),
(101,"Mevr. Cyproheptadine","mvcyproheptadine",'1940-05-18'),
(102,"Mevr. Cyproheptadine-Parkinson","mvcyproheptadineparkinson",'1940-05-19'),
(103,"Mevr. Antihist-Allergy","mvantihistallergy",'1940-05-20'),
(104,"Mr. Antichol-NoComorbid","mranticholnocomorbid",'1940-05-21'),
(105,"Mr. Antichol-Allergy","mranticholallergy",'1940-05-22'),
(106,"Mr. Butylscopolamine-NoComorbid","mrbutylscopolaminenocomorbid",'1940-05-23'),
(107,"Mr. Butylscopolamine-Allergy","mrbutylscopolamineallergy",'1940-05-24'),
(108,"Mevr. Spasmolytic-NoComorbid","mvspasmolyticnocomorbid",'1940-05-25'),
(109,"Mevr. Spasmolytic-Allergy","mvspasmolyticallergy",'1940-05-26'),
(110,"Mr. Alphablokker-NoComorbid","mralphablokkernocomorbid",'1940-05-27'),
(111,"Mr. Terazosin-allergy","mrterazosinallergy",'1940-05-28'),
(112,"Mevr. Ulcermed-NoComorbid","mvulcermednocomorbid",'1940-05-29'),
(113,"Mevr. Pantoprazole","mvpantoprazole",'1940-05-30'),
(114,"Mevr. Ulcermed-AllergyNoComorbid","mvulcermedallergynocomorbid",'1940-05-31'),
(115,"Mr. Diabetesmed-NoComorbid","mrdiabetesmednocomorbid",'1940-06-01'),
(116,"Mr. Sulfonylureumderiv","mrsulfonylureumderiv",'1940-06-02'),
(117,"Mr. DPP4","mrdpp4",'1940-06-03'),
(118,"Mr. GLP-1","mrglp1",'1940-06-04'),
(119,"Mr. SGLT2","mrsglt2",'1940-06-05'),
(120,"Mr. Diabetesmed-Allergy","mrdiabetesmedallergy",'1940-06-06'),
(121,"Mevr. Cholinesterase-NoComorbid","mvcholinesterasenocomorbid",'1940-06-07'),
(122,"Mevr. Cholinesterase-Allergy","mvcholinesteraseallergy",'1940-06-08'),
(123,"Mr. Avertigo-NoComorbid","mravertigonocomorbid",'1940-06-09'),
(124,"Mr. Avertigo-Allergy","mravertigoallergy",'1940-06-10'),
(125,"Mevr. Sympathomimetic-NoComorbid","mvsympathomimeticnocomorbid",'1940-06-11'),
(126,"Mr. CombiC09BA","mrcombic09ba",'1940-06-13'),
(127,"Mr. CombiBB","mrcombibb",'1940-06-14'),
(128,"Mr. CombiNSAID","mrcombinsaid",'1940-06-15'),
(129,"Mr. CombiNaproxPPI","mrcombinaproxppi",'1940-06-16');

UPDATE patient SET age = FLOOR(DATEDIFF(NOW(), birth_date)/365.25);

/* fake patients for validating rules */
INSERT INTO patient (id,display_name,login_token,birth_date,age) VALUES
(131,"Mr. ACEThiaz + Hartfalen","mracethiazhart",'1940-06-16',81),
(132,"Mw. Cardio-NoProb","mwcardionoprob",'1940-06-16',81),
(133,"Mr. Diuretic-noACEi","mrdiureticnoace",'1940-06-16',81),
(134,"Mr. BBlis","mrbblis",'1940-06-16',81),
(135,"Mw. Digoxine","mwdigoxine",'1940-06-16',81),
(136,"Mr. Statin","mrstatin",'1940-06-16',81),
(137,"Mr. Painladder","mrpainladder",'1940-06-16',81),
(138,"Mw. SSRI-NoProb","mwssrinoprob",'1940-06-16',81),
(139,"Mr. TCA-depress","mrtcadepress",'1940-06-16',81),
(140,"Mw. TCA-anxiety","mwtcaanxiety",'1942-06-16',79),
(141,"Mr. Benzo-anxiety","mrbenzoanxiety",'1940-06-16',81),
(142,"Mr. Benzo-noreason","mrbenzonoreason",'1940-06-16',81);

/* fake patients for usability */
INSERT INTO patient (id,display_name,login_token,birth_date,age) VALUES
(143,"Mw. Usability","mwusability",'1940-06-16',81);

/* fake patients for validation 2 */
INSERT INTO patient (id,display_name,login_token,birth_date,age) VALUES
(144,"Mr.SedPark","valid1",'1940-06-16',81),
(145,"Mw.AntipsyDelier","valid2",'1940-06-16',81),
(146,"Mr.AntipsyDement","valid3",'1940-06-16',81),
(147,"Mr.AntipsySchizo","valid4",'1940-06-16',81),
(148,"Mr.AntipsyNoReason","valid5",'1940-06-16',81),
(149,"Mw.Prozac","valid6",'1940-06-16',81),
(150,"Mr.Antiep","valid7",'1940-06-16',81),
(151,"Mr.CombiStatin","valid8",'1940-06-16',81),
(152,"Mw.NormalRenal","valid9",'1940-06-16',81),
(153,"Mw.LowRenal","valid10",'1940-06-16',81),
(154,"Mw.Neuropath","valid11",'1940-06-16',81),
(155,"Mw.Antihist","valid12",'1940-06-16',81),
(156,"Mr.ED","valid13",'1940-06-16',81),
(157,"Mr.DPP4","valid14",'1940-06-16',81),
(158,"Mr.GLP1","valid15",'1940-06-16',81),
(159,"Mr.SGLT2","valid16",'1940-06-16',81);

/* fake patients for automated tests */
INSERT INTO patient (id,display_name,login_token,birth_date,age) VALUES
(160,"Mr.Test0","ltoken0",'1940-06-16',81),
(161,"Mw.Test1","ltoken1",'1940-06-16',81),
(162,"Mr.Test2","ltoken2",'1940-06-16',81),
(163,"Mw.Test3","ltoken3",'1940-06-16',81),
(164,"Mw.Test4","ltoken4",'1940-06-16',81),
(165,"Mw.Test5","ltoken5",'1940-06-16',81),
(166,"Mw.Test6","ltoken6",'1940-06-16',81),
(167,"Mw.Test7","ltoken7",'1940-06-16',81),
(168,"Mw.Test8","ltoken8",'1940-06-16',81),
(169,"Mw.Test9","ltoken9",'1940-06-16',81);
