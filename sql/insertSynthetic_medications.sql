-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
INSERT INTO patient_medication (patient_id, date_retrieved, medication_name, generic_name, ATC_code, start_date) VALUES
(2,(select NOW()),"darifenacin","darifenacin","G04BD10",'2019-02-11'),
(4,(select NOW()),"diazepam","diazepam","N05BA01",(select NOW())),
(5,(select NOW()),"diazepam","diazepam","N05BA01",'2019-02-11'),
(6,(select NOW()),"diazepam","diazepam","N05BA01",'2019-02-11'),
(7,(select NOW()),"diazepam","diazepam","N05BA01",'2019-02-11'),
(8,(select NOW()),"diazepam","diazepam","N05BA01",'2019-02-11'),
(9,(select NOW()),"zolpidem","zolpidem","N05CF02",'2019-02-11'),
(9,(select NOW()),"ketoconazol","ketoconazol","J02AB02",'2019-02-11'),
(10,(select NOW()),"diazepam","diazepam","N05BA01",'2019-02-11'),
(11,(select NOW()),"scopolamine","scopolamine","N05CM05",'2019-02-11'),
(12,(select NOW()),"Buspar","buspiron","N05BE01",'2019-02-11'),
(13,(select NOW()),"Buspar","buspiron","N05BE01",'2019-02-11'),
(14,(select NOW()),"haloperidol","haloperidol","N05AD01",'2019-02-11'),
(15,(select NOW()),"quetiapine","quetiapine","N05AH04",'2019-02-11'),
(16,(select NOW()),"haloperidol","haloperidol","N05AD01",'2019-02-11'),
(17,(select NOW()),"haloperidol","haloperidol","N05AD01",'2019-02-11'),
(18,(select NOW()),"haloperidol","haloperidol","N05AD01",'2019-02-11'),
(19,(select NOW()),"clozapine","clozapine","N05AH02",'2019-02-11'),
(20,(select NOW()),"haloperidol","haloperidol","N05AD01",'2019-02-11'),
(21,(select NOW()),"quetiapine","quetiapine","N05AH04",'2019-02-11'),
(22,(select NOW()),"haloperidol","haloperidol","N05AD01",'2019-02-11'),
(23,(select NOW()),"haloperidol","haloperidol","N05AD01",'2019-02-11'),
(24,(select NOW()),"risperidon","risperidon","N05AX08",'2019-02-11'),
(25,(select NOW()),"amitriptyline","amitriptyline","N06AA09",'2019-02-11'),
(26,(select NOW()),"amitriptyline","amitriptyline","N06AA09",(select DATE_SUB(NOW(), INTERVAL 2 MONTH))),
(27,(select NOW()),"amitriptyline","amitriptyline","N06AA09",'2020-08-01'),
(28,(select NOW()),"sertraline","sertraline","N06AB06",'2019-02-11'),
(29,(select NOW()),"fluoxetine","fluoxetine","N06AB03",'2019-02-11'),
(30,(select NOW()),"escitalopram","escitalopram","N06AB10",'2019-02-11'),
(31,(select NOW()),"escitalopram","escitalopram","N06AB10",'2019-02-11'),
(32,(select NOW()),"escitalopram","escitalopram","N06AB10",'2019-02-11'),
(33,(select NOW()),"biperideen","biperideen","N04AA02",'2019-02-11'),
(34,(select NOW()),"levodopa","levodopa","N04BA01",'2019-02-11'),
(35,(select NOW()),"levodopa","levodopa","N04BA01",'2019-02-11'),
(36,(select NOW()),"levodopa","levodopa","N04BA01",'2019-02-11'),
(37,(select NOW()),"carbamazepine","carbamazepine","N03AF01",'2019-02-11'),
(38,(select NOW()),"fenobarbital","fenobarbital","N03AA02",'1980-01-01'),
(39,(select NOW()),"levetiracetam","levetiracetam","N03AX14",'2019-02-11'),
(40,(select NOW()),"levetiracetam","levetiracetam","N03AX14",'2019-02-11'),
(41,(select NOW()),"Lasix","furosemide","C03CA01",'2019-02-11'),
(42,(select NOW()),"Lasix","furosemide","C03CA01",'2019-02-11'),
(43,(select NOW()),"bumetanide","bumetanide","C03CA02",'2019-02-11'),
(44,(select NOW()),"Lasix","furosemide","C03CA01",'2019-02-11'),
(45,(select NOW()),"hydrochlorothiazide","hydrochloorthiazide","C03AA03",'2019-02-11'),
(46,(select NOW()),"hydrochlorothiazide","hydrochloorthiazide","C03AA03",'2019-02-11'),
(47,(select NOW()),"hydrochlorothiazide","hydrochloorthiazide","C03AA03",'2019-02-11'),
(48,(select NOW()),"hydrochlorothiazide","hydrochloorthiazide","C03AA03",'2019-02-11'),
(49,(select NOW()),"Lasix","furosemide","C03CA01",'2019-02-11'),
(50,(select NOW()),"reserpine","reserpine","C02AA02",'2019-02-11'),
(51,(select NOW()),"reserpine","reserpine","C02AA02",'2019-02-11'),
(52,(select NOW()),"reserpine","reserpine","C02AA02",'2019-02-11'),
(53,(select NOW()),"verapamil","verapamil","C08DA01",'2019-02-11'),
(54,(select NOW()),"verapamil","verapamil","C08DA01",'2019-02-11'),
(55,(select NOW()),"prazosin","prazosin","C02CA01",'2019-02-11'),
(56,(select NOW()),"prazosin","prazosin","C02CA01",'2019-02-11'),
(57,(select NOW()),"nicorandil","nicorandil","C01DX16",'2019-02-11'),
(58,(select NOW()),"nicorandil","nicorandil","C01DX16",'2019-02-11'),
(59,(select NOW()),"sotalol","sotalol","C07AA07",'2019-02-11'),
(60,(select NOW()),"sotalol","sotalol","C07AA07",'2019-02-11'),
(61,(select NOW()),"metoprolol","metoprolol","C07AB02",'2019-02-11'),
(62,(select NOW()),"metoprolol","metoprolol","C07AB02",'2019-02-11'),
(63,(select NOW()),"metoprolol","metoprolol","C07AB02",'2019-02-11'),
(64,(select NOW()),"quinapril","quinapril","C09AA06",'2019-02-11'),
(65,(select NOW()),"quinapril","quinapril","C09AA06",'2019-02-11'),
(66,(select NOW()),"simvastatine","simvastatine","C10AA01",'2019-02-11'),
(67,(select NOW()),"simvastatine","simvastatine","C10AA01",'2019-02-11'),
(68,(select NOW()),"hydrochlorothiazide","hydrochloorthiazide","C03AA03",'2019-02-11'),
(68,(select NOW()),"enalapril","enalapril","C09AA02",'2019-02-11'),
(69,(select NOW()),"amlodipine","amlodipine","C08CA01",'2019-02-11'),
(70,(select NOW()),"hydrochlorothiazide","hydrochloorthiazide","C03AA03",'2019-02-11'),
(71,(select NOW()),"buphenine","buphenine","C04AA02",'2019-02-11'),
(72,(select NOW()),"metoprolol and thiazides","metoprolol and thiazides","C07BB02",'2019-02-11'),
(73,(select NOW()),"metoprolol and other diuretics","metoprolol and other diuretics","C07CB02",'2019-02-11'),
(74,(select NOW()),"atorvastatin and amlodipine","atorvastatin and amlodipine","C10BX03",'2019-02-11'),
(75,(select NOW()),"rosuvastatin, amlodipine and lisinopril ","rosuvastatin, amlodipine and lisinopril ","C10BX07",'2019-02-11'),
(76,(select NOW()),"morfine","morfine","N02AA01",'2019-02-11'),
(77,(select NOW()),"oxymorphone","oxymorphone","N02AA11",'2019-02-11'),
(78,(select NOW()),"morfine","morfine","N02AA01",'2019-02-11'),
(79,(select NOW()),"morfine","morfine","N02AA01",'2019-02-11'),
(80,(select NOW()),"morfine","morfine","N02AA01",'2019-02-11'),
(81,(select NOW()),"tramadol","tramadol","N02AX02",'2019-02-11'),
(82,(select NOW()),"oxycodon","oxycodon","N02AA05",'2019-02-11'),
(83,(select NOW()),"diclofenac","diclofenac","M01AB05",'2019-02-11'),
(84,(select NOW()),"diclofenac","diclofenac","M01AB05",'2019-02-11'),
(84,(select NOW()),"paracetamol, combinations excluding psycholeptics","paracetamol, combinations excluding psycholeptics","N02BE51",'2019-02-11'),
(85,(select NOW()),"diclofenac","diclofenac","M01AB05",'2019-02-11'),
(86,(select NOW()),"diclofenac","diclofenac","M01AB05",'2019-02-11'),
(87,(select NOW()),"diclofenac","diclofenac","M01AB05",'2019-02-11'),
(88,(select NOW()),"diclofenac","diclofenac","M01AB05",'2019-02-11'),
(89,(select NOW()),"indometacin","indometacin","M01AB01",'2019-02-11'),
(90,(select NOW()),"pancuronium","pancuronium","M03AC01",'2019-02-11'),
(91,(select NOW()),"pancuronium","pancuronium","M03AC01",'2019-02-11'),
(92,(select NOW()),"pancuronium","pancuronium","M03AC01",'2019-02-11'),
(93,(select NOW()),"pancuronium","pancuronium","M03AC01",'2019-02-11'),
(94,(select NOW()),"pancuronium","pancuronium","M03AC01",'2019-02-11'),
(95,(select NOW()),"pancuronium","pancuronium","M03AC01",'2019-02-11'),
(96,(select NOW()),"methocarbamol","methocarbamol","M03BA03",'2019-02-11'),
(97,(select NOW()),"gabapentin","gabapentin","N03AX12",'2019-02-11'),
(98,(select NOW()),"gabapentin","gabapentin","N03AX12",'2019-02-11'),
(99,(select NOW()),"loratadine","loratadine","R06AX13",'2019-02-11'),
(100,(select NOW()),"promethazine","promethazine","R06AD02",'2019-02-11'),
(101,(select NOW()),"cyproheptadine","cyproheptadine","R06AX02",'2019-02-11'),
(102,(select NOW()),"cyproheptadine","cyproheptadine","R06AX02",'2019-02-11'),
(103,(select NOW()),"loratadine","loratadine","R06AX13",'2019-02-11'),
(104,(select NOW()),"dicyclomine","dicyclomine","A03AA07",'2019-02-11'),
(105,(select NOW()),"dicyclomine","dicyclomine","A03AA07",'2019-02-11'),
(106,(select NOW()),"butylscopolamine","butylscopolamine","A03BB01",'2019-02-11'),
(107,(select NOW()),"butylscopolamine","butylscopolamine","A03BB01",'2019-02-11'),
(108,(select NOW()),"flavoxaat","flavoxaat","G04BD02",'2019-02-11'),
(109,(select NOW()),"flavoxaat","flavoxaat","G04BD02",'2019-02-11'),
(110,(select NOW()),"tamsulosin","tamsulosin","G04CA02",'2019-02-11'),
(111,(select NOW()),"terazosin","terazosin","G04CA03",'2019-02-11'),
(112,(select NOW()),"omeprazol","omeprazol","A02BC01",'2019-02-11'),
(113,(select NOW()),"pantoprazol","pantoprazol","A02BC02",'2019-02-11'),
(114,(select NOW()),"omeprazol","omeprazol","A02BC01",'2019-02-11'),
(115,(select NOW()),"gliclazide","gliclazide","A10BB09",'2019-02-11'),
(116,(select NOW()),"glipizide","glipizide","A10BB07",'2019-02-11'),
(117,(select NOW()),"sitagliptin","sitagliptin","A10BH01",'2019-02-11'),
(118,(select NOW()),"lixisenatide","lixisenatide","A10BJ03",'2019-02-11'),
(119,(select NOW()),"dapagliflozin","dapagliflozin","A10BK01",'2019-02-11'),
(120,(select NOW()),"gliclazide","gliclazide","A10BB09",'2019-02-11'),
(121,(select NOW()),"rivastigmine","rivastigmine","N06DA03",'2019-02-11'),
(122,(select NOW()),"rivastigmine","rivastigmine","N06DA03",'2019-02-11'),
(123,(select NOW()),"piracetam","piracetam","N06BX03",'2019-02-11'),
(124,(select NOW()),"cinnarizine","cinnarizine","N07CA02",'2019-02-11'),
(125,(select NOW()),"salmeterol","salmeterol","R03AC12",'2019-02-11'),
(126,(select NOW()),"enalapril and diuretics","enalapril and diuretics","C09BA02",'2019-02-11'),
(127,(select NOW()),"atenolol, thiazides and other diuretics","atenolol, thiazides and other diuretics","C07DB01",'2019-02-11'),
(128,(select NOW()),"diclofenac topical","diclofenac topical","D11AX18",'2019-02-11'),
(129,(select NOW()),"naproxen and esomeprazol","naproxen and esomeprazol","M01AE52",'2019-02-11');

