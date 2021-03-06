// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const adfice_factory = require('./adfice');
const autil = require('./adfice-util');
const util = require("util");
const fs = require('fs');

var adfice = adfice_factory.adfice_init();
afterAll(async () => {
    return await adfice.shutdown();
});

async function clear_advice_for_patient(adfice, patient_id) {
    let sqls_and_params = [];
    let sql = `/* adfice.clear_advice_for_patient */
        UPDATE patient
           SET is_final = 0
         WHERE patient_id = ?`;
    let params = [patient_id];
    sqls_and_params.push([sql, params]);

    sql = `/* adfice.clear_advice_for_patient */
  DELETE FROM patient_advice_selection
        WHERE patient_id = ?`;
    sqls_and_params.push([sql, params]);

    sql = `/* adfice.clear_advice_for_patient */
  DELETE FROM patient_advice_freetext
        WHERE patient_id = ?`;
    sqls_and_params.push([sql, params]);

    let db = await adfice.db_init();
    let rs = await db.as_sql_transaction(sqls_and_params);
    return rs;
}

test('test patient_id for valid mrn', async () => {
    let mrn = 'DummyMRN-000000163';
    let patient_id = await adfice.id_for_mrn(mrn);
    expect(patient_id).toBe("00000000-0000-4000-8000-100000000163");
});

test('test patient_id for no mrn', async () => {
    let mrn = null;
    let patient_id = await adfice.id_for_mrn(mrn);
    expect(patient_id).toBe(null);
});

test('test patient_id for missing mrn', async () => {
    let mrn = 'DummyMRN-SirNotAppearing-000000163';
    let patient_id = await adfice.id_for_mrn(mrn);
    expect(patient_id).toBe(null);
});

test('test patient_id for valid fhir', async () => {
    let fhir = 'DummyFHIR-000000163';
    let patient_id = await adfice.id_for_fhir(fhir);
    expect(patient_id).toBe("00000000-0000-4000-8000-100000000163");
});

test('test patient_id for no fhir', async () => {
    let fhir = null;
    let patient_id = await adfice.id_for_fhir(fhir);
    expect(patient_id).toBe(null);
});

test('test patient_id for missing fhir', async () => {
    let fhir = 'DummyFHIR-SirNotAppearing-000000163';
    let patient_id = await adfice.id_for_fhir(fhir);
    expect(patient_id).toBe(null);
});

test('test mrn for valid patient_id', async () => {
    let patient_id = "00000000-0000-4000-8000-100000000163";
    let mrn = await adfice.mrn_for_id(patient_id);
    expect(mrn).toBe("DummyMRN-000000163");
});

test('test mrn for null patient_id', async () => {
    let patient_id = null;
    let mrn = await adfice.mrn_for_id(patient_id);
    expect(mrn).toBe(null);
});

test('test mrn for invalid patient_id', async () => {
    let patient_id = "SirNotAppearing";
    let mrn = await adfice.mrn_for_id(patient_id);
    expect(mrn).toBe(null);
});

test('test refresh_data for valid patient_id', async () => {
    let patient_id = "00000000-0000-4000-8000-100000000163";
    let refresh_data = await adfice.get_refresh_data(patient_id);
    expect(refresh_data.fhir).toBe("DummyFHIR-000000163");
});

test('test refresh_data for null patient_id', async () => {
    let patient_id = null;
    let refresh_data = await adfice.get_refresh_data(patient_id);
    expect(refresh_data).toBe(null);
});

test('test refresh_data for invalid patient_id', async () => {
    let patient_id = "SirNotAppearing";
    let refresh_data = await adfice.get_refresh_data(patient_id);
    expect(refresh_data).toBe(null);
});

test('test doctor_id for user_id', async () => {
    let user_id = 'dr_bob';
    let doctor_id = await adfice.doctor_id_for_user(user_id);
    expect(doctor_id).toBe('4573fee8-4845-44ff-a9c2-1e988ba81f8f');
});

test('test doctor_id for null user_id', async () => {
    let user_id = null;
    let doctor_id = await adfice.doctor_id_for_user(user_id);
    expect(doctor_id).toBe(null);
});

test('test doctor_id for nonexistant user_id', async () => {
    let user_id = 'sir_not_appearing';
    let doctor_id = await adfice.doctor_id_for_user(user_id);

    // clean up
    await adfice.sql_select("DELETE FROM etl_user WHERE ehr_user_id=?", [user_id]);

    expect(doctor_id.length).toBe(36);
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
    let str = 'Gebruik dit medicijn zoals u tot nu toe al gewend was.';
    expect(texts[6].patient_split[0].text).toBe(str);

    texts = await adfice.get_advice_texts_no_checkboxes(rule_numbers);
    expect(texts.length).toBe(1);
    expect(texts[0].cdss_split[0].text).toContain('angststoornis');
})

test('box_states_to_selection_states', () => {
    const patient_id = "00000000-0000-4000-8000-100000000032";
    const doctor_id = 1;
    const box_states = {
        "cb_C03AA03_42_2": false,
        "cb_C03AA03_42b_3": true
    };
    const expected = [
        [patient_id, 1, "C03AA03", "42", 2, 0],
        [patient_id, 1, "C03AA03", "42b", 3, 1]
    ];
    let out = adfice.box_states_to_selection_states(patient_id, doctor_id,
        box_states);
    expect(out).toStrictEqual(expected);
});

