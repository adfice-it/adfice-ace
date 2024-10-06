-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021-2024 Stichting Open Electronics Lab
INSERT INTO patient_medication (patient_id, date_retrieved, medication_name, generic_name, ATC_code, start_date) VALUES
("00000000-0000-4000-8000-100000000002",(select NOW()),"darifenacin","darifenacin","G04BD10",'2019-02-11'),
("00000000-0000-4000-8000-100000000004",(select NOW()),"diazepam","diazepam","N05BA01",(select NOW())),
("00000000-0000-4000-8000-100000000005",(select NOW()),"diazepam","diazepam","N05BA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000006",(select NOW()),"diazepam","diazepam","N05BA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000007",(select NOW()),"diazepam","diazepam","N05BA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000008",(select NOW()),"diazepam","diazepam","N05BA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000009",(select NOW()),"zolpidem","zolpidem","N05CF02",'2019-02-11'),
("00000000-0000-4000-8000-100000000009",(select NOW()),"ketoconazol","ketoconazol","J02AB02",'2019-02-11'),
("00000000-0000-4000-8000-100000000010",(select NOW()),"diazepam","diazepam","N05BA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000011",(select NOW()),"scopolamine","scopolamine","N05CM05",'2019-02-11'),
("00000000-0000-4000-8000-100000000012",(select NOW()),"Buspar","buspiron","N05BE01",'2019-02-11'),
("00000000-0000-4000-8000-100000000013",(select NOW()),"Buspar","buspiron","N05BE01",'2019-02-11'),
("00000000-0000-4000-8000-100000000014",(select NOW()),"haloperidol","haloperidol","N05AD01",'2019-02-11'),
("00000000-0000-4000-8000-100000000015",(select NOW()),"quetiapine","quetiapine","N05AH04",'2019-02-11'),
("00000000-0000-4000-8000-100000000016",(select NOW()),"haloperidol","haloperidol","N05AD01",'2019-02-11'),
("00000000-0000-4000-8000-100000000017",(select NOW()),"haloperidol","haloperidol","N05AD01",'2019-02-11'),
("00000000-0000-4000-8000-100000000018",(select NOW()),"haloperidol","haloperidol","N05AD01",'2019-02-11'),
("00000000-0000-4000-8000-100000000019",(select NOW()),"clozapine","clozapine","N05AH02",'2019-02-11'),
("00000000-0000-4000-8000-100000000020",(select NOW()),"haloperidol","haloperidol","N05AD01",'2019-02-11'),
("00000000-0000-4000-8000-100000000021",(select NOW()),"quetiapine","quetiapine","N05AH04",'2019-02-11'),
("00000000-0000-4000-8000-100000000022",(select NOW()),"haloperidol","haloperidol","N05AD01",'2019-02-11'),
("00000000-0000-4000-8000-100000000023",(select NOW()),"haloperidol","haloperidol","N05AD01",'2019-02-11'),
("00000000-0000-4000-8000-100000000024",(select NOW()),"risperidon","risperidon","N05AX08",'2019-02-11'),
("00000000-0000-4000-8000-100000000025",(select NOW()),"amitriptyline","amitriptyline","N06AA09",'2019-02-11'),
("00000000-0000-4000-8000-100000000026",(select NOW()),"amitriptyline","amitriptyline","N06AA09",(select DATE_SUB(NOW(), INTERVAL 2 MONTH))),
("00000000-0000-4000-8000-100000000027",(select NOW()),"amitriptyline","amitriptyline","N06AA09",'2020-08-01'),
("00000000-0000-4000-8000-100000000028",(select NOW()),"sertraline","sertraline","N06AB06",'2019-02-11'),
("00000000-0000-4000-8000-100000000029",(select NOW()),"fluoxetine","fluoxetine","N06AB03",'2019-02-11'),
("00000000-0000-4000-8000-100000000030",(select NOW()),"escitalopram","escitalopram","N06AB10",'2019-02-11'),
("00000000-0000-4000-8000-100000000031",(select NOW()),"escitalopram","escitalopram","N06AB10",'2019-02-11'),
("00000000-0000-4000-8000-100000000032",(select NOW()),"escitalopram","escitalopram","N06AB10",'2019-02-11'),
("00000000-0000-4000-8000-100000000033",(select NOW()),"biperideen","biperideen","N04AA02",'2019-02-11'),
("00000000-0000-4000-8000-100000000034",(select NOW()),"levodopa","levodopa","N04BA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000035",(select NOW()),"levodopa","levodopa","N04BA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000036",(select NOW()),"levodopa","levodopa","N04BA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000037",(select NOW()),"carbamazepine","carbamazepine","N03AF01",'2019-02-11'),
("00000000-0000-4000-8000-100000000038",(select NOW()),"fenobarbital","fenobarbital","N03AA02",'1980-01-01'),
("00000000-0000-4000-8000-100000000039",(select NOW()),"levetiracetam","levetiracetam","N03AX14",'2019-02-11'),
("00000000-0000-4000-8000-100000000040",(select NOW()),"levetiracetam","levetiracetam","N03AX14",'2019-02-11'),
("00000000-0000-4000-8000-100000000041",(select NOW()),"Lasix","furosemide","C03CA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000042",(select NOW()),"Lasix","furosemide","C03CA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000043",(select NOW()),"bumetanide","bumetanide","C03CA02",'2019-02-11'),
("00000000-0000-4000-8000-100000000044",(select NOW()),"Lasix","furosemide","C03CA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000045",(select NOW()),"hydrochlorothiazide","hydrochloorthiazide","C03AA03",'2019-02-11'),
("00000000-0000-4000-8000-100000000046",(select NOW()),"hydrochlorothiazide","hydrochloorthiazide","C03AA03",'2019-02-11'),
("00000000-0000-4000-8000-100000000047",(select NOW()),"hydrochlorothiazide","hydrochloorthiazide","C03AA03",'2019-02-11'),
("00000000-0000-4000-8000-100000000048",(select NOW()),"hydrochlorothiazide","hydrochloorthiazide","C03AA03",'2019-02-11'),
("00000000-0000-4000-8000-100000000049",(select NOW()),"Lasix","furosemide","C03CA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000050",(select NOW()),"reserpine","reserpine","C02AA02",'2019-02-11'),
("00000000-0000-4000-8000-100000000051",(select NOW()),"reserpine","reserpine","C02AA02",'2019-02-11'),
("00000000-0000-4000-8000-100000000052",(select NOW()),"reserpine","reserpine","C02AA02",'2019-02-11'),
("00000000-0000-4000-8000-100000000053",(select NOW()),"verapamil","verapamil","C08DA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000054",(select NOW()),"verapamil","verapamil","C08DA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000055",(select NOW()),"prazosin","prazosin","C02CA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000056",(select NOW()),"prazosin","prazosin","C02CA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000057",(select NOW()),"nicorandil","nicorandil","C01DX16",'2019-02-11'),
("00000000-0000-4000-8000-100000000058",(select NOW()),"nicorandil","nicorandil","C01DX16",'2019-02-11'),
("00000000-0000-4000-8000-100000000059",(select NOW()),"sotalol","sotalol","C07AA07",'2019-02-11'),
("00000000-0000-4000-8000-100000000060",(select NOW()),"sotalol","sotalol","C07AA07",'2019-02-11'),
("00000000-0000-4000-8000-100000000061",(select NOW()),"metoprolol","metoprolol","C07AB02",'2019-02-11'),
("00000000-0000-4000-8000-100000000062",(select NOW()),"metoprolol","metoprolol","C07AB02",'2019-02-11'),
("00000000-0000-4000-8000-100000000063",(select NOW()),"metoprolol","metoprolol","C07AB02",'2019-02-11'),
("00000000-0000-4000-8000-100000000064",(select NOW()),"quinapril","quinapril","C09AA06",'2019-02-11'),
("00000000-0000-4000-8000-100000000065",(select NOW()),"quinapril","quinapril","C09AA06",'2019-02-11'),
("00000000-0000-4000-8000-100000000066",(select NOW()),"simvastatine","simvastatine","C10AA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000067",(select NOW()),"simvastatine","simvastatine","C10AA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000068",(select NOW()),"hydrochlorothiazide","hydrochloorthiazide","C03AA03",'2019-02-11'),
("00000000-0000-4000-8000-100000000068",(select NOW()),"enalapril","enalapril","C09AA02",'2019-02-11'),
("00000000-0000-4000-8000-100000000681",(select NOW()),"hydrochlorothiazide","hydrochloorthiazide","C03AA03",'2019-02-11'),
("00000000-0000-4000-8000-100000000681",(select NOW()),"enalapril","enalapril","C09AA02",'2019-02-11'),
("00000000-0000-4000-8000-100000000681",(select NOW()),"amlodipine","amlodipine","C08CA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000069",(select NOW()),"amlodipine","amlodipine","C08CA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000070",(select NOW()),"hydrochlorothiazide","hydrochloorthiazide","C03AA03",'2019-02-11'),
("00000000-0000-4000-8000-100000000071",(select NOW()),"buphenine","buphenine","C04AA02",'2019-02-11'),
("00000000-0000-4000-8000-100000000072",(select NOW()),"metoprolol and thiazides","METOPROLOL/HYDROCHLOORTHIAZIDE TAB MGA 100/12,5MG","C07BB02",'2019-02-11'),
("00000000-0000-4000-8000-100000000073",(select NOW()),"metoprolol and other diuretics","metoprolol and other diuretics","C07CB02",'2019-02-11'),
("00000000-0000-4000-8000-100000000074",(select NOW()),"atorvastatin and amlodipine","atorvastatin and amlodipine","C10BX03",'2019-02-11'),
("00000000-0000-4000-8000-100000000075",(select NOW()),"rosuvastatin, amlodipine and lisinopril ","rosuvastatin, amlodipine and lisinopril ","C10BX07",'2019-02-11'),
("00000000-0000-4000-8000-100000000076",(select NOW()),"morfine","morfine","N02AA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000077",(select NOW()),"oxymorphone","oxymorphone","N02AA11",'2019-02-11'),
("00000000-0000-4000-8000-100000000078",(select NOW()),"morfine","morfine","N02AA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000079",(select NOW()),"morfine","morfine","N02AA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000080",(select NOW()),"morfine","morfine","N02AA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000081",(select NOW()),"tramadol","tramadol","N02AX02",'2019-02-11'),
("00000000-0000-4000-8000-100000000082",(select NOW()),"oxycodon","oxycodon","N02AA05",'2019-02-11'),
("00000000-0000-4000-8000-100000000083",(select NOW()),"diclofenac","diclofenac","M01AB05",'2019-02-11'),
("00000000-0000-4000-8000-100000000084",(select NOW()),"diclofenac","diclofenac","M01AB05",'2019-02-11'),
("00000000-0000-4000-8000-100000000084",(select NOW()),"paracetamol, combinations excluding psycholeptics",NULL,"N02BE51",'2019-02-11'),
("00000000-0000-4000-8000-100000000085",(select NOW()),"diclofenac","diclofenac","M01AB05",'2019-02-11'),
("00000000-0000-4000-8000-100000000086",(select NOW()),"diclofenac","diclofenac","M01AB05",'2019-02-11'),
("00000000-0000-4000-8000-100000000087",(select NOW()),"diclofenac","diclofenac","M01AB05",'2019-02-11'),
("00000000-0000-4000-8000-100000000088",(select NOW()),"diclofenac","diclofenac","M01AB05",'2019-02-11'),
("00000000-0000-4000-8000-100000000089",(select NOW()),"indometacin","indometacin","M01AB01",'2019-02-11'),
("00000000-0000-4000-8000-100000000090",(select NOW()),"pancuronium","pancuronium","M03AC01",'2019-02-11'),
("00000000-0000-4000-8000-100000000091",(select NOW()),"pancuronium","pancuronium","M03AC01",'2019-02-11'),
("00000000-0000-4000-8000-100000000092",(select NOW()),"pancuronium","pancuronium","M03AC01",'2019-02-11'),
("00000000-0000-4000-8000-100000000093",(select NOW()),"pancuronium","pancuronium","M03AC01",'2019-02-11'),
("00000000-0000-4000-8000-100000000094",(select NOW()),"pancuronium","pancuronium","M03AC01",'2019-02-11'),
("00000000-0000-4000-8000-100000000095",(select NOW()),"pancuronium","pancuronium","M03AC01",'2019-02-11'),
("00000000-0000-4000-8000-100000000096",(select NOW()),"methocarbamol","methocarbamol","M03BA03",'2019-02-11'),
("00000000-0000-4000-8000-100000000097",(select NOW()),"gabapentin","gabapentin","N03AX12",'2019-02-11'),
("00000000-0000-4000-8000-100000000098",(select NOW()),"gabapentin","gabapentin","N03AX12",'2019-02-11'),
("00000000-0000-4000-8000-100000000099",(select NOW()),"loratadine","loratadine","R06AX13",'2019-02-11'),
("00000000-0000-4000-8000-100000000100",(select NOW()),"promethazine","promethazine","R06AD02",'2019-02-11'),
("00000000-0000-4000-8000-100000000101",(select NOW()),"cyproheptadine","cyproheptadine","R06AX02",'2019-02-11'),
("00000000-0000-4000-8000-100000000102",(select NOW()),"cyproheptadine","cyproheptadine","R06AX02",'2019-02-11'),
("00000000-0000-4000-8000-100000000103",(select NOW()),"loratadine","loratadine","R06AX13",'2019-02-11'),
("00000000-0000-4000-8000-100000000104",(select NOW()),"dicyclomine","dicyclomine","A03AA07",'2019-02-11'),
("00000000-0000-4000-8000-100000000105",(select NOW()),"dicyclomine","dicyclomine","A03AA07",'2019-02-11'),
("00000000-0000-4000-8000-100000000106",(select NOW()),"butylscopolamine","butylscopolamine","A03BB01",'2019-02-11'),
("00000000-0000-4000-8000-100000000107",(select NOW()),"butylscopolamine","butylscopolamine","A03BB01",'2019-02-11'),
("00000000-0000-4000-8000-100000000108",(select NOW()),"flavoxaat","flavoxaat","G04BD02",'2019-02-11'),
("00000000-0000-4000-8000-100000000109",(select NOW()),"flavoxaat","flavoxaat","G04BD02",'2019-02-11'),
("00000000-0000-4000-8000-100000000110",(select NOW()),"tamsulosin","tamsulosin","G04CA02",'2019-02-11'),
("00000000-0000-4000-8000-100000000111",(select NOW()),"terazosin","terazosin","G04CA03",'2019-02-11'),
("00000000-0000-4000-8000-100000000112",(select NOW()),"omeprazol","omeprazol","A02BC01",'2019-02-11'),
("00000000-0000-4000-8000-100000000113",(select NOW()),"pantoprazol","pantoprazol","A02BC02",'2019-02-11'),
("00000000-0000-4000-8000-100000000114",(select NOW()),"omeprazol","omeprazol","A02BC01",'2019-02-11'),
("00000000-0000-4000-8000-100000000115",(select NOW()),"gliclazide","gliclazide","A10BB09",'2019-02-11'),
("00000000-0000-4000-8000-100000000116",(select NOW()),"glipizide","glipizide","A10BB07",'2019-02-11'),
("00000000-0000-4000-8000-100000000117",(select NOW()),"sitagliptin","sitagliptin","A10BH01",'2019-02-11'),
("00000000-0000-4000-8000-100000000118",(select NOW()),"lixisenatide","lixisenatide","A10BJ03",'2019-02-11'),
("00000000-0000-4000-8000-100000000119",(select NOW()),"dapagliflozin","dapagliflozin","A10BK01",'2019-02-11'),
("00000000-0000-4000-8000-100000000120",(select NOW()),"gliclazide","gliclazide","A10BB09",'2019-02-11'),
("00000000-0000-4000-8000-100000000121",(select NOW()),"rivastigmine","rivastigmine","N06DA03",'2019-02-11'),
("00000000-0000-4000-8000-100000000122",(select NOW()),"rivastigmine","rivastigmine","N06DA03",'2019-02-11'),
("00000000-0000-4000-8000-100000000123",(select NOW()),"piracetam","piracetam","N06BX03",'2019-02-11'),
("00000000-0000-4000-8000-100000000124",(select NOW()),"cinnarizine","cinnarizine","N07CA02",'2019-02-11'),
("00000000-0000-4000-8000-100000000125",(select NOW()),"salmeterol","salmeterol","R03AC12",'2019-02-11'),
("00000000-0000-4000-8000-100000000126",(select NOW()),"ENALAPRIL/HYDROCHLOORTHIAZIDE TABLET 20/12,5MG","ENALAPRIL/HYDROCHLOORTHIAZIDE TABLET 20/12,5MG","C09BA02",'2019-02-11'),
("00000000-0000-4000-8000-100000000127",(select NOW()),"atenolol, thiazides and other diuretics","atenolol, thiazides and other diuretics","C07DB01",'2019-02-11'),
("00000000-0000-4000-8000-100000000128",(select NOW()),"diclofenac topical","diclofenac topical","D11AX18",'2019-02-11'),
("00000000-0000-4000-8000-100000000129",(select NOW()),"naproxen and esomeprazol","NAPROXEN/ESOMEPRAZOL TABLET MGA 500/20MG","M01AE52",'2019-02-11');

