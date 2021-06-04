-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
-- use adfice;
INSERT INTO med_rules (medication_criteria_id, active, needs_review, medication_criteria, patient_group_criteria, preselect_criteria, selector_logic, condition_logic, reference) VALUES
("6","yes","no","benzo\'s and sedatives
N05C (Hypnotics and sedatives) EXCLUDING N05CH (melatonin)
or
N05BA Benzodiazepine derivatives ","angststoornis
and NOT epilepsy","","((atc:N05C & ! atc:N05CH) | atc:N05BA)","problem:angststoornis & ! problem:epilepsy",5),
("6a","yes","no","benzo\'s and sedatives
N05C (Hypnotics and sedatives) EXCLUDING N05CH (melatonin)
or
N05BA Benzodiazepine derivatives ","epilepsy (with or without angststoornis)","","((atc:N05C & ! atc:N05CH) | atc:N05BA)","problem:epilepsy",5),
("6b","yes","no","benzo\'s and sedatives
N05C (Hypnotics and sedatives) EXCLUDING N05CH (melatonin)
or
N05BA Benzodiazepine derivatives ","not angststoornis and not epilepsy","","((atc:N05C & ! atc:N05CH) | atc:N05BA)","!problem:angststoornis & ! problem:epilepsy",5),
("6e","yes","no","benzo\'s and sedatives
N05C (Hypnotics and sedatives) EXCLUDING N05CH (melatonin)
or
N05BA Benzodiazepine derivatives ","all","{{preselect box 1}{
SELECTOR() AND CONDITION(
NOT angststoornis (probleemlijst)
AND NOT epilepsy (probleemlijst)
AND start date < 2 weeks ago)
}}

{{preselect box 2}{
(SELECTOR() AND CONDITION(NOT angststoornis (probleemlijst)
AND NOT epilepsy (probleemlijst)
AND start date > 2 weeks ago))

OR
(SELECTOR() AND CONDITION(Parkinson (probleemlijst)
OR Lewy-bodies dementie (probleemlijst)
OR Multiple system atrophy (probleemlijst) 
OR progressive supranuclear palsy (probleemlijst)))

OR
(SELECTOR(N05CM05) AND CONDITION())
}}","((atc:N05C & ! atc:N05CH) | atc:N05BA)","",5),
("7","yes","no","benzo\'s and sedatives  except lorazepam or temazepam","all","","(atc:N05C & ! atc:N05CH & ! atc:N05CD07) | (atc:N05BA & ! atc:N05BA06)","",5),
("8","yes","no","benzo\'s and sedatives
N05C (Hypnotics and sedatives) EXCLUDING N05CH (melatonin)
or
N05BA Benzodiazepine derivatives ","bijwerking","","((atc:N05C & ! atc:N05CH) | atc:N05BA)","allergic-reaction",5),
("9","yes","no","benzo\'s and sedatives
N05C (Hypnotics and sedatives) EXCLUDING N05CH (melatonin)
or
N05BA Benzodiazepine derivatives ","Parkinson and parkinson-like conditions","","((atc:N05C & ! atc:N05CH) | atc:N05BA)","(problem:parkinson | problem:lewy-bodies-dementia | problem:multiple-system-atrophy | problem:progressive-supranuclear-palsy )",5),
("10","yes","no","(Alprazolam OR triazolam OR zolpidem OR zopiclon)","AND (ketoconazol, posaconazol, voriconazol, itraconazol, claritromycine, cobicistat, ritonavir, saquinavir OR lopinavir) (Omitting topicals D01AC08 G01AF11)","","(atc:N05BA12 | atc:N05CD05 | atc:N05CF02 | atc:N05CF01 )","(atc:J02AB02 | atc:J02AC04 | atc:J02AC03 | atc:J02AC02 | atc:J01FA09 | atc:V03AX03 | atc:J05AE03 | atc:J05AE01 | atc:J05AR10 )",5),
("11","yes","no","benzo\'s and sedatives
N05C (Hypnotics and sedatives) EXCLUDING N05CH (melatonin)
or
N05BA Benzodiazepine derivatives ","all","{{preselect box 1 if a stop-, afbouw-, or vervangen- option is checked}}","((atc:N05C & ! atc:N05CH) | atc:N05BA)","",5),
("12","yes", "no", "anxiolytica", "not angststoornis", "", "atc:N05B & !atc:N05BA & !atc:N05BB", "!problem:angststoornis & ! problem:slaapstoornis",5),
("13","yes","no","anxiolytica
N05B Anxiolytics 
excluding benzos (covered above) and antihistamines","all","","atc:N05B & !atc:N05BA & !atc:N05BB","",6),
("13a","yes","no","anxiolytica
N05B Anxiolytics 
excluding benzos (covered above) and antihistamines","all","{{preselect box 1 if a stop-, afbouw-, or vervangen- option is checked}}","atc:N05B & !atc:N05BA & !atc:N05BB","",6),
("13b","yes","no","anxiolytica
N05B Anxiolytics 
excluding benzos (covered above) and antihistamines","bijwerking","","atc:N05B & !atc:N05BA & !atc:N05BB","allergic-reaction",6),
("14","yes","no","antipsychotics N05A","delier or dementie","","atc:N05A","(problem:delier | problem:dementie)",7),
("14a","yes","no","antipsychotics N05A AND NOT (haloperidol or risperidon)","delier AND NOT Parkinson-like diseases","","(atc:N05A & ! atc:N05AD01 & ! atc:N05AX08)","problem:delier & ! problem:parkinson & ! problem:lewy-bodies-dementia & ! problem:multiple-system-atrophy & ! problem:progressive-supranuclear-palsy",7),
("14b","yes","no","antipsychotics N05A and NOT risperidon","dementie and NOT delier and NOT Parkinson-like diseases","","(atc:N05A & ! atc:N05AX08)","problem:dementie & ! problem:parkinson & ! problem:lewy-bodies-dementia & ! problem:multiple-system-atrophy & ! problem:progressive-supranuclear-palsy & ! problem:delier",7),
("14c","yes","no","antipsychotics N05A","schizofrenie","","atc:N05A","problem:schizofrenie",7),
("14d","yes","no","antipsychotics N05A","NOT delier
NOT dementia
NOT schizofrenie","","atc:N05A","! problem:delier & ! problem:dementie & ! problem:schizofrenie",7),
("15","yes","no","any antipsychotic other than clozapine","Parkinson or parkinson-like conditions","","(atc:N05A & !atc:N05AH02)","(problem:parkinson | problem:lewy-bodies-dementia | problem:multiple-system-atrophy | problem:progressive-supranuclear-palsy )",7),
("16","yes","no","antipsychotics N05A","all","{{preselect box 2}{SELECTOR(N05AA01 OR N05AA03 OR N05AB03 OR N05AB06 OR N05AC02 OR N05AH03 OR N05AH04) AND CONDITION()}}","atc:N05A","",7),
("17","yes","no","antipsychotics N05A","bijwerking","","atc:N05A","allergic-reaction",7),
("18","yes","no","antipsychotics N05A","all","{{preselect box 1 if a stop-, afbouw-, or vervangen- option is checked}}","atc:N05A","",7),
("19","yes","no","antidepressants N06A","medication started less than 6 months ago & depressie","","atc:N06A","medication.startDate > now-6-months & problem:depressie",8),
("19a","yes","no","antidepressants N06A","medication  started more than 6 months ago & depressie","","atc:N06A","medication.startDate <= now-6-months & problem:depressie",8),
("19b","yes","no","antidepressants N06A","angststoornis NOT depressie","","atc:N06A","problem:angststoornis & ! problem:depressie",8),
("19c","yes","no","antidepressants N06A","NOT depressie and NOT angststoornis","","atc:N06A"," ! problem:depressie & ! problem:angststoornis",8),
("19d","yes","no","antidepressants N06A","all","","atc:N06A","",8),
("19e","yes","no","fluoxetine N06AB03","all","","atc:N06AB03","",8),
("19f","yes","no","antidepressants N06A","all","{{preselect box 1}{
(SELECTOR() AND CONDITION(NOT
depressie (probleemlijst) AND NOT angststoornis (probleemlijst)))

OR
(SELECTOR(N06AA OR N06AB05) AND CONDITION()
)
}}","atc:N06A","",8),
("20","yes","no","antidepressants  excluding citalopram, sertraline, nortriptyline","all","","atc:N06A & ! atc:N06AB04 & ! atc:N06AB06 & ! atc:N06AA10","",8),
("21","yes","no","antidepressants  excluding citalopram, sertraline, nortriptyline","age < 80","","(atc:N06A & ! atc:N06AB04 & ! atc:N06AB06 & ! atc:N06AA10)","age < 80",8),
("22","yes","no","antidepressants  excluding citalopram, sertraline, nortriptyline","age >= 80","","(atc:N06A & ! atc:N06AB04 & ! atc:N06AB06 & ! atc:N06AA10)"," age >= 80",8),
("23","yes","no","antidepressants N06A","no natrium level","","atc:N06A","(no measurement.natrium.value)",8),
("24","yes","no","antidepressants N06A","old natrium level","","atc:N06A","(measurement.natrium.date >= now-11-months)",8),
("25","yes","no","antidepressants N06A","bijwerking","","atc:N06A","(problem:hyponatremia | problem:orthostatische-hypotensie | problem:tachycardia | problem:arrhythmia | measurement.natrium.value < 135 | allergic-reaction)",8),
("25a","yes","no","antidepressants N06A","all","{{preselect vervolg if a stop-, afbouw-, or vervangen- option is checked}}","atc:N06A","",8),
("26","yes","no","Anti-parkinson drugs N04","Parkinson or parkinson-like conditions","","atc:N04","(problem:parkinson | problem:lewy-bodies-dementia | problem:multiple-system-atrophy | problem:progressive-supranuclear-palsy )",9),
("26a","yes","no","Anti-parkinson drugs N04","Parkinson or parkinson-like conditions
AND
orthostatic hypotension","","atc:N04","(problem:parkinson | problem:lewy-bodies-dementia | problem:multiple-system-atrophy | problem:progressive-supranuclear-palsy ) & problem:orthostatische-hypotensie",9),
("26b","yes","no","Anti-parkinson drugs N04","NOT Parkinson or parkinson-like conditions","","atc:N04","! (problem:parkinson | problem:lewy-bodies-dementia | problem:multiple-system-atrophy | problem:progressive-supranuclear-palsy )",9),
("27","yes","no","Anti-parkinson drugs N04","all","{{preselect box 2}{SELECTOR(N04AA01 OR N04AA02 OR N04AA04 OR N04AB02 OR N04AC01) AND CONDITION()}}","atc:N04","",9),
("27a","yes","no","Anti-parkinson drugs N04","bijwerking","","atc:N04","allergic-reaction",9),
("27b","yes","no","Anti-parkinson drugs N04","all","{{preselect box 1 if a stop-, afbouw-, or vervangen- option is checked}}","atc:N04","",9),
("28","yes","no","Antiepileptics N03","all","","atc:N03","",10),
("29","yes","no","anti-epileptica except barbituates","","","atc:N03 && ! atc:N03AA","",10),
("29a","yes", "no","Older generation antiepileptics","all","","atc:N03AB02 | atc:N03AG01 | atc:N03AF01", "",10),
("30","yes","no","anti-epileptica except lamotrigine or levetiracetam","","","atc:N03 & ! atc:N03AX09 & ! atc:N03AX14","",10),
("30a","yes","no","Antiepileptics N03","","","atc:N03","allergic-reaction",10),
("31","yes","no","Antiepileptics N03","","{{preselect box 1 if a stop-, afbouw-, or vervangen- option is checked}}","atc:N03","",10),
("35","yes","no","Diuretica: C03 diuretics, C02L Antihypertensives and diuretics in combination OR C07 systemic beta-blokker (not eyedrops)","no concomittant ACE or AT-II (C09)","","(atc:C03 | atc:C02L | atc:C07 )","! (atc:C09)",13),
("36","yes","no","Lisdiuretica:
C03CA Sulfonamides, plain 
and C03CB Sulfonamides and potassium in combination 
and C03EB High-ceiling diuretics and potassium-sparing agents ","hartfalen","{preselect box 1}{}

{preselect box 2}{}","(atc:C03CA | atc:C03CB | atc:C03EB)","problem:hartfalen",13),
("37","yes","no","Lisdiuretica except furosemide:
C03CA Sulfonamides, plain except C03CA01
and C03CB Sulfonamides and potassium in combination 
and C03EB High-ceiling diuretics and potassium-sparing agents ","hartfalen","","(atc:C03CA | atc:C03CB | atc:C03EB) & ! atc:C03CA01","problem:hartfalen",13),
("38","yes","no","Lisdiuretica:
C03CA Sulfonamides, plain 
and C03CB Sulfonamides and potassium in combination 
and C03EB High-ceiling diuretics and potassium-sparing agents ","hypertensie AND NOT
hartfalen","","(atc:C03CA | atc:C03CB | atc:C03EB)","problem:hypertensie & ! problem:hartfalen",13),
("40","yes","no","Thiazides:
C03A Low-ceiling diuretics, thiazides 
C07B Beta-blocking agents and thiazides
C03EA Low-ceiling diuretics and potassium-sparing agents ","hypokaliemie (serumconcentratie kalium < 3,0
mmol/l)","","(atc:C03A | atc:C07B | atc:C03EA)","( measurement.kalium.value < 3.0 | problem:hypokalemia)",13),
("40a","yes","no","Thiazides:
C03A Low-ceiling diuretics, thiazides 
C07B Beta-blocking agents and thiazides
C03EA Low-ceiling diuretics and potassium-sparing agents ","hyponatriemie (serumconcentratie natrium < 130 mmol/l)","","(atc:C03A | atc:C07B | atc:C03EA)","(measurement.natrium.value < 130 | problem:hyponatremia)",13),
("40b","yes","no","Thiazides:
C03A Low-ceiling diuretics, thiazides 
C07B Beta-blocking agents and thiazides
C03EA Low-ceiling diuretics and potassium-sparing agents ","hypercalciemie
(gecorrigeerd serumconcentratie niet-eiwitgebonden calcium > 2,65 mmol/l)","","(atc:C03A | atc:C07B | atc:C03EA)","(measurement.calcium.value > 2.65 | problem:hypercalciemie)",13),
("40c","yes","no","Thiazides:
C03A Low-ceiling diuretics, thiazides 
C07B Beta-blocking agents and thiazides
C03EA Low-ceiling diuretics and potassium-sparing agents ","voorgeschiedenis van jicht","","(atc:C03A | atc:C07B | atc:C03EA)"," problem:jicht",13),
("41","yes","no","Diuretica: C03 diuretics
C02L Antihypertensives and diuretics in combination 
C07B Beta blocking agents and thiazides 
C07C Beta blocking agents and other diuretics 
C07D Beta blocking agents, thiazides and other diuretics 
C09BA and C09DA ACEi and ARB with diuretics","NOT hartfalen and NOT hypertensie","","(atc:C03 | atc:C02L | atc:C07B | atc:C07C | atc:C07D | atc:C09BA | atc:C09DA)","! problem:hartfalen & ! problem:hypertensie",13),
("42","yes","no","Diuretica: C03 diuretics except lisdiruetics
C02L Antihypertensives and diuretics in combination 
C07B Beta blocking agents and thiazides 
C07C Beta blocking agents and other diuretics 
C07D Beta blocking agents, thiazides and other diuretics 
C09BA and C09DA ACEi and ARB with diuretics","all","{{preselect box 2}{
(SELECTOR(C03CA
or C03CB
or C03EB) AND CONDITION(
NOT hartfalen (probleemlijst))
)
OR
(SELECTOR() AND
CONDITION(NOT hypertensie and NOT hartfalen))

OR
(SELECTOR(C03A or C07B or C03EA)
AND CONDITION (
(kalium < 3,0
mmol/l
OR hypokalemia (probleemlijst))
OR (natrium < 130 mmol/l OR hyponatremia (probleemlijst))
OR
(gecorrigeerd niet-eiwitgebonden calcium > 2,65 mmol/l OR hypercalciemie (probleemlijst))
OR
jicht (probleemlijst))
)

OR 
(SELECTOR() AND CONDITION(
(Parkinson (probleemlijst)
OR 
Lewy-bodies dementie (probleemlijst) OR Multiple system atrophy (probleemlijst) OR progressive supranuclear palsy (probleemlijst)
)
AND
orthostatische hypotensie (probleemlijst)))

or
(SELECTOR(C07DA) AND CONDITION())
}}","((atc:C03 &! C03CA &! C03CB &! C03EB) | atc:C02L | atc:C07B | atc:C07C | atc:C07D )","",13),
("43","yes","no","Diuretica: C03 diuretics
C02L Antihypertensives and diuretics in combination 
C07B Beta blocking agents and thiazides 
C07C Beta blocking agents and other diuretics 
C07D Beta blocking agents, thiazides and other diuretics
C09BA and C09DA ACEi and ARB with diuretics","bijwerking","","(atc:C03 | atc:C02L | atc:C07B | atc:C07C | atc:C07D | atc:C09BA | atc:C09DA )","allergic-reaction",13),
("44","yes","no","Diuretica: C03 diuretics
C02L Antihypertensives and diuretics in combination 
C07B Beta blocking agents and thiazides 
C07C Beta blocking agents and other diuretics 
C07D Beta blocking agents, thiazides and other diuretics 
C09BA and C09DA ACEi and ARB with diuretics","all","{{preselect box 1 if a stop-, afbouw-, or vervangen- option is checked}}","(atc:C03 | atc:C02L | atc:C07B | atc:C07C | atc:C07D | atc:C09BA | atc:C09DA )","",13),
("45","yes","no","antihypertensives:
C02 antihypertensives,
C03 diuretics
C04 peripheral vasodilators
C07 beta blockers
C08 calcium channel blockers
C09 RAA
C10BX03 Atorvastatin and amlodipine
C10BX07 Rosuvastatin, amlodipine and lisinopril    C10BX09 Rosuvastatin and amlodipine
C10BX11 Atorvastatin, amlodipine and perindopril
C10BX14 Rosuvastatin, amlodipine and perindopril","all","","(atc:C02 | atc:C03 | atc:C04 | atc:C07 | atc:C08 | atc:C09 | atc:C10BX03 | atc:C10BX07 | atc:C10BX09 | atc:C10BX11 | atc:C10BX14)","",14),
("46","yes","no","antihypertensiva EXCEPT those which are covered by other rules: C02 antihypertensives NOT C02L (combo with diuretics), C04 peripheral vasodilators, C08 NOT C08D (selective Ca channel blockers)","all","{preselect box 1}{
(SELECTOR() AND CONDITION(Parkinson (probleemlijst)
OR 
Lewy-bodies dementie (probleemlijst) OR Multiple system atrophy (probleemlijst) OR progressive supranuclear palsy (probleemlijst)
)
AND
orthostatische hypotensie (probleemlijst))

OR (SELECTOR (C02A OR C04 OR C08 OR C02CA OR C02DA OR C02DB OR C02DC OR C02DG01 OR C02DD01) AND CONDITION())
}","(atc:C02 | atc:C04 | atc:C08) & ! atc:C02L & ! atc:C08D","",14),
("47","yes","no","antihypertensiva EXCEPT those which are covered by other rules: C02 antihypertensives NOT C02L (combo with diuretics), C04 peripheral vasodilators, C08 calcium channel blockers","bijwerking","","(atc:C02 | atc:C04 | atc:C08) & ! atc:C02L","allergic-reaction",14),
("48","yes","no","antihypertensives:
C02 antihypertensives,
C03 diuretics
C04 peripheral vasodilators
C07 beta blockers
C08 calcium channel blockers
C09 RAA
C10BX03 Atorvastatin and amlodipine
C10BX07 Rosuvastatin, amlodipine and lisinopril    C10BX09 Rosuvastatin and amlodipine
C10BX11 Atorvastatin, amlodipine and perindopril
C10BX14 Rosuvastatin, amlodipine and perindopril","Parkinson or parkinson-like condition
AND
orthostatic hypotension","","(atc:C02 | atc:C03 | atc:C04 | atc:C07 | atc:C08 | atc:C09 | atc:C10BX03 | atc:C10BX07 | atc:C10BX09 | atc:C10BX11 | atc:C10BX14)","(problem:parkinson | problem:lewy-bodies-dementia | problem:multiple-system-atrophy | problem:progressive-supranuclear-palsy ) & problem:orthostatische-hypotensie",14),
("48a","yes","no","antihypertensives EXCEPT those covered by another vervolgafspraak rule: C02 AND NOT C02L AND NOT C02CA
AND NOT C02DA 
AND NOT C02DB
AND NOT C02DC 
AND NOT C02DG01
AND NOT C02DD01","all","","(atc:C02 | atc:C04 | atc:C08) & ! atc:C02L","",14),
("49","yes","no","Antiadrenergic agents, centrally acting C02A","all","","atc:C02A","",15),
("50","yes","no","Antiaritmica: C08D Klasse IV, C01A Cardiac glycosides, C01B Antiarrhythmics, class I and III ","all","{{preselect box 1}{SELECTOR(C08D) AND CONDITION(
Parkinson (probleemlijst)
OR 
Lewy-bodies dementie (probleemlijst) OR Multiple system atrophy (probleemlijst) OR progressive supranuclear palsy (probleemlijst)
)
AND
orthostatische hypotensie (probleemlijst)
)
}}","atc:C08D | atc:C01A | atc:C01B","",16),
("50a","yes","no","Antiaritmica not covered by other rules: C01A Cardiac glycosides, C01B Antiarrhythmics, class I and III ","bijwerking","","atc:C01A | atc:C01B","allergic-reaction",16),
("50b","yes","no","Antiaritmica not covered by other rules: C01A Cardiac glycosides, C01B Antiarrhythmics, class I and III ","all","{{preselect vervolg if a stop-, afbouw-, or vervangen- option is checked}}","atc:C01A | atc:C01B","",16),
("51","yes","no","Alpha-blockers (AB) used as antihypertensives
C02CA Alpha-adrenoreceptor antagonists","all","","atc: C02CA","",17),
("51a","yes","no","vasodilators used in cardiac diseases, except alpha blockers","all","","(atc:C04 | atc:C07E | atc:C08 | atc:C02DA | atc:C02DB | atc:C02DC | atc:C02DG01 | atc:C02DD01 | atc:C01DX16 | atc:C01DA | atc:C01EA01 | atc:C10BX03 | atc:C10BX07 | atc:C10BX09 | atc:C10BX11 | atc:C10BX14)","",17),
("52","yes","no","vasodilators
Interpreted as:
C04 Peripheral vasodilators
C07E Beta blocking agents and vasodilators 
C08 calcium channel blockers
C02CA Alpha-adrenoreceptor antagonists 
C02DA Thiazide derivatives (Diazoxide)
C02DB Hydrazinophthalazine derivatives (Hydralazine etc.)
C02DC Pyrimidine derivatives (Minoxidil)
C02DG01 Pinacidil
C02DD01 nitroprusside
C01DX16 Nicorandil 
C01DA (nitroglyserine) 
C01EA01 Alprostadil
C10BX03 Atorvastatin and amlodipine
C10BX07 Rosuvastatin, amlodipine and lisinopril
C10BX09 Rosuvastatin and amlodipine
C10BX11 Atorvastatin, amlodipine and perindopril
C10BX14 Rosuvastatin, amlodipine and perindopril
vasodilantia in FK:
C02DB02 hydralazine
C02DC01 minoxidil
C01EA01 alprostae ","hypertensie","","(atc:C04 | atc:C07E | atc:C08 | atc:C02CA | atc:C02DA | atc:C02DB | atc:C02DC | atc:C02DG01 | atc:C02DD01 | atc:C01DX16 | atc:C01DA | atc:C01EA01 | atc:C10BX03 | atc:C10BX07 | atc:C10BX09 | atc:C10BX11 | atc:C10BX14)","problem:hypertensie",17),
("53","yes","no","vasodilators
Interpreted as:
C04 Peripheral vasodilators
C07E Beta blocking agents and vasodilators 
C08 calcium channel blockers
C02CA Alpha-adrenoreceptor antagonists 
C02DA Thiazide derivatives (Diazoxide)
C02DB Hydrazinophthalazine derivatives (Hydralazine etc.)
C02DC Pyrimidine derivatives (Minoxidil)
C02DG01 Pinacidil
C02DD01 nitroprusside
C01DX16 Nicorandil 
C01DA (nitroglyserine) 
C01EA01 Alprostadil
C10BX03 Atorvastatin and amlodipine
C10BX07 Rosuvastatin, amlodipine and lisinopril
C10BX09 Rosuvastatin and amlodipine
C10BX11 Atorvastatin, amlodipine and perindopril
C10BX14 Rosuvastatin, amlodipine and perindopril
vasodilantia in FK:
C02DB02 hydralazine
C02DC01 minoxidil
C01EA01 alprostae ","NOT hypertensie","","(atc:C04 | atc:C07E | atc:C08 | atc:C02CA | atc:C02DA | atc:C02DB | atc:C02DC | atc:C02DG01 | atc:C02DD01 | atc:C01DX16 | atc:C01DA | atc:C01EA01 | atc:C10BX03 | atc:C10BX07 | atc:C10BX09 | atc:C10BX11 | atc:C10BX14)","! problem:hypertensie",17),
("54","yes","no","vasodilators not covered elsewhere: C01DX16
or C01EA01","all","{{preselect box 1}{}}}","(atc:C01DX16 | atc:C01EA01)","",17),
("54a","yes","no","vasodilators not covered elsewhere: C01DX16
or C01EA01","bijwerking","","(atc:C01DX16 | atc:C01EA01)","allergic-reaction",17),
("55","yes","no","vasodilators not covered elsewhere: C01DX16
or C01EA01","all","{{preselect box 1 if a stop-, afbouw-, or vervangen- option is checked}}","(atc:C01DX16 | atc:C01EA01)","",17),
("56","yes","no","Beta-blokkers
C07 beta-blockers NOT (C07B, C07C, or C07D) (combinations with diuretics)
S01ED beta-blocker eyedrops","all","{{preselect box 1}{
SELECTOR (
C07AA
OR C07AG
OR C07BA
OR C07BG
OR C07CA
OR C07CG
OR C07EA
OR C07FX01
OR C07FX02
OR C07FX06 
OR C07FA05
OR S01ED01
OR S01ED03
OR S01ED04
OR S01ED05) AND CONDITION()

OR
SELECTOR() AND CONDITION(
(Parkinson (probleemlijst)
OR 
Lewy-bodies dementie (probleemlijst) OR Multiple system atrophy (probleemlijst) OR progressive supranuclear palsy (probleemlijst)
)
AND
orthostatische hypotensie (probleemlijst)
)

OR
(SELECTOR() AND CONDITION(
NOT atriumfibrilleren (probleemlijst) AND NOT angina pectoris (probleemlijst)
AND NOT myocardinfarct (probleemlijst)
)
)
}}","(atc:C07 | atc:S01ED) & ! atc:C07B & ! atc:C07C & ! atc:C07D","",18),
("57","yes","no","Beta-blokkers: niet selectieve 
C07AA
C07AG
C07BA
C07BG
C07CA
C07CG
C07DA
C07EA
C07FX01
C07FX02
C07FX06
C07FA05
S01ED01
S01ED03
S01ED04
S01ED05","all","","atc:C07AA | atc:C07AG | atc:C07BA | atc:C07BG | atc:C07CA | atc:C07CG | atc:C07DA | atc:C07EA | atc:C07FX01 | atc:C07FX02 | atc:C07FX06 | atc:C07FA05 | atc:S01ED01 | atc:S01ED03 | atc:S01ED04 | atc:S01ED05 ","",18),
("57a","yes","no","Beta-blokkers: niet selectieve 
C07AA
C07AG
C07BA
C07BG
C07CA
C07CG
C07DA
C07EA
C07FX01
C07FX02
C07FX06
C07FA05
S01ED01
S01ED03
S01ED04
S01ED05","diabetes","","atc:C07AA | atc:C07AG | atc:C07BA | atc:C07BG | atc:C07CA | atc:C07CG | atc:C07DA | atc:C07EA | atc:C07FX01 | atc:C07FX02 | atc:C07FX06 | atc:C07FA05 | atc:S01ED01 | atc:S01ED03 | atc:S01ED04 | atc:S01ED05 ","problem:diabetes",18),
("58","yes","no","Beta-blokkers
C07 beta-blockers NOT (C07B, C07C, or C07D) (combinations with diuretics)
S01ED beta-blocker eyedrops","NOT atriumfibrilleren
AND NOT angina pectoris
NOT MI","","(atc:C07 | atc:S01ED) & ! atc:C07B & ! atc:C07C & ! atc:C07D","! problem:atriumfibrilleren & ! problem:angina-pectoris & ! problem:myocardinfarct",18),
("59","yes","no","Beta-blokkers C07 beta-blockers NOT preferred (selective) ones: C07AB selective beta-blockers, C07BB, C07CB, C07DB selective beta-blockers in combinations) ","atriumfibrilleren
OR angina pectoris
OR MI","","(atc:C07 | atc:S01ED) & ! atc:C07AB & ! atc:C07BB & ! atc:C07CB & ! atc:C07DB","problem:atriumfibrilleren | problem:angina-pectoris | problem:myocardinfarct",18),
("60","yes","no","Beta-blokkers
C07 beta-blockers NOT (C07B, C07C, or C07D) (combinations with diuretics)
S01ED beta-blocker eyedrops","bijwerking","","(atc:C07 | atc:S01ED) & ! atc:C07B & ! atc:C07C & ! atc:C07D","allergic-reaction",18),
("61","yes","no","Beta-blokkers
C07 beta-blockers NOT (C07B, C07C, or C07D) (combinations with diuretics)
S01ED beta-blocker eyedrops","all","{{preselect box 1 if a stop-, afbouw-, or vervangen- option is checked}}","(atc:C07 | atc:S01ED) & ! atc:C07B & ! atc:C07C & ! atc:C07D","",18),
("63","yes","no","RAS-remmers: ACE-remmers, angiotensinereceptor blokkers C09 EXCEPT C09BA and C09DA (with diuretics)","all","{{preselect box 1}{SELECTOR() AND CONDITION (
(Parkinson (probleemlijst)
OR 
Lewy-bodies dementie (probleemlijst) OR Multiple system atrophy (probleemlijst) OR progressive supranuclear palsy (probleemlijst)
)
AND
orthostatische hypotensie (probleemlijst)
)
}}","atc:C09 & ! atc:C09BA & ! atc:C09DA","",20),
("63a","yes","no","RAS-remmers: ACE-remmers, angiotensinereceptor blokkers C09 EXCEPT C09BA and C09DA (with diuretics)","bijwerking","","atc:C09 & ! atc:C09BA & ! atc:C09DA","allergic-reaction",20),
("63b","yes","no","RAS-remmers: ACE-remmers, angiotensinereceptor blokkers C09 EXCEPT C09BA and C09DA (with diuretics)","all","{{preselect box 1 if a stop-, afbouw-, or vervangen- option is checked}}","atc:C09 & ! atc:C09BA & ! atc:C09DA","",20),
("64","yes","no","Statines
C10AA HMG CoA reductase inhibitors
C10BA HMG CoA reductase inhibitors in combination with other lipid modifying agents 
A10BH51 Sitagliptin and simvastatin
A10BH52 Gemigliptin and rosuvastatin","all","","atc:C10AA | atc:C10BA | atc:A10BH51 | atc:A10BH52","",21),

("64a","yes","no","Statine combinations
C10BX HMG CoA reductase inhibitors, other combinations","all","{preselect box 1}{
(SELECTOR (C10BX03
OR C10BX07
OR C10BX09
OR C10BX11
OR C10BX14)
AND CONDITION ()
)}","atc:C10BX","",21),


("65","yes","no","Statines
C10AA HMG CoA reductase inhibitors
C10BA HMG CoA reductase inhibitors in combination with other lipid modifying agents 
C10BX HMG CoA reductase inhibitors, other combinations 
A10BH51 Sitagliptin and simvastatin
A10BH52 Gemigliptin and rosuvastatin","bijwerking","","atc:C10AA | atc:C10BA | atc:C10BX | atc:A10BH51 | atc:A10BH52","allergic-reaction",21),
("66","yes","no","Statines
C10AA HMG CoA reductase inhibitors
C10BA HMG CoA reductase inhibitors in combination with other lipid modifying agents 
C10BX HMG CoA reductase inhibitors, other combinations 
A10BH51 Sitagliptin and simvastatin
A10BH52 Gemigliptin and rosuvastatin","all","{{preselect box 1 if a stop-, afbouw-, or vervangen- option is checked}}","atc:C10AA | atc:C10BA | atc:C10BX | atc:A10BH51 | atc:A10BH52","",21),
("67","yes","no","Opiates N02A ","all","{{preselect box 2}{SELECTOR(NOT N02AX02 AND NOT N02AA01 
AND NOT N02AA05 
AND NOT N02AB03 ) AND CONDITION()}}","atc:N02A","",22),
("68","yes","no","Opiates N02A ","normal renal function","","atc:N02A","measurement.eGFR.value > 30 && measurement.eGFR.date <= now-11-months",22),
("69","yes","no","Opiates N02A ","low renal function","","atc:N02A","measurement.eGFR.value <= 30  && measurement.eGFR.date <= now-11-months",22),
("70","yes","no","Opiates N02A ","unknown renal function","","atc:N02A","! measurement.eGFR",22),
("71","yes","no","Opiates N02A ","old renal function measurement","","atc:N02A","measurement.eGFR.date > now-11-months",22),
("73","yes","no","Opiates N02A NOT morphine N02AA01, oxycodone N02AA05, fentanyl N02AB03","all","","atc:N02A & ! atc:N02AA01 & ! atc:N02AA05 & ! atc:N02AB03","",22),
("75","yes","no","Opiates N02A ","bijwerking","","atc:N02A","allergic-reaction",22),
("76","yes","no","Opiates N02A ","all","{{preselect box 1 if a stop-, afbouw-, or vervangen- option is checked}}","atc:N02A","",22),
("78","yes","no","NSAIDs:(excl. combinations w/ opioids)
M01A Anti-inflammatory and antirheumatic products, non-steroids 
M01B Anti-inflammatory/antirheumatic agents in combination 
or ATC S01BC (ocular NSAIDs)
or ATC S01CC (ocular combinations with NSAIDs)
or ATC D11AX18  (diclofenac topical)","all","{{preselect box 2}{
(SELECTOR() AND CONDITION(eGFR <= 30ml/min))

OR
(SELECTOR() AND CONDITION(
ANY (
N02BE01
OR N02BE51
OR N02BE71
OR N02AJ01 
OR N02AJ06 
OR N02AJ13 
OR N02AJ17)
))
}}","atc:M01A | atc:M01B | atc:S01BC | atc:S01CC | atc:D11AX18","",24),
("79","yes","no","NSAIDs:(excl. combinations w/ opioids)
M01A Anti-inflammatory and antirheumatic products, non-steroids 
M01B Anti-inflammatory/antirheumatic agents in combination 
or ATC S01BC (ocular NSAIDs)
or ATC S01CC (ocular combinations with NSAIDs)
or ATC D11AX18  (diclofenac topical)","normal renal function","","atc:M01A | atc:M01B | atc:S01BC | atc:S01CC | atc:D11AX18","measurement.eGFR.value > 30 && measurement.eGFR.date <= now-11-months",24),
("80","yes","no","NSAIDs:(excl. combinations w/ opioids)
M01A Anti-inflammatory and antirheumatic products, non-steroids 
M01B Anti-inflammatory/antirheumatic agents in combination 
or ATC S01BC (ocular NSAIDs)
or ATC S01CC (ocular combinations with NSAIDs)
or ATC D11AX18  (diclofenac topical)","low renal function","","atc:M01A | atc:M01B | atc:S01BC | atc:S01CC | atc:D11AX18","measurement.eGFR.value <= 30",24),
("80a","yes","no","NSAIDs NOT diclofenac and (excl. combinations w/ opioids)
M01A Anti-inflammatory and antirheumatic products, non-steroids 
M01B Anti-inflammatory/antirheumatic agents in combination 
or ATC S01BC (ocular NSAIDs)
or ATC S01CC (ocular combinations with NSAIDs)
or ATC D11AX18  (diclofenac topical)","NOT low renal function","","(atc:M01A | atc:M01B | atc:S01BC | atc:S01CC | atc:D11AX18) & ! atc:M01AB05 & ! atc:M01AB55","! measurement.eGFR.value <= 30",24),
("80b","yes","no","NSAIDs NOT naproxen and (excl. combinations w/ opioids)
M01A Anti-inflammatory and antirheumatic products, non-steroids 
M01B Anti-inflammatory/antirheumatic agents in combination 
or ATC S01BC (ocular NSAIDs)
or ATC S01CC (ocular combinations with NSAIDs)
or ATC D11AX18  (diclofenac topical)","NOT low renal function","","(atc:M01A | atc:M01B | atc:S01BC | atc:S01CC | atc:D11AX18) & ! atc:M01AE02 & ! atc:M01AE52 & ! atc:M01AE56","! measurement.eGFR.value <= 30",24),
("81","yes","no","NSAIDs:(excl. combinations w/ opioids)
M01A Anti-inflammatory and antirheumatic products, non-steroids 
M01B Anti-inflammatory/antirheumatic agents in combination 
or ATC S01BC (ocular NSAIDs)
or ATC S01CC (ocular combinations with NSAIDs)
or ATC D11AX18  (diclofenac topical)","unknown renal function","","atc:M01A | atc:M01B | atc:S01BC | atc:S01CC | atc:D11AX18","! measurement.eGFR",24),
("82","yes","no","NSAIDs:(excl. combinations w/ opioids)
M01A Anti-inflammatory and antirheumatic products, non-steroids 
M01B Anti-inflammatory/antirheumatic agents in combination 
or ATC S01BC (ocular NSAIDs)
or ATC S01CC (ocular combinations with NSAIDs)
or ATC D11AX18  (diclofenac topical)","old renal function measurement","","atc:M01A | atc:M01B | atc:S01BC | atc:S01CC | atc:D11AX18","measurement.eGFR.date > now-11-months",24),
("83","yes","no","NSAIDs:(excl. combinations w/ opioids)
M01A Anti-inflammatory and antirheumatic products, non-steroids 
M01B Anti-inflammatory/antirheumatic agents in combination 
or ATC S01BC (ocular NSAIDs)
or ATC S01CC (ocular combinations with NSAIDs)
or ATC D11AX18  (diclofenac topical)","paracetamol (
N02BE01
OR N02BE51
OR N02BE71
OR N02AJ01 
OR N02AJ06 
OR N02AJ13 
OR N02AJ17)","","atc:M01A | atc:M01B | atc:S01BC | atc:S01CC | atc:D11AX18","atc:N02BE01 | atc:N02BE51 | atc:N02BE71 | atc:N02AJ01 | atc:N02AJ06 | atc:N02AJ13 | atc:N02AJ17",24),
("83a","yes","no","NSAIDs:(excl. combinations w/ opioids)
M01A Anti-inflammatory and antirheumatic products, non-steroids 
M01B Anti-inflammatory/antirheumatic agents in combination 
or ATC S01BC (ocular NSAIDs)
or ATC S01CC (ocular combinations with NSAIDs)
or ATC D11AX18  (diclofenac topical)","bijwerking","","atc:M01A | atc:M01B | atc:S01BC | atc:S01CC | atc:D11AX18","allergic-reaction",24),
("84","yes","no","NSAIDs:(excl. combinations w/ opioids)
M01A Anti-inflammatory and antirheumatic products, non-steroids 
M01B Anti-inflammatory/antirheumatic agents in combination 
or ATC S01BC (ocular NSAIDs)
or ATC S01CC (ocular combinations with NSAIDs)
or ATC D11AX18  (diclofenac topical)","all","","atc:M01A | atc:M01B | atc:S01BC | atc:S01CC | atc:D11AX18","",24),
("86","yes","no","Muscle relaxants N03","paraplegia or dwaarslaesie","","atc:M03","(problem:paraplegia | problem:dwarslesie)",25),
("87","yes","no","Muscle relaxants N03","NOT paraplegia AND NOT dwaarslaesie","","atc:M03","! problem:paraplegia & ! problem:dwarslesie",25),
("88","yes","no","Muscle relaxants N03","all","{{preselect box 2}{
(SELECTOR() AND CONDITION (NOT paraplegia (probleemlijst) AND NOT dwaarslaesie (probleemlijst)))

OR
(SELECTOR(M03BA03 OR M03BC01) AND CONDITION())
}}","atc:M03","",25),
("89","yes","no","Muscle relaxants N03","normal renal function","","atc:M03","measurement.eGFR.value > 30 && measurement.eGFR.date <= now-11-months",25),
("90","yes","no","Muscle relaxants N03","low renal function","","atc:M03","measurement.eGFR.value <= 30 && measurement.eGFR.date <= now-11-months",25),
("91","yes","no","Muscle relaxants N03","unknown renal function","","atc:M03","! measurement.eGFR",25),
("92","yes","no","Muscle relaxants N03","old renal function measurement","","atc:M03","measurement.eGFR.date > now-11-months",25),
("93","yes","no","Muscle relaxants N03","bijwerking","","atc:M03","allergic-reaction",25),
("94","yes","no","Muscle relaxants N03","all","{{preselect box 1 if a stop-, afbouw-, or vervangen- option is checked}}","atc:M03","",25),
("95","yes","no","middelen bij neuropatische pijn N03AX12 gabapentin, N03AX16 pregabalin","all","","atc:N03AX12 | atc:N03AX16","",26),
("96","yes","no","middelen bij neuropatische pijn N03AX12 gabapentin, N03AX16 pregabalin","bijwerking","","atc:N03AX12 | atc:N03AX16","allergic-reaction",26),
("97","yes","no","middelen bij neuropatische pijn N03AX12 gabapentin, N03AX16 pregabalin","all","","atc:N03AX12 | atc:N03AX16","",26),
("99","yes","no","first-generation antihistamines: 
R06AD01  alimemazine 
R06AE04 chloorcyclizine
N07CA02 cinnarizine
R06AA04 clemastine
R06AE03 cyclizine
R06AB03 dimetindeen
N05BB01 hydroxyzine
R06AX17 ketotifen
R06AE05 meclozine
R06AE55 meclozine/pyridoxine
R06AD08 oxomemazine
R06AD02 promethazine","all","","atc:R06AD01 | atc:R06AE04 | atc:N07CA02 | atc:R06AA04 | atc:R06AE03 | atc:R06AB03 | atc:N05BB01 | atc:R06AX17 | atc:R06AE05 | atc:R06AE55 | atc:R06AD08 | atc:R06AD02 ","",27),
("100","yes","no","antihistamines
R06 (all existing antihistamines are R06A)
and N07CA02 cinnarizine
and N05BB01 hydroxyzine","all","{{preselect box 3}{SELECTOR(NOT R06AX29 
AND NOT R06AE07 
AND NOT R06AE09
AND NOT R06AX13 
AND NOT R06AX27 
AND NOT R06AX22 
AND NOT R06AX26 
AND NOT R06AX25 
AND NOT R06AX28) AND CONDITION()}}","atc:R06A | atc:N07CA | atc:N05BB","",27),
("101","yes","no","antihistamines, recommended ones (R06A
, R06AX29 
, R06AE07 
, R06AE09
, R06AX13 
, R06AX27 
, R06AX22 
, R06AX26 
, R06AX25 
, R06AX28)","all","","(atc:R06A | atc:N07CA | N05BB01) & ! (atc:R06AX29 | atc:R06AE07 | atc:R06AE09 | atc:R06AX13 | atc:R06AX27 | atc:R06AX22 | atc:R06AX26 | atc:R06AX25 | atc:R06AX28 ) ","",27),
("102","yes","no","antihistamines, recommended ones (R06A
, R06AX29 
, R06AE07 
, R06AE09
, R06AX13 
, R06AX27 
, R06AX22 
, R06AX26 
, R06AX25 
, R06AX28)","Parkinson and parkinson-like conditions","","(atc:R06A | atc:N07CA | N05BB01) & ! (atc:R06AX29 | atc:R06AE07 | atc:R06AE09 | atc:R06AX13 | atc:R06AX27 | atc:R06AX22 | atc:R06AX26 | atc:R06AX25 | atc:R06AX28 ) ","(problem:parkinson | problem:lewy-bodies-dementia | problem:multiple-system-atrophy | problem:progressive-supranuclear-palsy )",27),
("103","yes","no","antihistamines
R06 (all existing antihistamines are R06A)
and N07CA antivertigo antihistamines
and N05BB01 hydroxyzine","bijwerking","","atc:R06A | atc:N07CA | atc:N05BB","allergic-reaction",27),
("104","yes","no","antihistamines
R06 (all existing antihistamines are R06A)
and N07CA antivertigo antihistamine
and N05BB01 hydroxyzine","","{{preselect box 1 if a stop-, afbouw-, or vervangen- option is checked}}","atc:R06A | atc:N07CA | atc:N05BB","",27),
("105","yes","no","anticholinergics 
A03AA07 Dicycloverine
A03AB01 Benzilone
A03AB03 Oxyphenonium
A03AB05 Propantheline
A03BB01 Butylscopolamine
G04BD02 Flavoxate
G04BD04 Oxybutynin
G04BD05 Terodiline
G04BD06 Propiverine
G04BD07 Tolterodine
G04BD08 Solifenacin
G04BD09 Trospium
G04BD10 Darifenacin
G04BD11 Fesoterodine
M03BA03 Methocarbamol
M03BC01 Orphenadrine (citrate)
N04AA01 Trihexyphenidyl
N04AA02 Biperiden
N04AA04 Procyclidine
N04AB02 Orphenadrine (chloride)
N04AC01 Benzatropine
N05AA01 Chlorpromazine
N05AA03 Promazine
N05AB03 Perphenazine
N05AB06 Trifluoperazine
N05AC02 Thioridazine
N05AH03 Olanzapine
N05AH04 Quetiapine
N05BB01 Hydroxyzine
N05CM05 Scopolamine
N06AA*  Non-selective monoamine reuptake inhibitors
N06AB05 Paroxetine
R06AA02 Diphenhydramine
R06AA04 Clemastine
R06AA08 Carbinoxamine
R06AA09 Doxylamine
R06AA52 Diphenhydramine, combinations
R06AB01 Brompheniramine
R06AB04 Chlorphenamine
R06AD02 Promethazine
R06AD05 Hydroxyethylpromethazine","all","","atc:A03AA07 | atc:A03AB05 | atc:A03BA01 | atc:A03BA03 | atc:A03BB01 | atc:G04BD02 | atc:G04BD04 | atc:G04BD05 | atc:G04BD06 | atc:G04BD07 | atc:G04BD08 | atc:G04BD09 | atc:G04BD10 | atc:G04BD11 | atc:M03BA03 | atc:M03BC01 | atc:N04AA01 | atc:N04AA02 | atc:N04AA04 | atc:N04AB02 | atc:N04AC01 | atc:N05AA01 | atc:N05AA03 | atc:N05AB03 | atc:N05AB06 | atc:N05AC02 | atc:N05AH03 | atc:N05AH04 | atc:N05BB01 | atc:N05CM05 | atc:N06AA | atc:N06AB05 | atc:R06AA02 | atc:R06AA04 | atc:R06AA08 | atc:R06AA09 | atc:R06AA52 | atc:R06AB01 | atc:R06AB04 | atc:R06AD02 | atc:R06AE05","",28),
("105a","yes","no","anticholinergics not covered by other rules: A03AB05, A03BA01, A03BA03","all","{{preselect box 1}{}}","atc:A03AA07 | atc:A03AB05 | atc:A03BA01 | atc:A03BA03","",28),
("105b","yes","no","anticholinergics not covered by other rules: A03AB05, A03BA01, A03BA03","bijwerking","","atc:A03AB05 | atc:A03BA01 | atc:A03BA03","allergic-reaction",28),
("105c","yes","no","anticholinergics not covered by other rules: A03AB05, A03BA01, A03BA03","","{{preselect box 1 if a stop-, afbouw-, or vervangen- option is checked}}","atc:A03AB05 | atc:A03BA01 | atc:A03BA03","",28),
("106","yes","no","Butylscopolamine A03BB01","","{{preselect box 1}{}}","atc:A03BB01","",28),
("107","yes","no","Butylscopolamine A03BB01","bijwerking","","atc:A03BB01","allergic-reaction",28),
("108","yes","no","Butylscopolamine A03BB01","","{{preselect box 1 if a stop-, afbouw-, or vervangen- option is checked}}","atc:A03BB01","",28),
("110","yes","no","Urologische middelen: spasmolytica. Overactive bladder and incontinence medications.
G04BD10  Darifenacine
G04BD11 Fesoterodine
G04BD02 Flavoxaat
G04BD12 Mirabegron
G04BD04 Oxybutynine
G04BD08 Solifenacine
G04BD07 Tolterodine
G04BD05 Terodiline
G04BD06 Propiverine
G04BD09 Trospium","all","","atc:G04BD10 | atc:G04BD11 | atc:G04BD02 | atc:G04BD12 | atc:G04BD04 | atc:G04BD08 | atc:G04BD07 | atc:G04BD05 | atc:G04BD06 | atc:G04BD09 ","",30),
("111","yes","no","Urologische middelen: spasmolytica
G04BD10  Darifenacine
G04BD11 Fesoterodine
G04BD02 Flavoxaat
G04BD12 Mirabegron
G04BD04 Oxybutynine
G04BD08 Solifenacine
G04BD07 Tolterodine
G04BD05 Terodiline
G04BD06 Propiverine
G04BD09 Trospium","bijwerking","","atc:G04BD10 | atc:G04BD11 | atc:G04BD02 | atc:G04BD12 | atc:G04BD04 | atc:G04BD08 | atc:G04BD07 | atc:G04BD05 | atc:G04BD06 | atc:G04BD09 ","allergic-reaction",30),
("112","yes","no","Urologische middelen: spasmolytica
G04BD10  Darifenacine
G04BD11 Fesoterodine
G04BD02 Flavoxaat
G04BD12 Mirabegron
G04BD04 Oxybutynine
G04BD08 Solifenacine
G04BD07 Tolterodine
G04BD05 Terodiline
G04BD06 Propiverine
G04BD09 Trospium","all","{{preselect box 1 if a stop-, afbouw-, or vervangen- option is checked}}","atc:G04BD10 | atc:G04BD11 | atc:G04BD02 | atc:G04BD12 | atc:G04BD04 | atc:G04BD08 | atc:G04BD07 | atc:G04BD05 | atc:G04BD06 | atc:G04BD09 ","",30),
("113","yes","no","Alphablokkers G04CA Alpha-adrenoreceptor antagonists ","all","{{preselect box 1}{}}","atc:G04BE |atc:G04CA","",30),
("113a","yes","no","Nonselective alphablokkers","all","","atc:G04BE | atc:G04CA","",30),
("113b","yes","no","Nonselective alphablokkers","all","","atc:G04BE05 | atc:G04BE30","",30),
("113","yes","no","Alphablokkers G04CA Alpha-adrenoreceptor antagonists ","all","{{preselect box 1}{}}","atc:G04BE | atc:G04CA","",30),
("114","yes","no","Alphablokkers G04CA Alpha-adrenoreceptor antagonists ","bijwerking","","atc:G04BE | atc:G04CA","allergic-reaction",30),
("115","yes","no","Alphablokkers G04CA Alpha-adrenoreceptor antagonists ","all","","atc:G04BE |atc:G04CA","",30),
("117","yes","no","Middelen bij peptische aandoeningen: H2-antagonisten, protonpompremmers
A02BC Proton pump inhibitors 
B01AC56 Acetylsalicylic acid, combinations with PPIs
M01AE52 Naproxen and esomeprazole","all","","atc:A02BC | atc:B01AC56 | atc:M01AE52","",32),
("118","yes","no","Middelen bij peptische aandoeningen except pantoprazole A02BC02","","","(atc:A02BC | atc:B01AC56 | atc:M01AE52) & ! atc:A02BC02","",32),
("119","yes","no","Middelen bij peptische aandoeningen: H2-antagonisten, protonpompremmers
A02BC Proton pump inhibitors 
B01AC56 Acetylsalicylic acid, combinations with PPIs
M01AE52 Naproxen and esomeprazole","bijwerking","","atc:A02BC | atc:B01AC56 | atc:M01AE52","allergic-reaction",32),
("120","yes","no","Middelen bij peptische aandoeningen: H2-antagonisten, protonpompremmers
A02BC Proton pump inhibitors 
B01AC56 Acetylsalicylic acid, combinations with PPIs
M01AE52 Naproxen and esomeprazole","","{{preselect box 1 if a stop-, afbouw-, or vervangen- option is checked}}","atc:A02BC | atc:B01AC56 | atc:M01AE52","",32),
("121","yes","no","Diabetes medication: A10","all","{{preselect box 1}{SELECTOR(
A10BH 
OR A10BJ 
OR A10BK 
OR A10BB
AND NOT A10BB03
AND NOT A10BB09) AND CONDITION()}}","atc:A10","",31),
("121a","yes","no","Sulfonylureumderivaten (A10BB)","all","","atc:A10BB","",31),
("122","yes","no","Sulfonylureumderivaten (A10BB) AND NOT tolbutamide or glicazide.","all","","atc:A10BB & ! atc:A10BB03 & ! atc:A10BB09","",31),
("123","yes","no","gliclazide (A10BB09) or tolbutamide (A10BB03)","all","","atc:A10BB03 | atc:A10BB09","",31),
("124","yes","no","DPP4 remmers A10BH","all","","atc:A10BH","",31),
("125","yes","no","GLP-1 analogen A10BJ","all","","atc:A10BJ","",31),
("126","yes","no","SGLT2 remmers A10BK","all","","atc:A10BK","",31),
("127","yes","no","Diabetes medication: A10","all","","atc:A10","",31),
("128","yes","no","Diabetes medication: A10","all","{{preselect box 1 if a stop-, afbouw-, or vervangen- option is checked}}","atc:A10","",31),
("129","yes","no","Cholinesterase remmers N06DA","all","","atc:N06DA","",11),
("130","yes","no","Cholinesterase remmers N06DA","bijwerking","","atc:N06DA","allergic-reaction",11),
("131","yes","no","Cholinesterase remmers N06DA","all","{{preselect box 1 if a stop-, afbouw-, or vervangen- option is checked}}","atc:N06DA","",11),
("132","yes","no","AVertigomedicatie
N07CA (anti-vertigo medications)
N06BX03 (piracetam)","all","","atc:N07CA |
atc:N06BX03","",12),
("132a","yes","no","AVertigomedicatie
N06BX03 (piracetam)","all","","atc:N06BX03","",12),
("133","yes","no","AVertigomedicatie
N07CA (anti-vertigo medications)
N06BX03 (piracetam)","bijwerking","","atc:N07CA |
atc:N06BX03","allergic-reaction",12),
("134","yes","no","AVertigomedicatie
N07CA (anti-vertigo medications)
N06BX03 (piracetam)","all","{{preselect box 1 if a stop-, afbouw-, or vervangen- option is checked}}","atc:N07CA |
atc:N06BX03","",12),
("135","yes","no","Sympathicomimetica:
R03AC bèta2-sympathicomimetica
R01AA
R01AB sympathicomimetica, nasaal
R01BA Nasal decongestants for systemic use: Sympathomimetics
S01EA Sympathomimetics in glaucoma therapy
S01FB Mydriatics and cycloplegics: Sympathomimetics excluding antiglaucoma preparations","all","","atc:R03AC | atc:R01AA | atc:R01AB | atc:R01BA  | atc:S01EA | atc:S01FB","",33),
("136","yes","no","Sympathicomimetica:
R03AC bèta2-sympathicomimetica
R01AA
R01AB sympathicomimetica, nasaal
R01BA Nasal decongestants for systemic use: Sympathomimetics
S01EA Sympathomimetics in glaucoma therapy
S01FB Mydriatics and cycloplegics: Sympathomimetics excluding antiglaucoma preparations","bijwerking","","atc:R03AC | atc:R01AA | atc:R01AB | atc:R01BA  | atc:S01EA | atc:S01FB","allergic-reaction",33),
("137","yes","no","Sympathicomimetica:
R03AC bèta2-sympathicomimetica
R01AA
R01AB sympathicomimetica, nasaal
R01BA Nasal decongestants for systemic use: Sympathomimetics
S01EA Sympathomimetics in glaucoma therapy
S01FB Mydriatics and cycloplegics: Sympathomimetics excluding antiglaucoma preparations","all","","atc:R03AC | atc:R01AA | atc:R01AB | atc:R01BA  | atc:S01EA | atc:S01FB","",33);

/* todo: make sure these updates are reflected in the table create statements instead. We don't need them to be Updates any more.*/
UPDATE med_rules SET selector_logic = "(atc:C03 | atc:C02L | atc:C07B | atc:C07C | atc:C07D | atc:C09BA | atc:C09DA)" WHERE medication_criteria_id in("42","43","44");
UPDATE med_rules SET preselect_criteria = "{{preselect box 1}{
(SELECTOR() AND CONDITION(NOT
depressie (probleemlijst) AND NOT angststoornis (probleemlijst)))

OR
(SELECTOR(N06AA OR N06AB05) AND CONDITION()
)
}}" WHERE medication_criteria_id = "19f";
UPDATE med_rules SET selector_logic = "(atc:C02 | atc:C04 | atc:C08) & ! atc:C02L" WHERE medication_criteria_id in("48a");
UPDATE med_rules SET selector_logic = "atc:C09 & ! atc:C09BA & ! atc:C09DA" WHERE medication_criteria_id in("63","63a","63b");
UPDATE med_rules SET selector_logic = "atc:C10AA | atc:C10BA | atc:C10BX | atc:A10BH51 | atc:A10BH52" WHERE medication_criteria_id in("64");
UPDATE med_rules SET condition_logic = "measurement.eGFR.value > 30 && measurement.eGFR.date <= now-11-months" WHERE medication_criteria_id in("68","79","89");
UPDATE med_rules SET condition_logic = "measurement.eGFR.value <= 30 && measurement.eGFR.date <= now-11-months" WHERE medication_criteria_id in("69","80","90");
UPDATE med_rules SET condition_logic = "! measurement.natrium" WHERE medication_criteria_id in("23");
/* INSERT INTO med_rules (`medication_criteria_id`,
`active`,
`needs_review`,
`medication_criteria`,
`patient_group_criteria`,
`preselect_criteria`,
`selector_logic`,
`condition_logic`,
`reference`) VALUES("64a","yes","no","Statine combinations
C10BX HMG CoA reductase inhibitors, other combinations","all","{preselect box 1}{
(SELECTOR (C10BX03
OR C10BX07
OR C10BX09
OR C10BX11
OR C10BX14)
AND CONDITION ()
)}","atc:C10BX","",21);*/
UPDATE med_rules SET condition_logic = "atc:N02BE01 | atc:N02BE51 | atc:N02BE71 | atc:N02AJ01 | atc:N02AJ06 | atc:N02AJ13 | atc:N02AJ17" WHERE medication_criteria_id in("83");
UPDATE med_rules SET selector_logic = "atc:R06A | atc:N07CA | atc:N05BB01" WHERE medication_criteria_id in("100","103","104");
UPDATE med_rules SET selector_logic = "atc:A03AA07 |atc:A03AB05 | atc:A03BA01 | atc:A03BA03" WHERE medication_criteria_id in("105a","105b","105c");
UPDATE med_rules SET preselect_criteria = "{preselect box 1}{}" WHERE medication_criteria_id in("110");
UPDATE med_rules SET preselect_criteria = NULL WHERE medication_criteria_id in("128");
/* INSERT INTO med_rules (`medication_criteria_id`, active`,`needs_review`,`medication_criteria`,`patient_group_criteria`,`preselect_criteria`,`selector_logic`,`condition_logic`,`reference`) VALUES ("132a","yes","no","AVertigomedicatie
N06BX03 (piracetam)","all","","atc:N06BX03","",12); */
UPDATE med_rules SET selector_logic = "atc:N06BX03" WHERE medication_criteria_id in("133","134");
UPDATE med_rules SET patient_group_criteria = "medication started less than 6 months ago (or unknown) & depressie", condition_logic = "(medication.startDate > now-6-months | !medication.startDate) & problem:depressie" where medication_criteria_id = "19";

UPDATE med_rules SET active = "no" where condition_logic = "allergic-reaction" and medication_criteria_id != "25";
/*
INSERT INTO med_rules (`medication_criteria_id`, active`,`needs_review`,`medication_criteria`,`patient_group_criteria`,`preselect_criteria`,`selector_logic`,`condition_logic`,`reference`) VALUES 
("12","yes", "no", "anxiolytica", "not angststoornis", "", "atc:N05B & !atc:N05BA & !atc:N05BB", "!problem:angststoornis & ! problem:slaapstoornis",5),
("29a","yes", "no", "Older generation antiepileptics", "all", "", "atc:N03AB02 | atc:N03AG01 | atc:N03AF01", "",10);
*/
UPDATE med_rules SET medication_criteria = "Diuretica: C03 diuretics, C02L Antihypertensives and diuretics in combination OR C07 systemic beta-blokker (not eyedrops)", patient_group_criteria = "no concomittant ACE or AT-II (C09)", selector_logic = "(atc:C03 | atc:C02L | atc:C07 )" where medication_criteria_id = "35";
UPDATE med_rules SET medication_criteria = "Diuretica: C03 diuretics except lisdiruetics
C02L Antihypertensives and diuretics in combination 
C07B Beta blocking agents and thiazides 
C07C Beta blocking agents and other diuretics 
C07D Beta blocking agents, thiazides and other diuretics 
C09BA and C09DA ACEi and ARB with diuretics", selector_logic = "((atc:C03 &! C03CA &! C03CB &! C03EB) | atc:C02L | atc:C07B | atc:C07C | atc:C07D )" where medication_criteria_id = "41";