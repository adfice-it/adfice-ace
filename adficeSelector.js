var fs = require('fs');
const util = require("util");

function evaluateSelectors(meds, rules) {
    var medsWithRulesToFire = {};
    var medCounter = 0;
    do {
        var ruleCounter = 0;
        var rulesToFire = new Array();
        medsWithRulesToFire[meds[medCounter].ATC_code] = medsWithRulesToFire[meds[medCounter].ATC_code] || [];
        do {
            if (matchesSelector(meds[medCounter].ATC_code, rules[ruleCounter].selector_or) &&
                !matchesSelector(meds[medCounter].ATC_code, rules[ruleCounter].selector_not)) {
                rulesToFire.push(rules[ruleCounter].medication_criteria_id);
            } // else do nothing
            ruleCounter++;
        } while (ruleCounter < rules.length)
        medsWithRulesToFire[meds[medCounter].ATC_code].push(rulesToFire);
        medCounter++;
    } while (medCounter < meds.length);
    return medsWithRulesToFire;
}

function matchesSelector(atcCode, selectorString) {
    if (selectorString != null) {
        var selectorStrings = selectorString.split(",");
        var selectorCounter = 0;
        do {
            var selector = selectorStrings[selectorCounter].trim();
            var subATC = atcCode.substr(0, selector.length);
            if (subATC === selector) {
                return true;
            }
            selectorCounter++;
        } while (selectorCounter < selectorStrings.length)
    }
    return false;
}

module.exports = {
	evaluateSelectors: evaluateSelectors
}
