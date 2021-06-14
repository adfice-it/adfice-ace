alter table preselect_rules add column sql_condition varchar(1000);
UPDATE preselect_rules SET sql_condition="select true where (select true where (select patient_id from patient_problems where patient_id = ? and name IN(\'angststoornis\',\'epilepsy\') limit 1) IS NULL) and (select true from patient_medications where patient_id = ? and ((ATC_code LIKE \'N05C%\' AND ATC_code NOT LIKE \'N05CH%\') or ATC_code LIKE \'N05BA%\') and start_date > CURRENT_DATE() - INTERVAL 2 WEEK );" where medication_criteria_id="6e" and select_box_num = 1 and preselect_num = 1;
UPDATE preselect_rules SET sql_condition="select true where (select true where (select patient_id from patient_problems where patient_id = ? and name IN(\'angststoornis\',\'epilepsy\') limit 1) IS NULL) and (select true from patient_medications where patient_id = ? and ((ATC_code LIKE \'N05C%\' AND ATC_code NOT LIKE \'N05CH%\') or ATC_code LIKE \'N05BA%\') and start_date <= CURRENT_DATE() - INTERVAL 2 WEEK );" where medication_criteria_id="6e" and select_box_num = 2 and preselect_num = 1;
UPDATE preselect_rules SET sql_condition="select true where (select true from patient_problems where patient_id = ? and name in(\'parkinson\',\'lewy-bodies-dementie\',\'multiple-system-atrophy\',\'progressive-supranuclear-palsy\') limit 1) and (select true from patient_medications where patient_id = ? and ((ATC_code LIKE \'N05C%\' AND ATC_code NOT LIKE \'N05CH%\') or ATC_code LIKE \'N05BA%\') and start_date > CURRENT_DATE() - INTERVAL 2 WEEK );" where medication_criteria_id="6e" and select_box_num = 1 and preselect_num= 2;
UPDATE preselect_rules SET sql_condition="select true where (select true from patient_problems where patient_id = ? and name in(\'parkinson\',\'lewy-bodies-dementie\',\'multiple-system-atrophy\',\'progressive-supranuclear-palsy\') limit 1) and (select true from patient_medications where patient_id = ? and ((ATC_code LIKE \'N05C%\' AND ATC_code NOT LIKE \'N05CH%\') or ATC_code LIKE \'N05BA%\') and start_date <= CURRENT_DATE() - INTERVAL 2 WEEK );" where medication_criteria_id="6e" and select_box_num = 2 and preselect_num= 2;
UPDATE preselect_rules SET sql_condition="select true where (select patient_id from patient_problems where patient_id = ? and name IN(\'angststoornis\',\'depressie\') limit 1) IS NULL;" where medication_criteria_id="19f" and select_box_num = 1 and preselect_num = 1;
UPDATE preselect_rules SET sql_condition="select true where (select true from patient_problems where patient_id = ? and name = \'hartfalen\' limit 1) IS NULL limit 1;" where medication_criteria_id="42" and select_box_num = 2 and preselect_num = 1;
UPDATE preselect_rules SET sql_condition="select true where (select patient_id from patient_problems where patient_id = ? and name IN(\'hypertensie\',\'hartfalen\') limit 1) IS NULL;" where medication_criteria_id="42" and select_box_num = 2 and preselect_num = 2;
UPDATE preselect_rules SET sql_condition="select true from (select patient_labs.patient_id, lab_test_name, lab_test_result, name from patient_labs LEFT OUTER JOIN patient_problems on patient_labs.patient_id = patient_problems.patient_id where patient_labs.patient_id = ? AND ((lab_test_name = \'natrium\' AND cast(lab_test_result as decimal(5,2)) < 130) or (lab_test_name = \'kalium\' AND cast(lab_test_result as decimal(5,2)) < 3.0) or (lab_test_name = \'calcium\' AND cast(lab_test_result as decimal(5,2)) > 2.65)) UNION select patient_problems.patient_id, lab_test_name, lab_test_result, name from patient_problems LEFT OUTER JOIN patient_labs on patient_labs.patient_id = patient_problems.patient_id where patient_problems.patient_id = ? and name in(\'jicht\',\'hypokalemia\',\'hyponatremia\',\'hypercalciemie\')) as lp;" where medication_criteria_id="42" and select_box_num = 2 and preselect_num = 3;
UPDATE preselect_rules SET sql_condition="select true from patient_problems where patient_id = ? and name in(\'parkinson\',\'lewy-bodies-dementie\',\'multiple-system-atrophy\',\'progressive-supranuclear-palsy\') limit 1;" where medication_criteria_id="42" and select_box_num = 2 and preselect_num = 4;
UPDATE preselect_rules SET sql_condition="select true where (select true from patient_problems where patient_id = ? and name in(\'parkinson\',\'lewy-bodies-dementie\',\'multiple-system-atrophy\',\'progressive-supranuclear-palsy\') limit 1) and (select true from patient_problems where patient_id = ? and name = \'orthostatische-hypotensie\' limit 1);" where medication_criteria_id="42" and select_box_num = 2 and preselect_num = 5;
UPDATE preselect_rules SET sql_condition="select true where (select true from patient_problems where patient_id = ? and name in(\'parkinson\',\'lewy-bodies-dementie\',\'multiple-system-atrophy\',\'progressive-supranuclear-palsy\') limit 1) and (select true from patient_problems where patient_id = ? and name = \'orthostatische-hypotensie\' limit 1);" where medication_criteria_id="46" and select_box_num = 1 and preselect_num = 1;
UPDATE preselect_rules SET sql_condition="select true where (select true from patient_problems where patient_id = ? and name in(\'parkinson\',\'lewy-bodies-dementie\',\'multiple-system-atrophy\',\'progressive-supranuclear-palsy\') limit 1) and (select true from patient_problems where patient_id = ? and name = \'orthostatische-hypotensie\' limit 1);" where medication_criteria_id="50" and select_box_num = 1 and preselect_num = 1;
UPDATE preselect_rules SET sql_condition="select true where (select true from patient_problems where patient_id = ? and name in(\'parkinson\',\'lewy-bodies-dementie\',\'multiple-system-atrophy\',\'progressive-supranuclear-palsy\') limit 1) and (select true from patient_problems where patient_id = ? and name = \'orthostatische-hypotensie\' limit 1);" where medication_criteria_id="56" and select_box_num = 1 and preselect_num = 2;
UPDATE preselect_rules SET sql_condition="select true where (select patient_id from patient_problems where patient_id = ? and name IN(\'atriumfibrilleren\',\'angina-pectoris\',\'myocardinfarct\') limit 1) IS NULL;" where medication_criteria_id="56" and select_box_num = 1 and preselect_num = 3;
UPDATE preselect_rules SET sql_condition="select true where (select true from patient_problems where patient_id = ? and name in(\'parkinson\',\'lewy-bodies-dementie\',\'multiple-system-atrophy\',\'progressive-supranuclear-palsy\') limit 1) and (select true from patient_problems where patient_id = ? and name = \'orthostatische-hypotensie\' limit 1);" where medication_criteria_id="63" and select_box_num = 1 and preselect_num = 1;
UPDATE preselect_rules SET sql_condition="select true from patient_labs where patient_labs.patient_id = ? AND lab_test_name = \'eGFR\' AND cast(lab_test_result as decimal(5,2)) <= 30 AND date_measured >= CURRENT_DATE() - INTERVAL 11 MONTH limit 1;" where medication_criteria_id="78" and select_box_num = 2 and preselect_num = 1;
UPDATE preselect_rules SET sql_condition="select true from patient_medications where patient_id = ? and ATC_code in(\'N02BE01\',\'N02BE51\',\'N02BE71\',\'N02AJ01\',\'N02AJ06\',\'N02AJ13\',\'N02AJ17\') limit 1;" where medication_criteria_id="78" and select_box_num = 2 and preselect_num = 2;
UPDATE preselect_rules SET sql_condition="select true where (select patient_id from patient_problems where patient_id = ? and name IN(\'paraplegia\',\'dwaarslaesie\') limit 1) IS NULL;" where medication_criteria_id="88" and select_box_num = 2 and preselect_num = 1;
UPDATE preselect_rules SET sql_condition="select true;" where 
	   (medication_criteria_id="36" and select_box_num = 1 and preselect_num = 1)
	or (medication_criteria_id="36" and select_box_num = 2 and preselect_num = 1)
	or (medication_criteria_id="54" and select_box_num = 1 and preselect_num = 1)
	or (medication_criteria_id="105a" and select_box_num = 1 and preselect_num = 1)
	or (medication_criteria_id="106" and select_box_num = 1 and preselect_num = 1)
	or (medication_criteria_id="113" and select_box_num = 1 and preselect_num = 1);