/* fake patients for validating rules */
INSERT INTO patient_medication (patient_id, date_retrieved, medication_name, generic_name, ATC_code, start_date) VALUES
("00000000-0000-4000-8000-100000000131",(select NOW()),"hydrochlorothiazide","hydrochloorthiazide","C03AA03",'2019-02-11'),
("00000000-0000-4000-8000-100000000131",(select NOW()),"enalapril","enalapril","C09AA02",'2019-02-11'),
("00000000-0000-4000-8000-100000000132",(select NOW()),"verapamil","verapamil","C08DA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000132",(select NOW()),"lisinopril","lisinopril","C09AA03",'2019-02-11'),
("00000000-0000-4000-8000-100000000132",(select NOW()),"Lasix","furosemide","C03CA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000133",(select NOW()),"hydrochlorothiazide","hydrochloorthiazide","C03AA03",'2019-02-11'),
("00000000-0000-4000-8000-100000000134",(select NOW()),"Lasix","furosemide","C03CA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000134",(select NOW()),"metoprolol","metoprolol","C07AB02",'2019-02-11'),
("00000000-0000-4000-8000-100000000135",(select NOW()),"Lasix","furosemide","C03CA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000135",(select NOW()),"digoxine","digoxine","C01AA05",'2019-02-11'),
("00000000-0000-4000-8000-100000000136",(select NOW()),"simvastatine","simvastatine","C10AA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000137",(select NOW()),"diclofenac","diclofenac","M01AB05",'2019-02-11'),
("00000000-0000-4000-8000-100000000137",(select NOW()),"morfine","morfine","N02AA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000138",(select NOW()),"citalopram","citalopram","N06AB04",'2019-02-11'),
("00000000-0000-4000-8000-100000000139",(select NOW()),"amitriptyline","amitriptyline","N06AA09",'2019-02-11'),
("00000000-0000-4000-8000-100000000140",(select NOW()),"escitalopram","escitalopram","N06AB10",'2019-02-11'),
("00000000-0000-4000-8000-100000000141",(select NOW()),"diazepam","diazepam","N05BA01",(select NOW())),
("00000000-0000-4000-8000-100000000142",(select NOW()),"temazepam","temazepam","N05CD07",(select NOW()));

