// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const adfice_factory = require('./adfice');
const util = require("util");
const fs = require('fs');

var adfice = adfice_factory.adfice_init();
afterAll(async () => {
    return await adfice.shutdown();
});

test('test patient_id for valid mrn', async () => {
    let mrn = 'DummyMRN-641923847';
    let patient_id = await adfice.id_for_mrn(mrn);
    expect(patient_id).toBe(163);
});

test('test patient_id for no mrn', async () => {
    let mrn = null;
    let patient_id = await adfice.id_for_mrn(mrn);
    expect(patient_id).toBe(null);
});

test('test patient_id for missing mrn', async () => {
    let mrn = 'DummyMRN-SirNotAppearing-641923847';
    let patient_id = await adfice.id_for_mrn(mrn);
    expect(patient_id).toBe(null);
});

test('test advice text 6e', async () => {
    //console.log('6e');
    var rule_numbers = ["6e"];
    var texts = await adfice.get_advice_texts_checkboxes(rule_numbers);
    expect(texts.length).toBe(12);
    expect(texts[0].select_box_category).toBe('stop');
    expect(texts[1].select_box_category).toBe('taper-stop');
    expect(texts[2].select_box_category).toBe('taper-reduce');
    expect(texts[11].select_box_category).toBe('free_text');

    expect(texts[6].cdss_split[0].text).toBe('Continueren');
    expect(texts[6].ehr_split[0].text).toBe('Continueren');
    let str = 'Gebruik dit medicijn zoals u tot nu toe al deed.';
    expect(texts[6].patient_split[0].text).toBe(str);

    texts = await adfice.get_advice_texts_no_checkboxes(rule_numbers);
    expect(texts.length).toBe(1);
    expect(texts[0].cdss_split[0].text).toContain('angststoornis');
})

test('box_states_to_selection_states', () => {
    const patient_id = 32;
    const viewer = 188;
    const box_states = {
        "cb_C03AA03_42_2": false,
        "cb_C03AA03_42b_3": true
    };
    const expected = [
        [32, 188, "C03AA03", "42", 2, 0],
        [32, 188, "C03AA03", "42b", 3, 1]
    ];
    let out = adfice.box_states_to_selection_states(patient_id, viewer,
        box_states);
    expect(out).toStrictEqual(expected);
});

test('selection_states_to_box_states', () => {
    const selection_states = [{
        patient_id: 32,
        ATC_code: "C03AA03",
        medication_criteria_id: "42",
        select_box_num: 2,
        selected: 0
    }, {
        patient_id: 32,
        ATC_code: "C03AA03",
        medication_criteria_id: "42b",
        select_box_num: 3,
        selected: 1
    }];

    const expected = {
        "cb_C03AA03_42_2": false,
        "cb_C03AA03_42b_3": true
    };

    let out = adfice.selection_states_to_box_states(selection_states);

    expect(out).toStrictEqual(expected);
});

test('get_advice_for_patient(68), no labs, no problems', async () => {
    //console.log('68');
    let patient_num = 68;
    let patientAdvice = await adfice.get_advice_for_patient(patient_num);
    let advice = patientAdvice.medication_advice;
    expect(advice.length).toBe(2);
    let adv0 = advice[0];
    expect(adv0['ATC_code']).toBe('C03AA03');
    expect(adv0['medication_name']).toBe('hydrochlorothiazide');

    let adviceTextsCheckboxes = adv0['adviceTextsCheckboxes'];
    expect(adviceTextsCheckboxes.length).toBe(8);
    let checkbox0 = adviceTextsCheckboxes[0];
    expect(checkbox0['medication_criteria_id']).toBe("42");
    expect(checkbox0['select_box_num']).toBe(7);
    expect(checkbox0['select_box_category']).toBe('stop');

    let checkbox1 = adviceTextsCheckboxes[1];
    expect(checkbox1['cdss_split'][0].text)
        .toContain('Afbouwen waarna stoppen');
    expect(checkbox1['cdss_split'].length).toBe(2);

    let adviceTextsNoCheckboxes = adv0['adviceTextsNoCheckboxes'];
    expect(adviceTextsNoCheckboxes.length).toBe(3);
    let noCheckbox0 = adviceTextsNoCheckboxes[0];
    expect(noCheckbox0['medication_criteria_id']).toBe("41");
    expect(noCheckbox0['cdss_split'][0].text).toContain("ACE");
    expect(noCheckbox0['cdss_split'][0].text).toContain("antagonisten");

});

