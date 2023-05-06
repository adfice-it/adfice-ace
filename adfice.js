// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const autil = require('./adfice-util');
const ae = require('./adfice-evaluator');
const cp = require('./calculate-prediction');
const adb = require('./adfice-db');
const crypto = require('crypto');

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

        row.cdss_split = autil.split_freetext(row.cdss);
        /* delete row.cdss; TODO: switch patient-validation to cdss_split */

        row.ehr_split = autil.split_freetext(row.ehr);
        /* delete row.ehr */

        row.patient_split = autil.split_freetext(row.patient);
        /* delete row.patient */
    }
    return advice_texts;
}

async function get_table_sizes() {
    let db = await this.db_init();
    let params = [await db.schema_name()];
    let sql = `/* adfice.get_table_sizes */
        SELECT table_name
             , table_rows
             , ROUND((data_length + index_length)/POWER(1024,2),1) AS size_mb
             , (data_length + index_length) AS size_bytes
          FROM information_schema.tables
         WHERE table_schema=?
      ORDER BY size_bytes DESC`;
    return await this.sql_select(sql, params);
}

async function write_patient_from_json(etl_patient) {
    let patient_id = crypto.randomBytes(16).toString('hex');
    let list_of_transactions = [];
    list_of_transactions.push(...(patientListOfInserts(patient_id, etl_patient)));
    list_of_transactions.push(...(medListOfInserts(patient_id, etl_patient.medications)));
    list_of_transactions.push(...(probListOfInserts(patient_id, etl_patient.problems)));
    list_of_transactions.push(...(labListOfInserts(patient_id, etl_patient.labs)));
    list_of_transactions.push(...(measListOfInserts(patient_id, etl_patient.measurements)));

    let result = await this.db.as_sql_transaction(list_of_transactions);
    let meds = await this.get_meds(patient_id);
    let meas_update = measListOfUpdatesMeds(patient_id, meds);
    let update_result = await this.db.as_sql_transaction(meas_update);

    return patient_id;
}

async function renew_patient(patient_id, etl_patient) {
    let params = [patient_id];
    let list_of_transactions = [];
    list_of_transactions.push(...(patientListOfUpdates(patient_id, etl_patient)));
    let sql = "DELETE FROM patient_medication where patient_id = ?"
    list_of_transactions.push([sql, params]);
    list_of_transactions.push(...(medListOfInserts(patient_id, etl_patient.medications)));
    sql = "DELETE FROM patient_problem where patient_id = ?"
    list_of_transactions.push([sql, params]);
    list_of_transactions.push(...(probListOfInserts(patient_id, etl_patient.problems)));
    sql = "DELETE FROM patient_lab where patient_id = ?"
    list_of_transactions.push([sql, params]);
    list_of_transactions.push(...(labListOfInserts(patient_id, etl_patient.labs)));
    sql = "DELETE FROM patient_measurement where patient_id = ?"
    list_of_transactions.push([sql, params]);
    list_of_transactions.push(...(measListOfInserts(patient_id, etl_patient.measurements)));
    sql = "DELETE FROM patient_advice_selection where patient_id = ?"
    list_of_transactions.push([sql, params]);
    sql = "DELETE FROM patient_advice_freetext where patient_id = ?"
    list_of_transactions.push([sql, params]);

    await this.db.as_sql_transaction(list_of_transactions);

    let meds = await this.get_meds(patient_id);
    let meas_update = measListOfUpdatesMeds(patient_id, meds);
    let update_result = await this.db.as_sql_transaction(meas_update);

    return patient_id;
}

function patientListOfInserts(patient_id, patient) {
    let list_of_transactions = [];
    let age = calculateAge(patient);
    let sql = "INSERT INTO etl_mrn_patient (patient_id, mrn, fhir, refresh_token) VALUES (?,?,?,?)";
    list_of_transactions.push([sql, [patient_id, patient['mrn'], patient['ehr_pid'], patient['refresh_token']]]);
    let sql1 = '/* adfice.patientListOfInserts */ INSERT INTO patient ' +
        '(patient_id, participant_number, birth_date, age, is_final) ' +
        'VALUES (?,?,?,?,0)';
    list_of_transactions.push([sql1, [patient_id, patient['participant_number'], patient['birth_date'], age]]);
    let sql2 = '/* adfice.patientListOfInserts */ INSERT INTO etl_bsn_patient ' +
        '(patient_id, bsn) ' +
        "VALUES (?,?)";
    list_of_transactions.push([sql2, [patient_id, patient['bsn']]]);
    return list_of_transactions;
}

function patientListOfUpdates(patient_id, patient) {
    let list_of_transactions = [];
    let age = calculateAge(patient);
    let sql1 = '/* adfice.patientListOfUpdates */ UPDATE patient ' +
        'SET birth_date = ?, age = ?, is_final = 0 ' +
        "WHERE patient_id = '" + patient_id + "'";
    list_of_transactions.push([sql1, [patient['birth_date'], age]]);
    let sql2 = '/* adfice.patientListOfUpdates */ UPDATE etl_bsn_patient ' +
        "SET bsn = ? WHERE patient_id = '" + patient_id + "'";
    list_of_transactions.push([sql2, [patient['bsn']]]);
    return list_of_transactions;
}

