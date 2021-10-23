// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const fs = require('fs');
const path = require('path');
const autil = require('./adficeUtil');
const ae = require('./adficeEvaluator');
const cp = require('./calculatePrediction');
const adb = require('./adficeDB');

async function db_init() {
    if (!this.db) {
        this.db = await adb.init();
    }
    return this.db;
}

async function shutdown() {
    try {
        /* istanbul ignore else */
        if (this.db) {
            await this.db.close();
        }
    } finally {
        this.db = null;
    }
}

function question_marks(num) {
    return '?,'.repeat(num - 1) + '?';
}

async function sql_select(sql, params) {
    let db = await this.db_init();
    return await db.sql_query(sql, params);
}

function split_advice_texts_cdss_ehr_patient(advice_texts) {
    for (let j = 0; j < advice_texts.length; ++j) {
        let row = advice_texts[j];

        row.an_fyi = 'Flat fields "cdss", "ehr", "patient" are for debugging';

        row.cdss_split = autil.splitFreetext(row.cdss);
        /* delete row.cdss; TODO: switch patient-validation to cdss_split */

        row.ehr_split = autil.splitFreetext(row.ehr);
        /* delete row.ehr */

        row.patient_split = autil.splitFreetext(row.patient);
        /* delete row.patient */
    }
    return advice_texts;
}

async function getTableSizes() {
    let db = await this.db_init();
    let params = [await db.schema_name()];
    let sql = `/* adfice.getTableSizes */
        SELECT table_name
             , table_rows
             , ROUND((data_length + index_length)/POWER(1024,2),1) AS size_mb
             , (data_length + index_length) AS size_bytes
          FROM information_schema.tables
         WHERE table_schema=?
      ORDER BY size_bytes DESC`;
    return await this.sql_select(sql, params);
}

async function getAllAdviceTextsCheckboxes() {
    var sql = `/* adfice.getAllAdviceTextsCheckboxes */
        SELECT m.medication_criteria_id
             , m.select_box_num
             , m.select_box_category
             , m.cdss
             , m.ehr
             , m.patient
             , p.priority
          FROM med_advice_text m
     LEFT JOIN select_box_category_priority p
            ON (m.select_box_category = p.select_box_category)
         WHERE select_box_num IS NOT NULL
      ORDER BY p.priority ASC, m.select_box_num ASC, m.id ASC`;
    let advice_text = await this.sql_select(sql);
    let list = split_advice_texts_cdss_ehr_patient(advice_text);
    let all = {};
    for (let i = 0; i < list.length; ++i) {
        let row = list[i];
        let rule_num = row.medication_criteria_id;
        all[rule_num] = all[rule_num] || [];
        all[rule_num].push(row);
    }

    return all;
}

// called from AdficeWebserver
async function getAdviceTextsCheckboxes(rule_numbers, all) {
    if ((rule_numbers == null) || (!rule_numbers.length)) {
        return [];
    }
    if (!all) {
        all = await this.getAllAdviceTextsCheckboxes();
    }
    let narrowed = [];
    for (let i = 0; i < rule_numbers.length; ++i) {
        let rule_num = rule_numbers[i];
        let subset = all[rule_num];
        if (subset) {
            Array.prototype.push.apply(narrowed, subset);
        }
    }

    narrowed.sort((a, b) => {
        return ((a.priority - b.priority) ||
            (a.select_box_num - b.select_box_num) ||
            (a.id - b.id));
    });

    return narrowed;
}

async function getAdviceOtherTextsCheckboxes() {
    var sql = `/* adfice.getAdviceOtherTextsCheckboxes */
        SELECT medication_criteria_id
             , select_box_num
             , select_box_category
             , select_box_designator
             , cdss
             , ehr
             , patient
          FROM med_other_text
      ORDER BY medication_criteria_id
             , select_box_num`;
    let advice_text = await this.sql_select(sql);
    return split_advice_texts_cdss_ehr_patient(advice_text);
}

async function getAdviceTextsNoCheckboxes(rule_numbers) {
    if (rule_numbers == null || !rule_numbers.length) {
        return [];
    }
    var sql = `/* adfice.getAdviceTextsNoCheckboxes */
        SELECT medication_criteria_id
             , cdss
          FROM med_advice_text
         WHERE select_box_num IS NULL
           AND medication_criteria_id IN(` +
        question_marks(rule_numbers.length) +
        `)
      ORDER BY id`;
    let advice_text = await this.sql_select(sql, rule_numbers);
    return split_advice_texts_cdss_ehr_patient(advice_text);
}

