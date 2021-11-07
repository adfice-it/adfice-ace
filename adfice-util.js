// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const util = require("util");
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

function assert(condition, message) {
    if (condition) {
        return;
    } else {
        throw new Error(message || "Assertion failed");
    }
}

function split_freetext(str) {
    if (str == null) {
        return []
    };
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
                editable: editable
            });
        }
        editable = !editable;
    }

    return result;
}

async function to_json_file(path, obj) {
    let json = JSON.stringify(obj, null, 4) + '\n';
    let options = {};
    let promise = new Promise(function(resolve, reject) {
        fs.writeFile(path, json, options, function(err) {
            /* istanbul ignore next */
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
    return promise;
}

async function from_json_file(path) {
    let promise = new Promise(function(resolve, reject) {
        fs.readFile(path, 'utf8', function(err, utf8_bytes) {
            const obj = JSON.parse(utf8_bytes);
            /* istanbul ignore next */
            if (err) {
                reject(err);
            } else {
                resolve(obj);
            }
        });
    });
    return promise;
}

function child_process_spawn(cmd, args) {
    /* istanbul ignore next */
    if (process.platform == "win32") {
        args.unshift('/c', 'bash', cmd);
        cmd = process.env.comspec;
    }
    let env = process.env;
    env.path = process.cwd() + path.delimiter + env.path;
    let options = {
        cwd: process.cwd(),
        env: env,
        shell: true,
        stdio: 'inherit',
        setsid: false
    };

    let promise = new Promise(function(resolve, reject) {
        const process = child_process.spawn(cmd, args, options);

        process.on('exit', function(code) {
            resolve(code);
        });

        /* istanbul ignore next */
        process.on('error', function(err) {
            console.error("Error:", JSON.stringify({
                err: err,
                cmd: cmd,
                args: args,
                options: options
            }, null, 4));
            reject(err);
        });
    });
    return promise;
}

module.exports = {
    assert: assert,
    child_process_spawn: child_process_spawn,
    from_json_file: from_json_file,
    split_freetext: split_freetext,
    to_json_file: to_json_file,
}