/* fake patients for usability */
INSERT INTO patient_medication (patient_id, date_retrieved, medication_name, generic_name, ATC_code, start_date) VALUES
("00000000-0000-4000-8000-100000000143",(select NOW()),"metFORMINE","metformine","A10BA02",(select NOW())),
("00000000-0000-4000-8000-100000000143",(select NOW()),"TemaZEPAM","TemaZEPAM","N05CD07",(select NOW())),
("00000000-0000-4000-8000-100000000143",(select NOW()),"pantoprazol","pantoprazol","A02BC02",(select NOW())),
("00000000-0000-4000-8000-100000000143",(select NOW()),"apixaban","apixaban","B01AF02",(select NOW())),
("00000000-0000-4000-8000-100000000143",(select NOW()),"Atorvastatine","atorvastatine","C10AA05",(select NOW())),
("00000000-0000-4000-8000-100000000143",(select NOW()),"METOPROLOL","metoprolol","C07AB02",(select NOW()));

/* fake patients for validation 2 */
INSERT INTO patient_medication (patient_id, date_retrieved, medication_name, generic_name, ATC_code, start_date) VALUES
("00000000-0000-4000-8000-100000000144",(select NOW()),"Flurazepam","Flurazepam","N05CD01",(select NOW())),
("00000000-0000-4000-8000-100000000144",(select NOW()),"levodopa","levodopa","N04BA01",'2019-02-11'),