async function getAdviceTextsNonMedCheckboxes() {
    var sql = `/* adfice.getAdviceTextsNonMedCheckboxes */
        SELECT t.category_id
             , h.category_name
             , t.select_box_num
             , t.preselected
             , t.cdss
             , t.ehr
             , t.patient
          FROM nonmed_header AS h
          JOIN nonmed_text AS t
            ON (h.category_id = t.category_id)
      ORDER BY t.category_id
             , t.select_box_num
    `;
    let advice_text = await this.sql_select(sql);
    return split_advice_texts_cdss_ehr_patient(advice_text);
}

async function getReferenceNumbers(rule_numbers) {
    if (rule_numbers == null || !rule_numbers.length) {
        return [];
    }
    var sql = `/* adfice.getReferenceNumbers */
        SELECT reference
          FROM med_rules
         WHERE medication_criteria_id IN(` +
        question_marks(rule_numbers.length) +
        `)
      GROUP BY reference
      ORDER BY MIN(med_rules.id) ASC`;
    return await this.sql_select(sql, rule_numbers);
}

async function getActiveRules() {
    var sql = `/* adfice.getActiveRules */
         SELECT *
           FROM med_rules
          WHERE active = 'yes'
       ORDER BY id`;
    let rules = await this.sql_select(sql);
    return rules;
}

function as_id(num_or_str) {
    let num;
    if (typeof num_or_str == 'number') {
        num = num_or_str;
    } else {
        num = parseInt(num_or_str, 10) || 0;
    }
    return num;
}

async function getMedsForPatient(patient_id) {
    var sql = `/* adfice.getMedsForPatient */
        SELECT ATC_code
             , medication_name
             , generic_name
             , start_date
          FROM patient_medication
         WHERE patient_id=?
      ORDER BY ATC_code`;
    let params = [patient_id, patient_id];
    let meds = await this.sql_select(sql, params);
    return meds;
}

/* TODO refactor to make this set-based, rather than loop */
/* (the list is not long, we should read the whole table in to RAM) */
async function getSQLCondition(ruleNumber) {
    var sql = `/* adfice.getSQLCondition */
        SELECT sql_condition
          FROM med_rules
         WHERE medication_criteria_id=?
         `;
    let results = await this.sql_select(sql, [ruleNumber]);
    return results[0]['sql_condition'];
}

async function isSQLConditionTrue(patientIdentifier, ruleNumber) {
    let patient_id = as_id(patientIdentifier);
    let result = await this.evaluateSQLCondition(patient_id, ruleNumber);
    return result;
}

async function evaluateSQLCondition(patient_id, ruleNumber) {
    var sql = await this.getSQLCondition(ruleNumber);
    if (sql == null) {
        return true;
    } //no conditions === always true
    /* count the number of question marks in the string */
    return await this.evaluateSQL(sql, patient_id);
}

async function evaluateSQL(sql, patient_id) {
    let count;
    let matches = sql.match(/\?/g);
    if (matches) {
        count = matches.length;
    } else {
        count = 0;
    }

    let params = [];
    for (let i = 0; i < count; ++i) {
        params.push(patient_id);
    }
    let results = await this.sql_select(sql, params);
    if (results.length == 0) {
        return false;
    }
    autil.assert((results[0]['TRUE'] == 1), JSON.stringify({
        patient_id: patient_id,
        sql: sql,
        results: results
    }, null, 4));
    return true;
}

async function getPreselectRules(ruleNumber) {
    var sql = `/* adfice.getPreselectRules */
        SELECT *
          FROM preselect_rules
         WHERE medication_criteria_id=?
         `;
    let results = await this.sql_select(sql, [ruleNumber]);
    return results;
}

async function getProblemsForPatient(patient_id) {
    var sql = `/* adfice.getProblemsForPatient */
        SELECT name
             , start_date
             , display_name
          FROM patient_problem
         WHERE patient_id=?
      ORDER BY id`;
    let params = [patient_id, patient_id];
    let probs = await this.sql_select(sql, params);
    return probs;
}

async function getPatientById(patient_id) {
    var sql = `/* adfice.getPatientById */
        SELECT *
          FROM patient
         WHERE id=?`;
    let params = [patient_id];
    let results = await this.sql_select(sql, params);
    let patient;
    if (results.length > 0) {
        patient = results[0];
    } else {
        patient = {};
    }
    return patient;
}

