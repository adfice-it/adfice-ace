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
function getTargetDate(dateCriterion)
{
    assert(dateCriterion.includes("now-") && dateCriterion.includes("months"),
        "Unrecognized date criterion: '" + dateCriterion + "'");
    let regExp = /(\d+)/;
    let regExpResult = regExp.exec(dateCriterion);
    let months = regExpResult[1];
    var targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() - months);
    return targetDate;
}

module.exports = {
    assert: assert,
    getTargetDate: getTargetDate
}

// vim: set sts=4 expandtab :