test('selection_states_to_box_states', () => {
    const patient_id = "00000000-0000-4000-8000-100000000032";
    const selection_states = [{
        patient_id: patient_id,
        ATC_code: "C03AA03",
        medication_criteria_id: "42",
        select_box_num: 2,
        selected: 0
    }, {
        patient_id: patient_id,
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
    let patient_id = "00000000-0000-4000-8000-100000000068";
    let patientAdvice = await adfice.get_advice_for_patient(patient_id);
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
    let patient_id = "00000000-0000-4000-8000-100000000068";
    let viewer = 999;
    let doctor_id = 1;
    let advice = await adfice.get_advice_for_patient(patient_id);

    await clear_advice_for_patient(adfice, patient_id);
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
    adfice.set_advice_for_patient(patient_id, doctor_id, old_advice, freetexts);

    advice = await adfice.get_advice_for_patient(patient_id);
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
    adfice.set_advice_for_patient(patient_id, doctor_id, new_advice, freetexts);

    advice = await adfice.get_advice_for_patient(patient_id);

    expect(advice.selected_advice).toStrictEqual(new_advice);

    expect(advice.is_final).toBeFalsy();
    await adfice.finalize_advice(patient_id);
    advice = await adfice.get_advice_for_patient(patient_id);
    expect(advice.is_final).toBeTruthy();

    let data = await adfice.get_export_data(patient_id);
    expect(data.length).toBe(2);

    await clear_advice_for_patient(adfice, patient_id);
    advice = await adfice.get_advice_for_patient(patient_id);
    expect(advice.is_final).toBeFalsy();
    expect(advice.selected_advice).not.toStrictEqual(new_advice);

    adfice.set_advice_for_patient(patient_id, doctor_id, new_advice, freetexts);
})

test('update_prediction_with_user_values, update all missing data', async () => {
    let patient_id = "00000000-0000-4000-8000-100000000172";
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

    patient_id = "00000000-0000-4000-8000-100000000170";
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

    patient_id = "00000000-0000-4000-8000-100000000172";
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
    let params = [patient_id];
    let sql = `/* adfice.test.js cleanup patient_measurement */
     UPDATE patient_measurement
        SET user_GDS_score = null
          , user_grip_kg = null
          , user_walking_speed_m_per_s = null
          , user_height_cm = null
          , user_weight_kg = null
          , user_systolic_bp_mmHg = null
          , user_number_of_limitations = null
          , user_nr_falls_12m = null
          , user_nr_falls_12m = null
          , user_smoking = null
          , user_education_hml = null
          , user_fear0 = null
          , user_fear1 = null
          , user_fear2 = null
          , prediction_result = null
          , user_values_updated = null
      WHERE patient_id = ?`;
    await adfice.sql_select(sql, params);
})

test('update_prediction_with_user_values, delete some data after prediction', async () => {
    let patient_id = "00000000-0000-4000-8000-100000000172";
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

	//simulate user deleting an item
	form_data = {};
    form_data['user_GDS_score'] = null;
	await adfice.update_prediction_with_user_values(patient_id, form_data);
	measurements = await adfice.get_patient_measurements(patient_id);
    measurement = measurements[0];
	expect(measurement['prediction_result']).toBeFalsy;
	
    // clean up
    let params = [patient_id];
    let sql = `/* adfice.test.js cleanup patient_measurement */
     UPDATE patient_measurement
        SET user_GDS_score = null
          , user_grip_kg = null
          , user_walking_speed_m_per_s = null
          , user_height_cm = null
          , user_weight_kg = null
          , user_systolic_bp_mmHg = null
          , user_number_of_limitations = null
          , user_nr_falls_12m = null
          , user_nr_falls_12m = null
          , user_smoking = null
          , user_education_hml = null
          , user_fear0 = null
          , user_fear1 = null
          , user_fear2 = null
          , prediction_result = null
          , user_values_updated = null
      WHERE patient_id = ?`;
    await adfice.sql_select(sql, params);
})

test('get_advice_for_patient(27), with labs and problems', async () => {
    //console.log('27');
    let patient_id = "00000000-0000-4000-8000-100000000027";
    let patientAdvice = await adfice.get_advice_for_patient(patient_id);
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
    let patient_id = "00000000-0000-4000-8000-100000000001";
    let patientAdvice = await adfice.get_advice_for_patient(patient_id);
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
    let patient_id = "00000000-0000-4000-8000-100000000060";
    let patientAdvice = await adfice.get_advice_for_patient(patient_id);
    let advice = patientAdvice.medication_advice;
    expect(advice.length).toBe(1);
})

test('get_advice_for_patient(9), patient with non-rule med', async () => {
    //console.log('9');
    let patient_id = "00000000-0000-4000-8000-100000000009";
    let patientAdvice = await adfice.get_advice_for_patient(patient_id);
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
    let patient_id = null;
    let patientAdvice = await adfice.get_advice_for_patient(patient_id);
    let advice = patientAdvice.medication_advice;
    expect(advice.length).toBe(0);
})

test('get_advice_for_patient(-1)', async () => {
    //console.log('-1');
    let patient_id = -1;
    let patientAdvice = await adfice.get_advice_for_patient(patient_id);
    let advice = patientAdvice.medication_advice;
    expect(advice).toBe(undefined);
})

test('get_advice_for_patient(bogus)', async () => {
    let patient_id = 'bogus';
    let patientAdvice = await adfice.get_advice_for_patient(patient_id);
    let advice = patientAdvice.medication_advice;
    expect(advice).toBe(undefined);
})

test('freetext round trip', async () => {

    let viewer = "2";
    let doctor_id = "1";
    let patient = "00000000-0000-4000-8000-100000000026";
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
    await adfice.set_advice_for_patient(patient, doctor_id, cb_states, freetexts);
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
    let patient_id = "00000000-0000-4000-8000-100000000085";
    let patientAdvice = await adfice.get_advice_for_patient(patient_id);
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
    let patient_id = "00000000-0000-4000-8000-100000000044";
    let rule_number = 38;
    let isConditionTrue = await adfice.is_sql_condition_true(patient_id,
        rule_number);
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
});

test('SQL error check', async () => {
    let isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000005", "6");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000006", "6a");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000004", "6b");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000008", "9");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000005", "9");
    expect(isConditionTrue).toBe(false);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000009", "10");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000012", "12");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000015", "14");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000015", "14a");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000016", "14b");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000017", "14c");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000018", "14d");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000018", "15");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000026", "19");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000027", "19a");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000028", "19b");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000029", "19c");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000025", "21");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000026", "22");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000026", "23");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000030", "24");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000031", "25");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000034", "26");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000036", "26a");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000033", "26b");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000041", "35");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000042", "36");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000043", "37");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000044", "38");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000045", "40");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000046", "40a");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000047", "40b");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000048", "40c");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000048", "41");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000051", "48");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000055", "52");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000056", "53");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000060", "57a");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000060", "58");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000062", "59");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000078", "68");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000079", "69");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000081", "70");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000080", "70");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000085", "79");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000086", "80");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000089", "80a");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000089", "80b");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000089", "81");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000087", "81");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000084", "83");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000091", "86");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000092", "87");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000092", "89");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000093", "90");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000095", "91");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000094", "91");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.is_sql_condition_true("00000000-0000-4000-8000-100000000102", "102");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
});

