const util = require("util");

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
module.exports = {
    evaluateLabCriteria: function(labTests, labString) {
        // figure out if we have one criterion or more than one
        // right now we don't have anything more complex than A & B.
        // If we get other criteria, we can add code to deal with them.
        if (labString.includes("&")) {
            var labStrings = labString.split("&");
            return (evaluateACriterion(labTests, labStrings[0]) &&
                evaluateACriterion(labTests, labStrings[1]));
        } else {
            return evaluateACriterion(labTests, labString);
        }
    }
}

function evaluateACriterion(labTests, labString) {
    // figure out what kind of criterion we have
    // check for !lab.xxx.value
    var regExp = /!lab\.[a-zA-Z]+\.value/;
    if (regExp.exec(labString) != null) {
        return checkIfLabTestExists(labTests, labString);
    } else {
        // check for lab.xxx.value. Needs to be in an else because it will
        // also match !lab.xxx.value
        regExp = /lab\.[a-zA-Z]+\.value/;
        if (regExp.exec(labString) != null) {
            return checkLabTestResult(labTests, labString);
        }
    }
    // check for lab.xxx.date xxx
    regExp = /lab\.[a-zA-Z]+\.date/;
    /* istanbul ignore else */
    if (regExp.exec(labString) != null) {
        return checkDateOfLabTest(labTests, labString);
    } else {
        throw new Error("Unrecognized criteria string: '" + labString);
    }
}

function checkIfLabTestExists(labTests, labString) {
    var regExp = /!lab\.([a-zA-Z]+)\.value/;
    var regExpResult = regExp.exec(labString);
    // if the named test isn't in the map, it will return undefined
    if (typeof labTests.get(regExpResult[1]) == 'undefined') {
        return false;
    } else return true;
}

function checkLabTestResult(labTests, labString) {
    //TODO
    return false;
}

function checkDateOfLabTest(labTests, labString) {
    //TODO
    return false;
}
