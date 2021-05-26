// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
const adc = require('./adficeDrugCriteria')

test('one', () => {
    const drugList = ["J02AB02", "C09AA01", "C07AA01"];
    const drugString = "!C09A,!C09B";
    const startDate = new Date();
    var result = adc.evaluateDrugCriteria(drugList, drugString, startDate);
    expect(result).toBe(false);
})

test('two', () => {
    const drugList = ["J02AB02", "C09AA01", "C07AA01"];
    const drugString = "J02AB02,J02AC04,J02AC03,J02AC02,J01FA09" +
        ",V03AX03,J05AE03,J05AE01,J05AR10";
    const startDate = new Date();
    var result = adc.evaluateDrugCriteria(drugList, drugString, startDate);
    expect(result).toBe(true);
})

test('three', () => {
    const drugList = ["J02AB02", "C09AA01", "C07AA01"];
    // this doesn't exist currently but it is handled by this code
    const drugString = "C09A,!C09B";
    const startDate = new Date();
    var result = adc.evaluateDrugCriteria(drugList, drugString, startDate);
    expect(result).toBe(true);
})

test('four', () => {
    const drugList = ["J02AB02", "C09AA01", "C07AA01"];
    const drugString = "&(medication.startDate < now-6-months)";
    const startDate = new Date();
    var result = adc.evaluateDrugCriteria(drugList, drugString, startDate);
    expect(result).toBe(false);
    result = adc.evaluateDrugCriteria(drugList, drugString, null);
    expect(result).toBe(false);
})

test('five', () => {
    const drugList = ["J02AB02", "C09AA01", "C07AA01"];
    const drugString = "&(medication.startDate < now-6-months)";
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 13);
    var result = adc.evaluateDrugCriteria(drugList, drugString, startDate);
    expect(result).toBe(true);
})

test('six', () => {
    const drugList = ["J02AB02", "C09AA01", "C07AA01"];
    var drugString = "&(medication.startDate >= now-6-months" +
        " | !medication.startDate)";
    const startDate = new Date();
    var result = adc.evaluateDrugCriteria(drugList, drugString, startDate);
    expect(result).toBe(true);
})

test('seven', () => {
    const drugList = ["J02AB02", "C09AA01", "C07AA01"];
    var drugString = "&(medication.startDate >= now-6-months" +
        " | !medication.startDate)";
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 13);
    var result = adc.evaluateDrugCriteria(drugList, drugString, startDate);
    expect(result).toBe(false);
})

test('eight', () => {
    const drugList = ["J02AB02", "C09AA01", "C07AA01"];
    var drugString = "&(medication.startDate >= now-6-months" +
        " | !medication.startDate)";
    var startDate = null;
    var result = adc.evaluateDrugCriteria(drugList, drugString, startDate);
    expect(result).toBe(true);
})

test('nine', () => {
    const drugList = ["J02AB02", "C09AA01", "C07AA01"];
    const drugString = "!C09A,!C09B";
    const startDate = new Date();

    var result;

    result = adc.evaluateDrugCriteria(null, drugString, null);
    expect(result).toBe(null);

    result = adc.evaluateDrugCriteria([], drugString, null);
    expect(result).toBe(null);


    result = adc.evaluateDrugCriteria(drugList, null, startDate);
    expect(result).toBe(null);
});

test('ten', () => {
    const drugList = ["J02AB02", "C09AA01", "C07AA01"];
    const drugString = "C09B";
    const startDate = new Date();
    var result = adc.evaluateDrugCriteria(drugList, drugString, startDate);
    expect(result).toBe(false);
})

test('eleven', () => {
    const drugList = ["J02AB02", "C09AA01", "C07AA01"];
    var drugString = "&(medication.startDate > now-6-months)";
    var startDate = new Date();
    var result = adc.evaluateDrugCriteria(drugList, drugString, startDate);
    expect(result).toBe(true);

    startDate.setMonth(startDate.getMonth() - 13);
    result = adc.evaluateDrugCriteria(drugList, drugString, startDate);
    expect(result).toBe(false);
})

test('twelve', () => {
    const drugList = ["J02AB02", "C09AA01", "C07AA01"];
    var drugString = "&(medication.startDate <= now-6-months)";
    var startDate = new Date();
    var result = adc.evaluateDrugCriteria(drugList, drugString, startDate);
    expect(result).toBe(false);

    startDate.setMonth(startDate.getMonth() - 13);
    result = adc.evaluateDrugCriteria(drugList, drugString, startDate);
    expect(result).toBe(true);
})

test('does not have forbidden', () => {
    const drugList = ["J02AB02", "C07AA01"];
    const drugString = "!C09A,!C09B";
    const startDate = new Date();
    var result = adc.evaluateDrugCriteria(drugList, drugString, startDate);
    expect(result).toBe(true);
})

test('has required does not have forbidden', () => {
    const drugList = ["J02AB02", "C07AA01"];
    const drugString = "J02AB02,!C09B";
    const startDate = new Date();
    var result = adc.evaluateDrugCriteria(drugList, drugString, startDate);
    expect(result).toBe(true);
})

// vim: set sts=4 expandtab :
