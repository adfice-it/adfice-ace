-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
UPDATE med_rules SET condition_problem = "angststoornis &!epilepsy", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="6";
UPDATE med_rules SET condition_problem = "epilepsy", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="6a";
UPDATE med_rules SET condition_problem = "!angststoornis &!epilepsy", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="6b";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="6e";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="7";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="8";
UPDATE med_rules SET condition_problem = "parkinson | lewy-bodies-dementia | multiple-system-atrophy | progressive-supranuclear-palsy", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="9";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = "J02AB02,J02AC04,J02AC03,J02AC02,J01FA09,V03AX03,J05AE03,J05AE01,J05AR10", condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="10";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="11";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="13";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="13a";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="13b";
UPDATE med_rules SET condition_problem = "delier | dementie", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="14";
UPDATE med_rules SET condition_problem = "delier &!parkinson &!lewy-bodies-dementia &!multiple-system-atrophy &!progressive-supranuclear-palsy", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="14a";
UPDATE med_rules SET condition_problem = "dementie &!parkinson &!lewy-bodies-dementia &!multiple-system-atrophy &!progressive-supranuclear-palsy", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="14b";
UPDATE med_rules SET condition_problem = "schizofrenie", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="14c";
UPDATE med_rules SET condition_problem = "!delier &!dementie &!schizofrenie", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="14d";
UPDATE med_rules SET condition_problem = "parkinson | lewy-bodies-dementia | multiple-system-atrophy | progressive-supranuclear-palsy", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="15";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="16";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="17";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="18";
UPDATE med_rules SET condition_problem = "depressie", condition_age = NULL, condition_drug = "&(medication.startDate >= now-6-months | !medication.startDate)", condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="19";
UPDATE med_rules SET condition_problem = "depressie", condition_age = NULL, condition_drug = "&(medication.startDate < now-6-months)", condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="19a";
UPDATE med_rules SET condition_problem = "angststoornis &!depressie", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="19b";
UPDATE med_rules SET condition_problem = "!depressie &!angststoornis", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="19c";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="19d";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="19e";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="19f";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="20";
UPDATE med_rules SET condition_problem = NULL, condition_age = "<80", condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="21";
UPDATE med_rules SET condition_problem = NULL, condition_age = ">=80", condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="22";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = "!lab.natrium.value", condition_allergy = NULL WHERE medication_criteria_id ="23";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = "lab.natrium.date >= now-11-months", condition_allergy = NULL WHERE medication_criteria_id ="24";
UPDATE med_rules SET condition_problem = "hyponatremia | orthostatische-hypotensie | tachycardia | arrhythmia", condition_age = NULL, condition_drug = NULL, condition_lab = " lab.natrium.value < 135", condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="25";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="25a";
UPDATE med_rules SET condition_problem = "parkinson | lewy-bodies-dementia | multiple-system-atrophy | progressive-supranuclear-palsy", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="26";
UPDATE med_rules SET condition_problem = "(parkinson | lewy-bodies-dementia | multiple-system-atrophy | progressive-supranuclear-palsy ) & orthostatische-hypotensie", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="26a";
UPDATE med_rules SET condition_problem = "!parkinson &!lewy-bodies-dementia &!multiple-system-atrophy &!progressive-supranuclear-palsy", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="26b";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="27";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="27a";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="27b";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="28";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="29";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="30";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="30a";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="31";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = "!C09A,!C09B", condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="35";
UPDATE med_rules SET condition_problem = "hartfalen", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="36";
UPDATE med_rules SET condition_problem = "hartfalen", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="37";
UPDATE med_rules SET condition_problem = "hypertensie &!hartfalen", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="38";
UPDATE med_rules SET condition_problem = "hypokalemia", condition_age = NULL, condition_drug = NULL, condition_lab = "lab.kalium.value < 3.0", condition_allergy = NULL WHERE medication_criteria_id ="40";
UPDATE med_rules SET condition_problem = "hyponatremia", condition_age = NULL, condition_drug = NULL, condition_lab = "lab.natrium.value < 130", condition_allergy = NULL WHERE medication_criteria_id ="40a";
UPDATE med_rules SET condition_problem = "hypercalciemie", condition_age = NULL, condition_drug = NULL, condition_lab = "lab.calcium.value > 2.65", condition_allergy = NULL WHERE medication_criteria_id ="40b";
UPDATE med_rules SET condition_problem = "jicht", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="40c";
UPDATE med_rules SET condition_problem = "!hartfalen &!hypertensiea", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="41";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="42";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="43";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="44";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="45";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="46";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="47";
UPDATE med_rules SET condition_problem = "(parkinson | lewy-bodies-dementia | multiple-system-atrophy | progressive-supranuclear-palsy ) & orthostatische-hypotensie", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="48";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="48a";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="49";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="50";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="50a";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="50b";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="52";
UPDATE med_rules SET condition_problem = "!hypertensie", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="53";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="54";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="54a";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="55";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="56";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="57";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="57a";
UPDATE med_rules SET condition_problem = "!atriumfibrilleren &!angina-pectoris &!myocardinfarct", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="58";
UPDATE med_rules SET condition_problem = "atriumfibrilleren | angina-pectoris | myocardinfarct", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="59";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="60";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="61";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="63";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="63a";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="63b";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="64";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="65";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="66";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="67";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = "lab.eGFR.value > 30 & lab.eGFR.date > now-11-months", condition_allergy = NULL WHERE medication_criteria_id ="68";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = "lab.eGFR.value <= 30 & lab.eGFR.date > now-11-months", condition_allergy = NULL WHERE medication_criteria_id ="69";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = "!lab.eGFR.value", condition_allergy = NULL WHERE medication_criteria_id ="70";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = "lab.eGFR.date > now-11-months", condition_allergy = NULL WHERE medication_criteria_id ="71";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="72";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="73";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="75";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="76";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="78";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = "lab.eGFR.value > 30", condition_allergy = NULL WHERE medication_criteria_id ="79";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = "lab.eGFR.value <= 30 & lab.eGFR.date > now-11-months", condition_allergy = NULL WHERE medication_criteria_id ="80";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = "!lab.eGFR.value <= 30 & lab.eGFR.date > now-11-months", condition_allergy = NULL WHERE medication_criteria_id ="80a";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = "! lab.eGFR.value <= 30", condition_allergy = NULL WHERE medication_criteria_id ="80b";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = "! lab.eGFR", condition_allergy = NULL WHERE medication_criteria_id ="81";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = "lab.eGFR.date > now-11-months", condition_allergy = NULL WHERE medication_criteria_id ="82";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="83";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="83a";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="84";
UPDATE med_rules SET condition_problem = "paraplegia | dwarslesie", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="86";
UPDATE med_rules SET condition_problem = "!paraplegia &!dwarslesie", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="87";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="88";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = "lab.eGFR.value > 30 & lab.eGFR.date > now-11-months", condition_allergy = NULL WHERE medication_criteria_id ="89";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = "lab.eGFR.value <= 30 & lab.eGFR.date > now-11-months", condition_allergy = NULL WHERE medication_criteria_id ="90";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = "!lab.eGFR.value", condition_allergy = NULL WHERE medication_criteria_id ="91";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = "lab.eGFR.date > now-11-months", condition_allergy = NULL WHERE medication_criteria_id ="92";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="93";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="94";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="95";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="96";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="97";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="99";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="100";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="101";
UPDATE med_rules SET condition_problem = "parkinson | lewy-bodies-dementia | multiple-system-atrophy | progressive-supranuclear-palsy", condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="102";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="103";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="104";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = "A03AA07,A03AB05,A03BA01,A03BA03,A03BB01,G04BD02,G04BD04,G04BD05,G04BD06,G04BD07,G04BD08,G04BD09,G04BD10,G04BD11,M03BA03,M03BC01,N04AA01,N04AA02,N04AA04,N04AB02,N04AC01,N05AA01,N05AA03,N05AB03,N05AB06,N05AC02,N05AH03,N05AH04,N05BB01,N05CM05,N06AA,N06AB05,R06AA02,R06AA04,R06AA08,R06AA09,R06AA52,R06AB01,R06AB04,R06AD02,R06AE05", condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="105";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="105a";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="105b";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="105c";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="106";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="107";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="108";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="110";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="111";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="112";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="113";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="114";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="115";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="117";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="118";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="119";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="120";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="121";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="122";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="123";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="124";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="125";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="126";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="127";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="128";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="129";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="130";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="131";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="132";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="133";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="134";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="135";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = "allergic-reaction" WHERE medication_criteria_id ="136";
UPDATE med_rules SET condition_problem = NULL, condition_age = NULL, condition_drug = NULL, condition_lab = NULL, condition_allergy = NULL WHERE medication_criteria_id ="137";