async function getLabsForPatient(patient_id) {
    var sql = `/* adfice.getLabsForPatient */
        SELECT lab_test_name
             , lab_test_result
             , date_measured
          FROM patient_lab
         WHERE patient_id=?
      ORDER BY id`;
    let params = [patient_id, patient_id];
    let result = await this.sql_select(sql, params);
    return result;
}

async function getPatientMeasurements(patient_id) {
    var sql = `/* adfice.getPatientMeasurements */
        SELECT *
          FROM patient_measurement
         WHERE patient_id=?`
    let params = [patient_id];
    let results = await this.sql_select(sql, params);
    if (results.length > 0) {
        return results;
    }
    return null;
}

async function getPredictionResult(patient_id) {
    let measurements = await this.getPatientMeasurements(patient_id);

    if (!measurements || !measurements.length) {
        return null;
    }

    let measurement = measurements[0];

    if (measurement.prediction_result == null) {
        measurement = await this.calculateAndStorePredictionResult(patient_id);
    }

    return measurement.prediction_result;
}

async function updatePredictionResult(row_id, prediction_result) {
    let sql = `/* adfice.updatePredictionResult */
        UPDATE patient_measurement
           SET prediction_result = ?
         WHERE id = ?`;
    let params = [prediction_result, row_id];
    let results = await this.sql_select(sql, params);
}

async function calculateAndStorePredictionResult(patient_id) {
    let measurement = await this.calculatePredictionResult(patient_id);
    autil.assert(measurement);
    await this.updatePredictionResult(
        measurement.id,
        measurement.prediction_result);
    let measurements = await this.getPatientMeasurements(patient_id);
    autil.assert(measurements);
    autil.assert(measurements.length > 0);
    return measurements[0];
}

async function calculatePredictionResult(patient_id) {
    let measurements = await this.getPatientMeasurements(patient_id);
    if (measurements == null || !measurements.length) {
        return null;
    }
    let measurement = measurements[0];
    let prediction = cp.calculatePredictionDB(
        measurement['GDS_score'],
        measurement['grip_kg'],
        measurement['walking_speed_m_per_s'],
        measurement['BMI'],
        measurement['systolic_bp_mmHg'],
        measurement['number_of_limitations'],
        measurement['nr_falls_12m'],
        measurement['smoking'],
        measurement['has_antiepileptica'],
        measurement['has_ca_blocker'],
        measurement['has_incont_med'],
        measurement['education_hml'],
        measurement['fear1'],
        measurement['fear2']);
    measurement['prediction_result'] = prediction;
    return measurement;
}

async function setSQLSelectionsForPatient(sqls_and_params, patient_id,
    viewer_id, cb_states) {
    let insert_sql = `/* adfice.setAdviceForPatient */
 INSERT INTO patient_advice_selection
           ( patient_id
           , viewer_id
           , ATC_code
           , medication_criteria_id
           , select_box_num
           , selected
           )
      VALUES (?,?,?,?,?,?)
 ON DUPLICATE KEY
      UPDATE viewer_id=VALUES(viewer_id)
           , selected=VALUES(selected)
`;
    let params = boxStatesToSelectionStates(patient_id, viewer_id, cb_states);
    for (let i = 0; i < params.length; ++i) {
        sqls_and_params.push([insert_sql, params[i]]);
    }
}

async function setSQLFreetextsForPatient(sqls_and_params, patient_id,
    viewer_id, freetexts) {
    let insert_sql = `/* adfice.setAdviceForPatient */
 INSERT INTO patient_advice_freetext
           ( patient_id
           , viewer_id
           , ATC_code
           , medication_criteria_id
           , select_box_num
           , freetext_num
           , freetext
           )
      VALUES (?,?,?,?,?,?,?)
 ON DUPLICATE KEY
      UPDATE viewer_id=VALUES(viewer_id)
           , freetext=VALUES(freetext)
`;
    let params = freetextsToRows(patient_id, viewer_id, freetexts);
    for (let i = 0; i < params.length; ++i) {
        sqls_and_params.push([insert_sql, params[i]]);
    }
}

