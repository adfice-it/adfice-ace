// vim: set sts=4 expandtab :
const adfice = require('./adfice')
const util = require("util");

test('test advice text 6e', async () => {
    var rule_numbers = ["6e"];
    var texts = await adfice.getAdviceTextsCheckboxes(rule_numbers);
    expect(texts.length).toBe(11);
    expect(texts[9].cdss).toBe('Continueren');
    expect(texts[9].epic).toBe('Continueren');
    expect(texts[9].patient).toBe('Gebruik dit medicijn zoals u tot nu toe doet.');

    texts = await adfice.getAdviceTextsNoCheckboxes(rule_numbers);
    expect(texts.length).toBe(1);
    expect(texts[0].cdss).toContain('angststoornis');
})

test('getAdviceForPatient(68)', async () => {
    let patientNumber = 68;
    let advice = await adfice.getAdviceForPatient(patientNumber);
    expect(advice.length).toBe(2);
    let adv0 = advice[0];
    expect(adv0['ATC_code']).toBe('C03AA03');
    expect(adv0['medication_name']).toBe('hydrochlorothiazide');

    let adviceTextsCheckboxes = adv0['adviceTextsCheckboxes'];
    expect(adviceTextsCheckboxes.length).toBe(9);
    let checkbox0 = adviceTextsCheckboxes[0];
    expect(checkbox0['medication_criteria_id']).toBe("35");
    expect(checkbox0['selectBoxNum']).toBe(1);
    expect(checkbox0['selectBoxCategory']).toBe('switch');

    let adviceTextsNoCheckboxes = adv0['adviceTextsNoCheckboxes'];
    expect(adviceTextsNoCheckboxes.length).toBe(10);
    let noCheckbox0 = adviceTextsNoCheckboxes[0];
    expect(noCheckbox0['medication_criteria_id']).toBe("35");
    expect(noCheckbox0['cdss']).toContain("ACE");
    expect(noCheckbox0['cdss']).toContain("AT2-");
})