/* fake patients for validating rules */
INSERT INTO patient_medication (patient_id, date_retrieved, medication_name, generic_name, ATC_code, start_date) VALUES
(131,(select NOW()),"hydrochlorothiazide","hydrochloorthiazide","C03AA03",'2019-02-11'),
(131,(select NOW()),"enalapril","enalapril","C09AA02",'2019-02-11'),
(132,(select NOW()),"verapamil","verapamil","C08DA01",'2019-02-11'),
(132,(select NOW()),"lisinopril","lisinopril","C09AA03",'2019-02-11'),
(132,(select NOW()),"Lasix","furosemide","C03CA01",'2019-02-11'),
(133,(select NOW()),"hydrochlorothiazide","hydrochloorthiazide","C03AA03",'2019-02-11'),
(134,(select NOW()),"Lasix","furosemide","C03CA01",'2019-02-11'),
(134,(select NOW()),"metoprolol","metoprolol","C07AB02",'2019-02-11'),
(135,(select NOW()),"Lasix","furosemide","C03CA01",'2019-02-11'),
(135,(select NOW()),"digoxine","digoxine","C01AA05",'2019-02-11'),
(136,(select NOW()),"simvastatine","simvastatine","C10AA01",'2019-02-11'),
(137,(select NOW()),"diclofenac","diclofenac","M01AB05",'2019-02-11'),
(137,(select NOW()),"morfine","morfine","N02AA01",'2019-02-11'),
(138,(select NOW()),"citalopram","citalopram","N06AB04",'2019-02-11'),
(139,(select NOW()),"amitriptyline","amitriptyline","N06AA09",'2019-02-11'),
(140,(select NOW()),"escitalopram","escitalopram","N06AB10",'2019-02-11'),
(141,(select NOW()),"diazepam","diazepam","N05BA01",(select NOW())),
(142,(select NOW()),"temazepam","temazepam","N05CD07",(select NOW()));