// called from AdficeWebserver
async function setAdviceForPatient(patientIdentifier, viewer,
    cb_states, freetexts) {
    const patient_id = as_id(patientIdentifier);
    const viewer_id = as_id(viewer);

    let sqls_and_params = [];

    if (cb_states) {
        setSQLSelectionsForPatient(sqls_and_params, patient_id, viewer_id,
            cb_states);
    }

    if (freetexts) {
        setSQLFreetextsForPatient(sqls_and_params, patient_id, viewer_id,
            freetexts);
    }

    let db = await this.db_init();
    let rs = await db.as_sql_transaction(sqls_and_params);
    return rs;
}

async function getSelectionsForPatient(patient_id) {
    var sql = `/* adfice.getSelectionsForPatient */
        SELECT patient_id
             , viewer_id
             , ATC_code
             , medication_criteria_id
             , select_box_num
             , selected
          FROM patient_advice_selection
         WHERE patient_id=?
      ORDER BY id`;
    let params = [patient_id];
    let results = await this.sql_select(sql, params);
    return selectionStatesToBoxStates(results);
}

async function getFreetextsForPatient(patient_id) {
    var sql = `/* adfice.getFreetextForPatient */
         SELECT patient_id
              , viewer_id
              , ATC_code
              , medication_criteria_id
              , select_box_num
              , freetext_num
              , freetext
           FROM patient_advice_freetext
          WHERE patient_id=?
       ORDER BY id`;
    let params = [patient_id];
    let results = await this.sql_select(sql, params);
    return rowsToFreetexts(results);
}

function structureLabs(labRows) {
    let labTests = {};
    for (let i = 0; i < labRows.length; ++i) {
        let row = labRows[i];
        let lab_test_name = row.lab_test_name;
        let lab_test_result = row.lab_test_result;
        let date_measured = row.date_measured;
        labTests[lab_test_name] = labTests[lab_test_name] || {};
        labTests[lab_test_name]['lab_test_result'] = lab_test_result;
        labTests[lab_test_name]['date_measured'] = date_measured;
    }
    return labTests;
}

