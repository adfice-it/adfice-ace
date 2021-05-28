// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const adfice = require('./adfice')
const ae = require('./adficeEvaluator');

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
    result = ae.doesRuleFire(medicationStartDate, drugString, drugList,
        problemString, problemList, ageString, patientAge, labString, labTests);
    expect(result).toBe(true);

    labString = "!lab.eGFR.value <= 30 & lab.eGFR.date > now-11-months";
    result = ae.doesRuleFire(medicationStartDate, drugString, drugList,
        problemString, problemList, ageString, patientAge, labString, labTests);
    expect(result).toBe(true);
    labString = null;

    ageString = "<80";
    result = ae.doesRuleFire(medicationStartDate, drugString, drugList,
        problemString, problemList, ageString, patientAge, labString, labTests);
    expect(result).toBe(true);
    ageString = null;

    problemString = "angststoornis";
    result = ae.doesRuleFire(medicationStartDate, drugString, drugList,
        problemString, problemList, ageString, patientAge, labString, labTests);
    expect(result).toBe(true);
    problemString = null;

    drugString = drugString = "C09A,!C09B";
    result = ae.doesRuleFire(medicationStartDate, drugString, drugList,
        problemString, problemList, ageString, patientAge, labString, labTests);
    expect(result).toBe(true);
    drugString = null;

    // this criteria fails to be met
    ageString = ">80";
    result = ae.doesRuleFire(medicationStartDate, drugString, drugList,
        problemString, problemList, ageString, patientAge, labString, labTests);
    expect(result).toBe(false);
    ageString = null;

})