/* fake patients for usability */
INSERT INTO patient_medication (patient_id, date_retrieved, medication_name, generic_name, ATC_code, start_date) VALUES
(143,(select NOW()),"metFORMINE","metformine","A10BA02",(select NOW())),
(143,(select NOW()),"TemaZEPAM","TemaZEPAM","N05CD07",(select NOW())),
(143,(select NOW()),"pantoprazol","pantoprazol","A02BC02",(select NOW())),
(143,(select NOW()),"apixaban","apixaban","B01AF02",(select NOW())),
(143,(select NOW()),"Atorvastatine","atorvastatine","C10AA05",(select NOW())),
(143,(select NOW()),"METOPROLOL","metoprolol","C07AB02",(select NOW()));

/* fake patients for validation 2 */
INSERT INTO patient_medication (patient_id, date_retrieved, medication_name, generic_name, ATC_code, start_date) VALUES
(144,(select NOW()),"Flurazepam","Flurazepam","N05CD01",(select NOW())),
(144,(select NOW()),"levodopa","levodopa","N04BA01",'2019-02-11'),

(145,(select NOW()),"Zolpidem","zolpidem","N05CF02",(select NOW())),
(145,(select NOW()),"Cobicistat","cobicistat","V03AX03",(select NOW())),
(145,(select NOW()),"quetiapine","quetiapine","N05AH04",'2019-02-11'),
(145,(select NOW()),"levodopa","levodopa","N04BA01",'2019-02-11'),