test('Check preselect SQL', async () => {
    let patient_id1 = "00000000-0000-4000-8000-100000000001";
    let patient_id4 = "00000000-0000-4000-8000-100000000004";
    let patient_id8 = "00000000-0000-4000-8000-100000000008";
    let patient_id31 = "00000000-0000-4000-8000-100000000031";
    let patient_id48 = "00000000-0000-4000-8000-100000000048";
    let patient_id51 = "00000000-0000-4000-8000-100000000051";
    let patient_id79 = "00000000-0000-4000-8000-100000000079";
    let patient_id84 = "00000000-0000-4000-8000-100000000084";

    let preselectRules = await adfice.get_preselect_rules("6e");
    let sql = preselectRules[0]['sql_condition'].toString();
    let result = await (adfice.evaluate_sql(sql, patient_id4));
    expect(result).toBe(true);
    sql = "";
    result = null;
    sql = preselectRules[1]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, patient_id8));
    expect(result).toBe(false);
    sql = "";
    result = null;
    sql = preselectRules[2]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, patient_id8));
    expect(result).toBe(true);
    sql = "";
    result = null;
    sql = preselectRules[3]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, patient_id8));
    expect(result).toBe(true);
    preselectRules = null;
    sql = "";
    result = null;

    preselectRules = await adfice.get_preselect_rules("19f");
    sql = preselectRules[0]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, patient_id1));
    expect(result).toBe(true);
    preselectRules = null;
    sql = "";
    result = null;


    preselectRules = await adfice.get_preselect_rules("42a");

    sql = preselectRules[0]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, patient_id1));
    expect(result).toBe(true);
    sql = "";
    result = null;
    sql = preselectRules[1]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, patient_id1));
    expect(result).toBe(true);
    sql = "";
    result = null;
    sql = preselectRules[2]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, patient_id48));
    expect(result).toBe(true);
    result = await (adfice.evaluate_sql(sql, patient_id31));
    expect(result).toBe(true);
    sql = "";
    result = null;
    sql = preselectRules[3]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, patient_id51));
    expect(result).toBe(true);
    sql = "";
    result = null;
    sql = preselectRules[4]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, patient_id51));
    expect(result).toBe(true);
    preselectRules = null;
    sql = "";
    result = null;

    preselectRules = await adfice.get_preselect_rules("42b");
    sql = preselectRules[0]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, patient_id1));
    expect(result).toBe(true);
    sql = "";
    result = null;
    sql = preselectRules[1]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, patient_id51));
    expect(result).toBe(true);
    sql = "";
    result = null;
    sql = preselectRules[2]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, patient_id51));
    expect(result).toBe(true);
    preselectRules = null;
    sql = "";
    result = null;



    preselectRules = await adfice.get_preselect_rules("46");
    sql = preselectRules[0]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, patient_id51));
    expect(result).toBe(true);
    preselectRules = null;
    sql = "";
    result = null;

    preselectRules = await adfice.get_preselect_rules("50");
    sql = preselectRules[0]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, patient_id51));
    expect(result).toBe(true);
    preselectRules = null;
    sql = "";
    result = null;

    preselectRules = await adfice.get_preselect_rules("56");
    sql = preselectRules[1]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, patient_id51));
    expect(result).toBe(true);
    sql = "";
    result = null;
    sql = preselectRules[2]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, patient_id1));
    expect(result).toBe(true);
    preselectRules = null;
    sql = "";
    result = null;

    preselectRules = await adfice.get_preselect_rules("63");
    sql = preselectRules[0]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, patient_id51));
    expect(result).toBe(true);
    preselectRules = null;
    sql = "";
    result = null;

    preselectRules = await adfice.get_preselect_rules("78");
    sql = preselectRules[0]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, patient_id79));
    expect(result).toBe(true);
    sql = "";
    result = null;
    sql = preselectRules[1]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, patient_id84));
    expect(result).toBe(true);
    preselectRules = null;
    sql = "";
    result = null;

    preselectRules = await adfice.get_preselect_rules("88");
    sql = preselectRules[0]['sql_condition'].toString();
    result = await (adfice.evaluate_sql(sql, patient_id1));
    expect(result).toBe(true);
    preselectRules = null;
    sql = "";
    result = null;

});

