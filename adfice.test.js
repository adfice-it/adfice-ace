// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const adfice = require('./adfice')
const util = require("util");

test('test advice text 6e', async () => {
    var rule_numbers = ["6e"];
    var texts = await adfice.getAdviceTextsCheckboxes(rule_numbers);
    expect(texts.length).toBe(11);
    expect(texts[0].selectBoxCategory).toBe('stop');
    expect(texts[1].selectBoxCategory).toBe('taper-stop');
    expect(texts[2].selectBoxCategory).toBe('taper-reduce');
    expect(texts[10].selectBoxCategory).toBe('free_text');

    expect(texts[5].cdss_split[0].text).toBe('Continueren');
    expect(texts[5].epic_split[0].text).toBe('Continueren');
    let str = 'Gebruik dit medicijn zoals u tot nu toe al deed.';
    expect(texts[5].patient_split[0].text).toBe(str);

    texts = await adfice.getAdviceTextsNoCheckboxes(rule_numbers);
    expect(texts.length).toBe(1);
    expect(texts[0].cdss_split[0].text).toContain('angststoornis');
})

test('boxStatesToSelectionStates', () => {
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
    let out = adfice.boxStatesToSelectionStates(patient_id, viewer, box_states);
    expect(out).toStrictEqual(expected);
});

test('selectionStatesToBoxStates', () => {
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

    let out = adfice.selectionStatesToBoxStates(selection_states);

    expect(out).toStrictEqual(expected);
});

test('getAdviceForPatient(68), no labs, no problems', async () => {
    let patientNumber = 68;
    let patientAdvice = await adfice.getAdviceForPatient(patientNumber);
    let advice = patientAdvice.medication_advice;
    expect(advice.length).toBe(2);
    let adv0 = advice[0];
    expect(adv0['ATC_code']).toBe('C03AA03');
    expect(adv0['medication_name']).toBe('hydrochlorothiazide');

    let adviceTextsCheckboxes = adv0['adviceTextsCheckboxes'];
    expect(adviceTextsCheckboxes.length).toBe(8);
    let checkbox0 = adviceTextsCheckboxes[0];
    expect(checkbox0['medication_criteria_id']).toBe("42");
    expect(checkbox0['selectBoxNum']).toBe(7);
    expect(checkbox0['selectBoxCategory']).toBe('stop');

    let checkbox1 = adviceTextsCheckboxes[1];
    expect(checkbox1['cdss_split'][0].text).toContain('Afbouwen waarna stoppen');
    expect(checkbox1['cdss_split'].length).toBe(2);

    let adviceTextsNoCheckboxes = adv0['adviceTextsNoCheckboxes'];
    expect(adviceTextsNoCheckboxes.length).toBe(3);
    let noCheckbox0 = adviceTextsNoCheckboxes[0];
    expect(noCheckbox0['medication_criteria_id']).toBe("41");
    expect(noCheckbox0['cdss_split'][0].text).toContain("ACE");
    expect(noCheckbox0['cdss_split'][0].text).toContain("antagonisten");

});

test('setAdviceForPatient(68)', async () => {
    let patientNumber = 68;
    let viewer = 999;
    let advice = await adfice.getAdviceForPatient(patientNumber);

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

    adfice.setSelectionsForPatient(patientNumber, viewer, old_advice);

    advice = await adfice.getAdviceForPatient(patientNumber);
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
    adfice.setSelectionsForPatient(patientNumber, viewer, new_advice);

    advice = await adfice.getAdviceForPatient(patientNumber);
    expect(advice.selected_advice).toStrictEqual(new_advice);
})

test('getAdviceForPatient(27), with labs and problems', async () => {
    let patientNumber = 27;
    let patientAdvice = await adfice.getAdviceForPatient(patientNumber);
    let advice = patientAdvice.medication_advice;
    expect(advice.length).toBe(1);
    let adv0 = advice[0];
    expect(adv0['ATC_code']).toBe('N06AA09');
    expect(adv0['medication_name']).toBe('amitriptyline');

    let adviceTextsCheckboxes = adv0['adviceTextsCheckboxes'];
    expect(adviceTextsCheckboxes.length).toBe(15);
    let checkbox0 = adviceTextsCheckboxes[0];
    expect(checkbox0['medication_criteria_id']).toBe("19f");
    expect(checkbox0['selectBoxNum']).toBe(11);
    expect(checkbox0['selectBoxCategory']).toBe('stop');

    let adviceTextsNoCheckboxes = adv0['adviceTextsNoCheckboxes'];
    expect(adviceTextsNoCheckboxes.length).toBe(5);
    let noCheckbox0 = adviceTextsNoCheckboxes[0];
    expect(noCheckbox0['medication_criteria_id']).toBe("19a");
    expect(noCheckbox0.cdss_split[0].text).toContain("TCA");
    expect(noCheckbox0.cdss_split[0].text).toContain("SSRI");
})

