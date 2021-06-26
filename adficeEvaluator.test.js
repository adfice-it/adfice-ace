// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const adfice = require('./adfice')
const ae = require('./adficeEvaluator');

afterAll(async () => {
    return await adfice.shutdown();
});

test('test drugsWithoutFiredRules', () => {
    let rulesResult = {
        C09AA01: ["one", "two"],
        J02AB02: [],
        C07AA01: ["foo", "bar"]
    };
    let expected = ["J02AB02"];
    let actual = ae.drugsWithoutFiredRules(rulesResult);
    expect(actual).toStrictEqual(expected);
});

test('test drugsWithoutFiredRules', async () => {
    let preselectRule = {
        "preselect_or": null,
        "preselect_not": "C03CA,C03CB",
        "sql_condition": null
    };
    let result = await ae.evaluatePreselected(preselectRule, 1, "C03CA02",
        adfice.isSQLConditionTrue);
    expect(result).toBe(false);
    preselectRule = {
        "preselect_or": null,
        "preselect_not": "C03CA,C03CB",
        "sql_condition": null
    };
    result = await ae.evaluatePreselected(preselectRule, 1, "C03CD02",
        adfice.isSQLConditionTrue);
    expect(result).toBe(true);
});

test('test evaluateRules as it is called in getAdviceForPatient', async () => {
    let meds = [];
    let rules = await adfice.getActiveRules();
    let patient_id = 160;
    let evaluated = await ae.evaluateRules(meds, rules, patient_id,
        adfice.isSQLConditionTrue);
    let expected = {
        "medsWithRulesToFire": {},
        "meds_with_fired": [],
        "meds_without_fired": []
    };
    expect(evaluated).toStrictEqual(expected);
});

test('test evaluateRules with med lacking ATC code', async () => {
    let garlic = {
        ATC_code: null,
        medication_name: 'garlic',
        generic_name: 'allium sativum',
        start_date: '1999-12-31'
    }
    let meds = [garlic];
    let rules = await adfice.getActiveRules();
    let patient_id = 160;
    let evaluated = await ae.evaluateRules(meds, rules, patient_id,
        adfice.isSQLConditionTrue);
    let expected = {
        "medsWithRulesToFire": {},
        "meds_with_fired": [],
        "meds_without_fired": [garlic]
    };
    expect(evaluated).toStrictEqual(expected);
});
