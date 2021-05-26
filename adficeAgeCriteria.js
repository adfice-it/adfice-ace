// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 expandtab :
/* age is easy. It is >, <, >=, or <= some number */

/*
Evalutes whether the patient meets the age criteria.
If the patient's age meets the criteria returns true, else returns false.
If ageString is empty returns true.
If age is unknown returns false.
*/
function evaluateAgeCriteria(age, ageString) {
    if (ageString == null) {
        return true;
    }
    if (age == null) {
        return false;
    }
    var ageInString = ageString.match(/\d+/g);
    if ((ageString.substr(0, 1) === "<") &&
        !(ageString.substr(0, 2) === "<=")) {
        return age < ageInString;
    }
    if ((ageString.substr(0, 1) === ">") &&
        !(ageString.substr(0, 2) === ">=")) {
        return age > ageInString;
    }
    if (ageString.substr(0, 2) === "<=") {
        return age <= ageInString;
    }
    if (ageString.substr(0, 2) === ">=") {
        return age >= ageInString;
    }
    return false;
}

module.exports = {
    evaluateAgeCriteria: evaluateAgeCriteria
}
