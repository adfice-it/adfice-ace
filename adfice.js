// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

var fs = require('fs');
const autil = require('./adficeUtil');
const ae = require('./adficeEvaluator');
const cp = require('./calculatePrediction');

var db = require('./adficeDB');

function question_marks(num) {
    return '?,'.repeat(num - 1) + '?';
}

async function shutdown() {
    await db.close();
}

async function sql_select(sql, params) {
    return await db.sql_query(sql, params);
}

function split_advice_texts_cdss_epic_patient(advice_texts) {
    for (let j = 0; j < advice_texts.length; ++j) {
        let row = advice_texts[j];

        row.an_fyi = 'Flat fields "cdss", "epic", "patient" are for debugging';

        row.cdss_split = autil.splitFreetext(row.cdss);
        /* delete row.cdss; TODO: switch patient-validation to cdss_split */

        row.epic_split = autil.splitFreetext(row.epic);
        /* delete row.epic */

        row.patient_split = autil.splitFreetext(row.patient);
        /* delete row.patient */
    }
    return advice_texts;
}

async function getAllAdviceTextsCheckboxes() {
    var sql = `/* adfice.getAllAdviceTextsCheckboxes */
        SELECT m.medication_criteria_id
             , m.select_box_num
             , m.select_box_category
             , m.cdss
             , m.epic
             , m.patient
             , p.priority
          FROM med_advice_text m
     LEFT JOIN select_box_category_priority p
            ON (m.select_box_category = p.select_box_category)
         WHERE select_box_num IS NOT NULL
      ORDER BY p.priority ASC, m.select_box_num ASC, m.id ASC`;
    let advice_text = await sql_select(sql);
    let list = split_advice_texts_cdss_epic_patient(advice_text);
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
        all = await getAllAdviceTextsCheckboxes();
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
             , epic
             , patient
          FROM med_other_text
      ORDER BY medication_criteria_id
             , select_box_num`;
    let advice_text = await sql_select(sql);
    return split_advice_texts_cdss_epic_patient(advice_text);
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
    let advice_text = await sql_select(sql, rule_numbers);
    return split_advice_texts_cdss_epic_patient(advice_text);
}

async function getAdviceTextsNonMedCheckboxes() {
    var sql = `/* adfice.getAdviceTextsNonMedCheckboxes */
        SELECT t.category_id
             , h.category_name
             , t.select_box_num
             , t.preselected
             , t.cdss
             , t.epic
             , t.patient
          FROM nonmed_header AS h
          JOIN nonmed_text AS t
            ON (h.category_id = t.category_id)
      ORDER BY t.category_id
             , t.select_box_num
    `;
    let advice_text = await sql_select(sql);
    return split_advice_texts_cdss_epic_patient(advice_text);
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
    return sql_select(sql, rule_numbers);
}

async function getActiveRules() {
    var sql = `/* adfice.getActiveRules */
         SELECT *
           FROM med_rules
          WHERE active = 'yes'
       ORDER BY id`;
    let rules = await sql_select(sql);
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
          FROM patient_medications
         WHERE patient_id=?
           AND date_retrieved = (
                   SELECT MAX(date_retrieved)
                     FROM patient_medications
                    WHERE patient_id=?
               )
      ORDER BY ATC_code`;
    let params = [patient_id, patient_id];
    let meds = await sql_select(sql, params);
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
    let results = await sql_select(sql, [ruleNumber]);
    return results[0]['sql_condition'];
}

async function isSQLConditionTrue(patientIdentifier, ruleNumber) {
    let patient_id = as_id(patientIdentifier);
    let result = await evaluateSQLCondition(patient_id, ruleNumber);
    return result;
}

async function evaluateSQLCondition(patient_id, ruleNumber) {
    var sql = await getSQLCondition(ruleNumber);
    if (sql == null) {
        return true;
    } //no conditions === always true
    /* count the number of question marks in the string */
    return await evaluateSQL(sql, patient_id);
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
    let results = await sql_select(sql, params);
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
    let results = await sql_select(sql, [ruleNumber]);
    return results;
}

