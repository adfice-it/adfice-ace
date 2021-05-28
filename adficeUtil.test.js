// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

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

test('ucfirst', () => {
    expect(autil.ucfirst('foo bar')).toBe('Foo bar');
    expect(autil.ucfirst('FOOo')).toBe('FOOo');
    expect(autil.ucfirst(null)).toBe(null);
    expect(autil.ucfirst(7)).toBe(7);
})

test('split freetext advice strings', () => {

    let example = "initial:{{free text: pre-filled: first free text}}" +
    " some addtional text:{{free text}}";

    let expected = [
        { id: 0, text: "initial:", editable: false },
        { id: 1, text: "first free text", editable: true },
        { id: 2, text: "some addtional text:", editable: false },
        { id: 3, text: "", editable: true }
    ];

    expect(autil.splitFreetext(example)).toStrictEqual(expected);

    expected = [{ id: 0, text: "foo", editable: false }];
    expect(autil.splitFreetext("foo")).toStrictEqual(expected);
    expect(autil.splitFreetext(null)).toStrictEqual([]);
})