function structureMeas(measRow) {
    let measurements = {};
	// seems like there ought to be a less horrible way to do this, but this'll do.
	// the ETL should prevent this from happening in real life, but it definitely happens in the test data.
	if (typeof(measRow) == 'undefined' || measRow == null || measRow.length !=1){
		    measurements['user_education_hml'] = null;
			measurements['education_hml'] = null;
			measurements['user_height_cm'] = null;
			measurements['height_cm'] = null;
			measurements['height_date_measured'] = null;
			measurements['user_weight_kg'] = null;
			measurements['weight_kg'] = null;
			measurements['weight_date_measured'] = null;
			measurements['BMI'] = null;
			measurements['BMI_date_measured'] = null;
			measurements['user_GDS_score'] = null;
			measurements['GDS_score'] = null;
			measurements['GDS_date_measured'] = null;
			measurements['user_grip_kg'] = null;
			measurements['grip_kg'] = null;
			measurements['grip_date_measured'] = null;
			measurements['user_walking_speed_m_per_s'] = null;
			measurements['walking_speed_m_per_s'] = null;
			measurements['walking_date_measured'] = null;
			measurements['user_systolic_bp_mmHg'] = null;
			measurements['systolic_bp_mmHg'] = null;
			measurements['diastolic_bp_mmHg'] = null;
			measurements['bp_date_measured'] = null;
			measurements['user_number_of_limitations'] = null;
			measurements['number_of_limitations'] = null;
			measurements['functional_limit_date_measured'] = null;
			measurements['user_fear0'] = null;
			measurements['user_fear1'] = null;
			measurements['user_fear2'] = null;
			measurements['fear0'] = null;
			measurements['fear1'] = null;
			measurements['fear2'] = null;
			measurements['fear_of_falls_date_measured'] = null;
			measurements['user_nr_falls_12m'] = null;
			measurements['nr_falls_12m'] = null;
			measurements['nr_falls_date_measured'] = null;
			measurements['user_smoking'] = null;
			measurements['smoking'] = null;
			measurements['smoking_date_measured'] = null;
			measurements['has_antiepileptica'] = null;
			measurements['has_ca_blocker'] = null;
			measurements['has_incont_med'] = null;
			measurements['prediction_result'] = null;
			measurements['user_values_updated'] = null;
	} else {
		measurements['user_education_hml'] = measRow[0].user_education_hml;
		measurements['education_hml'] = measRow[0].education_hml;
		measurements['user_height_cm'] = measRow[0].user_height_cm;
		measurements['height_cm'] = measRow[0].height_cm;
		measurements['height_date_measured'] = measRow[0].height_date_measured;
		measurements['user_weight_kg'] = measRow[0].user_weight_kg;
		measurements['weight_kg'] = measRow[0].weight_kg;
		measurements['weight_date_measured'] = measRow[0].weight_date_measured;
		measurements['BMI'] = measRow[0].BMI;
		measurements['BMI_date_measured'] = measRow[0].BMI_date_measured;
		measurements['user_GDS_score'] = measRow[0].user_GDS_score;
		measurements['GDS_score'] = measRow[0].GDS_score;
		measurements['GDS_date_measured'] = measRow[0].GDS_date_measured;
		measurements['user_grip_kg'] = measRow[0].user_grip_kg;
		measurements['grip_kg'] = measRow[0].grip_kg;
		measurements['grip_date_measured'] = measRow[0].grip_date_measured;
		measurements['user_walking_speed_m_per_s'] = measRow[0].user_walking_speed_m_per_s;
		measurements['walking_speed_m_per_s'] = measRow[0].walking_speed_m_per_s;
		measurements['walking_date_measured'] = measRow[0].walking_date_measured;
		measurements['user_systolic_bp_mmHg'] = measRow[0].user_systolic_bp_mmHg;
		measurements['systolic_bp_mmHg'] = measRow[0].systolic_bp_mmHg;
		measurements['diastolic_bp_mmHg'] = measRow[0].diastolic_bp_mmHg;
		measurements['bp_date_measured'] = measRow[0].bp_date_measured;
		measurements['user_number_of_limitations'] = measRow[0].user_number_of_limitations;
		measurements['number_of_limitations'] = measRow[0].number_of_limitations;
		measurements['functional_limit_date_measured'] = measRow[0].functional_limit_date_measured;
		measurements['user_fear0'] = measRow[0].user_fear0;
		measurements['user_fear1'] = measRow[0].user_fear1;
		measurements['user_fear2'] = measRow[0].user_fear2;
		measurements['fear0'] = measRow[0].fear0;
		measurements['fear1'] = measRow[0].fear1;
		measurements['fear2'] = measRow[0].fear2;
		measurements['fear_of_falls_date_measured'] = measRow[0].fear_of_falls_date_measured;
		measurements['user_nr_falls_12m'] = measRow[0].user_nr_falls_12m;
		measurements['nr_falls_12m'] = measRow[0].nr_falls_12m;
		measurements['nr_falls_date_measured'] = measRow[0].nr_falls_date_measured;
		measurements['user_smoking'] = measRow[0].user_smoking;
		measurements['smoking'] = measRow[0].smoking;
		measurements['smoking_date_measured'] = measRow[0].smoking_date_measured;
		measurements['has_antiepileptica'] = measRow[0].has_antiepileptica;
		measurements['has_ca_blocker'] = measRow[0].has_ca_blocker;
		measurements['has_incont_med'] = measRow[0].has_incont_med;
		measurements['prediction_result'] = measRow[0].prediction_result;
		measurements['user_values_updated'] = measRow[0].user_values_updated;
	}
    return measurements;
}

