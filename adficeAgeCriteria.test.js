// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const ageCriteria = require('./adficeAgeCriteria')

test('under_80', () => {
    const ageString = "<80";
    expect(ageCriteria.evaluateAgeCriteria(82, ageString)).toBe(false);
    expect(ageCriteria.evaluateAgeCriteria(80, ageString)).toBe(false);
    expect(ageCriteria.evaluateAgeCriteria(79, ageString)).toBe(true);
})

test('80_and_under', () => {
    const ageString = "<=80";
    expect(ageCriteria.evaluateAgeCriteria(82, ageString)).toBe(false);
    expect(ageCriteria.evaluateAgeCriteria(80, ageString)).toBe(true);
    expect(ageCriteria.evaluateAgeCriteria(79, ageString)).toBe(true);
})

test('80_plus', () => {
    const ageString = ">=80";
    expect(ageCriteria.evaluateAgeCriteria(82, ageString)).toBe(true);
    expect(ageCriteria.evaluateAgeCriteria(80, ageString)).toBe(true);
    expect(ageCriteria.evaluateAgeCriteria(79, ageString)).toBe(false);
})

test('over_80', () => {
    const ageString = ">80";
    expect(ageCriteria.evaluateAgeCriteria(82, ageString)).toBe(true);
    expect(ageCriteria.evaluateAgeCriteria(80, ageString)).toBe(false);
    expect(ageCriteria.evaluateAgeCriteria(79, ageString)).toBe(false);
})

test('bogus', () => {
    const ageString = ">80";
    let age_null;
    expect(ageCriteria.evaluateAgeCriteria(age_null, ageString)).toBe(false);

    let ageString_null;
    expect(ageCriteria.evaluateAgeCriteria(80, ageString_null)).toBe(true);

    let ageString_bogus = "bogus";
    expect(ageCriteria.evaluateAgeCriteria(80, ageString_bogus)).toBe(false);
})