test('Check preselected checkbox output', async () => {
    let output = {};

    let rules = ["88"];
    let patient = "00000000-0000-4000-8000-100000000001";
    let atc = "M03AC01";
    output = await adfice.determine_preselected_checkboxes(rules, patient, atc);
    expect(output["cb_M03AC01_88_2"]).toBe("checked");

    // Ace does not think it is possible for 2 checkboxes to be checked with
    // the current rules. In theory, it would be allowed.
    rules = ["45", "46", "48", "48a", "49"];
    patient = "00000000-0000-4000-8000-100000000051";
    atc = "C02AA02";
    output = await adfice.determine_preselected_checkboxes(rules, patient, atc);
    expect(output["cb_C02AA02_46_1"]).toBe("checked");

    rules = ["42b"];
    patient = "00000000-0000-4000-8000-100000000001";
    atc = "C03CA02"
    output = await adfice.determine_preselected_checkboxes(rules, patient, atc);
    expect(output["cb_C03CA02_42b_2"]).toBe("checked");

    // preselect-not is not actually used by any rules,
    // is tested in adfice-evaluator.test.js
});

test('Get prediction model result from DB', async () => {
    let patient = "00000000-0000-4000-8000-100000000142"

    // clear any saved result
    let measurements = await adfice.get_patient_measurements(patient);
    let measurement = measurements[0];
    let row_id = measurement.id;
    await adfice.update_prediction_result(row_id, null);

    // add prediction result to database on first fetch if not present
    let prediction = await adfice.get_prediction_result(patient);
    expect(prediction).toBe(75);

    // second fetch gets the same result, but does not update the db
    prediction = await adfice.get_prediction_result(patient);
    expect(prediction).toBe(75);
});

test('Get empty result set from measurements', async () => {
    let patient_id = "00000000-0000-4000-8000-100000000001";
    let measurements = await adfice.get_patient_measurements(patient_id);
    expect(measurements).toBe(null);
    let prediction1 = await adfice.get_prediction_result(patient_id);
    expect(prediction1).toBe(null);
});

test('Get bsn', async () => {
    let patient_id = "00000000-0000-4000-8000-100000000001";
    let bsn = await adfice.get_bsn(patient_id);
    expect(bsn).toBe('888000001');
});

test('Fail to get bsn', async () => {
    let patient_id = "BAD_ID";
    let bsn = await adfice.get_bsn(patient_id);
    expect(bsn).toBe(null);
});

test('Structure measurements', async () => {
    let patient_id = "00000000-0000-4000-8000-100000000002";
    let measurements = await adfice.get_patient_measurements(patient_id);
    let structuredMeas = adfice.structure_meas(measurements);
    expect(structuredMeas['grip_kg']).toBe(21.5);
});

test('Calculate prediction based on DB data', async () => {
    let patient_id1 = "00000000-0000-4000-8000-100000000001";
    let patient_id2 = "00000000-0000-4000-8000-100000000002";
    let measurement = await adfice.calculate_prediction_result(patient_id2);
    expect(measurement.prediction_result).toBeGreaterThan(10);
    measurement = await adfice.calculate_prediction_result(patient_id1);
    expect(measurement).toBe(null);
});

test('Calculate prediction based on user-entered data', async () => {
    let patient_id = "00000000-0000-4000-8000-100000000170";
    let measurement = await adfice.calculate_prediction_result(patient_id);
    expect(measurement.prediction_result).toBeGreaterThan(10);
});

test('Update prediction', async () => {
    let patient = "00000000-0000-4000-8000-100000000002";
    let precheck = await adfice.get_patient_measurements(patient);
    let row_id = precheck[0].id;
    await adfice.update_prediction_result(row_id, null);

    let before = await adfice.get_patient_measurements(patient);
    let after = null;
    try {
        await adfice.calculate_store_prediction_result(patient);
        after = await adfice.get_patient_measurements(patient);
    } finally {
        let row_id = before[0].id;
        await adfice.update_prediction_result(row_id, null);
        let cleanup = await adfice.get_patient_measurements(patient);
    }
    expect(before.length).toBeGreaterThan(0);
    expect(before[0].prediction_result).toBe(null);
    expect(after.length).toBeGreaterThan(0);
    expect(after[0].prediction_result).toBeGreaterThan(10);
});

test('Log fired rules', async () => {
    let patient = "00000000-0000-4000-8000-100000000165";
    let sql = 'select * from rules_fired where patient_id = ?';
    let params = [patient];
    let before = await adfice.sql_select(sql, params);

    let meds_with_rules_to_fire = {};
    meds_with_rules_to_fire['N05AH04'] = ['14', '14a', '16', '18', '105'];
    meds_with_rules_to_fire['N05CF02'] = ['6b', '6e', '7', '10', '11'];
    await adfice.logFiredRules(patient, meds_with_rules_to_fire);

    let after = await adfice.sql_select(sql, params);
    let sql_cleanup = "delete from rules_fired where patient_id = ?";
    await adfice.sql_select(sql_cleanup, params);

    expect(before.length).toBe(0);
    expect(after.length).toBe(2);
    if (after[0].ATC_code == 'N05AH04') {
        expect(after[0].rules_fired).toBe('14,14a,16,18,105');
    } else {
        expect(after[0].rules_fired).toBe('6b,6e,7,10,11');
    }

});

test('export_patient', async () => {
    let patient = "00000000-0000-4000-8000-100000000168";
    let doctor_id = '1';

    await clear_advice_for_patient(adfice, patient);
    let new_advice = {
        "cb_M03BA03_88_2": true,
        "cb_OTHER_other_1": true,
        "cb_NONMED_A_1": true
    };
    let viewer = 999;
    let freetexts = null;
    await adfice.set_advice_for_patient(patient, doctor_id, new_advice, freetexts);

    const portal_db_env_path = null;
    const read_back = true;
    const returned = await adfice.finalize_and_export(patient,
        portal_db_env_path, read_back);

    const contents = JSON.stringify(returned);

    expect(contents).toMatch(/168/);
    expect(contents).toMatch(/metho/);
    expect(contents).toMatch(/Stoppen/);
    expect(contents).toMatch(/Valpre/);
});

