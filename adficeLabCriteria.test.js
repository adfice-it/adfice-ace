// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const alc = require('./adficeLabCriteria')

/* we need to reuse these a lot, so I'm parking them up here */
let normalNatrium = {};
normalNatrium["lab_test_result"] = 140;
normalNatrium["date_measured"] = new Date();
let normalKalium = {};
normalKalium["lab_test_result"] = 3.5;
normalKalium["date_measured"] = new Date();
let normalCalcium = {};
normalCalcium["lab_test_result"] = 2.6;
normalCalcium["date_measured"] = new Date();
let normaleGFR = {};
normaleGFR["lab_test_result"] = 60;
normaleGFR["date_measured"] = new Date();

let lowNatrium = {};
lowNatrium["lab_test_result"] = 120;
lowNatrium["date_measured"] = new Date();

let highCalcium = {};
highCalcium["lab_test_result"] = 2.9;
highCalcium["date_measured"] = new Date();

let bordereGFR = {};
bordereGFR["lab_test_result"] = 30;
bordereGFR["date_measured"] = new Date();

let loweGFR = {};
loweGFR["lab_test_result"] = 20;
loweGFR["date_measured"] = new Date();

let outOfDate = new Date();
outOfDate.setMonth(outOfDate.getMonth() - 12);

let oldNatrium = {};
oldNatrium["lab_test_result"] = 140;
oldNatrium["date_measured"] = outOfDate;

let oldeGFR = {};
oldeGFR["lab_test_result"] = 35;
oldeGFR["date_measured"] = outOfDate;

test('Complete normal labs, check for hyponatremia', () => {
    let labTests = {};
    labTests["natrium"] = normalNatrium;
    labTests["kalium"] = normalKalium;
    labTests["calcium"] = normalCalcium;
    labTests["eGFR"] = normaleGFR;
    let labString = "lab.natrium.value < 135";
    let result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(false);
})

test('Complete normal labs, check for hypercalcemia', () => {
    let labTests = {};
    labTests["natrium"] = normalNatrium;
    labTests["kalium"] = normalKalium;
    labTests["calcium"] = normalCalcium;
    labTests["eGFR"] = normaleGFR;
    let labString = "lab.calcium.value > 2.65";
    let result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(false);
})

test('Complete normal labs, check for low eGFR', () => {
    let labTests = {};
    labTests["natrium"] = normalNatrium;
    labTests["kalium"] = normalKalium;
    labTests["calcium"] = normalCalcium;
    labTests["eGFR"] = normaleGFR;
    let labString = "lab.eGFR.value <= 30";
    let result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(false);
})

test('Complete normal labs, check if natrium is recent', () => {
    let labTests = {};
    labTests["natrium"] = normalNatrium;
    labTests["kalium"] = normalKalium;
    labTests["calcium"] = normalCalcium;
    labTests["eGFR"] = normaleGFR;
    let labString = "lab.natrium.date >= now-11-months";
    let result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(true);
})

test('Complete normal labs, check if natrium is recent, but old', () => {
    let labTests = {};
    labTests["natrium"] = oldNatrium;
    let labString = "lab.natrium.date >= now-3-months";
    let result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(false);
})

test('Complete normal labs, check if natrium is recent, but missing', () => {
    let labTests = {};
    labTests["kalium"] = normalKalium;
    let labString = "lab.natrium.date >= now-11-months";
    let result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(false);
})


test('Complete normal labs, check if natrium is missing', () => {
    let labTests = {};
    labTests["natrium"] = normalNatrium;
    labTests["kalium"] = normalKalium;
    labTests["calcium"] = normalCalcium;
    labTests["eGFR"] = normaleGFR;
    let labString = "!lab.natrium.value";
    let result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(false);
})
test('Complete normal labs, check if natrium is missing (missing)', () => {
    let labTests = {};
    labTests["kalium"] = normalKalium;
    labTests["calcium"] = normalCalcium;
    labTests["eGFR"] = normaleGFR;
    let labString = "!lab.natrium.value";
    let result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(true);
})

test('Complete normal labs, check criteria with AND', () => {
    let labTests = {};
    labTests["natrium"] = normalNatrium;
    labTests["kalium"] = normalKalium;
    labTests["calcium"] = normalCalcium;
    labTests["eGFR"] = normaleGFR;
    let labString = "lab.eGFR.value <= 30 & lab.eGFR.date > now-11-months";
    let result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(false);
})

test('low natrium, check natrium value (low)', () => {
    let labTests = {};
    labTests["natrium"] = lowNatrium;
    let labString = "lab.natrium.value < 135";
    let result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(true);
})

test('low natrium, check natrium value (normal)', () => {
    let labTests = {};
    labTests["natrium"] = normalNatrium;
    let labString = "lab.natrium.value < 135";
    let result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(false);
})

test('low natrium, check natrium value (missing)', () => {
    let labTests = {};
    let labString = "lab.natrium.value < 135";
    let result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(false);
})

test('high calcium, check calcium value', () => {
    let labTests = {};
    labTests["calcium"] = highCalcium;
    let labString = "lab.calcium.value > 2.65";
    let result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(true);
})

test('borderline eGFR, check eGFR value', () => {
    let labTests = {};
    labTests["eGFR"] = bordereGFR;
    let labString = "lab.eGFR.value <= 30";
    let result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(true);
})

test('Old labs, check if natrium is recent', () => {
    let labTests = {};
    labTests["natrium"] = oldNatrium;
    let labString = "lab.natrium.date >= now-11-months";
    let result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(false);
})

test('no labs, check natrium value', () => {
    let labTests = {};
    let labString = "lab.natrium.value < 135";
    let result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(false);
})

test('no labs, check natrium date', () => {
    let labTests = {};
    let labString = "lab.natrium.date >= now-11-months";
    let result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(false);
})

test('no labs, check missing natrium', () => {
    let labTests = {};
    let labString = "!lab.natrium.value";
    let result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(true);
})

test('eGFR normal, check if normal and in date', () => {
    let labTests = {};
    labTests["eGFR"] = normaleGFR;
    let labString = "!lab.eGFR.value <= 30 & lab.eGFR.date > now-11-months";
    let result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(true);
})

test('eGFR low, check if normal and in date', () => {
    let labTests = {};
    labTests["eGFR"] = loweGFR;
    let labString = "!lab.eGFR.value <= 30 & lab.eGFR.date > now-11-months";
    let result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(false);
})

test('old eGFR, check if normal and in date', () => {
    let labTests = {};
    labTests["eGFR"] = oldeGFR;
    let labString = "!lab.eGFR.value <= 30 & lab.eGFR.date > now-11-months";
    let result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(false);
})
