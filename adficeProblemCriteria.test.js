// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const apc = require('./adficeProblemCriteria')

test('one match', () => {
    const problemList = ["epilepsy"];
    const problemString = "epilepsy";
    var result = apc.evaluateProblemCriteria(problemList, problemString);
    expect(result).toBe(true);
})

test('no match', () => {
    const problemList = ["epilepsy", "diabetes"];
    const problemString = "angststoornis &!epilepsy";
    var result = apc.evaluateProblemCriteria(problemList, problemString);
    expect(result).toBe(false);
})

test('three', () => {
    const problemList = ["epilepsy", "diabetes"];
    const problemString = "angststoornis &!epilepsy";
    var result = apc.evaluateProblemCriteria(problemList, problemString);
    expect(result).toBe(false);
})

test('empty problemList', () => {
    const problemList = [];
    const problemString = "!angststoornis &!epilepsy";
    var result = apc.evaluateProblemCriteria(problemList, problemString);
    expect(result).toBe(true);
})

test('null problemString', () => {
    const problemList = ["parkinson", "orthostatische-hypotensie"];
    let problemString;
    var result = apc.evaluateProblemCriteria(problemList, problemString);
    expect(result).toBe(true);
})

test('complex probelmString', () => {
    const problemList = ["parkinson", "orthostatische-hypotensie"];
    const problemString =
        "(parkinson | lewy-bodies-dementia | multiple-system-atrophy | progressive-supranuclear-palsy ) & orthostatische-hypotensie";
    var result = apc.evaluateProblemCriteria(problemList, problemString);
    expect(result).toBe(true);
})

test('complex probelmString no match', () => {
    const problemList = ["angststoornis", "diabetes"];
    const problemString =
        "(parkinson | lewy-bodies-dementia | multiple-system-atrophy | progressive-supranuclear-palsy ) & orthostatische-hypotensie";
    var result = apc.evaluateProblemCriteria(problemList, problemString);
    expect(result).toBe(false);
})

test('ORs and AND', () => {
    const problemList = ["angststoornis", "diabetes"];
    const problemString =
        "(parkinson | diabetes | multiple-system-atrophy ) & angststoornis";
    var result = apc.evaluateProblemCriteria(problemList, problemString);
    expect(result).toBe(true);
})

test('not inside or, false', () => {
    const problemList = ["angststoornis", "diabetes"];
    const problemString =
        "(parkinson | !diabetes | multiple-system-atrophy ) & angststoornis";
    var result = apc.evaluateProblemCriteria(problemList, problemString);
    expect(result).toBe(false);
})

test('not inside or, true', () => {
    const problemList = ["angststoornis", "diabetes"];
    const problemString = "(epilepsy | !diabetes) | angststoornis";
    var result = apc.evaluateProblemCriteria(problemList, problemString);
    expect(result).toBe(true);
})

test('one match not inside parens', () => {
    const problemList = ["diabetes"];
    const problemString = "(epilepsy | !diabetes) | angststoornis";
    var result = apc.evaluateProblemCriteria(problemList, problemString);
    expect(result).toBe(false);
})

test('positive and not negative', () => {
    const problemList = ["diabetes"];
    const problemString = "diabetes & !angststoornis";
    var result = apc.evaluateProblemCriteria(problemList, problemString);
    expect(result).toBe(true);
})