test('export db not available', async () => {
    let patient = "00000000-0000-4000-8000-100000000168";
    let doctor_id = '1';

    await clear_advice_for_patient(adfice, patient);
    let new_advice = {
        "cb_M03BA03_88_2": true,
        "cb_OTHER_other_1": true,
        "cb_NONMED_A_1": true
    };
    let viewer = 999;
    let freetexts = null;
    await adfice.set_advice_for_patient(patient, doctor_id, new_advice, freetexts);

    const bogus_db_contents = `# Bogus DB contents
DB_HOST=127.0.0.1
DB_PORT=54242
DB_USER=bogus
DB_NAME=bogus
DB_PASSWORD=bogus
# 1 second
DB_ACQUIRE_TIMEOUT=1000
DB_CONNECT_TIMEOUT=1000
DB_INITIALIZATION_TIMEOUT=1000
`
    const bogus_portal_db_env_path = autil.tmp_path('bogus-db-', '.env');
    await autil.to_file(bogus_portal_db_env_path, bogus_db_contents);

    const read_back = true;
    const returned = await adfice.finalize_and_export(patient,
        bogus_portal_db_env_path, read_back);
    fs.unlinkSync(bogus_portal_db_env_path, (err) => {});

    expect(returned.error).toMatch(/portal/);
});

test('Do not export patients without BSN', async () => {
    let patient = "bogus";
    let doctor_id = '1';

    await clear_advice_for_patient(adfice, patient);
    let new_advice = {
        "cb_M03BA03_88_2": true,
        "cb_OTHER_other_1": true,
        "cb_NONMED_A_1": true
    };
    let freetexts = null;
    await adfice.set_advice_for_patient(patient, doctor_id, new_advice, freetexts);

    const portal_db_env_path = null;
    const read_back = true;
    const returned = await adfice.finalize_and_export(patient,
        portal_db_env_path, read_back);

    expect(returned.error).toMatch(/BSN/);
});

test('finalize_export API', async () => {
    let patient = "00000000-0000-4000-8000-100000000068";
    await clear_advice_for_patient(adfice, patient);
    await adfice.finalize_and_export(patient);
    let patientAdvice = await adfice.get_advice_for_patient(patient);
    expect(patientAdvice.is_final).toBeTruthy();
    await clear_advice_for_patient(adfice, patient);
});

test('log events', async () => {
    let viewer = '2';
    let patient = "00000000-0000-4000-8000-100000000166";
    let sql = "SELECT COUNT(*) AS cnt FROM logged_events WHERE patient_id = ?";
    let results = await adfice.sql_select(sql, [patient]);
    let cnt = 0;
    if (results.length > 0) {
        cnt = results[0].cnt;
    }

    await adfice.add_log_event_print(viewer, patient);
    await adfice.add_log_event_copy_patient_text(viewer, patient);
    await adfice.add_log_event_copy_ehr_text(viewer, patient);
    await adfice.add_log_event_renew(viewer, patient);

    let results2 = await adfice.sql_select(sql, [patient]);
    let cnt2 = 0;
    if (results2.length > 0) {
        cnt2 = results2[0].cnt;
    }
    expect(cnt2).toBe(cnt + 4);
});

test('access log', async () => {
    let user_id = 'dr_alice';
    let patient = "00000000-0000-4000-8000-100000000166";
    let sql = "SELECT COUNT(*) AS cnt FROM access_log WHERE patient_id = ?";
    let results = await adfice.sql_select(sql, [patient]);
    let cnt = 0;
    if (results.length > 0) {
        cnt = results[0].cnt;
    }

    await adfice.add_log_event_access(user_id, patient);

    let results2 = await adfice.sql_select(sql, [patient]);
    let cnt2 = 0;
    if (results2.length > 0) {
        cnt2 = results2[0].cnt;
    }

    user_id = null;
    await adfice.add_log_event_access(user_id, patient);
    let results3 = await adfice.sql_select(sql, [patient]);
    let cnt3 = 0;
    if (results3.length > 0) {
        cnt3 = results3[0].cnt;
    }

    expect(cnt2).toBe(cnt + 1);
    expect(cnt3).toBe(cnt2 + 1);
});

test('test get patient table sql and params', async function() {
    let patient_id = "00000000-0000-4000-8000-100000000175";
    let patient = {
        ehr_pid: 'DummyFHIR-000000175',
        mrn: 'DummyMRN-000000175',
        bsn: '000-00-0000',
        birth_date: '1930-01-01'
    };
    let list_of_inserts = adfice.patientListOfInserts(patient_id, patient, 100175);
    expect(list_of_inserts.length).toBe(3);
    expect(list_of_inserts[1][0]).toContain("INSERT INTO patient");
    expect(list_of_inserts[1][0]).toContain("is_final) VALUES (?,?,?,?,0)");
    expect(list_of_inserts[1][1].length).toBe(4);
    expect(list_of_inserts[2][0]).toContain("INSERT INTO etl_bsn_patient");
    expect(list_of_inserts[2][1].length).toBe(2);
});

test('test get patient table sql and params with nulls', async function() {
    let patient_id = "00000000-0000-4000-8000-100000000175";
    let patient = {
        ehr_pid: 'DummyFHIR-000000175',
        mrn: 'DummyMRN-000000175',
        bsn: null,
        birth_date: null
    };
    let list_of_inserts = adfice.patientListOfInserts(patient_id, patient, 100175);
    expect(list_of_inserts.length).toBe(3);
    expect(list_of_inserts[1][0]).toContain("INSERT INTO patient");
    expect(list_of_inserts[1][0]).toContain("is_final) VALUES (?,?,?,?,0)");
    expect(list_of_inserts[1][1].length).toBe(4);
    expect(list_of_inserts[2][0]).toContain("INSERT INTO etl_bsn_patient");
    expect(list_of_inserts[2][1].length).toBe(2);
});

