// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const autil = require('./adfice-util')
const fs = require('fs');

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
});

test('json serialization file round-trip', async function() {
    let path = 'adfice-util.test.garbage.json';
    try {
        fs.unlinkSync(path);
    } catch (ignore) {
        // it is okay that the file does not exist
    }

    let obj1 = {
        foo: 'bar',
        whiz: 'bang',
    };
    await autil.to_json_file(path, obj1);
    let obj2 = await autil.from_json_file(path);
    expect(obj2).toStrictEqual(obj1);
    fs.unlinkSync(path);
});

function expect_uuid4_version_and_variant(bytes) {
    // version 4 UUIDs: xxxxxxxx-xxxx-4xxx-Vxxx-xxxxxxxxxxxx
    // the 2 most significant bits of V should be 0b10
    expect(bytes[6] & 0xF0).toBe(0x40);
    expect(bytes[8] & 0xC0).toBe(0x80);
}

test('uuid4_new', function() {
    let uuid_bytes = autil.uuid4_new();
    expect(uuid_bytes.length).toBe(16);
    expect_uuid4_version_and_variant(uuid_bytes);
});

const uuid4_regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

test('uuid4_new_string', function() {
    let uuid_str_1 = autil.uuid4_new_string();
    expect(uuid_str_1.length).toBe(36);
    expect(uuid_str_1).toMatch(uuid4_regex);

    let uuid_str_2 = autil.uuid4_new_string();
    expect(uuid_str_2.length).toBe(36);
    expect(uuid_str_2).toMatch(uuid4_regex);

    expect(uuid_str_2).not.toBe(uuid_str_1);
});

test('set_version_and_variant, uuid_bytes_to_string', function() {
    let bytes = new Uint8Array(16);
    bytes[15] = 3;
    autil.uuid4_set_version_and_variant(bytes);
    expect_uuid4_version_and_variant(bytes);

    let uuid_str = autil.uuid_bytes_to_string(bytes);
    expect(uuid_str).toBe("00000000-0000-4000-8000-000000000003");
});

test('tmp_path defaults', function() {
    let prefix;
    let suffix;
    let path = autil.tmp_path(prefix, suffix);
    expect(path).toMatch(/tmp\./);
});