test('set_advice_for_patient(68)', async () => {
    //console.log('68 part 2');
    let patient_num = 68;
    let viewer = 999;
    let advice = await adfice.get_advice_for_patient(patient_num);

    await adfice.reload_patient_data(patient_num, 'true');
    let old_advice = {
        "cb_C03AA03_42_2": false,
        "cb_C03AA03_42_3": true,
        "cb_C03AA03_42_4": false,
        "cb_C03AA03_42_1": false,
        "cb_C03AA03_42_6": false,
        "cb_C03AA03_42_5": false,
        "cb_C09AA02_63_1": false,
        "cb_C09AA02_63_2": true,
        "cb_C09AA02_63_3": false,
        "cb_C09AA02_63_4": false,
        "cb_C09AA02_63b_1": true
    };

    let freetexts = null;
    adfice.set_advice_for_patient(patient_num, viewer, old_advice, freetexts);

    advice = await adfice.get_advice_for_patient(patient_num);
    expect(advice.selected_advice).toStrictEqual(old_advice);

    let new_advice = {
        "cb_C03AA03_42_2": true,
        "cb_C03AA03_42_3": false,
        "cb_C03AA03_42_4": false,
        "cb_C03AA03_42_1": false,
        "cb_C03AA03_42_6": false,
        "cb_C03AA03_42_5": false,
        "cb_C09AA02_63_1": false,
        "cb_C09AA02_63_2": false,
        "cb_C09AA02_63_3": true,
        "cb_C09AA02_63_4": false,
        "cb_C09AA02_63b_1": false
    };
    adfice.set_advice_for_patient(patient_num, viewer, new_advice, freetexts);

    advice = await adfice.get_advice_for_patient(patient_num);
    expect(advice.selected_advice).toStrictEqual(new_advice);

    expect(advice.is_final).toBeFalsy();
    await adfice.finalize_advice(patient_num);
    advice = await adfice.get_advice_for_patient(patient_num);
    expect(advice.is_final).toBeTruthy();

    let data = await adfice.get_export_data(patient_num);
    expect(data.length).toBe(2);

    await adfice.clear_advice_for_patient(patient_num);
    advice = await adfice.get_advice_for_patient(patient_num);
    expect(advice.is_final).toBeFalsy();
    expect(advice.selected_advice).not.toStrictEqual(new_advice);

    adfice.set_advice_for_patient(patient_num, viewer, new_advice, freetexts);
})

