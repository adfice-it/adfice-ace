// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 expandtab :
"use strict";

const util = require("util");
const autil = require('./adficeUtil')

/*
Lab criteria can:
* check if a value is present (!lab.xxx.value means it is missing)
* check if the date of the value is within a certain time frame
* check if the value is >, <, >= or <= aa threshhold
* a combination of the above (right now they are only combined with &,
  although an | is possible)

-- an exhaustive list of all criteria currently in the database:
!lab.natrium.value
lab.natrium.date >= now-11-months
lab.natrium.value < 135
lab.kalium.value < 3.0
lab.natrium.value < 130
lab.calcium.value > 2.65
lab.eGFR.value > 30 & lab.eGFR.date > now-11-months
lab.eGFR.value <= 30 & lab.eGFR.date > now-11-months
!lab.eGFR
lab.eGFR.date > now-11-months
lab.eGFR.value > 30
!lab.eGFR.value <= 30 & lab.eGFR.date > now-11-months

A patient can have any number of lab values. It is probably a good idea to
pass this is as key-values:
key: test_name
value:
	key: test_result
	key: date_measured
*/

/*
Evaluates whether the patient meets the criteria.
Returns true if the patient does meet the criteria, false if they don't.
If drugString is null, returns null. Should probably throw an error.
drugList should be an array,
drugString should be a string,
selectorStartDate should be a Date object
*/
function evaluateLabCriteria(labTests, labString) {
    // TODO what if labstrings is null or empty?
    let labStrings = labString.split("&");
    let result = true;
    for (let i = 0; result && i < labStrings.length; ++i) {
        let labStr = labStrings[i].trim();
        result = result && evaluateACriterion(labTests, labStr);
    }
    return result;
}

function evaluateACriterion(labTests, labString) {
    // check for !lab.xxx.value <= 30
    var regExp = /!lab\.[a-zA-Z]+\.value\s*[<>=]+\s*[0-9]/;
    if (regExp.exec(labString) != null) {
        let result = checkLabTestResult(labTests, labString);
        return result;
    }

    // figure out what kind of criterion we have
    // check for !lab.xxx.value
    regExp = /!lab\.[a-zA-Z]+\.value/;
    if (regExp.exec(labString) != null) {
        let result = checkIfLabTestNotExists(labTests, labString);
        return result;
    } else {
        // check for lab.xxx.value. Needs to be in an else because it will
        // also match !lab.xxx.value
        regExp = /lab\.[a-zA-Z]+\.value/;
        if (regExp.exec(labString) != null) {
            let result = checkLabTestResult(labTests, labString);
            return result;
        }
    }
    // check for lab.xxx.date xxx
    regExp = /lab\.[a-zA-Z]+\.date/;
    autil.assert((regExp.exec(labString) != null),
        "Unrecognized criteria string: '" + labString);
    let result = checkDateOfLabTest(labTests, labString);
    return result;
}

function checkIfLabTestNotExists(labTests, labString) {
    var regExp = /!lab\.([a-zA-Z]+)\.value/;
    var regExpResult = regExp.exec(labString);
    // if the named test isn't in the map, it will return undefined
    if (typeof labTests[regExpResult[1]] == 'undefined') {
        return true;
    }
    return false;
}

function checkLabTestResult(labTests, labString) {
    autil.assert(labString != null);
    labString = labString.trim();
    autil.assert(labString.length > 0);

    let invert = false;
    if (labString[0] == '!') {
        invert = true;
    }

    let regExp = /lab\.([a-zA-Z]+)\.value\s*([><=]+)\s*([^\s]+)/;
    let regExpResult = regExp.exec(labString);
    let labKey = regExpResult[1].trim();
    let operator = regExpResult[2].trim();
    let value = regExpResult[3].trim();

    let result;
    if (typeof labTests[labKey] == 'undefined') {
        result = false;
    } else {
        let lab_test_result = labTests[labKey]['lab_test_result'];
        result = autil.compareNumbers(lab_test_result, operator, value);
    }
    if (invert) {
        result = !result;
    }
    return result;
}

function checkDateOfLabTest(labTests, labString) {
    autil.assert(labString != null && labString.length > 0);

    let regExp = /lab\.([a-zA-Z]+)\.date\s*([><=]+)\s*([^\s]+)/;
    let regExpResult = regExp.exec(labString);
    let labKey = regExpResult[1].trim();
    let operator = regExpResult[2].trim();
    let expression = regExpResult[3].trim();

    if (typeof labTests[labKey] == 'undefined') {
        return false;
    }

    let date = labTests[labKey]['date_measured'];
    let result = autil.compareDateToExpression(date, operator, expression);
    return result;
}

module.exports = {
    evaluateLabCriteria: evaluateLabCriteria
}