function calculateAge(patient) {
    if (patient['birth_date'] == null) {
        return null;
    }
    let diff = new Date().getTime() - new Date(patient['birth_date']).getTime();
    return (diff / 31536000000).toFixed(0);
}

function nowString() {
    return dateString(new Date());
}

function dateString(date_obj) {
    /* istanbul ignore next */
    if (date_obj == null) {
        return null;
    }
    let date_str = date_obj.getFullYear() +
        '-' + (date_obj.getMonth() + 1) +
        '-' + date_obj.getDate() +
        ' ' + date_obj.getHours() +
        ":" + date_obj.getMinutes() +
        ":" + date_obj.getSeconds();
    return date_str;
}

function medListOfInserts(patient_id, medications) {
    let list_of_inserts = [];
    if (!medications || medications.length < 1) {
        return list_of_inserts;
    }
    for (let i = 0; i < medications.length; ++i) {
        let medication = medications[i];
        let sql = `/* adfice.medListOfInserts */
			INSERT INTO patient_medication` +
            ' (patient_id, date_retrieved';
        let values = ") VALUES (?,?";
        let params = [patient_id, nowString()];
        if (medication['display_name'] != null) {
            sql += ", medication_name";
            params.push(medication['display_name']);
            values += ',?';
        }
        if (medication['generic_name'] != null) {
            sql += ", generic_name";
            params.push(medication['generic_name']);
            values += ',?';
        }
        if (medication['ATC'] != null) {
            sql += ", ATC_code";
            params.push(medication['ATC']);
            values += ',?';
        }
        if (medication['start_date'] != null) {
            let start_date = medication['start_date'].toString();
            start_date = start_date.replace('T', ' ');
            start_date = start_date.replace('Z', '');
            sql += ", start_date";
            params.push(start_date);
            values += ',?';
        }
        if (medication['dose_text'] != null) {
            sql += ", dose";
            params.push(medication['dose_text']);
            values += ',?';
        }
        sql = sql + values + ")";
        if (params.length > 2) {
            list_of_inserts.push([sql, params]);
        }
    }
    return list_of_inserts;
}

function probListOfInserts(patient_id, problems) {
    let list_of_inserts = [];
    if (!problems || problems.length < 1) {
        return list_of_inserts;
    }
    for (let i = 0; i < problems.length; ++i) {
        let sql = `/* adfice.probListOfInserts */
			INSERT INTO patient_problem` +
            ' (patient_id, date_retrieved, name, icd_10';
        let values = ") VALUES (?,?,?,?";
        let problem = problems[i];
        let params = [patient_id, nowString(), problem['name'],
            problem['icd_10']
        ];
        if (problem['ehr_text'] != null &&
            problem['ehr_text'] != '') {
            sql += ", ehr_text";
            params.push(problem['ehr_text']);
            values += ',?';
        }
        if (problem['start_date'] != null) {
            sql += ", start_date";
            params.push(problem['start_date']);
            values += ',?';
        }
        sql = sql + values + ")";
        list_of_inserts.push([sql, params]);
    }
    return list_of_inserts;
}

function labListOfInserts(patient_id, labs) {
    let list_of_inserts = [];
    if (!labs || labs.length < 1) {
        return list_of_inserts;
    }
    for (let i = 0; i < labs.length; ++i) {
        let lab = labs[i];
        let sql =
            '/* adfice.labListOfInserts */ INSERT INTO patient_lab ' +
            '(patient_id, date_retrieved, date_measured, lab_test_name, ' +
            'lab_test_code, lab_test_result, lab_test_units) ' +
            'VALUES (?,?,?,?,?,?,?)';
        let params = [
            patient_id,
            nowString(),
            lab['date_measured'],
            lab['name'],
            lab['lab_test_code'],
            lab['lab_test_result'],
            lab['lab_test_units']
        ];
        list_of_inserts.push([sql, params]);
    }
    return list_of_inserts;
}

function measListOfInserts(patient_id, measurements) {
    if (!measurements || Object.keys(measurements).length < 1) {
        let sql = '/* adfice.measListOfInserts */ INSERT INTO patient_measurement ' +
            '(patient_id, date_retrieved) VALUES (?,?)';
        let params = [patient_id, nowString()]
        return [
            [sql, params]
        ];
    }
    let sql =
        '/* adfice.measListOfInserts */ INSERT INTO patient_measurement ' +
        '(patient_id, date_retrieved,systolic_bp_mmHg,bp_date_measured,' +
        'height_cm,height_date_measured,weight_kg,weight_date_measured,' +
        'smoking, smoking_date_measured,GDS_score,GDS_date_measured, ' +
        'grip_kg, grip_date_measured,walking_speed_m_per_s,walking_date_measured, ' +
        'fear0, fear1, fear2, fear_of_falls_date_measured, ' +
        'number_of_limitations, functional_limit_date_measured, nr_falls_12m, nr_falls_date_measured) ' +
        'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    let params = [
        patient_id,
        nowString(),
        measurements['systolic_bp_mmHg'],
        measurements['bp_date_measured'],
        measurements['height_cm'],
        measurements['height_date_measured'],
        measurements['weight_kg'],
        measurements['weight_date_measured'],
        measurements['smoking'],
        measurements['smoking_date_measured'],
        measurements['GDS_score'],
        measurements['GDS_date_measured'],
        measurements['grip_kg'],
        measurements['grip_date_measured'],
        measurements['walking_speed_m_per_s'],
        measurements['walking_date_measured'],
        measurements['fear0'],
        measurements['fear1'],
        measurements['fear2'],
        measurements['fear_of_falls_date_measured'],
        measurements['number_of_limitations'],
        measurements['functional_limit_date_measured'],
        measurements['nr_falls_12m'],
        measurements['nr_falls_date_measured']
    ];

    let list_of_inserts = [
        [sql, params]
    ];
    return list_of_inserts;
}

