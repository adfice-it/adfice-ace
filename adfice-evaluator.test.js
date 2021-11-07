// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const adfice_factory = require('./adfice.js');
const ae = require('./adfice-evaluator');

let adfice = adfice_factory.adfice_init();

afterAll(async () => {
    return await adfice.shutdown();
});

test('test drugs_without_fired_rules', () => {
    let rulesResult = {
        C09AA01: ["one", "two"],
        J02AB02: [],
        C07AA01: ["foo", "bar"]
    };
    let expected = ["J02AB02"];
    let actual = ae.drugs_without_fired_rules(rulesResult);
    expect(actual).toStrictEqual(expected);
});

test('test drugs_without_fired_rules', async () => {
    let preselectRule = {
        "preselect_or": null,
        "preselect_not": "C03CA,C03CB",
        "sql_condition": null
    };
    let result = await ae.evaluate_preselected(preselectRule, 1, "C03CA02",
        adfice.is_sql_condition_true);
    expect(result).toBe(false);
    preselectRule = {
        "preselect_or": null,
        "preselect_not": "C03CA,C03CB",
        "sql_condition": null
    };
    result = await ae.evaluate_preselected(preselectRule, 1, "C03CD02",
        adfice.is_sql_condition_true);
    expect(result).toBe(true);
});

test('test evaluate_rules as it is called in get_advice_for_patient', async () => {
    let meds = [];
    let rules = await adfice.get_active_rules();
    let patient_id = 160;
    let evaluated = await ae.evaluate_rules(meds, rules, patient_id,
        adfice.is_sql_condition_true);
    let expected = {
        "meds_with_rules_to_fire": {},
        "meds_with_fired": [],
        "meds_without_fired": []
    };
    expect(evaluated).toStrictEqual(expected);
});

test('test evaluate_rules with med lacking ATC code', async () => {
    let garlic = {
        ATC_code: null,
        medication_name: 'garlic',
        generic_name: 'allium sativum',
        start_date: '1999-12-31'
    }
    let meds = [garlic];
    let rules = await adfice.get_active_rules();
    let patient_id = 160;
    let evaluated = await ae.evaluate_rules(meds, rules, patient_id,
        adfice.is_sql_condition_true);
    let expected = {
        "meds_with_rules_to_fire": {},
        "meds_with_fired": [],
        "meds_without_fired": [garlic]
    };
    expect(evaluated).toStrictEqual(expected);
});