// called from AdficeWebserver
async function getAdviceForPatient(patientIdentifier) {
    let patient_id = as_id(patientIdentifier);
    let patient = await this.getPatientById(patient_id);
    let age = patient.age;
    let is_final = false;
    if (patient.is_final) {
        is_final = true;
    }

    let labRows = await this.getLabsForPatient(patient_id);
    let labTests = structureLabs(labRows);

    let problems = await this.getProblemsForPatient(patient_id);
    let problemList = [];
    for (let i = 0; i < problems.length; ++i) {
        problemList.push(problems[i].name);
    }
	
	let measurements = structureMeas(await this.getPatientMeasurements(patient_id));
	
	var meds = await this.getMedsForPatient(patient_id);
    let drugList = [];
    for (let i = 0; i < meds.length; ++i) {
        drugList.push(meds[i].ATC_code);
    }

    var rules = await this.getActiveRules();
    var all_cb_advice = await this.getAllAdviceTextsCheckboxes();

    let evaluated = await ae.evaluateRules(meds, rules, patient_id,
        async (pId, ruleNum) => {
            return await this.isSQLConditionTrue(pId, ruleNum);
        }
    );
    let medsWithRulesToFire = evaluated.medsWithRulesToFire;
    let meds_with_fired = evaluated.meds_with_fired;
    let meds_without_fired = evaluated.meds_without_fired;
    let preselected_checkboxes = {};
    let advice = [];
    for (let i = 0; i < meds.length; ++i) {
        let med = meds[i];
        let atc_code = med.ATC_code;
        let fired = medsWithRulesToFire[atc_code];
        if (!fired || !fired.length) {
            continue;
        }

        let advice_text = await this.getAdviceTextsCheckboxes(fired,
            all_cb_advice);

        let advice_text_no_box = await this.getAdviceTextsNoCheckboxes(fired);

        let atc_preselected_checkboxes =
            await this.determinePreselectedCheckboxes(fired, patient_id,
                atc_code.trim());
        Object.assign(preselected_checkboxes, atc_preselected_checkboxes);

        let adv = {};
        adv.ATC_code = atc_code.trim();
        adv.medication_name = med.medication_name.trim();
        adv.generic_name = med.generic_name.trim();
        adv.adviceTextsCheckboxes = advice_text;
        adv.adviceTextsNoCheckboxes = advice_text_no_box;
        adv.referenceNumbers = await this.getReferenceNumbers(fired);
        adv.fired = fired;
        adv.preselectedCheckboxes = atc_preselected_checkboxes;
        advice.push(adv);
    }

    let advice_text_non_med = await this.getAdviceTextsNonMedCheckboxes();
    for (let i = 0; i < advice_text_non_med.length; ++i) {
        let nm_adv = advice_text_non_med[i];
        if (nm_adv.preselected) {
            let category = nm_adv.category_id;
            let box = nm_adv.select_box_num;
            let checkbox_id = `cb_NONMED_${category}_${box}`;
            preselected_checkboxes[checkbox_id] = 'checked';
        }
    }
    let advice_other_text = await this.getAdviceOtherTextsCheckboxes();
    let selected_advice = await this.getSelectionsForPatient(patient_id);

    let cb_states = [];
    if (Object.keys(selected_advice).length == 0 && patient.id !== undefined) {
        cb_states = preselected_checkboxes;
        await this.setAdviceForPatient(patientIdentifier, 0, cb_states, null);
        selected_advice = await this.getSelectionsForPatient(patient_id);
    }

    let free_texts = await this.getFreetextsForPatient(patient_id);

    let risk_score = await this.getPredictionResult(patient_id);

    let debug_info = {
        data_sizes: await this.getTableSizes()
    };

    let patient_advice = {};
    patient_advice.patient_id = patient_id;
    patient_advice.age = age;
    patient_advice.is_final = is_final;
    patient_advice.labs = labRows;
    patient_advice.medications = meds;
    patient_advice.meds_without_rules = meds_without_fired;
    patient_advice.meds_with_rules = meds_with_fired;
    patient_advice.problems = problems;
	patient_advice.measurements = measurements;
    patient_advice.medication_advice = advice;
    patient_advice.selected_advice = selected_advice;
    patient_advice.free_texts = free_texts;
    patient_advice.advice_text_non_med = advice_text_non_med;
    patient_advice.advice_other_text = advice_other_text;
    patient_advice.risk_score = risk_score;
    patient_advice.debug_info = debug_info;

    return patient_advice;
}

async function determinePreselectedCheckboxes(fired, patient_id, atc_code) {
    let preselected = {};
    for (let i = 0; i < fired.length; ++i) {
        let rule_number = fired[i].toString();
        let preselectRules = await this.getPreselectRules(rule_number);
        for (let j = 0; j < preselectRules.length; ++j) {
            let preselectRule = preselectRules[j];
            let box = preselectRule['select_box_num'];
            let is_preselected = await ae.evaluatePreselected(preselectRule,
                patient_id, atc_code, async (sql, pId) => {
                    return await this.evaluateSQL(sql, pId);
                }
            );
            if (is_preselected) {
                let checkbox_id = `cb_${atc_code}_${rule_number}_${box}`;
                preselected[checkbox_id] = 'checked';
            }
        }
    }
    return preselected;
}

function boxStatesToSelectionStates(patient_id, viewer_id, box_states) {
    let output = [];

    const checkbox_ids = Object.keys(box_states);
    checkbox_ids.forEach((checkbox_id, index) => {
        let parts = checkbox_id.split('_');
        let atc = parts[1];
        let criterion = parts[2];
        let box_num = parseInt(parts[3], 10);
        let checked = 0;
        if (box_states[checkbox_id]) {
            checked = 1;
        }
        output.push([patient_id, viewer_id, atc, criterion, box_num, checked]);
    });

    return output;
}