("00000000-0000-4000-8000-100000000145",(select NOW()),"Zolpidem","zolpidem","N05CF02",(select NOW())),
("00000000-0000-4000-8000-100000000145",(select NOW()),"Cobicistat","cobicistat","V03AX03",(select NOW())),
("00000000-0000-4000-8000-100000000145",(select NOW()),"quetiapine","quetiapine","N05AH04",'2019-02-11'),
("00000000-0000-4000-8000-100000000145",(select NOW()),"levodopa","levodopa","N04BA01",'2019-02-11'),

("00000000-0000-4000-8000-100000000146",(select NOW()),"Meprobamate","Meprobamate","N05BC01",(select NOW())),
("00000000-0000-4000-8000-100000000146",(select NOW()),"haloperidol","haloperidol","N05AD01",'2019-02-11'),
("00000000-0000-4000-8000-100000000146",(select NOW()),"sotalol","sotalol","C07AA07",'2019-02-11'),

("00000000-0000-4000-8000-100000000147",(select NOW()),"haloperidol","haloperidol","N05AD01",'2019-02-11'),
("00000000-0000-4000-8000-100000000147",(select NOW()),"nicorandil","nicorandil","C01DX16",'2019-02-11'),
("00000000-0000-4000-8000-100000000147",(select NOW()),"indometacin","indometacin","M01AB01",'2019-02-11'),
("00000000-0000-4000-8000-100000000147",(select NOW()),"paracetamol, combinations excluding psycholeptics",NULL,"N02BE51",'2019-02-11'),
("00000000-0000-4000-8000-100000000147",(select NOW()),"pancuronium","pancuronium","M03AC01",'2019-02-11'),