(146,(select NOW()),"Meprobamate","Meprobamate","N05BC01",(select NOW())),
(146,(select NOW()),"haloperidol","haloperidol","N05AD01",'2019-02-11'),
(146,(select NOW()),"sotalol","sotalol","C07AA07",'2019-02-11'),

(147,(select NOW()),"haloperidol","haloperidol","N05AD01",'2019-02-11'),
(147,(select NOW()),"nicorandil","nicorandil","C01DX16",'2019-02-11'),
(147,(select NOW()),"indometacin","indometacin","M01AB01",'2019-02-11'),
(147,(select NOW()),"paracetamol, combinations excluding psycholeptics","paracetamol, combinations excluding psycholeptics","N02BE51",'2019-02-11'),
(147,(select NOW()),"pancuronium","pancuronium","M03AC01",'2019-02-11'),

(148,(select NOW()),"haloperidol","haloperidol","N05AD01",'2019-02-11'),
(148,(select NOW()),"prazosin","prazosin","C02CA01",'2019-02-11'),

(149,(select NOW()),"fluoxetine","fluoxetine","N06AB03",'2019-02-11'),
(149,(select NOW()),"reserpine","reserpine","C02AA02",'2019-02-11'),

(150,(select NOW()),"carbamazepine","carbamazepine","N03AF01",'2019-02-11'),
(150,(select NOW()),"Amlodipine","amlodipine","C08CA01",'2019-02-11'),

