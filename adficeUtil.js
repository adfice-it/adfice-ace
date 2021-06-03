// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const util = require("util");

function assert(condition, message) {
    if (condition) {
        return;
    } else {
        throw new Error(message || "Assertion failed");
    }
}

function ucfirst(s) {
    if (typeof s !== 'string') {
        return s;
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function splitFreetext(str) {
    if (str == null) { return [] };
    let substrings = str.split(/{{|}}/);
    let editable = false;
    let result = [];

    for (let i = 0; i < substrings.length; ++i) {
        let text = substrings[i];
        if (editable) {
            let regExp = /\s*free\s+text\s*(:\s*pre-filled\s*:\s*(.*))?/;
            let regExpResult = regExp.exec(text);
            if (regExpResult != null && regExpResult.length == 3) {
                text = regExpResult[2] || "";
            } else {
                text = "BAD DATA";
            }
        }
        if (editable || text.length > 0) {
            result.push({
                id: i,
                text: text.trim(),
                editable : editable
            });
        }
        editable = !editable;
    }

    return result;
}

module.exports = {
    assert: assert,
    splitFreetext: splitFreetext,
    ucfirst: ucfirst
}
