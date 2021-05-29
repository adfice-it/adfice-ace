// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const util = require("util");

function assert(condition, message) {
    if (condition) {
        return;
    } else {
        throw new Error(message || "Assertion failed");
    }
}

function ucfirst(s) {
    if (typeof s !== 'string') {
        return s;
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
}

// The date criteria are always of the form "now-N-months".
// If we get some that use years or something other than now we'll
// add those functions.
function getDateFromExpression(dateExpression)
{
    assert(dateExpression.includes("now-") && dateExpression.includes("months"),
        "Unrecognized date expression: '" + dateExpression + "'");
    let regExp = /(\d+)/;
    let regExpResult = regExp.exec(dateExpression);
    let months = regExpResult[1];
    var targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() - months);
    return targetDate;
}

function compareDateToExpression(date, operator, expression)
{
    operator = operator.trim();

    let targetDate = getDateFromExpression(expression);

    if (operator === "<") {
        return date < targetDate;
    }
    if (operator === ">") {
        return date > targetDate;
    }

    if (operator === "<=") {
        return date <= targetDate;
    }
    // Last known operator is ">=", so if it's not that, error
    assert((operator === ">="),
        "Unrecognized date comparision operator: '" + operator + "'");
    return date >= targetDate;
}

function compareNumbers(a, operator, b) {
    if (operator === "<=") { return (+a <= +b); }
    if (operator === "<") { return (+a < +b); }
    if (operator === ">") { return (+a > +b); }
    if (operator === ">=") { return (+a >= +b); }
    if (operator === "==") { return (+a == +b); }
    if (operator === "=") { return (+a == +b); }
    if (operator === "!==") { return (+a !== +b); }
    // last known operator is "!="
    assert((operator === "!="), "Unrecognized operator '" + operator + "'");
    return (+a !== +b);
}

function splitFreetext(str) {
    if (str == null) { return [] };
    let substrings = str.split(/{{|}}/);
    let editable = false;
    let result = [];

    for (let i = 0; i < substrings.length; ++i) {
        let text = substrings[i];
        if (editable) {
            let regExp = /\s*free\s+text\s*(:\s*pre-filled\s*:\s*(.*))?/;
            let regExpResult = regExp.exec(text);
            if (regExpResult != null && regExpResult.length == 3) {
                text = regExpResult[2] || "";
            } else {
                text = "BAD DATA";
            }
        }
        if (editable || text.length > 0) {
            result.push({
                id: i,
                text: text.trim(),
                editable : editable
            });
        }
        editable = !editable;
    }

    return result;
}

module.exports = {
    assert: assert,
    compareDateToExpression: compareDateToExpression,
    compareNumbers: compareNumbers,
    getDateFromExpression: getDateFromExpression,
    splitFreetext: splitFreetext,
    ucfirst: ucfirst
}