async function getProblemsForPatient(patient_id) {
    var sql = `/* adfice.getProblemsForPatient */
        SELECT name
             , start_date
             , display_name
          FROM patient_problems
         WHERE patient_id=?
           AND date_retrieved = (
                   SELECT MAX(date_retrieved)
                     FROM patient_problems
                    WHERE patient_id=?
               )
      ORDER BY id`;
    let params = [patient_id, patient_id];
    let probs = await sql_select(sql, params);
    return probs;
}

async function getPatientById(patient_id) {
    var sql = `/* adfice.getPatientById */
        SELECT *
          FROM patient
         WHERE id=?`;
    let params = [patient_id];
    let results = await sql_select(sql, params);
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
           AND date_retrieved = (
                   SELECT MAX(date_retrieved)
                     FROM patient_lab
                    WHERE patient_id=?
               )
      ORDER BY id`;
    let params = [patient_id, patient_id];
    let result = await sql_select(sql, params);
    return result;
}

async function getPatientMeasurements(patient_id) {
    var sql = `/* adfice.getPatientMeasurements */
        SELECT *
          FROM patient_measurement
         WHERE patient_id=?
      ORDER BY date_retrieved DESC
         LIMIT 1`;
    let params = [patient_id];
    let results = await sql_select(sql, params);
    if (results.length > 0) {
        return results;
    }
    return null;
}

async function getPredictionResult(patient_id) {
    let measurements = await getPatientMeasurements(patient_id);

    if (!measurements || !measurements.length) {
        return null;
    }

    let measurement = measurements[0];

    if (measurement.prediction_result == null) {
        measurement = await calculateAndStorePredictionResult(patient_id);
    }

    return measurement.prediction_result;
}

async function updatePredictionResult(row_id, prediction_result) {
    let sql = `/* adfice.updatePredictionResult */
        UPDATE patient_measurement
           SET prediction_result = ?
         WHERE id = ?`;
    let params = [prediction_result, row_id];
    let results = await sql_select(sql, params);
}

async function calculateAndStorePredictionResult(patient_id) {
    let measurement = await calculatePredictionResult(patient_id);
    autil.assert(measurement);
    await updatePredictionResult(measurement.id, measurement.prediction_result);
    let measurements = await getPatientMeasurements(patient_id);
    autil.assert(measurements);
    autil.assert(measurements.length > 0);
    return measurements[0];
}

async function calculatePredictionResult(patient_id) {
    let measurements = await getPatientMeasurements(patient_id);
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

// called from AdficeWebserver
async function setSelectionsForPatient(patientIdentifier, viewer, cb_states) {
    const patient_id = as_id(patientIdentifier);
    const viewer_id = as_id(viewer);

    let sqls_and_params = [];

    let delete_sql = `/* adfice.setSelectionsForPatient */
 DELETE FROM patient_advice_selection
  WHERE patient_id = ?`;
    sqls_and_params.push([delete_sql, patient_id]);

    let insert_sql = `/* adfice.setSelectionsForPatient */
 INSERT INTO patient_advice_selection
           ( patient_id
           , viewer_id
           , ATC_code
           , medication_criteria_id
           , select_box_num
           , selected
           )
      VALUES (?,?,?,?,?,?)`;
    let params = boxStatesToSelectionStates(patient_id, viewer_id, cb_states);
    for (let i = 0; i < params.length; ++i) {
        sqls_and_params.push([insert_sql, params[i]]);
    }

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
    let results = await sql_select(sql, params);
    return selectionStatesToBoxStates(results);
}

// called from AdficeWebserver
async function setFreetextsForPatient(patientIdentifier, viewer, freetexts) {
    const patient_id = as_id(patientIdentifier);
    const viewer_id = as_id(viewer);

    let sqls_and_params = [];

    let delete_sql = `/* adfice.setFreetextsForPatient */
 DELETE FROM patient_advice_freetext
  WHERE patient_id = ?`;
    sqls_and_params.push([delete_sql, patient_id]);

    let insert_sql = `/* adfice.setFreetextForPatient */
 INSERT INTO patient_advice_freetext
           ( patient_id
           , viewer_id
           , ATC_code
           , medication_criteria_id
           , select_box_num
           , freetext_num
           , freetext
           )
      VALUES (?,?,?,?,?,?,?)`;
    let params = freetextsToRows(patient_id, viewer_id, freetexts);
    for (let i = 0; i < params.length; ++i) {
        sqls_and_params.push([insert_sql, params[i]]);
    }

    let rs = await db.as_sql_transaction(sqls_and_params);
    return rs;
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
    let results = await sql_select(sql, params);
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

// called from AdficeWebserver
async function getAdviceForPatient(patientIdentifier) {
    let patient_id = as_id(patientIdentifier);
    let patient = await getPatientById(patient_id);
    let age = patient.age;
    let is_final = false;
    if (patient.is_final) {
        is_final = true;
    }

    let labRows = await getLabsForPatient(patient_id);
    let labTests = structureLabs(labRows);

    let problems = await getProblemsForPatient(patient_id);
    let problemList = [];
    for (let i = 0; i < problems.length; ++i) {
        problemList.push(problems[i].name);
    }

    var meds = await getMedsForPatient(patient_id);
    let drugList = [];
    for (let i = 0; i < meds.length; ++i) {
        drugList.push(meds[i].ATC_code);
    }

    var rules = await getActiveRules();
    var all_cb_advice = await getAllAdviceTextsCheckboxes();

    let evaluated = await ae.evaluateRules(meds, rules, patient_id,
        isSQLConditionTrue);
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

        let advice_text = await getAdviceTextsCheckboxes(fired, all_cb_advice);

        let advice_text_no_box = await getAdviceTextsNoCheckboxes(fired);

        let atc_preselected_checkboxes = await determinePreselectedCheckboxes(
            fired, patient_id, atc_code.trim());
        Object.assign(preselected_checkboxes, atc_preselected_checkboxes);

        let adv = {};
        adv.ATC_code = atc_code.trim();
        adv.medication_name = med.medication_name.trim();
        adv.generic_name = med.generic_name.trim();
        adv.adviceTextsCheckboxes = advice_text;
        adv.adviceTextsNoCheckboxes = advice_text_no_box;
        adv.referenceNumbers = await getReferenceNumbers(fired);
        adv.fired = fired;
        adv.preselectedCheckboxes = atc_preselected_checkboxes;
        advice.push(adv);
    }

    let advice_text_non_med = await getAdviceTextsNonMedCheckboxes();
    let advice_other_text = await getAdviceOtherTextsCheckboxes();
    let selected_advice = await getSelectionsForPatient(patient_id);
    let free_texts = await getFreetextsForPatient(patient_id);

    let risk_score = await getPredictionResult(patient_id);

    let patient_advice = {};
    patient_advice.patient_id = patient_id;
    patient_advice.age = age;
    patient_advice.is_final = is_final;
    patient_advice.labs = labRows;
    patient_advice.medications = meds;
    patient_advice.meds_without_rules = meds_without_fired;
    patient_advice.meds_with_rules = meds_with_fired;
    patient_advice.problems = problems;
    patient_advice.medication_advice = advice;
    patient_advice.selected_advice = selected_advice;
    patient_advice.preselected_checkboxes = preselected_checkboxes;
    patient_advice.free_texts = free_texts;
    patient_advice.advice_text_non_med = advice_text_non_med;
    patient_advice.advice_other_text = advice_other_text;
    patient_advice.risk_score = risk_score;

    return patient_advice;
}

async function determinePreselectedCheckboxes(fired, patient_id, atc_code) {
    let preselected = {};
    for (let i = 0; i < fired.length; ++i) {
        let rule_number = fired[i].toString();
        let preselectRules = await getPreselectRules(rule_number);
        for (let j = 0; j < preselectRules.length; ++j) {
            let preselectRule = preselectRules[j];
            let box = preselectRule['select_box_num'];
            let is_preselected = await ae.evaluatePreselected(preselectRule,
                patient_id, atc_code, evaluateSQL);
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
         , s.ATC_code
         , s.medication_criteria_id
         , s.select_box_num
         , s.selected
         , s.row_created AS selection_time
         , f.row_created AS freetext_time
         , f.freetext_num
         , f.freetext
      FROM patient_advice_selection s
 LEFT JOIN patient_advice_freetext f
        ON ((s.patient_id = f.patient_id)
       AND  (s.ATC_code = f.ATC_code)
       AND  (s.medication_criteria_id = f.medication_criteria_id)
       AND  (s.select_box_num = f.select_box_num))
     WHERE s.patient_id = ?
       AND s.selected
  ORDER BY s.id ASC
         , f.id ASC`;
    let params = [patient_id];
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

    let cmd = './export-to-mrs';

    return autil.child_process_spawn(cmd, args);
}