function measListOfUpdatesMeds(patient_id, meds) {
    let has_antiepileptica = 0;
    let has_ca_blocker = 0;
    let has_incont_med = 0;
    for (let i = 0; i < meds.length; ++i) {
        if (meds[i]['ATC_code']) {
            if (meds[i]['ATC_code'].startsWith('N03') &&
                meds[i]['ATC_code'] != 'N03AX12' &&
                meds[i]['ATC_code'] != 'N03AX16') {
                has_antiepileptica = 1;
            }
            if (meds[i]['ATC_code'].startsWith('C08')) {
                has_ca_blocker = 1;
            }
            if (meds[i]['ATC_code'].startsWith('G04BD') ||
                meds[i]['ATC_code'] === 'G04CA53') {
                has_incont_med = 1;
            }
        }
    }

    let list_of_transactions = [];
    let sql = '/* adfice.measListOfUpdatesMeds */ UPDATE patient_measurement ' +
        'SET has_antiepileptica = ?, has_ca_blocker = ?, has_incont_med = ? ' +
        "WHERE patient_id = '" + patient_id + "'";
    list_of_transactions.push([sql, [has_antiepileptica, has_ca_blocker, has_incont_med]]);
    return list_of_transactions;
}

async function remove_med(atc_code, patient_id) {
    var sql = `/* adfice.remove_med */
        DELETE
        FROM patient_medication
        WHERE ATC_code = ? AND patient_id = ?;`;
    var params = [atc_code, patient_id];
    let deleted = await this.db.sql_query(sql, params);;
    return deleted;
}