test('test get med sql and params', async function() {
    let patient_id = "00000000-0000-4000-8000-100000000175";
    let medications = [{
        ATC: 'B0GU501',
        generic_name: 'testdrug',
        display_name: 'Test Drug',
        start_date: '2021-01-01',
        dose_text: 'My instructions'
    }];
    let list_of_inserts = adfice.medListOfInserts(patient_id, medications)
    expect(list_of_inserts.length).toBe(1);
    // SQL should be: 'INSERT INTO patient_medication (patient_id, date_retrieved, medication_name, generic_name, ATC_code, start_date, dose) VALUES (?,?,?,?,?,?,?)'
    expect(list_of_inserts[0][0]).toContain('INSERT INTO patient_medication');
    expect(list_of_inserts[0][1].length).toBe(7);
    expect(list_of_inserts[0][1][2]).toBe('Test Drug');
    expect(list_of_inserts[0][1][5]).toBe('2021-01-01');
});

test('test get med sql and params with some nulls', async function() {
    let patient_id = "00000000-0000-4000-8000-100000000175";
    let medications = [{
        ATC: 'B0GU501',
        display_name: 'Test Drug'
    }];
    let list_of_inserts = adfice.medListOfInserts(patient_id, medications)
    // SQL should be: 'INSERT INTO patient_medication (patient_id, date_retrieved, medication_name, ATC_code) VALUES (?,?,?,?)'
    // Note that this changes depending on whether the medication data is complete.
    expect(list_of_inserts[0][0]).toContain('INSERT INTO patient_medication');
    expect(list_of_inserts[0][1].length).toBe(4);
    expect(list_of_inserts[0][1][2]).toBe('Test Drug');

    medications = [{
        generic_name: 'testdrug',
        start_date: '2021-01-01',
        dose_text: 'My instructions'
    }];
    list_of_inserts = adfice.medListOfInserts(patient_id, medications);
    // SQL should be: 'INSERT INTO patient_medication (patient_id, date_retrieved, generic_name, start_date, dose) VALUES (?,?,?,?,?)'
    expect(list_of_inserts[0][0]).toContain('INSERT INTO patient_medication');
    expect(list_of_inserts[0][1].length).toBe(5);
    expect(list_of_inserts[0][1][2]).toBe('testdrug');
    expect(list_of_inserts[0][1][3]).toBe('2021-01-01');

    medications = [{}];
    list_of_inserts = adfice.medListOfInserts(patient_id, medications);
    expect(list_of_inserts.length).toBe(0);
});


test('test removal of empty entries', async function() {
    let patient_id = "00000000-0000-4000-8000-100000000175";
    let medications = [{
        ATC: 'B0GU501',
        generic_name: null,
        display_name: 'Test Drug',
        start_date: null,
        dose_text: null
    }];
    let list_of_inserts = adfice.medListOfInserts(patient_id, medications)
    expect(list_of_inserts.length).toBe(1);
    // SQL should be: 'INSERT INTO patient_medication (patient_id, date_retrieved, medication_name, ATC_code) VALUES (?,?,?,?)'
    expect(list_of_inserts[0][0]).toContain('INSERT INTO patient_medication');
    expect(list_of_inserts[0][1].length).toBe(4);
    expect(list_of_inserts[0][1][3]).toBe('B0GU501');
});

test('test get problem sql and params', async function() {
    let patient_id = "00000000-0000-4000-8000-100000000175";
    let found_problems = [{
            name: 'diabetes',
            icd_10: 'E11.9',
            ehr_text: 'Diabetes mellitus (CMS/HCC)',
            start_date: '2012-11-29',
        },
        {
            name: 'angststoornis',
            icd_10: 'F41.2',
            ehr_text: 'Gemengde angststoornis en depressieve stoornis',
            start_date: '2021-06-01',
        }
    ];
    let list_of_inserts = adfice.probListOfInserts(patient_id, found_problems);
    expect(list_of_inserts.length).toBe(2);
    // SQL should be: 'INSERT INTO patient_problem (patient_id, date_retrieved, name, icd_10, ehr_text, start_date) VALUES (?,?,?,?,?,?)'
    expect(list_of_inserts[0][0]).toContain('INSERT INTO patient_problem');
    expect(list_of_inserts[0][1].length).toBe(6);
    expect(list_of_inserts[0][1][5]).toBe('2012-11-29');

    found_problems = [{
            name: 'arrhythmia',
            icd_10: 'I49.1',
            ehr_text: '',
            start_date: null
        },
        {
            name: 'angststoornis',
            icd_10: 'F41.2',
            ehr_text: 'Gemengde angststoornis en depressieve stoornis',
            start_date: '2021-06-01'
        }
    ];
    list_of_inserts = adfice.probListOfInserts(patient_id, found_problems);
    expect(list_of_inserts.length).toBe(2);
    //SQL should be: 'INSERT INTO patient_problem (patient_id, date_retrieved, name, icd_10) VALUES (?,?,?,?)'
    expect(list_of_inserts[0][0]).toContain('INSERT INTO patient_problem');
    expect(list_of_inserts[0][1].length).toBe(4);
    expect(list_of_inserts[0][1][2]).toBe('arrhythmia');
});