(151,(select NOW()),"rosuvastatin, amlodipine and lisinopril","rosuvastatin, amlodipine en lisinopril","C10BX07",'2019-02-11'),

(152,(select NOW()),"tramadol","tramadol","N02AX02",'2019-02-11'),
(152,(select NOW()),"diclofenac","diclofenac","M01AB05",'2019-02-11'),
(152,(select NOW()),"pancuronium","pancuronium","M03AC01",'2019-02-11'),
(152,(select NOW()),"omeprazol","omeprazol","A02BC01",'2019-02-11'),

(153,(select NOW()),"morfine","morfine","N02AA01",'2019-02-11'),
(153,(select NOW()),"indometacin","indometacin","M01AB01",'2019-02-11'),
(153,(select NOW()),"methocarbamol","methocarbamol","M03BA03",'2019-02-11'),

(154,(select NOW()),"gabapentin","gabapentin","N03AX12",'2019-02-11'),
(154,(select NOW()),"gliclazide","gliclazide","A10BB09",'2019-02-11'),

(155,(select NOW()),"promethazine","promethazine","R06AD02",'2019-02-11'),
(155,(select NOW()),"dicyclomine","dicyclomine","A03AA07",'2019-02-11'),
(155,(select NOW()),"flavoxaat","flavoxaat","G04BD02",'2019-02-11'),

(156,(select NOW()),"butylscopolamine","butylscopolamine","A03BB01",'2019-02-11'),
(156,(select NOW()),"tamsulosin","tamsulosin","G04CA02",'2019-02-11'),
(156,(select NOW()),"sildenafil","sildenafil","G04BE03",'2019-02-11'),
(156,(select NOW()),"fentolamine","fentolamine","G04BE05",'2019-02-11'),

(157,(select NOW()),"sitagliptin","sitagliptin","A10BH01",'2019-02-11'),
(157,(select NOW()),"rivastigmine","rivastigmine","N06DA03",'2019-02-11'),

(158,(select NOW()),"lixisenatide","lixisenatide","A10BJ03",'2019-02-11'),
(158,(select NOW()),"piracetam","piracetam","N06BX03",'2019-02-11'),

(159,(select NOW()),"dapagliflozin","dapagliflozin","A10BK01",'2019-02-11'),
(159,(select NOW()),"salmeterol","salmeterol","R03AC12",'2019-02-11'),

(162,(select NOW()),"levodopa","levodopa","N04BA01",'2019-02-11'),
(168,(select NOW()),"methocarbamol","methocarbamol","M03BA03",'2019-02-11');