("00000000-0000-4000-8000-100000000148",(select NOW()),"haloperidol","haloperidol","N05AD01",'2019-02-11'),
("00000000-0000-4000-8000-100000000148",(select NOW()),"prazosin","prazosin","C02CA01",'2019-02-11'),

("00000000-0000-4000-8000-100000000149",(select NOW()),"fluoxetine","fluoxetine","N06AB03",'2019-02-11'),
("00000000-0000-4000-8000-100000000149",(select NOW()),"reserpine","reserpine","C02AA02",'2019-02-11'),

("00000000-0000-4000-8000-100000000150",(select NOW()),"carbamazepine","carbamazepine","N03AF01",'2019-02-11'),
("00000000-0000-4000-8000-100000000150",(select NOW()),"Amlodipine","amlodipine","C08CA01",'2019-02-11'),

("00000000-0000-4000-8000-100000000151",(select NOW()),"rosuvastatin, amlodipine and lisinopril","rosuvastatin, amlodipine en lisinopril","C10BX07",'2019-02-11'),

("00000000-0000-4000-8000-100000000152",(select NOW()),"tramadol","tramadol","N02AX02",'2019-02-11'),
("00000000-0000-4000-8000-100000000152",(select NOW()),"diclofenac","diclofenac","M01AB05",'2019-02-11'),
("00000000-0000-4000-8000-100000000152",(select NOW()),"pancuronium","pancuronium","M03AC01",'2019-02-11'),
("00000000-0000-4000-8000-100000000152",(select NOW()),"omeprazol","omeprazol","A02BC01",'2019-02-11'),