test('update_prediction_with_user_values, update all missing data', async () => {
    let patient_id = 172;
    let form_data = {};
    form_data['user_GDS_score'] = '1';
    form_data['user_grip_kg'] = '15';
    form_data['user_walking_speed_m_per_s'] = '0.2';
    form_data['user_height_cm'] = '160';
    form_data['user_weight_kg'] = '60';
    form_data['user_systolic_bp_mmHg'] = '120';
    form_data['user_number_of_limitations'] = '2';
    form_data['user_nr_falls_12m'] = '2';
    form_data['user_smoking'] = '0';
    form_data['user_education_hml'] = '2';
    form_data['fear_dropdown'] = '2';
    let measurements = await adfice.get_patient_measurements(patient_id);
    let measurement = measurements[0];
    expect(measurement['prediction_result']).toBeFalsy();
    expect(measurement['user_grip_kg']).toBeFalsy();
    await adfice.update_prediction_with_user_values(patient_id, form_data);
    measurements = await adfice.get_patient_measurements(patient_id);
    measurement = measurements[0];
    expect(measurement['prediction_result']).toBeGreaterThan(10);
    expect(measurement['user_grip_kg']).toBe(15);

    patient_id = 170;
    form_data = {};
    form_data['user_GDS_score'] = '';
    form_data['user_grip_kg'] = '';
    form_data['user_walking_speed_m_per_s'] = '';
    form_data['user_height_cm'] = '';
    form_data['user_weight_kg'] = '';
    form_data['user_systolic_bp_mmHg'] = '';
    form_data['user_number_of_limitations'] = '';
    form_data['user_nr_falls_12m'] = '';
    form_data['user_smoking'] = '';
    form_data['user_education_hml'] = '';
    form_data['fear_dropdown'] = '';
    measurements = await adfice.get_patient_measurements(patient_id);
    measurement = measurements[0];
    let prediction_result = measurement['prediction_result'];
    expect(prediction_result).toBeGreaterThan(10);
    expect(measurement['user_grip_kg']).toBe(25);
    await adfice.update_prediction_with_user_values(patient_id, form_data);
    measurements = await adfice.get_patient_measurements(patient_id);
    measurement = measurements[0];
    expect(measurement['prediction_result']).toBe(prediction_result);
    expect(measurement['user_grip_kg']).toBe(25);

    patient_id = 172;
    form_data = {};
    form_data['fear_dropdown'] = '0';
    await adfice.update_prediction_with_user_values(patient_id, form_data);
    measurements = await adfice.get_patient_measurements(patient_id);
    measurement = measurements[0];
    expect(measurement['user_fear0']).toBe(1);
    expect(measurement['user_fear1']).toBe(0);
    form_data = {};
    form_data['fear_dropdown'] = '1';
    await adfice.update_prediction_with_user_values(patient_id, form_data);
    measurements = await adfice.get_patient_measurements(patient_id);
    measurement = measurements[0];
    expect(measurement['user_fear1']).toBe(1);
    expect(measurement['user_fear0']).toBe(0);

    // clean up
    let params = [172];
    let sql = 'UPDATE patient_measurement SET user_GDS_score = null, user_grip_kg = null, user_walking_speed_m_per_s = null, user_height_cm = null, user_weight_kg = null, user_systolic_bp_mmHg = null, user_number_of_limitations = null, user_nr_falls_12m = null, user_nr_falls_12m = null, user_smoking = null, user_education_hml = null, user_fear0 = null, user_fear1 = null, user_fear2 = null, prediction_result = null, user_values_updated = null WHERE patient_id = ?';
    await adfice.sql_select(sql, params);
})

test('get_advice_for_patient(27), with labs and problems', async () => {
    //console.log('27');
    let patient_num = 27;
    let patientAdvice = await adfice.get_advice_for_patient(patient_num);
    let advice = patientAdvice.medication_advice;
    expect(advice.length).toBe(1);
    let adv0 = advice[0];
    expect(adv0['ATC_code']).toBe('N06AA09');
    expect(adv0['medication_name']).toBe('amitriptyline');

    let adviceTextsCheckboxes = adv0['adviceTextsCheckboxes'];
    expect(adviceTextsCheckboxes.length).toBe(16);
    let checkbox0 = adviceTextsCheckboxes[0];
    expect(checkbox0['medication_criteria_id']).toBe("19f");
    expect(checkbox0['select_box_num']).toBe(11);
    expect(checkbox0['select_box_category']).toBe('stop');

    let adviceTextsNoCheckboxes = adv0['adviceTextsNoCheckboxes'];
    expect(adviceTextsNoCheckboxes.length).toBe(4);
    let noCheckbox0 = adviceTextsNoCheckboxes[0];
    expect(noCheckbox0['medication_criteria_id']).toBe("19a");
    expect(noCheckbox0.cdss_split[0].text).toContain("depressie");
})

