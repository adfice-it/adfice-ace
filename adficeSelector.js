var fs = require('fs');
const util = require("util");

function evaluateSelectors(meds, rules) {
    let medsWithRulesToFire = {};
    for (let i = 0; i < meds.length; ++i) {
        let med = meds[i];
        let atc_code = med.ATC_code.trim();
        let rulesToFire = new Array();
        medsWithRulesToFire[atc_code] = medsWithRulesToFire[atc_code] || [];
        for (let ruleCounter = 0; ruleCounter < rules.length; ++ruleCounter) {
            let rule = rules[ruleCounter];
            if (matchesSelector(atc_code, rule.selector_or) &&
                !matchesSelector(atc_code, rule.selector_not)) {
                rulesToFire.push(rule.medication_criteria_id);
            } // else do nothing
        }
        medsWithRulesToFire[atc_code].push(rulesToFire);
    }
    return medsWithRulesToFire;
}

function matchesSelector(atcCode, selectorString) {
    if (selectorString != null) {
        let selectorStrings = selectorString.split(",");
        for (let i = 0; i < selectorStrings.length; ++i) {
            let selector = selectorStrings[i].trim();
            let subATC = atcCode.substr(0, selector.length);
            if (subATC === selector) {
                return true;
            }
        }
    }
    return false;
}

module.exports = {
    evaluateSelectors: evaluateSelectors
}