("00000000-0000-4000-8000-100000000153",(select NOW()),"morfine","morfine","N02AA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000153",(select NOW()),"indometacin","indometacin","M01AB01",'2019-02-11'),
("00000000-0000-4000-8000-100000000153",(select NOW()),"methocarbamol","methocarbamol","M03BA03",'2019-02-11'),

("00000000-0000-4000-8000-100000000154",(select NOW()),"gabapentin","gabapentin","N03AX12",'2019-02-11'),
("00000000-0000-4000-8000-100000000154",(select NOW()),"gliclazide","gliclazide","A10BB09",'2019-02-11'),

("00000000-0000-4000-8000-100000000155",(select NOW()),"promethazine","promethazine","R06AD02",'2019-02-11'),
("00000000-0000-4000-8000-100000000155",(select NOW()),"dicyclomine","dicyclomine","A03AA07",'2019-02-11'),
("00000000-0000-4000-8000-100000000155",(select NOW()),"flavoxaat","flavoxaat","G04BD02",'2019-02-11'),

("00000000-0000-4000-8000-100000000156",(select NOW()),"butylscopolamine","butylscopolamine","A03BB01",'2019-02-11'),
("00000000-0000-4000-8000-100000000156",(select NOW()),"tamsulosin","tamsulosin","G04CA02",'2019-02-11'),
("00000000-0000-4000-8000-100000000156",(select NOW()),"sildenafil","sildenafil","G04BE03",'2019-02-11'),
("00000000-0000-4000-8000-100000000156",(select NOW()),"fentolamine","fentolamine","G04BE05",'2019-02-11'),