test('get_advice_for_patient(1), no med rule advice', async () => {
    let patient_num = 1;
    let patientAdvice = await adfice.get_advice_for_patient(patient_num);
    let advice = patientAdvice.medication_advice;
    expect(advice.length).toBe(0);
    let non_med_advice = patientAdvice.advice_text_non_med;
    expect(non_med_advice.length).toBe(56);

    expect(patientAdvice.selected_advice['cb_NONMED_A_1']).toBe(true);
    expect(patientAdvice.selected_advice['cb_NONMED_C_1']).toBeUndefined();
    let preselected_checkbox_count = 4
    expect(Object.keys(patientAdvice.selected_advice).length).toBe(4);
})

test('get_advice_for_patient(60), sparse patient', async () => {
    //console.log('60');
    let patient_num = 60;
    let patientAdvice = await adfice.get_advice_for_patient(patient_num);
    let advice = patientAdvice.medication_advice;
    expect(advice.length).toBe(1);
})

test('get_advice_for_patient(9), patient with non-rule med', async () => {
    //console.log('9');
    let patient_num = 9;
    let patientAdvice = await adfice.get_advice_for_patient(patient_num);
    let medication_advice_atc = [];
    for (let i = 0; i < patientAdvice.medication_advice.length; ++i) {
        let row = patientAdvice.medication_advice[i];
        medication_advice_atc.push(row.ATC_code);
    }

    expect(patientAdvice.meds_without_rules.length).toBe(1);
    expect(patientAdvice.meds_with_rules.length).toBe(1);

    let atc_no_advice = patientAdvice.meds_without_rules[0].ATC_code;
    expect(medication_advice_atc.includes(atc_no_advice)).toBe(false);

    let atc = patientAdvice.meds_with_rules[0].ATC_code;
    expect(medication_advice_atc.includes(atc)).toBe(true);
})

test('get_advice_for_patient(null)', async () => {
    //console.log('null');
    let patient_num = null;
    let patientAdvice = await adfice.get_advice_for_patient(patient_num);
    let advice = patientAdvice.medication_advice;
    expect(advice.length).toBe(0);
})

test('get_advice_for_patient(-1)', async () => {
    //console.log('-1');
    let patient_num = -1;
    let patientAdvice = await adfice.get_advice_for_patient(patient_num);
    let advice = patientAdvice.medication_advice;
    expect(advice.length).toBe(0);
})

test('get_advice_for_patient(bogus)', async () => {
    let patient_num = 'bogus';
    let patientAdvice = await adfice.get_advice_for_patient(patient_num);
    let advice = patientAdvice.medication_advice;
    expect(advice.length).toBe(0);
})

test('freetext round trip', async () => {

    let viewer = "2";
    let patient = "26";
    let freetexts = {
        ft_C03AA03_42_1_1: "",
        ft_C03AA03_42_2_1: "serie van",
        ft_C03AA03_42_3_1: "foo",
        ft_C03AA03_42_5_1: "",
        ft_C03AA03_42_6_1: "bar",
        ft_C09AA02_63_1_1: "",
        ft_C09AA02_63_2_1: "",
        ft_C09AA02_63_4_1: "",
        ft_C09AA02_63b_1_1: "baz"
    };

    let cb_states = null;
    await adfice.set_advice_for_patient(patient, viewer, cb_states, freetexts);
    let actual = await adfice.get_freetexts(patient);

    expect(actual).toStrictEqual(freetexts);
})

test('no rules fired', async () => {
    expect(await adfice.get_advice_texts_checkboxes(null)).toStrictEqual([]);
    expect(await adfice.get_advice_texts_no_checkboxes(null)).toStrictEqual([]);
    expect(await adfice.get_reference_numbers(null)).toStrictEqual([]);

    expect(await adfice.get_advice_texts_checkboxes([])).toStrictEqual([]);
    expect(await adfice.get_advice_texts_no_checkboxes([])).toStrictEqual([]);
    expect(await adfice.get_reference_numbers([])).toStrictEqual([]);
});