function selectionStatesToBoxStates(selection_states) {
    let output = {};
    for (let i = 0; i < selection_states.length; ++i) {
        let row = selection_states[i];
        let atc = row['ATC_code'];
        let rule = row['medication_criteria_id'];
        let box = row['select_box_num'];
        let checkbox_id = `cb_${atc}_${rule}_${box}`;
        let checked;
        if (row['selected']) {
            checked = true;
        } else {
            checked = false;
        }
        output[checkbox_id] = checked;
    }
    return output;
}

function rowsToFreetexts(rows) {
    let output = {};
    for (let i = 0; i < rows.length; ++i) {
        let row = rows[i];
        let atc = row['ATC_code'];
        let rule = row['medication_criteria_id'];
        let box = row['select_box_num'];
        let ftn = row['freetext_num'];
        let freetext_edit_id = `ft_${atc}_${rule}_${box}_${ftn}`;
        output[freetext_edit_id] = row['freetext'];
    }
    return output;
}

function freetextsToRows(patient_id, viewer_id, freetexts) {
    let output = [];
    const freetext_ids = Object.keys(freetexts);
    freetext_ids.forEach((freetext_id, index) => {
        let parts = freetext_id.split('_');
        let atc = parts[1];
        let criterion = parts[2];
        let box_num = parseInt(parts[3], 10);
        let text_num = parseInt(parts[4], 10);
        let freetext = freetexts[freetext_id];
        output.push([
            patient_id,
            viewer_id,
            atc,
            criterion,
            box_num,
            text_num,
            freetext
        ]);
    });
    return output;
}

// called from export-to-mrs.js
async function getExportData(patientIdentifier) {
    let patient_id = as_id(patientIdentifier);
    let sql = `/* adfice.getExportData */
    SELECT s.patient_id
         , COALESCE(pm.medication_name, nmh.category_name) AS medcat_name
         , s.ATC_code
         , s.medication_criteria_id
         , s.select_box_num
         , s.selected
         , s.row_created AS selection_time
         , f.row_created AS freetext_time
         , f.freetext_num
         , COALESCE(m.patient, n.patient) AS advice
         , f.freetext
         , meas.prediction_result
      FROM patient_advice_selection s
 LEFT JOIN patient_medication pm
        ON ((s.patient_id = pm.patient_id)
       AND  (s.ATC_code = pm.ATC_code))
 LEFT JOIN med_advice_text m
        ON ((s.medication_criteria_id = m.medication_criteria_id)
       AND  (s.select_box_num = m.select_box_num))
 LEFT JOIN nonmed_text n
        ON ((s.medication_criteria_id = n.category_id)
       AND  (s.select_box_num = n.select_box_num))
 LEFT JOIN nonmed_header nmh
        ON (n.category_id = nmh.category_id)
 LEFT JOIN patient_advice_freetext f
        ON ((s.patient_id = f.patient_id)
       AND  (s.ATC_code = f.ATC_code)
       AND  (s.medication_criteria_id = f.medication_criteria_id)
       AND  (s.select_box_num = f.select_box_num))
 LEFT JOIN patient_measurement as meas
        ON (s.patient_id = meas.patient_id)
     WHERE s.patient_id = ?
       AND s.selected
  ORDER BY s.ATC_code
         , n.category_id
         , s.id ASC
         , f.id ASC`;
    let params = [patient_id];
    let db = await this.db_init();
    let results = await db.sql_query(sql, params);
    return results;
}

// expect to be called from external
async function exportForPatient(patient, logfile) {
    let args = ['-i', patient];

    /* istanbul ignore next */
    if (logfile) {
        args.push('-l');
        args.push(logfile);
    }

    let cmd = process.cwd() + path.sep + 'export-to-mrs';

    return autil.child_process_spawn(cmd, args);
}

async function finalizeAdviceForPatient(patient_id) {
    let sql = `/* adfice.finalizeAdviceForPatient */
    UPDATE patient
       SET is_final = 1
     WHERE id = ?`
    let params = [patient_id];
    let db = await this.db_init();
    let result = await db.sql_query(sql, params);
    return result;
}

async function finalizeAndExport(patient_id, logfile) {
    await this.finalizeAdviceForPatient(patient_id);
    await this.exportForPatient(patient_id, logfile);
}

