// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const autil = require('./adfice-util')

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

test('split freetext advice strings', () => {

    let example = "initial:{{free text: pre-filled: first free text}}" +
        " some addtional text:{{free text}}";

    let expected = [{
        id: 0,
        text: "initial:",
        editable: false
    }, {
        id: 1,
        text: "first free text",
        editable: true
    }, {
        id: 2,
        text: "some addtional text:",
        editable: false
    }, {
        id: 3,
        text: "",
        editable: true
    }];

    expect(autil.split_freetext(example)).toStrictEqual(expected);

    expected = [{
        id: 0,
        text: "foo",
        editable: false
    }];
    expect(autil.split_freetext("foo")).toStrictEqual(expected);
    expect(autil.split_freetext(null)).toStrictEqual([]);
})

test('split freetext handle bad strings', () => {

    let example = "initial:{{free text: pre-filled: first free text}}" +
        " some addtional text:{{free text}}";

    expect(autil.split_freetext("{free text}}")).toStrictEqual([{
        id: 0,
        text: "{free text",
        editable: false
    }, {
        id: 1,
        text: "BAD DATA",
        editable: true
    }]);
    expect(autil.split_freetext("{free text:}}")).toStrictEqual([{
        id: 0,
        text: "{free text:",
        editable: false
    }, {
        id: 1,
        text: "BAD DATA",
        editable: true
    }]);
    expect(autil.split_freetext("{{free text:}")).toStrictEqual([{
        id: 1,
        text: "",
        editable: true
    }]);
})