async function get_all_advice_texts_checkboxes() {
    var sql = `/* adfice.get_all_advice_texts_checkboxes */
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

// called from adfice-webserver-runner
async function get_advice_texts_checkboxes(rule_numbers, all) {
    if ((rule_numbers == null) || (!rule_numbers.length)) {
        return [];
    }
    if (!all) {
        all = await this.get_all_advice_texts_checkboxes();
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

async function get_advice_other_texts_checkboxes() {
    var sql = `/* adfice.get_advice_other_texts_checkboxes */
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

async function get_advice_texts_no_checkboxes(rule_numbers) {
    if (rule_numbers == null || !rule_numbers.length) {
        return [];
    }
    var sql = `/* adfice.get_advice_texts_no_checkboxes */
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

async function get_advice_texts_non_med_checkboxes() {
    var sql = `/* adfice.get_advice_texts_non_med_checkboxes */
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

async function get_reference_numbers(rule_numbers) {
    if (rule_numbers == null || !rule_numbers.length) {
        return [];
    }
    var sql = `/* adfice.get_reference_numbers */
        SELECT reference
          FROM med_rules
         WHERE medication_criteria_id IN(` +
        question_marks(rule_numbers.length) +
        `)
      GROUP BY reference
      ORDER BY MIN(med_rules.id) ASC`;
    return await this.sql_select(sql, rule_numbers);
}

async function get_active_rules() {
    var sql = `/* adfice.get_active_rules */
         SELECT *
           FROM med_rules
          WHERE active = 'yes'
       ORDER BY id`;
    let rules = await this.sql_select(sql);
    return rules;
}

async function get_meds(patient_id) {
    var sql = `/* adfice.get_meds */
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
async function get_sql_condition(rule_number) {
    var sql = `/* adfice.get_sql_condition */
        SELECT sql_condition
          FROM med_rules
         WHERE medication_criteria_id=?
         `;
    let params = [rule_number];
    let results = await this.sql_select(sql, params);
    return results[0]['sql_condition'];
}

async function is_sql_condition_true(patient_id, rule_number) {
    let result = await this.evaluate_sql_condition(patient_id, rule_number);
    return result;
}

async function evaluate_sql_condition(patient_id, rule_number) {
    var sql = await this.get_sql_condition(rule_number);
    if (sql == null) {
        return true;
    } //no conditions === always true
    /* count the number of question marks in the string */
    return await this.evaluate_sql(sql, patient_id);
}

async function evaluate_sql(sql, patient_id) {
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

async function get_preselect_rules(rule_number) {
    var sql = `/* adfice.get_preselect_rules */
        SELECT *
          FROM preselect_rules
         WHERE medication_criteria_id=?
         `;
    let results = await this.sql_select(sql, [rule_number]);
    return results;
}

async function get_problems(patient_id) {
    var sql = `/* adfice.get_problems */
        SELECT name
             , start_date
             , display_name
          FROM patient_problem
          JOIN problem ON patient_problem.name = problem.problem_name
         WHERE patient_id=?
      ORDER BY patient_problem.id`;
    let params = [patient_id, patient_id];
    let probs = await this.sql_select(sql, params);
    return probs;
}

async function get_patient_by_id(patient_id) {
    var sql = `/* adfice.get_patient_by_id */
        SELECT patient.*, etl_mrn_patient.mrn
          FROM patient join etl_mrn_patient on patient.patient_id = etl_mrn_patient.patient_id
         WHERE patient.patient_id=?`;
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

// Why is patient_id in params twice?
async function get_labs(patient_id) {
    var sql = `/* adfice.get_labs */
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

async function get_patient_measurements(patient_id) {
    var sql = `/* adfice.get_patient_measurements */
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

async function get_bsn(patient_id) {
    var sql = `/* adfice.get_bsn */
        SELECT bsn
          FROM etl_bsn_patient
         WHERE patient_id=?`
    let params = [patient_id];
    let results = await this.sql_select(sql, params);
    if (results.length == 1) {
        return results[0]['bsn'];
    }
    return null;
}

async function get_prediction_result(patient_id) {
    let measurements = await this.get_patient_measurements(patient_id);

    if (!measurements || !measurements.length) {
        return null;
    }

    let measurement = measurements[0];

    if (measurement.prediction_result == null) {
        measurement = await this.calculate_store_prediction_result(patient_id);
    }

    return measurement.prediction_result;
}

async function update_prediction_result(row_id, prediction_result) {
    let sql = `/* adfice.update_prediction_result */
        UPDATE patient_measurement
           SET prediction_result = ?
         WHERE id = ?`;
    let params = [prediction_result, row_id];
    let results = await this.sql_select(sql, params);
}

async function calculate_store_prediction_result(patient_id) {
    let measurement = await this.calculate_prediction_result(patient_id);
    autil.assert(measurement);
    await this.update_prediction_result(
        measurement.id,
        measurement.prediction_result);
    let measurements = await this.get_patient_measurements(patient_id);
    autil.assert(measurements);
    autil.assert(measurements.length > 0);
    return measurements[0];
}

//TODO the call to get_patient_measurements can probably be factored out of this
async function calculate_prediction_result(patient_id) {
    let measurements = await this.get_patient_measurements(patient_id);
    if (measurements == null || !measurements.length) {
        return null;
    }
    let measurement = measurements[0];
    //any value that can be = 0 cannot use the || syntax
    let GDS_score = measurement['GDS_score'];
    if (GDS_score == null) {
        GDS_score = measurement['user_GDS_score'];
    }
    let grip_kg = measurement['grip_kg'] || measurement['user_grip_kg'];
    let walking_speed_m_per_s = measurement['walking_speed_m_per_s'] ||
        measurement['user_walking_speed_m_per_s'];
    //prefer BMI calculated by EHR; then calculated from EHR height and weight, then user-entered
    let BMI = measurement['BMI'];
    let user_BMI = null;
    if (!BMI) {
        if (measurement['height_cm'] != null &&
            measurement['weight_kg'] != null) {
            BMI = measurement['weight_kg'] /
                ((measurement['height_cm']) ^ 2);
        } else {
            /* istanbul ignore else */
            if (measurement['user_height_cm'] != null &&
                measurement['user_weight_kg'] != null) {
                user_BMI = measurement['user_weight_kg'] /
                    ((measurement['user_height_cm']) ^ 2);
            } // else user_BMI stays null
            BMI = user_BMI;
        }
    }
    let systolic_bp_mmHg = measurement['systolic_bp_mmHg'] ||
        measurement['user_systolic_bp_mmHg'];
    let number_of_limitations = measurement['number_of_limitations'];
    if (number_of_limitations == null) {
        number_of_limitations = measurement['user_number_of_limitations'];
    }
    let nr_falls_12m = measurement['nr_falls_12m'];
    if (nr_falls_12m == null) {
        nr_falls_12m = measurement['user_nr_falls_12m'];
    }
    let smoking = measurement['smoking'];
    if (smoking == null) {
        smoking = measurement['user_smoking'];
    }
    let education_hml = measurement['education_hml'] ||
        measurement['user_education_hml'];
    let fear1 = 0;
    if (measurement['fear1'] == 1 || measurement['user_fear1'] == 1) {
        fear1 = 1;
    }
    let fear2 = 0;
    if (measurement['fear2'] == 1 || measurement['user_fear2'] == 1) {
        fear2 = 1;
    }

    let prediction = cp.calculate_prediction_db(
        GDS_score,
        grip_kg,
        walking_speed_m_per_s,
        BMI,
        systolic_bp_mmHg,
        number_of_limitations,
        nr_falls_12m,
        smoking,
        measurement['has_antiepileptica'],
        measurement['has_ca_blocker'],
        measurement['has_incont_med'],
        education_hml,
        fear1,
        fear2);
    measurement['prediction_result'] = prediction;
    return measurement;
}

async function set_sql_selections(sqls_and_params, patient_id, doctor_id,
    cb_states) {
    let insert_sql = `/* adfice.set_advice_for_patient */
 INSERT INTO patient_advice_selection
           ( patient_id
           , doctor_id
           , ATC_code
           , medication_criteria_id
           , select_box_num
           , selected
           )
      VALUES (?,?,?,?,?,?)
 ON DUPLICATE KEY
      UPDATE doctor_id=VALUES(doctor_id)
           , selected=VALUES(selected)
`;
    let params = box_states_to_selection_states(patient_id, doctor_id,
        cb_states);
    for (let i = 0; i < params.length; ++i) {
        sqls_and_params.push([insert_sql, params[i]]);
    }
}

async function set_sql_freetexts(sqls_and_params, patient_id, doctor_id,
    freetexts) {
    let insert_sql = `/* adfice.set_advice_for_patient */
 INSERT INTO patient_advice_freetext
           ( patient_id
           , doctor_id
           , ATC_code
           , medication_criteria_id
           , select_box_num
           , freetext_num
           , freetext
           )
      VALUES (?,?,?,?,?,?,?)
 ON DUPLICATE KEY
      UPDATE doctor_id=VALUES(doctor_id)
           , freetext=VALUES(freetext)
`;
    let params = freetexts_to_rows(patient_id, doctor_id, freetexts);
    for (let i = 0; i < params.length; ++i) {
        sqls_and_params.push([insert_sql, params[i]]);
    }
}

// called from adfice-webserver-runner
async function set_advice_for_patient(patient_id, doctor,
    cb_states, freetexts) {
    const doctor_id = doctor;

    let sqls_and_params = [];

    if (cb_states) {
        set_sql_selections(sqls_and_params, patient_id, doctor_id,
            cb_states);
    }

    if (freetexts) {
        set_sql_freetexts(sqls_and_params, patient_id, doctor_id, freetexts);
    }

    let db = await this.db_init();
    let rs = await db.as_sql_transaction(sqls_and_params);
    return rs;
}

async function update_prediction_with_user_values(patient_id, form_data) {

    let fields = Object.keys(form_data);

    let sql = `/* adfice.update_prediction_with_user_values */
        UPDATE patient_measurement
           SET `
    let params = [];
    for (let i = 0; i < fields.length; ++i) {
        if (form_data[fields[i]] != "") {
            if (fields[i] == "fear_dropdown") {
                sql += 'user_fear0=' + '?,';
                sql += 'user_fear1=' + '?,';
                sql += 'user_fear2=' + '?,';
                if (form_data[fields[i]] == 0) {
                    params.push(1, 0, 0);
                }
                if (form_data[fields[i]] == 1) {
                    params.push(0, 1, 0);
                }
                if (form_data[fields[i]] == 2) {
                    params.push(0, 0, 1);
                }
            } else {
                sql += fields[i] + '=' + '?,';
                params.push(form_data[fields[i]]);
            }
        }
    }
    if (params.length > 0) {
        sql += 'user_values_updated = (select now())';
        sql += " WHERE patient_id = ? ";
        params.push(patient_id);
        let sql_and_params = [sql, params];
        let list_of_updates = [sql_and_params];
        let db = await this.db_init();
        let rs = await db.as_sql_transaction(list_of_updates);
        await this.calculate_store_prediction_result(patient_id);
        return rs;
    } else {
        return null;
    }
}

async function get_selections(patient_id) {
    var sql = `/* adfice.get_selections */
        SELECT patient_id
             , ATC_code
             , medication_criteria_id
             , select_box_num
             , selected
          FROM patient_advice_selection
         WHERE patient_id=?
      ORDER BY id`;
    let params = [patient_id];
    let results = await this.sql_select(sql, params);
    return selection_states_to_box_states(results);
}

async function get_freetexts(patient_id) {
    var sql = `/* adfice.getFreetextForPatient */
         SELECT patient_id
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
    return rows_to_freetexts(results);
}

function structure_labs(lab_rows) {
    let labTests = {};
    for (let i = 0; i < lab_rows.length; ++i) {
        let row = lab_rows[i];
        let lab_test_name = row.lab_test_name;
        let lab_test_result = row.lab_test_result;
        let date_measured = row.date_measured;
        labTests[lab_test_name] = labTests[lab_test_name] || {};
        labTests[lab_test_name]['lab_test_result'] = lab_test_result;
        labTests[lab_test_name]['date_measured'] = date_measured;
    }
    return labTests;
}

function structure_meas(meas_row) {
    let measurements = {};
    // seems like there ought to be a less horrible way to do this,
    // but this'll do.
    // the ETL should prevent this from happening in real life,
    // but it definitely happens in the test data.
    if (typeof(meas_row) == 'undefined' || meas_row == null ||
        meas_row.length != 1) {
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
        measurements = meas_row[0];
    }
    return measurements;
}
async function get_all_problems() {
    var sql = `/* adfice.get_all_problems */
        SELECT problem_name
             , display_name
          FROM problem
      ORDER BY id`;
    let result = await this.sql_select(sql);
    return result;
}

async function get_all_labs() {
    var sql = `/* adfice.get_all_labs */
        SELECT lab_name
          FROM lab
      ORDER BY id`;
    let result = await this.sql_select(sql);
    return result;
}

// called from adfice-webserver-runner
// returns a JSON representation of all the data we have on this patient
// note that this is NOT the function that populates the patient_advice column in the portal
async function get_advice_for_patient(patient_id) {
    let patient = await this.get_patient_by_id(patient_id);
    if (patient.patient_id != patient_id) {
        return {};
    }

    let age = patient.age;
    let is_final = false;
    if (patient.is_final) {
        is_final = true;
    }

    let lab_rows = await this.get_labs(patient_id);
    let labTests = structure_labs(lab_rows);

    let problems = await this.get_problems(patient_id);
    let problemList = [];
    for (let i = 0; i < problems.length; ++i) {
        problemList.push(problems[i].name);
    }

    let measurements = structure_meas(
        await this.get_patient_measurements(patient_id));

    var meds = await this.get_meds(patient_id);
    let drugList = [];
    for (let i = 0; i < meds.length; ++i) {
        drugList.push(meds[i].ATC_code);
    }

    var rules = await this.get_active_rules();
    var all_cb_advice = await this.get_all_advice_texts_checkboxes();

    let evaluated = await ae.evaluate_rules(meds, rules, patient_id,
        async (pId, ruleNum) => {
            let result = await this.is_sql_condition_true(pId, ruleNum);
            return result;
        }
    );

    let meds_with_rules_to_fire = evaluated.meds_with_rules_to_fire;
    let meds_with_fired = evaluated.meds_with_fired;
    let meds_without_fired = evaluated.meds_without_fired;
    let preselected_checkboxes = {};
    let advice = [];
    for (let i = 0; i < meds.length; ++i) {
        let med = meds[i];
        let atc_code = med.ATC_code;
        let fired = meds_with_rules_to_fire[atc_code];
        if (!fired || !fired.length) {
            continue;
        }

        let advice_text = await this.get_advice_texts_checkboxes(fired,
            all_cb_advice);

        let advice_text_no_box = await this.get_advice_texts_no_checkboxes(
            fired);

        let atc_preselected_checkboxes =
            await this.determine_preselected_checkboxes(fired, patient_id,
                atc_code.trim());
        Object.assign(preselected_checkboxes, atc_preselected_checkboxes);

        let adv = {};
        adv.ATC_code = atc_code.trim();
        adv.medication_name = med.medication_name.trim();
        adv.generic_name = med.generic_name.trim();
        adv.adviceTextsCheckboxes = advice_text;
        adv.adviceTextsNoCheckboxes = advice_text_no_box;
        adv.referenceNumbers = await this.get_reference_numbers(fired);
        adv.fired = fired;
        adv.preselectedCheckboxes = atc_preselected_checkboxes;
        advice.push(adv);
    }

    let advice_text_non_med = await this.get_advice_texts_non_med_checkboxes();
    for (let i = 0; i < advice_text_non_med.length; ++i) {
        let nm_adv = advice_text_non_med[i];
        if (nm_adv.preselected) {
            let category = nm_adv.category_id;
            let box = nm_adv.select_box_num;
            let checkbox_id = `cb_NONMED_${category}_${box}`;
            preselected_checkboxes[checkbox_id] = 'checked';
        }
    }
    let advice_other_text = await this.get_advice_other_texts_checkboxes();
    let selected_advice = await this.get_selections(patient_id);
    await this.logFiredRules(patient_id, meds_with_rules_to_fire);

    let cb_states = [];
    if (Object.keys(selected_advice).length == 0 && patient.id !== undefined) {
        cb_states = preselected_checkboxes;
        await this.set_advice_for_patient(patient_id, null,
            cb_states, null);
        selected_advice = await this.get_selections(patient_id);
    }

    let free_texts = await this.get_freetexts(patient_id);

    let risk_score = await this.get_prediction_result(patient_id);

    let debug_info = {
        data_sizes: await this.get_table_sizes()
    };

    let all_problems = {};
    let sql_problems = await this.get_all_problems();
    for (let i = 0; i < sql_problems.length; ++i) {
        all_problems[sql_problems[i].problem_name] =
            sql_problems[i].display_name;
    }

    let all_labs = [];
    let sql_labs = await this.get_all_labs();
    for (let i = 0; i < sql_labs.length; ++i) {
        all_labs.push(sql_labs[i].lab_name);
    }

    let patient_advice = {};
    patient_advice.patient_id = patient_id;
    patient_advice.age = age;
    patient_advice.mrn = patient.mrn;
    patient_advice.is_final = is_final;
    patient_advice.labs = lab_rows;
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
    patient_advice.all_problems = all_problems;
    patient_advice.all_labs = all_labs;
    patient_advice.debug_info = debug_info;

    return patient_advice;
}

async function logFiredRules(patient_id, meds_with_rules_to_fire) {
    let meds = Object.keys(meds_with_rules_to_fire);
    let sql = `/* adfice.logFiredRules */
         INSERT INTO rules_fired (id, patient_id, ATC_code, rules_fired)
		 VALUES(null,?,?,?)`;
    let sqls_and_params = [];
    for (let i = 0; i < meds.length; ++i) {
        let rule_string = meds_with_rules_to_fire[meds[i]].toString();
        let params = [patient_id, meds[i], rule_string];
        sqls_and_params.push([sql, params]);
    }
    let db = await this.db_init();
    let rs = await db.as_sql_transaction(sqls_and_params);
}

async function determine_preselected_checkboxes(fired, patient_id, atc_code) {
    let preselected = {};
    for (let i = 0; i < fired.length; ++i) {
        let rule_number = fired[i].toString();
        let preselectRules = await this.get_preselect_rules(rule_number);
        for (let j = 0; j < preselectRules.length; ++j) {
            let preselectRule = preselectRules[j];
            let box = preselectRule['select_box_num'];
            let is_preselected = await ae.evaluate_preselected(preselectRule,
                patient_id, atc_code, async (sql, pId) => {
                    return await this.evaluate_sql(sql, pId);
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

function box_states_to_selection_states(patient_id, doctor_id, box_states) {
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
        output.push([patient_id, doctor_id, atc, criterion, box_num, checked]);
    });

    return output;
}

function selection_states_to_box_states(selection_states) {
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

function rows_to_freetexts(rows) {
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

function freetexts_to_rows(patient_id, doctor_id, freetexts) {
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
            doctor_id,
            atc,
            criterion,
            box_num,
            text_num,
            freetext
        ]);
    });
    return output;
}

// called from export-to-portal.js
async function get_export_data(patient_id) {
    let sql = `/* adfice.get_export_data */
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

async function finalize_advice(patient_id) {
    let sql = `/* adfice.finalize_advice */
    UPDATE patient
       SET is_final = 1
     WHERE patient_id = ?`
    let params = [patient_id];
    let db = await this.db_init();
    let result = await db.sql_query(sql, params);
    return result;
}

async function export_to_portal_db(portal_db_env_file_path, patient_id,
    bsn, json_advice) {

    let sqls_and_params = [];

    sqls_and_params.push([
        "DELETE FROM patient_advice WHERE patient_id = ?",
        [patient_id]
    ]);

    sqls_and_params.push([
        "INSERT INTO patient_advice (patient_id, bsn, json_advice) VALUES (?,?,?)",
        [patient_id, bsn, JSON.stringify(json_advice)]
    ]);

    let db = await adb.init(null, portal_db_env_file_path);
    try {
        return await db.as_sql_transaction(sqls_and_params);
    } finally {
        await db.close();
    }
}

// this function only exists to confirm that the write to the portal was successful
async function read_from_portal_db(portal_db_env_file_path, patient_id) {
    let sql = "SELECT json_advice FROM patient_advice WHERE patient_id = ?";
    let params = [patient_id];

    let db = await adb.init(null, portal_db_env_file_path);
    try {
        return await db.sql_query(sql, params);
    } finally {
        await db.close();
    }
}

async function finalize_and_export(patient_id, portal_db_env_file_path,
    read_back) {

    /* istanbul ignore else */
    if (!portal_db_env_file_path) {
        portal_db_env_file_path = './portal-dbconfig.env';
    }

    let json_advice = await this.get_export_data(patient_id);
    let bsn = await this.get_bsn(patient_id);

    // if we fail to retrieve a BSN, we should not be exporting to the portal
    if (!bsn) {
        return {
            error: "Portal write error: Failed to acquire BSN"
        };
    }

    try {
        await export_to_portal_db(portal_db_env_file_path,
            patient_id, bsn, json_advice);
    } catch (e) {
        return {
            error: "Portal write error: Write to portal failed",
            caught: e,
        };
    }

    let rv = {};
    if (read_back) {
        rv.read_back = await read_from_portal_db(portal_db_env_file_path,
            patient_id);
    }

    await this.finalize_advice(patient_id);

    return rv;
}

async function add_log_event(doctor_id, patient_id, event_type) {
    let sql = `/* adfice.add_log_event */
 INSERT INTO logged_events
           ( doctor_id
           , patient_id
           , event_type
           )
      VALUES (?,?,?)
`;
    let params = [
        doctor_id,
        patient_id,
        event_type
    ];
    return await this.sql_select(sql, params);
}

async function add_log_event_print(doctor_id, patient_id) {
    return await this.add_log_event(doctor_id, patient_id, 1);
}

async function add_log_event_copy_patient_text(doctor_id, patient_id) {
    return await this.add_log_event(doctor_id, patient_id, 2);
}

async function add_log_event_copy_ehr_text(doctor_id, patient_id) {
    return await this.add_log_event(doctor_id, patient_id, 3);
}

async function add_log_event_renew(doctor_id, patient_id) {
    return await this.add_log_event(doctor_id, patient_id, 4);
}

async function add_log_event_access(user_id, patient_id) {
    if (typeof(user_id) == undefined || user_id == null) {
        user_id = "unknown";
    }
    let sql = `/* adfice.add_log_event_access */
		INSERT INTO access_log
           ( ehr_user_id
		   , patient_id
           )
		VALUES (?,?)
`;
    let params = [user_id, patient_id];
    return await this.sql_select(sql, params);
}

async function id_for_mrn(mrn) {
    if (!mrn) {
        return null;
    }
    let sql = 'SELECT patient_id FROM etl_mrn_patient WHERE mrn=?';
    let params = [mrn];
    let results = await this.sql_select(sql, params);
    if (results.length == 0) {
        return null;
    }
    return results[0].patient_id;
}

async function id_for_fhir(fhir) {
    if (!fhir) {
        return null;
    }
    let sql = 'SELECT patient_id FROM etl_mrn_patient WHERE fhir=?';
    let params = [fhir];
    let results = await this.sql_select(sql, params);
    if (results.length == 0) {
        return null;
    }
    return results[0].patient_id;
}

async function mrn_for_id(patient_id) {
    if (!patient_id) {
        return null;
    }
    let sql = 'SELECT mrn FROM etl_mrn_patient WHERE patient_id=?';
    let params = [patient_id];
    let results = await this.sql_select(sql, params);
    if (results.length == 0) {
        return null;
    }
    return results[0].mrn;
}

async function get_refresh_data(patient_id) {
    if (!patient_id) {
        return null;
    }
    let sql = 'SELECT mrn, fhir, refresh_token FROM etl_mrn_patient WHERE patient_id=?';
    let params = [patient_id];
    let results = await this.sql_select(sql, params);
    if (results.length == 0) {
        return null;
    }
    let result = {
        mrn: results[0].mrn,
        fhir: results[0].fhir,
        refresh_token: results[0].refresh_token
    }
    return result;
}

async function doctor_id_for_user(user_id) {
    if (!user_id) {
        return null;
    }
    let sql = 'SELECT doctor_id FROM etl_user WHERE ehr_user_id=?';
    let params = [user_id];
    let results = await this.sql_select(sql, params);
    if (results.length == 0) {
        sql = "INSERT INTO etl_user (doctor_id, ehr_user_id) VALUES ((select uuid()), ?);";
        await this.sql_select(sql, params);
        sql = 'SELECT doctor_id FROM etl_user WHERE ehr_user_id=?';
        results = await this.sql_select(sql, params);
    }
    return results[0].doctor_id;
}

async function get_help_phone(local_env_file_path){
	 if (!local_env_file_path) {
        local_env_file_path = './local.env';
    }
	var envfile = {};
    try {
        envfile = await dotenv.parse(fs.readFileSync(local_env_file_path));
    } catch (error) /* istanbul ignore next */ {
        console.log(error);
    }
	let help_phone = envfile.HELP_PHONE || '';
	return help_phone;
}

function adfice_init(db) {
    let adfice = {
        /* private variables */
        db: db,

        /* "private" and "friend" member functions */
        add_log_event: add_log_event,
        box_states_to_selection_states: box_states_to_selection_states,
        calculate_store_prediction_result: calculate_store_prediction_result,
        calculate_prediction_result: calculate_prediction_result,
        db_init: db_init,
        determine_preselected_checkboxes: determine_preselected_checkboxes,
        evaluate_sql: evaluate_sql,
        evaluate_sql_condition: evaluate_sql_condition,
        finalize_advice: finalize_advice,
        get_active_rules: get_active_rules,
        get_advice_other_texts_checkboxes: get_advice_other_texts_checkboxes,
        get_advice_texts_no_checkboxes: get_advice_texts_no_checkboxes,
        get_advice_texts_non_med_checkboxes: get_advice_texts_non_med_checkboxes,
        get_all_advice_texts_checkboxes: get_all_advice_texts_checkboxes,
        get_all_problems: get_all_problems,
        get_all_labs: get_all_labs,
        get_bsn: get_bsn,
        get_export_data: get_export_data,
        get_freetexts: get_freetexts,
        get_labs: get_labs,
        get_meds: get_meds,
        get_patient_by_id: get_patient_by_id,
        get_prediction_result: get_prediction_result,
        get_preselect_rules: get_preselect_rules,
        get_problems: get_problems,
        get_reference_numbers: get_reference_numbers,
        get_selections: get_selections,
        get_sql_condition: get_sql_condition,
        get_table_sizes: get_table_sizes,
        is_sql_condition_true: is_sql_condition_true,
        labListOfInserts: labListOfInserts,
        logFiredRules: logFiredRules,
        measListOfInserts: measListOfInserts,
        measListOfUpdatesMeds: measListOfUpdatesMeds,
        medListOfInserts: medListOfInserts,
        patientListOfInserts: patientListOfInserts,
        probListOfInserts: probListOfInserts,
        selection_states_to_box_states: selection_states_to_box_states,
        sql_select: sql_select,
        structure_meas: structure_meas,
        update_prediction_result: update_prediction_result,
        update_prediction_with_user_values: update_prediction_with_user_values,

        /* public API methods */
        add_log_event_access: add_log_event_access,
        add_log_event_print: add_log_event_print,
        add_log_event_renew: add_log_event_renew,
        add_log_event_copy_patient_text: add_log_event_copy_patient_text,
        add_log_event_copy_ehr_text: add_log_event_copy_ehr_text,
        doctor_id_for_user: doctor_id_for_user,
        finalize_and_export: finalize_and_export,
        get_advice_for_patient: get_advice_for_patient,
        get_advice_texts_checkboxes: get_advice_texts_checkboxes,
		get_help_phone: get_help_phone,
        get_patient_measurements: get_patient_measurements,
        get_refresh_data: get_refresh_data,
        id_for_fhir: id_for_fhir,
        id_for_mrn: id_for_mrn,
        mrn_for_id: mrn_for_id,
        remove_med: remove_med,
        renew_patient: renew_patient,
        set_advice_for_patient: set_advice_for_patient,
        shutdown: shutdown,
        write_patient_from_json: write_patient_from_json,
    };
    return adfice;
}

module.exports = {
    adfice_init: adfice_init,
};