async function clearAdviceForPatient(patient_id) {
    let sqls_and_params = [];
    let sql = `/* adfice.clearAdviceForPatient */
        UPDATE patient
           SET is_final = 0
         WHERE id = ?`;
    let params = [patient_id];
    sqls_and_params.push([sql, params]);

    sql = `/* adfice.clearAdviceForPatient */
  DELETE FROM patient_advice_selection
        WHERE patient_id = ?`;
    sqls_and_params.push([sql, params]);

    sql = `/* adfice.clearAdviceForPatient */
  DELETE FROM patient_advice_freetext
        WHERE patient_id = ?`;
    sqls_and_params.push([sql, params]);

    let db = await this.db_init();
    let rs = await db.as_sql_transaction(sqls_and_params);
    return rs;
}

async function reloadPatientData(patient, cmd) {
    let patient_id = as_id(patient);
    await this.clearAdviceForPatient(patient_id);
    if (!cmd) {
        cmd = 'bin/reload-patient-data.sh';
    }

    let args = [patient];

    return autil.child_process_spawn(cmd, args);
}

async function addLogEvent(viewer_id, patient_id, event_type) {
    let sql = `/* adfice.addLogEvent */
 INSERT INTO logged_events
           ( viewer_id
           , patient_id
           , event_type
           )
      VALUES (?,?,?)
`;
    let params = [
        as_id(viewer_id),
        as_id(patient_id),
        as_id(event_type)
    ];
    return await this.sql_select(sql, params);
}

async function addLogEventPrint(viewer_id, patient_id) {
    return await this.addLogEvent(viewer_id, patient_id, 1);
}

async function addLogEventCopyPatientText(viewer_id, patient_id) {
    return await this.addLogEvent(viewer_id, patient_id, 2);
}

async function addLogEventCopyEHRText(viewer_id, patient_id) {
    return await this.addLogEvent(viewer_id, patient_id, 3);
}

function adfice_init(db) {
    let adfice = {
        /* private variables */
        db: db,

        /* "private" and "friend" member functions */
        addLogEvent: addLogEvent,
        boxStatesToSelectionStates: boxStatesToSelectionStates,
        calculateAndStorePredictionResult: calculateAndStorePredictionResult,
        calculatePredictionResult: calculatePredictionResult,
        clearAdviceForPatient: clearAdviceForPatient,
        db_init: db_init,
        determinePreselectedCheckboxes: determinePreselectedCheckboxes,
        evaluateSQL: evaluateSQL,
        evaluateSQLCondition: evaluateSQLCondition,
        exportForPatient: exportForPatient,
        finalizeAdviceForPatient: finalizeAdviceForPatient,
        getActiveRules: getActiveRules,
        getAdviceOtherTextsCheckboxes: getAdviceOtherTextsCheckboxes,
        getAdviceTextsNoCheckboxes: getAdviceTextsNoCheckboxes,
        getAdviceTextsNonMedCheckboxes: getAdviceTextsNonMedCheckboxes,
        getAllAdviceTextsCheckboxes: getAllAdviceTextsCheckboxes,
        getExportData: getExportData,
        getFreetextsForPatient: getFreetextsForPatient,
        getLabsForPatient: getLabsForPatient,
        getMedsForPatient: getMedsForPatient,
        getPatientById: getPatientById,
        getPredictionResult: getPredictionResult,
        getPreselectRules: getPreselectRules,
        getProblemsForPatient: getProblemsForPatient,
        getReferenceNumbers: getReferenceNumbers,
        getSelectionsForPatient: getSelectionsForPatient,
        getSQLCondition: getSQLCondition,
        getTableSizes: getTableSizes,
        isSQLConditionTrue: isSQLConditionTrue,
        selectionStatesToBoxStates: selectionStatesToBoxStates,
        sql_select: sql_select,
        structureMeas: structureMeas,
		updatePredictionResult: updatePredictionResult,

        /* public API methods */
        addLogEventPrint: addLogEventPrint,
        addLogEventCopyPatientText: addLogEventCopyPatientText,
        addLogEventCopyEHRText: addLogEventCopyEHRText,
        finalizeAndExport: finalizeAndExport,
        getAdviceForPatient: getAdviceForPatient,
        getAdviceTextsCheckboxes: getAdviceTextsCheckboxes,
        getPatientMeasurements: getPatientMeasurements,
        reloadPatientData: reloadPatientData,
        setAdviceForPatient: setAdviceForPatient,
        shutdown: shutdown,
    };
    return adfice;
}

module.exports = {
    adfice_init: adfice_init,
};