test('getAdviceForPatient(60), sparse patient', async () => {
    let patientNumber = 60;
    let patientAdvice = await adfice.getAdviceForPatient(patientNumber);
    let advice = patientAdvice.medication_advice;
    expect(advice.length).toBe(1);
})

test('getAdviceForPatient(9), patient with non-rule med', async () => {
    let patientNumber = 9;
    let patientAdvice = await adfice.getAdviceForPatient(patientNumber);
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

test('getAdviceForPatient(null)', async () => {
    let patientNumber = null;
    let patientAdvice = await adfice.getAdviceForPatient(patientNumber);
    let advice = patientAdvice.medication_advice;
    expect(advice.length).toBe(0);
})

test('getAdviceForPatient(-1)', async () => {
    let patientNumber = -1;
    let patientAdvice = await adfice.getAdviceForPatient(patientNumber);
    let advice = patientAdvice.medication_advice;
    expect(advice.length).toBe(0);
})

test('getAdviceForPatient(bogus)', async () => {
    let patientNumber = 'bogus';
    let patientAdvice = await adfice.getAdviceForPatient(patientNumber);
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

    await adfice.setFreetextsForPatient(patient, viewer, freetexts);
    let actual = await adfice.getFreetextsForPatient(patient);

    expect(actual).toStrictEqual(freetexts);
})

test('no rules fired', async () => {
    expect(await adfice.getAdviceTextsCheckboxes(null)).toStrictEqual([]);
    expect(await adfice.getAdviceTextsNoCheckboxes(null)).toStrictEqual([]);
    expect(await adfice.getReferenceNumbers(null)).toStrictEqual([]);

    expect(await adfice.getAdviceTextsCheckboxes([])).toStrictEqual([]);
    expect(await adfice.getAdviceTextsNoCheckboxes([])).toStrictEqual([]);
    expect(await adfice.getReferenceNumbers([])).toStrictEqual([]);
});

test('getAdviceForPatient(85), normal eGFR', async () => {
    let patientNumber = 85;
    let patientAdvice = await adfice.getAdviceForPatient(patientNumber);
    let advice = patientAdvice.medication_advice;
    //TODO check for malformed patient data. In this case labTests was not being constructed correctly. Or just replace the criteria with SQL and test that insstead.

});

test('getSQLcondition rule 38', async () => {
    let ruleNumber = 38;
    let sqlCondition = await adfice.getSQLCondition(ruleNumber);
    expect(sqlCondition).toContain("patient_problems");
});

test('isSQLConditionTrue', async () => {
    let patientIdentifier = 44;
    let ruleNumber = 38;
    let isConditionTrue = await adfice.isSQLConditionTrue(patientIdentifier, ruleNumber);
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
});

test('SQL error check', async () => {
    let isConditionTrue = await adfice.isSQLConditionTrue(5, "6");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(6, "6a");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(4, "6b");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(8, "9");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(9, "10");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(12,"12");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(15, "14");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(15,"14a");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(16, "14b");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(17, "14c");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(18, "14d");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(18, "15");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(26, "19");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(27, "19a");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(28, "19b");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(29, "19c");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(25, "21");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(26, "22");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(26, "23");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(30,"24");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(31,"25");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(34, "26");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(36,"26a");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(33, "26b");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(41, "35");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(42,"36");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(43,"37");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(44, "38");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(45,"40");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(46,"40a");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(47,"40b");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(48,"40c");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(48, "41");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(51, "48");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(55,"52");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(56,"53");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(60, "57a");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(60,"58");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(62, "59");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(78,"68");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(79,"69");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(81, "70");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(80,"71");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(85,"79");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(86,"80");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(89, "80a");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(89, "80b");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(89, "81");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(87,"82");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(84, "83");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(91,"86");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(92,"87");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(92,"89");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(93,"90");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(95, "91");
    expect(isConditionTrue).toBe(true);
    isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(94,"92");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
    isConditionTrue = await adfice.isSQLConditionTrue(102,"102");
    expect(isConditionTrue).toBe(true); isConditionTrue = false;
});
