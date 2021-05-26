// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 expandtab :
var fs = require('fs');
const ae = require('./adficeEvaluator');

function question_marks(num) {
    return '?,'.repeat(num - 1) + '?';
}

async function sql_select(sql, params) {
    let passwd = await fs.promises.readFile('adfice_mariadb_user_password');
    passwd = String(passwd).trim();

    const mariadb = require('mariadb');
    const pool = mariadb.createPool({
        host: '127.0.0.1',
        port: 13306,
        user: 'adfice',
        password: passwd,
        database: 'adfice',
        connectionLimit: 5
    });

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
        /* istanbul ignore else */
        if (conn) {
            let result = conn.end();
            pool.end();
        }
    }
}

async function getAdviceTextsCheckboxes(rule_numbers) {
    if (rule_numbers == null) {
        return [];
    }
    var sql = `/* getAdviceTextsCheckboxes */
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
         ORDER BY p.priority ASC, m.id ASC`
    return sql_select(sql, rule_numbers);
}

async function getAdviceTextsNoCheckboxes(rule_numbers) {
    if (rule_numbers == null) {
        return [];
    }
    var sql = `/* getAdviceTextsNoCheckboxes */
        SELECT medication_criteria_id,
               cdss
          FROM med_advice_text
         WHERE selectBoxNum IS NULL
           AND medication_criteria_id IN(` +
        question_marks(rule_numbers.length) +
        `)
         ORDER BY id`;
    return sql_select(sql, rule_numbers);
}

async function getActiveRules() {
    var sql = "SELECT * FROM med_rules WHERE active = 'yes' ORDER BY id";
    return sql_select(sql);
}

async function getMedsForPatient(patientNumber) {
    var sql = `/* getMedsForPatient */
        SELECT ATC_code, medication_name, start_date
          FROM patient_medications
         WHERE patient_id=?
           AND date_retrieved = (
                   SELECT MAX(date_retrieved)
                     FROM patient_medications
                    WHERE patient_id=?
               )
         ORDER BY ATC_code`;
    let params = [patientNumber, patientNumber];
    return sql_select(sql, params);
}

async function getProblemsForPatient(patientNumber) {
    var sql = `/* getProblemsForPatient */
        SELECT name, start_date
          FROM patient_problems
         WHERE patient_id=?
           AND date_retrieved = (
                   SELECT MAX(date_retrieved)
                     FROM patient_problems
                    WHERE patient_id=?
               )
        ORDER BY id`;
    return sql_select(sql, [patientNumber, patientNumber]);
}

async function getAgeForPatient(patientNumber) {
    var sql = `/* getAgeForPatient */
        SELECT age
          FROM patient
         WHERE id=?
         ORDER BY age DESC LIMIT 1`;
    let results = await sql_select(sql, [patientNumber, patientNumber]);
    if (results.length > 0) {
        return results[0].age;
    }
    return null;
}

async function getLabsForPatient(patientNumber) {
    var sql = `/* getLabsForPatient */
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
    let params = [patientNumber, patientNumber];
    let result = sql_select(sql, params);
    return result;
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

async function getAdviceForPatient(patientNumber) {
    let patient_id;
    if (typeof patientNumber == 'number') {
        patient_id = patientNumber;
    } else {
        patient_id = parseInt(patientNumber);
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
        let adv = {};
        adv.ATC_code = atc_code.trim();
        adv.medication_name = med.medication_name.trim();
        adv.adviceTextsCheckboxes = await getAdviceTextsCheckboxes(fired);
        adv.adviceTextsNoCheckboxes = await getAdviceTextsNoCheckboxes(fired);
        advice.push(adv);
    }

    let patient_advice = {};

    patient_advice.patient_id = patient_id;
    patient_advice.age = age;
    patient_advice.labs = labRows;
    patient_advice.medications = meds;
    patient_advice.problems = problems;
    patient_advice.medication_advice = advice;

    return patient_advice;
}

module.exports = {
    getActiveRules: getActiveRules,
    getAdviceForPatient: getAdviceForPatient,
    getAdviceTextsCheckboxes: getAdviceTextsCheckboxes,
    getAdviceTextsNoCheckboxes: getAdviceTextsNoCheckboxes,
    getMedsForPatient: getMedsForPatient,
}
