// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

var fs = require('fs');
const autil = require('./adficeUtil');
const ae = require('./adficeEvaluator');
const mariadb = require('mariadb');

function question_marks(num) {
    return '?,'.repeat(num - 1) + '?';
}

async function createPool() {
    let passwd = await fs.promises.readFile('adfice_mariadb_user_password');
    passwd = String(passwd).trim();

    const pool = mariadb.createPool({
        host: '127.0.0.1',
        port: 13306,
        user: 'adfice',
        password: passwd,
        database: 'adfice',
        connectionLimit: 5
    });
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
    autil.assert(rule_numbers !== null);
    autil.assert(rule_numbers.length > 0);
    var sql = `/* adfice.getAdviceTextsCheckboxes */
        SELECT m.medication_criteria_id,
               m.selectBoxNum,
               m.selectBoxCategory,
               m.cdss,
               m.epic,
               m.patient
          FROM med_advice_text m
     LEFT JOIN select_box_category_priority p
            ON (m.selectBoxCategory = p.select_box_category)
         WHERE selectBoxNum IS NOT NULL
           AND medication_criteria_id IN(` +
        question_marks(rule_numbers.length) +
        `)
      ORDER BY p.priority ASC, m.selectBoxNum ASC, m.id ASC`
    let advice_text = await sql_select(sql, rule_numbers);
    return split_advice_texts_cdss_epic_patient(advice_text);
}

async function getAdviceTextsNoCheckboxes(rule_numbers) {
    autil.assert(rule_numbers !== null);
    autil.assert(rule_numbers.length > 0);
    var sql = `/* adfice.getAdviceTextsNoCheckboxes */
        SELECT medication_criteria_id,
               cdss
          FROM med_advice_text
         WHERE selectBoxNum IS NULL
           AND medication_criteria_id IN(` +
        question_marks(rule_numbers.length) +
        `)
      ORDER BY id`;
    let advice_text = await sql_select(sql, rule_numbers);
    return split_advice_texts_cdss_epic_patient(advice_text);
}

async function getActiveRules() {
    var sql = "SELECT * FROM med_rules WHERE active = 'yes' ORDER BY id";
    let rules = await sql_select(sql);
    return rules;
}

async function getMedsForPatient(patientIdentifier) {
    var sql = `/* adfice.getMedsForPatient */
        SELECT ATC_code, medication_name, start_date
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

async function getProblemsForPatient(patientIdentifier) {
    var sql = `/* adfice.getProblemsForPatient */
        SELECT name, start_date
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
      ORDER BY age DESC LIMIT 1`;
    let results = await sql_select(sql, [patientIdentifier, patientIdentifier]);
    if (results.length > 0) {
        return results[0].age;
    }
    return null;
}

async function getLabsForPatient(patientIdentifier) {
    var sql = `/* adfice.getLabsForPatient */
        SELECT lab_test_name,
               lab_test_result,
               date_measured
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

async function setSelectionsForPatient(patientIdentifier, viewer, cb_states) {
    const patient_id = parseInt(patientIdentifier, 10);
    const viewer_id = parseInt(viewer, 10);

    let sqls_and_params = [];

    let delete_sql = `/* adfice.setSelectionsForPatient */
 DELETE FROM patient_advice_selection
  WHERE patient_id = ?`;
    sqls_and_params.push([delete_sql, patient_id]);

    let insert_sql = `/* adfice.setSelectionsForPatient */
 INSERT INTO patient_advice_selection (
             patient_id,
             viewer_id,
             ATC_code,
             medication_criteria_id,
             select_box_num,
             selected)
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
        SELECT patient_id,
               viewer_id,
               ATC_code,
               medication_criteria_id,
               select_box_num,
               selected
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
 INSERT INTO patient_advice_freetext (
             patient_id,
             viewer_id,
             ATC_code,
             medication_criteria_id,
             select_box_num,
             freetext_num,
             freetext)
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
         SELECT patient_id,
                viewer_id,
                ATC_code,
                medication_criteria_id,
                select_box_num,
                freetext_num,
                freetext
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
        labTests[lab_test_name][lab_test_result] = lab_test_result;
        labTests[lab_test_name][date_measured] = date_measured;
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

    var medsWithRulesToFire = await ae.evaluateRules(meds, rules, drugList,
        problemList, age, labTests);
    /*
        console.log(JSON.stringify({
            rules: rules,
            medsWithRulesToFire: medsWithRulesToFire
        }, null, 4));
    */

    let advice = [];
    for (let i = 0; i < meds.length; ++i) {
        let med = meds[i];
        // TODO get the reference field for all rules that fired for this
        // medication and add it to this object
        let atc_code = med.ATC_code;
        let fired = medsWithRulesToFire[atc_code];

        let advice_text = await getAdviceTextsCheckboxes(fired);

        let advice_text_no_box = await getAdviceTextsNoCheckboxes(fired);

        let adv = {};
        adv.ATC_code = atc_code.trim();
        adv.medication_name = med.medication_name.trim();
        adv.adviceTextsCheckboxes = advice_text;
        adv.adviceTextsNoCheckboxes = advice_text_no_box;
        advice.push(adv);

        //console.log(JSON.stringify({adv: adv}, null, 4));

    }

    let selected_advice = await getSelectionsForPatient(patient_id);

    let patient_advice = {};
    patient_advice.patient_id = patient_id;
    patient_advice.age = age;
    patient_advice.labs = labRows;
    patient_advice.medications = meds;
    patient_advice.problems = problems;
    patient_advice.medication_advice = advice;
    patient_advice.selected_advice = selected_advice;

    return patient_advice;
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
        let freetext_edit_id = `ft_${atc}_${rule}_${box}_${ftn}_e`;
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
    getFreetextsForPatient: getFreetextsForPatient,
    getMedsForPatient: getMedsForPatient,
    getSelectionsForPatient: getSelectionsForPatient,
    selectionStatesToBoxStates: selectionStatesToBoxStates,
    setFreetextsForPatient: setFreetextsForPatient,
    setSelectionsForPatient: setSelectionsForPatient
}