("00000000-0000-4000-8000-100000000157",(select NOW()),"sitagliptin","sitagliptin","A10BH01",'2019-02-11'),
("00000000-0000-4000-8000-100000000157",(select NOW()),"rivastigmine","rivastigmine","N06DA03",'2019-02-11'),

("00000000-0000-4000-8000-100000000158",(select NOW()),"lixisenatide","lixisenatide","A10BJ03",'2019-02-11'),
("00000000-0000-4000-8000-100000000158",(select NOW()),"piracetam","piracetam","N06BX03",'2019-02-11'),

("00000000-0000-4000-8000-100000000159",(select NOW()),"dapagliflozin","dapagliflozin","A10BK01",'2019-02-11'),
("00000000-0000-4000-8000-100000000159",(select NOW()),"salmeterol","salmeterol","R03AC12",'2019-02-11'),

("00000000-0000-4000-8000-100000000160",(select NOW()),"levodopa","levodopa","N04BA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000162",(select NOW()),"levodopa","levodopa","N04BA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000168",(select NOW()),"methocarbamol","methocarbamol","M03BA03",'2019-02-11'),

("00000000-0000-4000-8000-100000000180",(select NOW()),"amitriptyline","amitriptyline","N06AA09",'2020-08-01'),

/* fake patient for data reload test */
("00000000-0000-4000-8000-100000000174",(select NOW()),"lixisenatide","lixisenatide","A10BJ03",'2019-02-11'),
("00000000-0000-4000-8000-100000000174",(select NOW()),"levodopa","levodopa","N04BA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000179",(select NOW()),"levodopa","levodopa","N04BA01",'2019-02-11'),
("00000000-0000-4000-8000-100000000182",(select NOW()),"lixisenatide","lixisenatide","A10BJ03",'2019-02-11'),
("00000000-0000-4000-8000-100000000182",(select NOW()),"levodopa","levodopa","N04BA01",'2019-02-11');