test('get_advice_for_patient(85), normal eGFR', async () => {
    let patient_num = 85;
    let patientAdvice = await adfice.get_advice_for_patient(patient_num);
    let advice = patientAdvice.medication_advice;
    // TODO check for malformed patient data. In this case labTests was not
    // being constructed correctly. Or just replace the criteria with SQL and
    // test that insstead.

});

test('getSQLcondition rule 38', async () => {
    let rule_number = 38;
    let sqlCondition = await adfice.get_sql_condition(rule_number);
    expect(sqlCondition).toContain("patient_problem");
});

test('is_sql_condition_true', async () => {
    let patient_identifier = 44;
    let rule_number = 38;
    let isConditionTrue = await adfice.is_sql_condition_true(patient_identifier,
        rule_number);
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
});

test('SQL error check', async () => {
    let isConditionTrue = await adfice.is_sql_condition_true(5, "6");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(6, "6a");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(4, "6b");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(8, "9");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(5, "9");
    expect(isConditionTrue).toBe(false);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(9, "10");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(12, "12");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(15, "14");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(15, "14a");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(16, "14b");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(17, "14c");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(18, "14d");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(18, "15");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(26, "19");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(27, "19a");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(28, "19b");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(29, "19c");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(25, "21");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(26, "22");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(26, "23");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(30, "24");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(31, "25");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(34, "26");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(36, "26a");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(33, "26b");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(41, "35");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(42, "36");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(43, "37");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(44, "38");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(45, "40");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(46, "40a");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(47, "40b");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(48, "40c");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(48, "41");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(51, "48");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(55, "52");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(56, "53");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(60, "57a");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(60, "58");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(62, "59");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(78, "68");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(79, "69");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(81, "70");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(80, "70");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(85, "79");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(86, "80");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(89, "80a");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(89, "80b");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(89, "81");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(87, "81");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(84, "83");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(91, "86");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(92, "87");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(92, "89");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(93, "90");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(95, "91");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(94, "91");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true(102, "102");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
});

test('Check preselect SQL', async () => {
    let preselectRules = await adfice.get_preselect_rules("6e");
    let sql = preselectRules[0]['sql_condition'].toString();
    let result = await (adfice.evaluate_sql(sql, 4));
    expect(result).toBe(true);
    sql = "";
    result = null;
    sql = preselectRules[1]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, 8));
    expect(result).toBe(false);
    sql = "";
    result = null;
    sql = preselectRules[2]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, 8));
    expect(result).toBe(true);
    sql = "";
    result = null;
    sql = preselectRules[3]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, 8));
    expect(result).toBe(true);
    preselectRules = null;
    sql = "";
    result = null;

    preselectRules = await adfice.get_preselect_rules("19f");
    sql = preselectRules[0]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, 1));
    expect(result).toBe(true);
    preselectRules = null;
    sql = "";
    result = null;

    preselectRules = await adfice.get_preselect_rules("42");
    sql = preselectRules[0]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, 1));
    expect(result).toBe(true);
    sql = "";
    result = null;
    sql = preselectRules[1]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, 1));
    expect(result).toBe(true);
    sql = "";
    result = null;
    sql = preselectRules[2]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, 48));
    expect(result).toBe(true);
    result = await (adfice.evaluate_sql(sql, 31));
    expect(result).toBe(true);
    sql = "";
    result = null;
    sql = preselectRules[3]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, 51));
    expect(result).toBe(true);
    sql = "";
    result = null;
    sql = preselectRules[4]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, 51));
    expect(result).toBe(true);
    preselectRules = null;
    sql = "";
    result = null;

    preselectRules = await adfice.get_preselect_rules("46");
    sql = preselectRules[0]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, 51));
    expect(result).toBe(true);
    preselectRules = null;
    sql = "";
    result = null;

    preselectRules = await adfice.get_preselect_rules("50");
    sql = preselectRules[0]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, 51));
    expect(result).toBe(true);
    preselectRules = null;
    sql = "";
    result = null;

    preselectRules = await adfice.get_preselect_rules("56");
    sql = preselectRules[1]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, 51));
    expect(result).toBe(true);
    sql = "";
    result = null;
    sql = preselectRules[2]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, 1));
    expect(result).toBe(true);
    preselectRules = null;
    sql = "";
    result = null;

    preselectRules = await adfice.get_preselect_rules("63");
    sql = preselectRules[0]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, 51));
    expect(result).toBe(true);
    preselectRules = null;
    sql = "";
    result = null;

    preselectRules = await adfice.get_preselect_rules("78");
    sql = preselectRules[0]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, 79));
    expect(result).toBe(true);
    sql = "";
    result = null;
    sql = preselectRules[1]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, 84));
    expect(result).toBe(true);
    preselectRules = null;
    sql = "";
    result = null;

    preselectRules = await adfice.get_preselect_rules("88");
    sql = preselectRules[0]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, 1));
    expect(result).toBe(true);
    preselectRules = null;
    sql = "";
    result = null;

});

