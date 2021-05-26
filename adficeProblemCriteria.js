// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 expandtab :
const util = require("util");
const autil = require('./adficeUtil');

/*
// problem_criteria can contain items in the following formats:
jicht
!hypertensie
!atriumfibrilleren &!angina-pectoris &!myocardinfarct
hypertensie &!hartfalen
parkinson | lewy-bodies-dementia | multiple-system-atrophy | progressive-supranuclear-palsy
(parkinson | lewy-bodies-dementia | multiple-system-atrophy | progressive-supranuclear-palsy ) & orthostatische-hypotensie
// note that there is only ever one set of parentheses.
// We could create a more general boolean parser (and there are examples of
// them on the internetz) but this covers the cases that actually exist
*/


/*
Returns true if the patient meets the criteria or
returns false if the patient does not meet the criteria or
returns true if problemString is null
*/
module.exports = {
    evaluateProblemCriteria: function(problemList, problemString) {
        if (problemString == null) {
            return true;
        }
        if (problemString.includes("(")) {
            var parentheticalMap = parentheticalProblem(problemString);
            var insideProblemMap = splitProblems(parentheticalMap.get(
                "problemStringInside"));
            var afterProblemMap = splitProblems(parentheticalMap.get(
                "problemStringAfter"));
            var operator = parentheticalMap.get(
                "problemStringOperator");

            if (operator == "&") {
                if (evaluateCriteria(problemList, insideProblemMap) &&
                    evaluateCriteria(problemList, afterProblemMap)) {
                    return true;
                } else {
                    return false;
                }
            }

            // there actually are no criteria like this, but
            // it's trivial to have the functionality
            autil.assert(operator == "|", "Unexpected operator: " + operator);
            if (evaluateCriteria(problemList, insideProblemMap) ||
                evaluateCriteria(problemList, afterProblemMap)) {
                return true;
            } else {
                return false;
            }
        } else {
            var problemMap = splitProblems(problemString);
            return evaluateCriteria(problemList, problemMap);
        }
    }
}

function parentheticalProblem(problemString) {
    var parentheticalMap = new Map();

    // capture the part before parentheses
    var problemStringBefore = "";
    var regExp = /^(.*?)\(/;
    var regExpResult = regExp.exec(problemString);
    autil.assert(regExpResult !== null);
    problemStringBefore = regExpResult[1] || "";

    // capture the part in the parentheses
    regExp = /\(([^)]+)\)/;
    var problemStringInside = regExp.exec(problemString)[1].trim();

    // capture the operator after the parentheses
    var problemStringOperator = "";
    regExp = /\)[ ]*([&|]*)/;
    regExpResult = regExp.exec(problemString);
    autil.assert(regExpResult !== null);
    autil.assert(regExpResult[1] !== null);
    problemStringOperator = regExpResult[1].trim();

    // capture the part after the parentheses
    var problemStringAfter = "";
    regExp = /\) [&|](.*)/;
    regExpResult = regExp.exec(problemString);
    autil.assert(regExpResult !== null);
    autil.assert(regExpResult[1] !== null);
    problemStringAfter = regExpResult[1].trim();

    parentheticalMap.set("problemStringBefore", problemStringBefore);
    parentheticalMap.set("problemStringInside", problemStringInside);
    parentheticalMap.set("problemStringOperator", problemStringOperator);
    parentheticalMap.set("problemStringAfter", problemStringAfter);

    return parentheticalMap;
}

function splitProblems(problemString) {
    autil.assert(problemString !== null);

    var problemMap = new Map();
    var problem = new Array();
    var problemNot = new Array();

    var criteriaArray = problemString.split(" ");
    criteriaArray.forEach((problemExpression, index) => {
        if (problemExpression.substr(0, 1) === "!") {
            problemNot.push(problemExpression.substr(1,
                problemExpression.length));
        } else if (problemExpression.substr(0, 2) === "&!") {
            problemNot.push(problemExpression.substr(2,
                problemExpression.length));
        } else if (problemExpression === "|") {
            /*do nothing*/
        } else {
            problem.push(problemExpression);
        }
    });
    problemMap.set("problem", problem);
    problemMap.set("problemNot", problemNot);
    return problemMap;
}

function evaluateCriteria(problemList, problemMap) {
    var hasRequiredProblem = false;
    var hasForbiddenProblem = false;

    problemMap.get("problemNot").forEach((notProblem, index) => {
        if (problemList.length > 0 && problemList.includes(
                notProblem)) {
            hasForbiddenProblem = true;
        }
    });

    if (!hasForbiddenProblem) {
        problemMap.get("problem").forEach((problem, index) => {
            if (problemList.length > 0 && problemList.includes(
                    problem)) {
                hasRequiredProblem = true;
            }
        });
    }

    // there are no positive criteria but there are negative criteria or
    if (problemMap.get("problem").length == 0 && !hasForbiddenProblem) {
        return true;
    }

    // there are positive criteria but no negative criteria or
    if (hasRequiredProblem && problemMap.get("problemNot").length == 0) {
        return true;
    }

    // there are both positive and negative criteria
    if (problemMap.get("problem").length > 0 && hasRequiredProblem &&
        problemMap.get("problemNot").length > 0 && !hasForbiddenProblem) {
        return true;
    }

    return false;
}
