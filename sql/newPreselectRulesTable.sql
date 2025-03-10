-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021-2024 Stichting Open Electronics Lab
SET CHARACTER SET 'utf8'; -- enable unicode support in older clients
INSERT INTO preselect_rules (medication_criteria_id, select_box_num, preselect_num, preselect_or, preselect_not, preselect_problem, preselect_age, preselect_drug, preselect_lab, preselect_allergy) VALUES
("6e",1,1,NULL,NULL,"!angststoornis &!epilepsy",NULL,"&medication.start_date >= now-2-weeks",NULL,NULL), 
("6e",1,2,NULL,NULL,"parkinson | lewy-bodies-dementia | multiple-system-atrophy | progressive-supranuclear-palsy & med started < 2 weeks ago",NULL,NULL,NULL,NULL),
("6e",2,1,NULL,NULL,"!angststoornis &!epilepsy",NULL,"&medication.start_date < now-2-weeks",NULL,NULL),
("6e",2,2,NULL,NULL,"parkinson | lewy-bodies-dementia | multiple-system-atrophy | progressive-supranuclear-palsy & med started >= 2 weeks ago",NULL,NULL,NULL,NULL),
("6e",2,3,"N05CM05",NULL,NULL,NULL,NULL,NULL,NULL),
("13",1,1,"N05BB01",NULL,NULL,NULL,NULL,NULL,NULL),
("16",2,1,"N05AA01,N05AA03,N05AB03,N05AB06,N05AC02,N05AH03,N05AH04",NULL,NULL,NULL,NULL,NULL,NULL),
("19f",1,1,NULL,NULL,"!depressie &!angststoornis",NULL,NULL,NULL,NULL),
("19f",1,2,"N06AA, N06AB05",NULL,NULL,NULL,NULL,NULL,NULL),
("27",2,1,"N04AA01,N04AA02,N04AA04,N04AB02,N04AC01",NULL,NULL,NULL,NULL,NULL,NULL),
("36",1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
("36",2,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
-- ("42a",2,1,NULL,NULL,"!hartfalen",NULL,NULL,NULL,NULL),
("42a",2,2,NULL,NULL,"!hypertensie &!hartfalen",NULL,NULL,NULL,NULL),
("42b",2,1,"C03C,C03EB",NULL,"!hartfalen",NULL,NULL,NULL,NULL),
("42b",2,2,NULL,NULL,"!hypertensie &!hartfalen",NULL,NULL,NULL,NULL),
("42a",2,3,"C07B",NULL,"jicht | hypokalemia | hyponatremia | hypercalciemie",NULL,NULL,"measurement.natrium.value < 130 | measurement.kalium.value < 3.0 | measurement.calcium.value  > 2.65",NULL),
-- ("42a",2,4,NULL,NULL,"parkinson",NULL,NULL,NULL,NULL),
("42b",2,3,"C03A",NULL,"jicht | hypokalemia | hyponatremia | hypercalciemie",NULL,NULL,"measurement.natrium.value < 130 | measurement.kalium.value < 3.0 | measurement.calcium.value  > 2.65",NULL),
("42a",2,4,NULL,NULL,"(parkinson | lewy-bodies-dementia | multiple-system-atrophy | progressive-supranuclear-palsy) & orthostatische-hypotensie",NULL,NULL,NULL,NULL),
("42b",2,4,NULL,NULL,"(parkinson | lewy-bodies-dementia | multiple-system-atrophy | progressive-supranuclear-palsy) & orthostatische-hypotensie",NULL,NULL,NULL,NULL),
("42a",2,5,"C07DA",NULL,NULL,NULL,NULL,NULL,NULL),
("46",1,1,NULL,NULL,"(parkinson | lewy-bodies-dementia | multiple-system-atrophy | progressive-supranuclear-palsy) & orthostatische-hypotensie",NULL,NULL,NULL,NULL),
("46",1,2,"C02A,C04,C08,C02CA,C02DA,C02DB,C02DC,C02DG01,C02DD01",NULL,NULL,NULL,NULL,NULL,NULL),
("50",1,1,NULL,NULL,"(parkinson | lewy-bodies-dementia | multiple-system-atrophy | progressive-supranuclear-palsy) & orthostatische-hypotensie",NULL,NULL,NULL,NULL),
("54",1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
("56",1,1,"C07AA,C07AG,C07BA,C07BG,C07CA,C07CG,C07EA,C07FX01,C07FX02,C07FX06,C07FA05,S01ED01,S01ED03,S01ED04,S01ED05",NULL,NULL,NULL,NULL,NULL,NULL),
("56",1,2,NULL,NULL,"(parkinson | lewy-bodies-dementia | multiple-system-atrophy | progressive-supranuclear-palsy) & orthostatische-hypotensie",NULL,NULL,NULL,NULL),
("56",1,3,NULL,NULL,"!atriumfibrilleren &! angina-pectoris &! myocardinfarct",NULL,NULL,NULL,NULL),
("63",1,1,NULL,NULL,"(parkinson | lewy-bodies-dementia | multiple-system-atrophy | progressive-supranuclear-palsy) & orthostatische-hypotensie",NULL,NULL,NULL,NULL),
("64",1,1,"C10BX03,C10BX07,C10BX09,C10BX11,C10BX14",NULL,NULL,NULL,NULL,NULL,NULL),
("67",2,1,NULL,"N02AA01,N02AA05,N02AB03",NULL,NULL,NULL,NULL,NULL),
("78",2,1,NULL,NULL,NULL,NULL,NULL,"measurement.eGFR.value <= 30",NULL),
("78",2,2,NULL,NULL,NULL,NULL,"N02BE01,N02BE51,N02BE71,N02AJ01,N02AJ06,N02AJ13,N02AJ17",NULL,NULL),
("88",2,1,NULL,NULL,"!paraplegia &!dwarslesie",NULL,NULL,NULL,NULL),
("88",2,2,"M03BA03,M03BC01",NULL,NULL,NULL,NULL,NULL,NULL),
("100",3,1,NULL,"R06AX29,R06AE07,R06AE09,R06AX13,R06AX27,R06AX22,R06AX26,R06AX25,R06AX28",NULL,NULL,NULL,NULL,NULL),
("105a",1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
("106",1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
("113",1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
("121",1,1,"A10BH,A10BJ,A10BK,A10BB","A10BB03,A10BB09",NULL,NULL,NULL,NULL,NULL);