test('Check preselected checkbox output', async () => {
    let output = {};

    let rules = ["88"];
    let patient = 1;
    let atc = "M03AC01";
    output = await adfice.determine_preselected_checkboxes(rules, patient, atc);
    expect(output["cb_M03AC01_88_2"]).toBe("checked");

    // Ace does not think it is possible for 2 checkboxes to be checked with
    // the current rules. In theory, it would be allowed.
    rules = ["45", "46", "48", "48a", "49"];
    patient = 51;
    atc = "C02AA02";
    output = await adfice.determine_preselected_checkboxes(rules, patient, atc);
    expect(output["cb_C02AA02_46_1"]).toBe("checked");

    rules = ["42"];
    patient = 1;
    atc = "C03CA02"
    output = await adfice.determine_preselected_checkboxes(rules, patient, atc);
    expect(output["cb_C03CA02_42_2"]).toBe("checked");

    // preselect-not is not actually used by any rules,
    // is tested in adfice-evaluator.test.js
});

test('Get prediction model result from DB', async () => {
    let patient = 142

    // clear any saved result
    let measurements = await adfice.get_patient_measurements(patient);
    let measurement = measurements[0];
    let row_id = measurement.id;
    await adfice.update_prediction_result(row_id, null);

    // add prediction result to database on first fetch if not present
    let prediction = await adfice.get_prediction_result(patient);
    expect(prediction).toBe(74);

    // second fetch gets the same result, but does not update the db
    prediction = await adfice.get_prediction_result(patient);
    expect(prediction).toBe(74);
});

test('Get empty result set from measurements', async () => {
    let measurements = await adfice.get_patient_measurements(1);
    expect(measurements).toBe(null);
    let prediction1 = await adfice.get_prediction_result(1);
    expect(prediction1).toBe(null);
});

test('Structure measurements', async () => {
    let measurements = await adfice.get_patient_measurements(2);
    let structuredMeas = adfice.structure_meas(measurements);
    expect(structuredMeas['grip_kg']).toBe(21.5);
});

test('Calculate prediction based on DB data', async () => {
    let measurement = await adfice.calculate_prediction_result(2);
    expect(measurement.prediction_result).toBeGreaterThan(10);
    measurement = await adfice.calculate_prediction_result(1);
    expect(measurement).toBe(null);
});

test('Calculate prediction based on user-entered data', async () => {
    let measurement = await adfice.calculate_prediction_result(170);
    expect(measurement.prediction_result).toBeGreaterThan(10);
});

