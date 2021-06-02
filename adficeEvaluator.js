// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

var fs = require('fs');
const util = require("util");

async function evaluateRules(meds, rules, patient_id, adfice) {
    let medsWithRulesToFire = {};
    let meds_with_fired = [];
    let meds_without_fired = [];
    for (let i = 0; i < meds.length; ++i) {
        let med = meds[i];
        let atc_code = med.ATC_code.trim();
        let startDate = med.start_date;
        medsWithRulesToFire[atc_code] = medsWithRulesToFire[atc_code] || [];
        for (let ruleCounter = 0; ruleCounter < rules.length; ++ruleCounter) {
            let rule = rules[ruleCounter];
            if (matchesSelector(atc_code, rule.selector_or) &&
                !matchesSelector(atc_code, rule.selector_not)) {
				let isConditionTrue = await adfice.isSQLConditionTrue(patient_id,rule.medication_criteria_id);
				  if(isConditionTrue){
                    medsWithRulesToFire[atc_code].push(rule.medication_criteria_id);
                }
            }
        }
        if (medsWithRulesToFire[atc_code].length > 0) {
            meds_with_fired.push(med);
        } else {
            meds_without_fired.push(med);
            delete medsWithRulesToFire[atc_code];
        }
    }
    let rv = {
        medsWithRulesToFire: medsWithRulesToFire,
        meds_with_fired: meds_with_fired,
        meds_without_fired: meds_without_fired
    };
    return rv;
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

function drugsWithoutFiredRules(rulesResult) {
    let results = [];
    let keys = Object.keys(rulesResult);
    for (let i = 0; i < keys.length; ++i) {
        let key = keys[i];
        let value = rulesResult[key];
        if (!value.length) {
            results.push(key);
        }
    };
    return results;
}

module.exports = {
    matchesSelector: matchesSelector,
    drugsWithoutFiredRules: drugsWithoutFiredRules,
    evaluateRules: evaluateRules
}
