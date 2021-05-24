const util = require("util");
/*
Condition_drug checks one of three things:
 * the presence of one or more other drugs in the patient's file
  (not the selector, but doesn't hurt if the selector is also checked)

 * the absence of one or more other drugs in the patient's file
  (not the selector, but doesn't hurt if the selector is also checked)

 * the start date of the drug from the selector

 The latter is the only case in the system where the conditions should
 be combined with AND.

Below is an exhaustive list of all of the criteria that are currently in the
database.

J02AB02,J02AC04,J02AC03,J02AC02,J01FA09,V03AX03,J05AE03,J05AE01,J05AR10
&(medication.startDate >= now-6-months | !medication.startDate)
&(medication.startDate < now-6-months)
!C09A &!C09B
A03AA07,A03AB05,A03BA01,A03BA03,A03BB01,G04BD02,G04BD04,G04BD05,G04BD06,
G04BD07,G04BD08,G04BD09,G04BD10,G04BD11,M03BA03,M03BC01,N04AA01,N04AA02,
N04AA04,N04AB02,N04AC01,N05AA01,N05AA03,N05AB03,N05AB06,N05AC02,N05AH03,
N05AH04,N05BB01,N05CM05,N06AA,N06AB05,R06AA02,R06AA04,R06AA08,R06AA09,
R06AA52,R06AB01,R06AB04,R06AD02,R06AE05
*/


/*
Evaluates whether the patient meets the criteria.
Returns true if the patient does meet the criteria, false if they don't.
If drugString is null, returns null. Should probably throw an error.
drugList should be an array, drugString should be a string,
selectorStartDate should be a Date object
*/
module.exports = {
    evaluateDrugCriteria: function(drugList, drugString, selectorStartDate) {
        // TODO check what happens if you call this function without a
        // selectorStartDate
        if (drugString == null) {
            return null;
        }
        if ((drugList == null || drugList.length == 0) &&
            selectorStartDate == null) {
            return null;
        }
        // figure out what kind of string we have
        if (drugString.includes("startDate")) {
            return evaluateStartDate(drugString, selectorStartDate);
        } else {
            return evaluateDrugList(drugList, drugString);
        }
    }
}

function evaluateStartDate(drugString, selectorStartDate) {
    if (drugString.includes("!medication.startDate") &&
        selectorStartDate == null) {
        return true;
    } else if (selectorStartDate == null) {
        return false;
    }
    // capture the operator
    var regExp = /startDate ([^a-z0-9]*)/;
    var regExpResult = regExp.exec(drugString);
    var drugStringOperator = regExpResult[1].trim();
    // capture the expression after the operator
    regExp = /[<>=]+ (.*)(?:\)| \| !medication.startDate)/;
    regExpResult = regExp.exec(drugString);
    var drugStringDateCriteria = regExpResult[1].trim();
    // right now the date criteria are always of the form "now-N-months".
    // If we get some that use years or something other than now we'll
    // add those functions.
    /* istanbul ignore else */
    if (drugStringDateCriteria.includes("now-") &&
        drugStringDateCriteria.includes("months")) {
        regExp = /(\d+)/
        regExpResult = regExp.exec(drugStringDateCriteria);
        var drugStringMonths = regExpResult[1]
    } else {
        throw new Error("Unrecognized medication.startDate criteria: '" +
            drugString + "', '" + selectorStartDate + "'");
    }
    var targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() - drugStringMonths);
    if (drugStringOperator === "<") {
        return selectorStartDate < targetDate;
    }
    if (drugStringOperator === ">") {
        return selectorStartDate > targetDate;
    }
    if (drugStringOperator === "<=") {
        return selectorStartDate <= targetDate;
    }
    /* istanbul ignore else */
    if (drugStringOperator === ">=") {
        return selectorStartDate >= targetDate;
    } else {
        throw new Error("Unrecognized medication.startDate criteria: '" +
            drugString + "', '" + selectorStartDate + "'");
    }
}

function evaluateDrugList(drugList, drugString) {
    var drugCriteria = drugString.split(",");
    // for each drugString, check if it matches a drug on the patient's
    // drug list.
    // if the drug string is a !, check to make sure that drug is not
    // on the drug list.
    var hasRequiredDrug = null;
    var hasForbiddenDrug = null;
    var drugCriteriaCounter = 0;
    do {
        var drugCriterion = drugCriteria[drugCriteriaCounter];
        if (drugCriterion.includes("!")) {
            var dcLen = drugCriterion.length;
            var drugCriterionATC = drugCriterion.substr(1, dcLen).trim();
            if (drugIsOnList(drugCriterionATC, drugList)) {
                hasForbiddenDrug = true;
            } else {
                hasForbiddenDrug = false;
            }
        } else {
            var drugCriterionATC = drugCriterion.trim();
            if (drugIsOnList(drugCriterionATC, drugList)) {
                hasRequiredDrug = true;
            } else {
                hasRequiredDrug = false;
            }
        }
        ++drugCriteriaCounter;
    } while (drugCriteriaCounter < drugCriteria.length &&
        !hasForbiddenDrug && !hasRequiredDrug)

    // there are no positive criteria but there are negative criteria
    if (hasRequiredDrug == null && !hasForbiddenDrug) {
        return true;
    }
    // there are positive criteria but no negative criteria
    // or there are both positive and negative criteria
    if (hasRequiredDrug && !hasForbiddenDrug) {
        return true;
    }

    return false;
}

function drugIsOnList(drugCriterionATC, drugList) {
    var drugListCounter = 0;
    do {
        var dcLen = drugCriterionATC.length;
        var drugFromList = drugList[drugListCounter].substr(0, dcLen).trim();
        if (drugFromList === drugCriterionATC) {
            return true;
        }
        drugListCounter++;
    } while (drugListCounter < drugList.length)
    return false;
}

// vim: set sts=4 expandtab :
