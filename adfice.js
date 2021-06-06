// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

var fs = require('fs');
const autil = require('./adficeUtil');
const ae = require('./adficeEvaluator');
var dbconfig = require('./dbconfig.json');
const mariadb = require('mariadb');

function question_marks(num) {
    return '?,'.repeat(num - 1) + '?';
}

async function createPool() {
    if (!dbconfig['password']) {
        let passwd = await fs.promises.readFile(dbconfig['passwordFile']);
        dbconfig['password'] = String(passwd).trim();
    }
    const pool = mariadb.createPool(dbconfig);
    return pool;
}

function endPool(conn, pool) {
    try {
        conn.end();
    } catch (error) {
        /* istanbul ignore next */
        console.log(error);
    } finally {
        pool.end();
    }
}

async function as_sql_transaction(sqls_and_params) {
    let pool = await createPool();
    let results = [];
    let conn;
    try {
        conn = await pool.getConnection();
        conn.beginTransaction();
        for (let i = 0; i < sqls_and_params.length; ++i) {
            let sql = sqls_and_params[i][0];
            let params = sqls_and_params[i][1];
            conn.query(sql, params);
        }
        let rs = await conn.commit();
        return rs;
    } finally {
        endPool(conn, pool);
    }
}

async function sql_select(sql, params) {
    let pool = await createPool();
    let conn;
    try {
        conn = await pool.getConnection();
        // This version of the driver seems to always place the "meta" in
        // with the rows, no matter which calling convention we try.
        let result_set = await conn.query(sql, params);
        // So, we will filter out anything that is not in the iterator:
        let objects = [];
        for (let i = 0; i < result_set.length; ++i) {
            let row = result_set[i];
            objects.push(row);
        }
        return objects;
    } finally {
        endPool(conn, pool);
    }
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

async function getAdviceTextsCheckboxes(rule_numbers) {
    if ((rule_numbers == null) || (!rule_numbers.length)) {
        return [];
    }
    var sql = `/* adfice.getAdviceTextsCheckboxes */
        SELECT m.medication_criteria_id
             , m.selectBoxNum
             , m.selectBoxCategory
             , m.cdss
             , m.epic
             , m.patient
          FROM med_advice_text m
     LEFT JOIN select_box_category_priority p
            ON (m.selectBoxCategory = p.select_box_category)
         WHERE selectBoxNum IS NOT NULL
           AND medication_criteria_id IN(` +
        question_marks(rule_numbers.length) +
        `)
      ORDER BY p.priority ASC, m.selectBoxNum ASC, m.id ASC`;
    let advice_text = await sql_select(sql, rule_numbers);
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
         WHERE selectBoxNum IS NULL
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
             , t.selectBoxNum
             , t.preselected
             , t.cdss
             , t.epic
             , t.patient
          FROM nonmed_header AS h
          JOIN nonmed_text AS t
            ON (h.category_id = t.category_id)
      ORDER BY t.category_id
             , t.selectBoxNum
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

async function getMedsForPatient(patientIdentifier) {
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
    let params = [patientIdentifier, patientIdentifier];
    let meds = await sql_select(sql, params);
    return meds;
}

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
    let result = await evaluateSQLCondition(patientIdentifier, ruleNumber);
    return result;
}

async function evaluateSQLCondition(patientIdentifier, ruleNumber) {
    var sql = await getSQLCondition(ruleNumber);
    if (sql == null) {
        return true;
    } //no conditions === always true
    /* count the number of question marks in the string */
    return await evaluateSQL(sql, patientIdentifier);
}

async function evaluateSQL(sql, patientIdentifier) {
    const count = sql.match(/\?/g).length;
    autil.assert(count > 0);
    let params = [];
    for (let i = 0; i < count; ++i) {
        params.push(patientIdentifier);
    }
    let results = await sql_select(sql, params);
    if (results.length == 0) {
        return false;
    }
    autil.assert((results[0]['TRUE'] == 1), JSON.stringify({
        patientIdentifier: patientIdentifier,
        //ruleNumber: ruleNumber,
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

async function getProblemsForPatient(patientIdentifier) {
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
    let probs = await sql_select(sql, [patientIdentifier, patientIdentifier]);
    return probs;
}

async function getAgeForPatient(patientIdentifier) {
    var sql = `/* adfice.getAgeForPatient */
        SELECT age
          FROM patient
         WHERE id=?
      ORDER BY age DESC
         LIMIT 1`;
    let results = await sql_select(sql, [patientIdentifier, patientIdentifier]);
    if (results.length > 0) {
        return results[0].age;
    }
    return null;
}

async function getLabsForPatient(patientIdentifier) {
    var sql = `/* adfice.getLabsForPatient */
        SELECT lab_test_name
             , lab_test_result
             , date_measured
          FROM patient_labs
         WHERE patient_id=?
           AND date_retrieved = (
                   SELECT MAX(date_retrieved)
                     FROM patient_labs
                    WHERE patient_id=?
               )
      ORDER BY id`;
    let params = [patientIdentifier, patientIdentifier];
    let result = await sql_select(sql, params);
    return result;
}

async function getPatientMeasurements(patientIdentifier) {
    var sql = `/* adfice.getPatientMeasurements */
        SELECT *
          FROM patient_measurements
         WHERE patient_id=?
      ORDER BY date_retrieved DESC
         LIMIT 1`;
    let params = [patientIdentifier, patientIdentifier];
    let results = await sql_select(sql, params);
    if (results.length > 0) {
        return results;
    }
    return null;
}

async function getPredictionResult(patientIdentifier) {
    let measurements = await getPatientMeasurements(patientIdentifier);
    if (measurements == null) {
        return null;
    } else {
        return measurements[0]['prediction_result'];
    }
}

async function setSelectionsForPatient(patientIdentifier, viewer, cb_states) {
    const patient_id = parseInt(patientIdentifier, 10);
    const viewer_id = parseInt(viewer, 10);

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

    let rs = await as_sql_transaction(sqls_and_params);
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

async function setFreetextsForPatient(patientIdentifier, viewer, freetexts) {
    const patient_id = parseInt(patientIdentifier, 10);
    const viewer_id = parseInt(viewer, 10);

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

    let rs = await as_sql_transaction(sqls_and_params);
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

async function getAdviceForPatient(patientIdentifier) {
    let patient_id;
    if (typeof patientIdentifier == 'number') {
        patient_id = patientIdentifier;
    } else {
        patient_id = parseInt(patientIdentifier);
    }
    patient_id = patient_id || 0;

    let age = await getAgeForPatient(patient_id);

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

    let evaluated = await ae.evaluateRules(meds, rules, patient_id,
        isSQLConditionTrue);
    let medsWithRulesToFire = evaluated.medsWithRulesToFire;
    let meds_with_fired = evaluated.meds_with_fired;
    let meds_without_fired = evaluated.meds_without_fired;

    let advice = [];
    for (let i = 0; i < meds.length; ++i) {
        let med = meds[i];
        // TODO get the reference field for all rules that fired for this
        // medication and add it to this object
        let atc_code = med.ATC_code;
        let fired = medsWithRulesToFire[atc_code];
        if (!fired || !fired.length) {
            continue;
        }

        let advice_text = await getAdviceTextsCheckboxes(fired);

        let advice_text_no_box = await getAdviceTextsNoCheckboxes(fired);

        let adv = {};
        adv.ATC_code = atc_code.trim();
        adv.medication_name = med.medication_name.trim();
        adv.generic_name = med.generic_name.trim();
        adv.adviceTextsCheckboxes = advice_text;
        adv.adviceTextsNoCheckboxes = advice_text_no_box;
        adv.referenceNumbers = await getReferenceNumbers(fired);
        adv.fired = fired;
        adv.preselectedCheckboxes = await determinePreselectedCheckboxes(fired,
            patient_id, atc_code.trim());
        advice.push(adv);
    }

    let advice_text_non_med = await getAdviceTextsNonMedCheckboxes();
    let selected_advice = await getSelectionsForPatient(patient_id);


    let patient_advice = {};
    patient_advice.patient_id = patient_id;
    patient_advice.age = age;
    patient_advice.labs = labRows;
    patient_advice.medications = meds;
    patient_advice.meds_without_rules = meds_without_fired;
    patient_advice.meds_with_rules = meds_with_fired;
    patient_advice.problems = problems;
    patient_advice.medication_advice = advice;
    patient_advice.selected_advice = selected_advice;
    patient_advice.advice_text_non_med = advice_text_non_med;

    return patient_advice;
}

async function determinePreselectedCheckboxes(fired, patient_id, atc_code) {
    let preselectedCheckboxes = [];
    for (let i = 0; i < fired.length; ++i) {
        let rule_number = fired[i].toString();
        let preselectRules = await getPreselectRules(rule_number);
        for (let j = 0; j < preselectRules.length; ++j) {
            let preselectRule = preselectRules[j];
            let box = preselectRule['selectBoxNum'];
            let preselected = await ae.evaluatePreselected(preselectRule,
                patient_id, atc_code, evaluateSQL);
            if (preselected) {
                let checkbox_id = `cb_${atc_code}_${rule_number}_${box}`;
                if (preselectedCheckboxes.indexOf(checkbox_id) == -1) {
                    preselectedCheckboxes.push(checkbox_id);
                }
            }
        }
    }
    return preselectedCheckboxes;
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

module.exports = {
    boxStatesToSelectionStates: boxStatesToSelectionStates,
    getActiveRules: getActiveRules,
    getAdviceForPatient: getAdviceForPatient,
    getAdviceTextsCheckboxes: getAdviceTextsCheckboxes,
    getAdviceTextsNoCheckboxes: getAdviceTextsNoCheckboxes,
    getAdviceTextsNonMedCheckboxes: getAdviceTextsNonMedCheckboxes,
    getFreetextsForPatient: getFreetextsForPatient,
    getMedsForPatient: getMedsForPatient,
    getSQLCondition: getSQLCondition,
    isSQLConditionTrue: isSQLConditionTrue,
    evaluateSQL: evaluateSQL,
    getReferenceNumbers: getReferenceNumbers,
    getSelectionsForPatient: getSelectionsForPatient,
    selectionStatesToBoxStates: selectionStatesToBoxStates,
    setFreetextsForPatient: setFreetextsForPatient,
    setSelectionsForPatient: setSelectionsForPatient,
    getPreselectRules: getPreselectRules,
    determinePreselectedCheckboxes: determinePreselectedCheckboxes,
    getPatientMeasurements: getPatientMeasurements,
    getPredictionResult: getPredictionResult
}
