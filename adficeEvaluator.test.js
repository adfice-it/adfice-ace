// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const adfice = require('./adfice')
const ae = require('./adficeEvaluator');

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
	let preselectRule = {"preselect_or": null, "preselect_not": "C03CA,C03CB", "sql_condition": null};
	let result = await ae.evaluatePreselected(preselectRule,1,"C03CA02",adfice.isSQLConditionTrue);
	expect(result).toBe(false);
	preselectRule = {"preselect_or": null, "preselect_not": "C03CA,C03CB", "sql_condition": null};
	result = await ae.evaluatePreselected(preselectRule,1,"C03CD02",adfice.isSQLConditionTrue);
	expect(result).toBe(true);
});