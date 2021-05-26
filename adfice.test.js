// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 expandtab :
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

    expect(texts[5].cdss).toBe('Continueren');
    expect(texts[5].epic).toBe('Continueren');
    expect(texts[5].patient).toBe('Gebruik dit medicijn zoals u tot nu toe doet.');

    texts = await adfice.getAdviceTextsNoCheckboxes(rule_numbers);
    expect(texts.length).toBe(1);
    expect(texts[0].cdss).toContain('angststoornis');
})

test('getAdviceForPatient(68), no labs, no problems', async () => {
    let patientNumber = 68;
    let patientAdvice = await adfice.getAdviceForPatient(patientNumber);
    let advice = patientAdvice.medication_advice;
    expect(advice.length).toBe(2);
    let adv0 = advice[0];
    expect(adv0['ATC_code']).toBe('C03AA03');
    expect(adv0['medication_name']).toBe('hydrochlorothiazide');

    let adviceTextsCheckboxes = adv0['adviceTextsCheckboxes'];
    expect(adviceTextsCheckboxes.length).toBe(6);
    let checkbox0 = adviceTextsCheckboxes[0];
    expect(checkbox0['medication_criteria_id']).toBe("42");
    expect(checkbox0['selectBoxNum']).toBe(2);
    expect(checkbox0['selectBoxCategory']).toBe('taper-stop');

    let adviceTextsNoCheckboxes = adv0['adviceTextsNoCheckboxes'];
    expect(adviceTextsNoCheckboxes.length).toBe(4);
    let noCheckbox0 = adviceTextsNoCheckboxes[0];
    expect(noCheckbox0['medication_criteria_id']).toBe("41");
    expect(noCheckbox0['cdss']).toContain("ACE");
    expect(noCheckbox0['cdss']).toContain("antagonisten");
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
    expect(adviceTextsCheckboxes.length).toBe(14);
    let checkbox0 = adviceTextsCheckboxes[0];
    expect(checkbox0['medication_criteria_id']).toBe("19f");
    expect(checkbox0['selectBoxNum']).toBe(1);
    expect(checkbox0['selectBoxCategory']).toBe('taper-stop');

    let adviceTextsNoCheckboxes = adv0['adviceTextsNoCheckboxes'];
    expect(adviceTextsNoCheckboxes.length).toBe(5);
    let noCheckbox0 = adviceTextsNoCheckboxes[0];
    expect(noCheckbox0['medication_criteria_id']).toBe("19a");
    expect(noCheckbox0['cdss']).toContain("TCA");
    expect(noCheckbox0['cdss']).toContain("SSRI");
})

test('getAdviceForPatient(60), sparse patient', async () => {
    let patientNumber = 60;
    let patientAdvice = await adfice.getAdviceForPatient(patientNumber);
    let advice = patientAdvice.medication_advice;
    expect(advice.length).toBe(1);
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