test('test get lab sql and params', async function() {
    let patient_id = "00000000-0000-4000-8000-100000000175";
    let found_labs = [{
            name: 'eGFR',
            date_measured: '2021-01-01 15:20:48',
            lab_test_code: '33914-3',
            lab_test_result: '> 60',
            lab_test_units: 'ml/min/1.73m2'
        },
        {
            name: 'kalium',
            date_measured: '2021-05-05 10:20:48',
            lab_test_code: '2823-3',
            lab_test_result: '4',
            lab_test_units: 'mmol/L'
        }
    ];
    let list_of_inserts = adfice.labListOfInserts(patient_id, found_labs);
    expect(list_of_inserts.length).toBe(2);
    //SQL should be: 'INSERT INTO patient_lab (patient_id, date_retrieved, date_measured, lab_test_name, lab_test_code, lab_test_result, lab_test_units) VALUES (?,?,?,?,?,?,?)'
    expect(list_of_inserts[0][0]).toContain('INSERT INTO patient_lab');
    expect(list_of_inserts[0][1].length).toBe(7);
    expect(list_of_inserts[0][1][3]).toBe('eGFR');
});

test('test measListOfInserts', async function() {
    let patient_id = "00000000-0000-4000-8000-100000000175";
    let found_meas = {
        systolic_bp_mmHg: 120,
        bp_date_measured: '2012-11-29 22:47',
        height_cm: 130,
        height_date_measured: '2020-01-27 21:06',
        weight_kg: 32,
        weight_date_measured: '2020-01-27 21:06',
        smoking: 0,
        smoking_date_measured: '2021-08-05 05:00',
    };
    //TODO add the rest of the measurements
    let measListOfInserts = adfice.measListOfInserts(patient_id, found_meas);

    found_meas = {
        systolic_bp_mmHg: null,
        bp_date_measured: null,
        height_cm: 130,
        height_date_measured: '2020-01-27 21:06',
        weight_kg: 32,
        weight_date_measured: '2020-01-27 21:06',
        smoking: 0,
        smoking_date_measured: '2021-08-05 05:00',
    };
    let measListOfInserts2 = adfice.measListOfInserts(patient_id, found_meas);

    found_meas = {
        systolic_bp_mmHg: 120,
        bp_date_measured: null,
        height_cm: 130,
        height_date_measured: '2020-01-27 21:06',
        weight_kg: 32,
        weight_date_measured: '2020-01-27 21:06',
        smoking: 0,
        smoking_date_measured: '2021-08-05 05:00',
    };
    let measListOfInserts3 = adfice.measListOfInserts(patient_id, found_meas);

    expect(measListOfInserts[0][1][2]).toBe(120);
    expect(measListOfInserts2[0][1][2]).toBe(null);
    expect(measListOfInserts3[0][1][3]).toBe(null);
});

test('test writePatientFromJSON', async function() {
    let fake_pid = Math.random().toString().substr(2, 10);
    let fake_mrn = 'mrn' + fake_pid;
	let fake_refresh = 'bogus_token';
    let fake_bsn =
        fake_pid.substr(0, 2) + '-' +
        fake_pid.substr(3, 4) + '-' +
        fake_pid.substr(5, 7);
    let fake_participant = 'study' + fake_pid.substr(5, 10);

    let patient = {
        ehr_pid: fake_pid,
        mrn: fake_mrn,
		refresh_token: fake_refresh,
        bsn: fake_bsn,
        birth_date: '1930-01-01'
    };
    patient.medications = [{
        ATC: 'B0GU501',
        generic_name: 'testdrug',
        display_name: 'Test Drug',
        start_date: '2021-01-01',
        dose_text: 'My instructions'
    }];
    patient.problems = [{
            name: 'diabetes',
            icd_10: 'E11.9',
            ehr_text: 'Diabetes mellitus (CMS/HCC)',
            start_date: '2012-11-29'
        },
        {
            name: 'angststoornis',
            icd_10: 'F41.2',
            ehr_text: 'Gemengde angststoornis en depressieve stoornis',
            start_date: '2021-06-01'
        }
    ];
    patient.labs = [{
            name: 'eGFR',
            date_measured: '2021-01-01 15:20:48',
            lab_test_code: '33914-3',
            lab_test_result: '> 60',
            lab_test_units: 'ml/min/1.73m2'
        },
        {
            name: 'kalium',
            date_measured: '2021-05-05 10:20:48',
            lab_test_code: '2823-3',
            lab_test_result: '4',
            lab_test_units: 'mmol/L'
        }
    ];
    patient.measurements = {
        systolic_bp_mmHg: 120,
        bp_date_measured: '2012-11-29 22:47',
        height_cm: 130,
        height_date_measured: '2020-01-27 21:06',
        weight_kg: 32,
        weight_date_measured: '2020-01-27 21:06',
        smoking: 0,
        smoking_date_measured: '2021-08-05 05:00'
    };
    //TODO add the rest of the measurements
    let patient_id = await adfice.write_patient_from_json(patient, fake_participant);
    let retrieved_patient = await adfice.get_patient_by_id(patient_id);
    let retrieved_meds = await adfice.get_meds(patient_id);
    let retrieved_probs = await adfice.get_problems(patient_id);
    let retrieved_labs = await adfice.get_labs(patient_id);
    let retrieved_meas = await adfice.get_patient_measurements(patient_id);

    expect(retrieved_patient['birth_date'].toString().includes('1930')).toBe(true);
    // oddly, when you console.log the date object you get 1929-12-31T23:40:28.000Z . I'm sure there's a reason.
    expect(retrieved_patient['participant_number']).toBe('study' + fake_pid.substr(5, 10));
    expect(retrieved_meds.length).toBe(1);
    expect(retrieved_meds[0]['ATC_code']).toBe('B0GU501');
    expect(retrieved_probs.length).toBe(2);
    expect(retrieved_probs[1]['display_name']).toBe('Angststoornis');
    expect(retrieved_labs.length).toBe(2);
    expect(retrieved_labs[1]['lab_test_result']).toBe('4');
    expect(retrieved_meas[0]['user_education_hml']).toBe(null);
    expect(retrieved_meas[0]['systolic_bp_mmHg']).toBe(120);
    expect(retrieved_meas[0]['smoking']).toBe(0);
});

