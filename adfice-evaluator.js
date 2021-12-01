// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

var fs = require('fs');
const util = require("util");
/*Returns:meds_with_rules_to_fire: a map of ATC codes: a list of the medication_criteria_ids of rules that fire for each ATC code. Only contains meds that fired rules.
meds_with_fired: a list of the medications that had rules fire (for displaying on start page)
meds_without_fired: a list of the medications that didn't have rules file (also for displaying on start page)*/
async function evaluate_rules(meds, rules, patient_id, is_sql_condition_true) {
    let meds_with_rules_to_fire = {};
    let meds_with_fired = [];
    let meds_without_fired = [];
    for (let i = 0; i < meds.length; ++i) {
        let med = meds[i];
        let atc_code = null;
        let start_date = med.start_date;
        if (med.ATC_code != null) {
            atc_code = med.ATC_code.trim();
            meds_with_rules_to_fire[atc_code] =
                meds_with_rules_to_fire[atc_code] || [];
            for (let j = 0; j < rules.length; ++j) {
                let rule = rules[j];
                if (matches_selector(atc_code, rule.selector_or) &&
                    !matches_selector(atc_code, rule.selector_not)) {
                    let is_condition_true = await is_sql_condition_true(
                        patient_id, rule.medication_criteria_id);
                    if (is_condition_true) {
                        meds_with_rules_to_fire[atc_code].push(
                            rule.medication_criteria_id);
                    }
                }
            }
        }
        if (atc_code != null) {
            if (meds_with_rules_to_fire[atc_code].length > 0) {
                meds_with_fired.push(med);
            } else {
                meds_without_fired.push(med);
                delete meds_with_rules_to_fire[atc_code];
            }
        } else {
            meds_without_fired.push(med);
        }
    }
    let rv = {
        meds_with_rules_to_fire: meds_with_rules_to_fire,
        meds_with_fired: meds_with_fired,
        meds_without_fired: meds_without_fired
    };
    return rv;
}

function matches_selector(atc_code, selector_string) {
    if (selector_string != null) {
        let selector_strings = selector_string.split(",");
        for (let i = 0; i < selector_strings.length; ++i) {
            let selector = selector_strings[i].trim();
            let sub_atc = atc_code.substr(0, selector.length);
            if (sub_atc === selector) {
                return true;
            }
        }
    }
    return false;
}


// This function will evaluate whether a single preselect rule is true
// = one row from the table preselect_rules
// if there is no row in preselect_rules,
//    then the checkbox is never preselected.
// if there is a row,
//    then if the row returns true, the checkbox is preselected.
async function evaluate_preselected(preselect_rule, patient_id, atc_code,
    evaluate_sql) {
    //console.dir(adfice);
    // if no selector is specified, then
    // it is true for all drugs that can fire the rule
    let selector_result = true;
    if (preselect_rule['preselect_or'] != null) {
        let selector_string = preselect_rule['preselect_or'].toString();
        if (!matches_selector(atc_code, selector_string)) {
            selector_result = false;
        }
    }
    if (preselect_rule['preselect_not'] != null) {
        let let_selector_string = preselect_rule['preselect_not'].toString();
        if (matches_selector(atc_code, let_selector_string)) {
            selector_result = false;
        }
    }
    // if no condition is specified, then
    // it is true for all patients
    let condition_result = true;
    if (preselect_rule['sql_condition'] != null) {
        let sql_condition = preselect_rule['sql_condition'].toString();
        let is_condition_true = await evaluate_sql(sql_condition, patient_id);
        if (!is_condition_true) {
            condition_result = false;
        }
    }
    if (selector_result && condition_result) {
        return true;
    } else {
        return false;
    }
}

// this function looks to be unused except in a test
function drugs_without_fired_rules(rules_result) {
    let results = [];
    let keys = Object.keys(rules_result);
    for (let i = 0; i < keys.length; ++i) {
        let key = keys[i];
        let value = rules_result[key];
        if (!value.length) {
            results.push(key);
        }
    }
    return results;
}

module.exports = {
    matches_selector: matches_selector,
    drugs_without_fired_rules: drugs_without_fired_rules,
    evaluate_rules: evaluate_rules,
    evaluate_preselected: evaluate_preselected
}
