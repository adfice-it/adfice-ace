const adfice = require('./adfice')
const as = require('./adficeSelector');

test('full selector acceptance for patient 68', async () => {
    var expected = {
        C09AA02: [
            ['45', '48', '63', '63a', '63b']
        ],
        C03AA03: [
            [
                '35', '40', '40a',
                '40b', '40c', '41',
                '42', '43', '44',
                '45', '48'
            ]
        ]
    };
    var result = await adfice.getRulesForPatient(68);
    expect(result).toEqual(expected);
})

function monthsAgo(months) {
    var targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() - months);
    return targetDate;
}

test('one condition in rule', () => {
    // started a medication some months ago
    let medication = "C09AA01";
    let medicationStartDate = monthsAgo(2);

    let patientAge = 76;

    let labTests = {};
    // fresh lab results from this morning
    let natrium = {};
    natrium["lab_test_result"] = 140;
    natrium["date_measured"] = new Date();
    labTests['natrium'] = natrium;
    let kalium = {};
    kalium["lab_test_result"] = 3.5;
    kalium["date_measured"] = new Date();
    labTests['kalium'] = kalium;
    let calcium = {};
    calcium["lab_test_result"] = 2.6;
    calcium["date_measured"] = new Date();
    labTests['calcium'] = calcium;
    let eGFR = {};
    eGFR["lab_test_result"] = 60;
    eGFR["date_measured"] = new Date();
    labTests['eGFR'] = eGFR;

    let drugList = ["J02AB02", "C09AA01", "C07AA01"];
    let problemList = ["epilepsy", "angststoornis", "diabetes"];

    let drugString = null;
    let problemString = null;
    let ageString = null;
    let labString = null;
    let result = null;

    // all criteria strings are null:
    result = as.doesRuleFire(medicationStartDate, drugString, drugList,
        problemString, problemList, ageString, patientAge, labString, labTests);
    expect(result).toBe(true);

    labString = "!lab.eGFR.value <= 30 & lab.eGFR.date > now-11-months";
    result = as.doesRuleFire(medicationStartDate, drugString, drugList,
        problemString, problemList, ageString, patientAge, labString, labTests);
    expect(result).toBe(true);
    labString = null;

    ageString = "<80";
    result = as.doesRuleFire(medicationStartDate, drugString, drugList,
        problemString, problemList, ageString, patientAge, labString, labTests);
    expect(result).toBe(true);
    ageString = null;

    problemString = "angststoornis";
    result = as.doesRuleFire(medicationStartDate, drugString, drugList,
        problemString, problemList, ageString, patientAge, labString, labTests);
    expect(result).toBe(true);
    problemString = null;

    drugString = drugString = "C09A,!C09B";
    result = as.doesRuleFire(medicationStartDate, drugString, drugList,
        problemString, problemList, ageString, patientAge, labString, labTests);
    expect(result).toBe(true);
    drugString = null;

    // this criteria fails to be met
    ageString = ">80";
    result = as.doesRuleFire(medicationStartDate, drugString, drugList,
        problemString, problemList, ageString, patientAge, labString, labTests);
    expect(result).toBe(false);
    ageString = null;

})
// vim: set sts=4 expandtab :
