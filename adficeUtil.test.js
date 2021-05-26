// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
const autil = require('./adficeUtil')

test('assert true', () => {
    autil.assert(true);
})

test('assert false', () => {
    let caught = null;
    try {
        autil.assert(1 == 2);
    } catch (error) {
        caught = error;
    }
    expect(caught !== null).toBe(true);
    let msg = "" + caught;
    expect(msg).toContain("Assertion failed");
})

test('assert(false, messge)', () => {
    let caught = null;
    try {
        autil.assert(1 == 2, "Foo bar");
    } catch (error) {
        caught = error;
    }
    expect(caught !== null).toBe(true);
    let msg = "" + caught;
    expect(msg).toContain("Foo bar");
})

test('compareNumbers', () => {
    expect(autil.compareNumbers("1", ">=", "2")).toBe(false);
    expect(autil.compareNumbers("2", ">=", "2")).toBe(true);
    expect(autil.compareNumbers("3", ">=", "2")).toBe(true);

    expect(autil.compareNumbers("1", ">", "2")).toBe(false);
    expect(autil.compareNumbers("2", ">", "2")).toBe(false);
    expect(autil.compareNumbers("3", ">", "2")).toBe(true);

    expect(autil.compareNumbers("1", "<", "2")).toBe(true);
    expect(autil.compareNumbers("2", "<", "2")).toBe(false);
    expect(autil.compareNumbers("3", "<", "2")).toBe(false);

    expect(autil.compareNumbers("1", "<=", "2")).toBe(true);
    expect(autil.compareNumbers("2", "<=", "2")).toBe(true);
    expect(autil.compareNumbers("3", "<=", "2")).toBe(false);

    expect(autil.compareNumbers("1", "=", "2")).toBe(false);
    expect(autil.compareNumbers("2", "=", "2")).toBe(true);

    expect(autil.compareNumbers("1", "==", "2")).toBe(false);
    expect(autil.compareNumbers("2", "==", "2")).toBe(true);

    expect(autil.compareNumbers("1", "!=", "2")).toBe(true);
    expect(autil.compareNumbers("2", "!=", "2")).toBe(false);

    expect(autil.compareNumbers("1", "!==", "2")).toBe(true);
    expect(autil.compareNumbers("2", "!==", "2")).toBe(false);
})

// vim: set sts=4 expandtab :