test('Update prediction', async () => {
    let patient = 2;
	let precheck = await adfice.get_patient_measurements(patient);	let row_id = precheck[0].id;	    await adfice.update_prediction_result(row_id, null);    let before = await adfice.get_patient_measurements(patient);	let after = null;
    try {
        await adfice.calculate_store_prediction_result(patient);
        after = await adfice.get_patient_measurements(patient);
    } finally {
		let row_id = before[0].id;
        await adfice.update_prediction_result(row_id, null);		let cleanup = await adfice.get_patient_measurements(patient);    }    expect(before.length).toBeGreaterThan(0);
    expect(before[0].prediction_result).toBe(null);
	expect(after.length).toBeGreaterThan(0);
    expect(after[0].prediction_result).toBeGreaterThan(10);
});test('Log fired rules', async () => {
    let patient = 162;	let sql = 'select * from rules_fired where patient_id =' + patient;
	let before = await adfice.sql_select(sql);
	let meds_with_rules_to_fire = {};	meds_with_rules_to_fire['N05AH04'] = ['14','14a','16','18','105'];	meds_with_rules_to_fire['N05CF02'] = ['6b','6e','7','10','11'];	await adfice.logFiredRules(patient, meds_with_rules_to_fire);	let after =  await adfice.sql_select(sql);	let sql_cleanup = "delete from rules_fired where patient_id =" + patient;	await adfice.sql_select(sql_cleanup);    expect(before.length).toBe(0);	expect(after.length).toBe(2);
	if(after[0].ATC_code == 'N05AH04'){		expect(after[0].rules_fired).toBe('14,14a,16,18,105');	} else {		expect(after[0].rules_fired).toBe('6b,6e,7,10,11');	}
});

test('export_patient', async () => {
    let patient = '168';
    let file = "test-export_patient-168.log";
    try {
        fs.unlinkSync(file, (err) => {});
    } catch (ignoreError) {}

    await adfice.reload_patient_data(patient, 'true');
    let new_advice = {
        "cb_M03BA03_88_2": true,
        "cb_OTHER_other_1": true,
        "cb_NONMED_A_1": true
    };
    let viewer = 999;
    let freetexts = null;
    adfice.set_advice_for_patient(patient, viewer, new_advice, freetexts);

    // essentially calling adfice.finalize_and_export(id), but with a file
    await adfice.finalize_advice(patient);
    await adfice.export_patient(patient, file);

    const contents = fs.readFileSync(file, 'utf8');

    expect(contents).toMatch(/168/);
    expect(contents).toMatch(/metho/);
    expect(contents).toMatch(/Stoppen/);
    expect(contents).toMatch(/Valpre/);

    fs.unlinkSync(file);
});

test('finalize_export API', async () => {
    let patient = '68';
    let file = "test-export_patient-68-2.log";
    try {
        fs.unlinkSync(file, (err) => {});
    } catch (ignoreError) {}

    await adfice.clear_advice_for_patient(patient);
    await adfice.finalize_and_export(patient, file);
    let patientAdvice = await adfice.get_advice_for_patient(patient);
    expect(patientAdvice.is_final).toBeTruthy();
    fs.unlinkSync(file);
    await adfice.clear_advice_for_patient(patient);
});

test('reload from MRS', async () => {
    let patient = '160';
    let sql = "UPDATE patient SET birth_date='1940-06-16', age=81 WHERE id=?";
    await adfice.sql_select(sql, [patient]);
    let patientAdvice = await adfice.get_advice_for_patient(patient);
    expect(patientAdvice.age).toBe(81);

    let cmd = 'bin/reload-synthetic-data.sh';
    await adfice.reload_patient_data(patient, cmd);
    patientAdvice = await adfice.get_advice_for_patient(patient);
    expect(patientAdvice.age).toBe(80);

    // test default no-op reload script
    patient = '169';
    await adfice.reload_patient_data(patient);
});

test('log print event', async () => {
    let viewer = '2';
    let patient = '166';
    let sql = "SELECT COUNT(*) AS cnt FROM logged_events WHERE patient_id = ?";
    let results = await adfice.sql_select(sql, [patient]);
    let cnt = 0;
    if (results.length > 0) {
        cnt = results[0].cnt;
    }

    await adfice.add_log_event_print(viewer, patient);
    await adfice.add_log_event_copy_patient_text(viewer, patient);
    await adfice.add_log_event_copy_ehr_text(viewer, patient);

    let results2 = await adfice.sql_select(sql, [patient]);
    let cnt2 = 0;
    if (results2.length > 0) {
        cnt2 = results2[0].cnt;
    }
    expect(cnt2).toBe(cnt + 3);
});