async function finalizeAdviceForPatient(patient_id) {
    let sql = `/* adfice.finalizeAdviceForPatient */
    UPDATE patient
       SET is_final = 1
     WHERE id = ?`
    let params = [patient_id];
    let result = await db.sql_query(sql, params);
    return result;
}

async function finalizeAndExport(patient_id, logfile) {
    await finalizeAdviceForPatient(patient_id);
    await exportForPatient(patient_id, logfile);
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

    let rs = await db.as_sql_transaction(sqls_and_params);
    return rs;
}

async function reloadPatientData(patient, cmd) {
    let patient_id = as_id(patient);
    await clearAdviceForPatient(patient_id);
    if (!cmd) {
        cmd = 'bin/reload-patient-data.sh';
    }

    let args = [patient];

    return autil.child_process_spawn(cmd, args);
}

module.exports = {
    boxStatesToSelectionStates: boxStatesToSelectionStates,
    calculateAndStorePredictionResult: calculateAndStorePredictionResult,
    calculatePredictionResult: calculatePredictionResult,
    clearAdviceForPatient: clearAdviceForPatient,
    determinePreselectedCheckboxes: determinePreselectedCheckboxes,
    evaluateSQL: evaluateSQL,
    exportForPatient: exportForPatient,
    finalizeAdviceForPatient: finalizeAdviceForPatient,
    finalizeAndExport: finalizeAndExport,
    getActiveRules: getActiveRules,
    getAdviceForPatient: getAdviceForPatient,
    getAdviceTextsCheckboxes: getAdviceTextsCheckboxes,
    getAdviceTextsNoCheckboxes: getAdviceTextsNoCheckboxes,
    getAdviceTextsNonMedCheckboxes: getAdviceTextsNonMedCheckboxes,
    getAllAdviceTextsCheckboxes: getAllAdviceTextsCheckboxes,
    getExportData: getExportData,
    getFreetextsForPatient: getFreetextsForPatient,
    getMedsForPatient: getMedsForPatient,
    getPatientMeasurements: getPatientMeasurements,
    getPredictionResult: getPredictionResult,
    getPreselectRules: getPreselectRules,
    getReferenceNumbers: getReferenceNumbers,
    getSelectionsForPatient: getSelectionsForPatient,
    getSQLCondition: getSQLCondition,
    isSQLConditionTrue: isSQLConditionTrue,
    reloadPatientData: reloadPatientData,
    selectionStatesToBoxStates: selectionStatesToBoxStates,
    setFreetextsForPatient: setFreetextsForPatient,
    setSelectionsForPatient: setSelectionsForPatient,
    shutdown: shutdown,
    sql_select: sql_select,
    updatePredictionResult: updatePredictionResult
}