test('test renew_patient', async function() {
    // create a patient to renew
    let fake_pid = Math.random().toString().substr(2, 10);
    let fake_mrn = 'mrn' + fake_pid;
	let fake_refresh = 'bogus_token';
    let fake_bsn =
        fake_pid.substr(0, 2) + '-' +
        fake_pid.substr(3, 4) + '-' +
        fake_pid.substr(5, 7);
    let fake_participant = fake_pid.substr(5, 10);

    let patient = {
        ehr_pid: fake_pid,
        mrn: fake_mrn,
		refresh_token: fake_refresh,
        bsn: fake_bsn,
        birth_date: '1930-01-01'
    };
    patient.medications = [{
        ATC: 'B0GU501',
        generic_name: 'testdrug',
        display_name: 'Test Drug',
        start_date: '2021-01-01',
        dose_text: 'My instructions'
    }];
    patient.problems = [{
            name: 'diabetes',
            icd_10: 'E11.9',
            ehr_text: 'Diabetes mellitus (CMS/HCC)',
            start_date: '2012-11-29'
        },
        {
            name: 'angststoornis',
            icd_10: 'F41.2',
            ehr_text: 'Gemengde angststoornis en depressieve stoornis',
            start_date: '2021-06-01'
        }
    ];
    patient.labs = [{
            name: 'eGFR',
            date_measured: '2021-01-01 15:20:48',
            lab_test_code: '33914-3',
            lab_test_result: '> 60',
            lab_test_units: 'ml/min/1.73m2'
        },
        {
            name: 'kalium',
            date_measured: '2021-05-05 10:20:48',
            lab_test_code: '2823-3',
            lab_test_result: '4',
            lab_test_units: 'mmol/L'
        }
    ];
    patient.measurements = {
        systolic_bp_mmHg: 120,
        bp_date_measured: '2012-11-29 22:47',
        height_cm: 130,
        height_date_measured: '2020-01-27 21:06',
        weight_kg: 32,
        weight_date_measured: '2020-01-27 21:06',
        smoking: 0,
        smoking_date_measured: '2021-08-05 05:00'
    };
    //TODO add the rest of the measurements

    //create data to renew them with
    let etl_patient = {
        ehr_pid: fake_pid,
        mrn: fake_mrn,
		refresh_token: fake_refresh,
        bsn: fake_bsn,
        birth_date: '1931-01-01'
    };
    etl_patient.medications = [{
        ATC: 'B0GU502',
        generic_name: 'bogusdrug',
        display_name: 'Bogus1 Drug',
        start_date: '2022-01-01',
        dose_text: 'Do not take this medication'
    }];
    etl_patient.problems = [{
        name: 'myocardinfarct',
        icd_10: 'I21.0',
        ehr_text: 'Acuut transmuraal myocardinfarct van voorwand',
        start_date: '2020-03-20'
    }];
    etl_patient.labs = [{
            name: 'eGFR',
            date_measured: '2021-01-01 15:20:48',
            lab_test_code: '33914-3',
            lab_test_result: '> 60',
            lab_test_units: 'ml/min/1.73m2'
        },
        {
            name: 'kalium',
            date_measured: '2021-05-05 10:20:48',
            lab_test_code: '2823-3',
            lab_test_result: '4',
            lab_test_units: 'mmol/L'
        },
        {
            name: 'calcium',
            date_measured: '2021-05-05 10:20:48',
            lab_test_code: 'xxx',
            lab_test_result: '3.0',
            lab_test_units: 'mmol/L'
        }
    ];
    etl_patient.measurements = {
        systolic_bp_mmHg: 120,
        bp_date_measured: '2021-11-29 22:47',
        height_cm: 130,
        height_date_measured: '2022-01-27 21:06',
        weight_kg: 32,
        weight_date_measured: '2022-01-27 21:06',
        smoking: 1,
        smoking_date_measured: '2022-05-05 05:00'
    };

    let patient_id = await adfice.write_patient_from_json(patient, fake_participant);
    let patient_id2 = await adfice.renew_patient(patient_id, etl_patient);
    let retrieved_patient = await adfice.get_patient_by_id(patient_id2);
    let retrieved_meds = await adfice.get_meds(patient_id2);
    let retrieved_probs = await adfice.get_problems(patient_id2);
    let retrieved_labs = await adfice.get_labs(patient_id2);
    let retrieved_meas = await adfice.get_patient_measurements(patient_id2);

    expect(retrieved_patient['birth_date'].toString().includes('1931')).toBe(true);
    // oddly, when you console.log the date object you get 1929-12-31T23:40:28.000Z . I'm sure there's a reason.
    expect(retrieved_meds.length).toBe(1);
    expect(retrieved_meds[0]['ATC_code']).toBe('B0GU502');
    expect(retrieved_probs.length).toBe(1);
    expect(retrieved_probs[0]['display_name']).toBe('Myocardinfarct');
    expect(retrieved_labs.length).toBe(3);
    expect(retrieved_labs[1]['lab_test_result']).toBe('4');
    expect(retrieved_labs[2]['lab_test_result']).toBe('3.0');
    expect(retrieved_meas[0]['user_education_hml']).toBe(null);
    expect(retrieved_meas[0]['systolic_bp_mmHg']).toBe(120);
    expect(retrieved_meas[0]['smoking']).toBe(1);
});
