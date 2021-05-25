const util = require("util");

function assert(condition, message) {
    if (condition) {
        return;
    } else {
        throw new Error(message || "Assertion failed");
    }
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

module.exports = {
    assert: assert,
    compareDateToExpression: compareDateToExpression,
    compareNumbers: compareNumbers,
    getDateFromExpression: getDateFromExpression
}

// vim: set sts=4 expandtab :
