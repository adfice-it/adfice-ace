// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const fs = require('fs');
const path = require('path');
const autil = require('./adfice-util');
const ae = require('./adfice-evaluator');
const cp = require('./calculate-prediction');
const adb = require('./adfice-db');

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

function as_id(num_or_str) {
    let num;
    if (typeof num_or_str == 'number') {
        num = num_or_str;
    } else {
        num = parseInt(num_or_str, 10) || 0;
    }
    return num;
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
    let results = await this.sql_select(sql, [rule_number]);
    return results[0]['sql_condition'];
}

async function is_sql_condition_true(patient_identifier, rule_number) {
    let patient_id = as_id(patient_identifier);
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

async function calculate_prediction_result(patient_id) {
    let measurements = await this.get_patient_measurements(patient_id);
    if (measurements == null || !measurements.length) {
        return null;
    }
    let measurement = measurements[0];
    let GDS_score = measurement['GDS_score'];
    if (GDS_score == null) {
        GDS_score = measurement['user_GDS_score'];
    }
    let grip_kg = measurement['grip_kg'] || measurement['user_grip_kg'];
    let walking_speed_m_per_s = measurement['walking_speed_m_per_s'] ||
        measurement['user_walking_speed_m_per_s'];
    let user_BMI = null;
    if (measurement['user_height_cm'] != null &&
        measurement['user_weight_kg'] != null) {
        user_BMI = measurement['user_weight_kg'] /
            ((measurement['user_height_cm']) ^ 2);
    }
    let BMI = measurement['BMI'] || user_BMI;
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
    viewer_id, cb_states) {
    let insert_sql = `/* adfice.set_advice_for_patient */
 INSERT INTO patient_advice_selection
           ( patient_id
           , doctor_id
           , viewer_id
           , ATC_code
           , medication_criteria_id
           , select_box_num
           , selected
           )
      VALUES (?,?,?,?,?,?,?)
 ON DUPLICATE KEY
      UPDATE viewer_id=VALUES(viewer_id)
           , selected=VALUES(selected)
`;
    let params = box_states_to_selection_states(patient_id, doctor_id, viewer_id,
        cb_states);
    for (let i = 0; i < params.length; ++i) {
        sqls_and_params.push([insert_sql, params[i]]);
    }
}

async function set_sql_freetexts(sqls_and_params, patient_id, doctor_id, viewer_id,
    freetexts) {
    let insert_sql = `/* adfice.set_advice_for_patient */
 INSERT INTO patient_advice_freetext
           ( patient_id
           , doctor_id
           , viewer_id
           , ATC_code
           , medication_criteria_id
           , select_box_num
           , freetext_num
           , freetext
           )
      VALUES (?,?,?,?,?,?,?,?)
 ON DUPLICATE KEY
      UPDATE viewer_id=VALUES(viewer_id)
           , freetext=VALUES(freetext)
`;
    let params = freetexts_to_rows(patient_id, doctor_id, viewer_id, freetexts);
    for (let i = 0; i < params.length; ++i) {
        sqls_and_params.push([insert_sql, params[i]]);
    }
}

// called from adfice-webserver-runner
async function set_advice_for_patient(patient_identifier, doctor,
    viewer, cb_states, freetexts) {
    const patient_id = as_id(patient_identifier);
    const viewer_id = as_id(viewer);
    const doctor_id = as_id(doctor);

    let sqls_and_params = [];

    if (cb_states) {
        set_sql_selections(sqls_and_params, patient_id, doctor_id, viewer_id,
            cb_states);
    }

    if (freetexts) {
        set_sql_freetexts(sqls_and_params, patient_id, doctor_id, viewer_id, freetexts);
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
        sql += " WHERE patient_id = " + patient_id;
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
    return selection_states_to_box_states(results);
}

async function get_freetexts(patient_id) {
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
async function get_advice_for_patient(patient_identifier) {
    let patient_id = as_id(patient_identifier);
    let patient = await this.get_patient_by_id(patient_id);
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
            return await this.is_sql_condition_true(pId, ruleNum);
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
        await this.set_advice_for_patient(patient_identifier, null,
            0, cb_states, null);
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

function box_states_to_selection_states(patient_id, doctor_id, viewer_id, box_states) {
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
        output.push([patient_id, doctor_id, viewer_id, atc, criterion, box_num, checked]);
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

function freetexts_to_rows(patient_id, doctor_id, viewer_id, freetexts) {
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
async function get_export_data(patient_identifier) {
    let patient_id = as_id(patient_identifier);
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

// expect to be called from external
async function export_patient(patient, logfile) {
    let args = ['-i', patient];

    /* istanbul ignore next */
    if (logfile) {
        args.push('-l');
        args.push(logfile);
    }

    let cmd = process.cwd() + path.sep + 'export-to-mrs';

    return autil.child_process_spawn(cmd, args);
}

async function finalize_advice(patient_id) {
    let sql = `/* adfice.finalize_advice */
    UPDATE patient
       SET is_final = 1
     WHERE id = ?`
    let params = [patient_id];
    let db = await this.db_init();
    let result = await db.sql_query(sql, params);
    return result;
}

async function finalize_and_export(patient_id, logfile) {
    await this.finalize_advice(patient_id);
    await this.export_patient(patient_id, logfile);
}

async function add_log_event(viewer_id, patient_id, event_type) {
    let sql = `/* adfice.add_log_event */
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

async function add_log_event_print(viewer_id, patient_id) {
    return await this.add_log_event(viewer_id, patient_id, 1);
}

async function add_log_event_copy_patient_text(viewer_id, patient_id) {
    return await this.add_log_event(viewer_id, patient_id, 2);
}

async function add_log_event_copy_ehr_text(viewer_id, patient_id) {
    return await this.add_log_event(viewer_id, patient_id, 3);
}

async function add_log_event_renew(viewer_id, patient_id) {
    return await this.add_log_event(viewer_id, patient_id, 4);
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
    let params = [user_id,
        as_id(patient_id)
    ];
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

async function doctor_id_for_user(user_id) {
    if (!user_id) {
        return null;
    }
    let sql = 'SELECT doctor_id FROM etl_user WHERE ehr_user_id=?';
    let params = [user_id];
    let results = await this.sql_select(sql, params);
    if (results.length == 0) {
        sql = "INSERT INTO etl_user (ehr_user_id) VALUES (?);";
        await this.sql_select(sql, params);
        sql = 'SELECT doctor_id FROM etl_user WHERE ehr_user_id=?';
        results = await this.sql_select(sql, params);
    }
    return results[0].doctor_id;
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
        export_patient: export_patient,
        finalize_advice: finalize_advice,
        get_active_rules: get_active_rules,
        get_advice_other_texts_checkboxes: get_advice_other_texts_checkboxes,
        get_advice_texts_no_checkboxes: get_advice_texts_no_checkboxes,
        get_advice_texts_non_med_checkboxes: get_advice_texts_non_med_checkboxes,
        get_all_advice_texts_checkboxes: get_all_advice_texts_checkboxes,
        get_all_problems: get_all_problems,
        get_all_labs: get_all_labs,
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
        logFiredRules: logFiredRules,
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
        get_patient_measurements: get_patient_measurements,
        id_for_mrn: id_for_mrn,
        set_advice_for_patient: set_advice_for_patient,
        shutdown: shutdown,
    };
    return adfice;
}

module.exports = {
    adfice_init: adfice_init,
};
