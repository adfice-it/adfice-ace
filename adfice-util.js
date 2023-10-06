// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const util = require("util");
const child_process = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

function assert(condition, message) {
    if (condition) {
        return;
    } else {
        throw new Error(message || "Assertion failed");
    }
}

/* istanbul ignore next */
function dump(data) {
    console.log(JSON.stringify(data, null, 4));
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

function tmp_path(prefix, suffix) {
    prefix = (typeof prefix !== 'undefined') ? prefix : 'tmp.';
    suffix = (typeof suffix !== 'undefined') ? suffix : '';
    let name = prefix + crypto.randomBytes(16).toString('hex') + suffix;
    return path.join(os.tmpdir(), name);
}

async function to_json_file(path, obj) {
    let json = JSON.stringify(obj, null, 4) + '\n';
    await to_file(path, json);
}

async function to_file(path, contents) {
    let options = {};
    let promise = new Promise(function(resolve, reject) {
        fs.writeFile(path, contents, options, function(err) {
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

/* istanbul ignore next */
function child_process_spawn(cmd, args) {
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

function uuid4_new() {
    return uuid4_set_version_and_variant(crypto.randomBytes(16));
}

function uuid4_new_string() {
    return uuid_bytes_to_string(uuid4_new());
}

function uuid4_set_version_and_variant(bytes) {
    assert_array_has_16_bytes(bytes);
    // Version 4 UUIDs are expected to have 6 fixed bits in the 16 bytes:
    // four bits for the version, and two for the variant.
    // The remaining 122 bits are for psudo-random values.
    // (16 * 8) - 6 = 122
    // xxxxxxxx-xxxx-Vxxx-Txxx-xxxxxxxxxxxx
    // Version: 4 (psudo-random)
    // varianT: 8 (possible values 8, 9, A, B)
    bytes[6] = (bytes[6] & 0x0F) + 0x40; // set Version 4
    bytes[8] = (bytes[8] & 0x3F) + 0x80; // set varianT 8
    return bytes;
}

function uuid_bytes_to_string(bytes) {
    assert_array_has_16_bytes(bytes);
    let uuid_str = '';
    for (let i = 0; i < 16; ++i) {
        // 8-4-4-4-12
        if ((i == 4) || (i == 6) || (i == 8) || (i == 10)) {
            uuid_str += '-';
        }
        if (bytes[i] < 0x10) {
            uuid_str += '0';
        }
        uuid_str += (bytes[i] & 0xFF).toString(16);
    }
    return uuid_str;
}

function string_to_hash(input_string){
	// SHA1 is good enough for this purpose, and produces output of a convenient length
	let hash = crypto.createHash('sha1').update(input_string).digest('hex');
	return hash;
}

/* istanbul ignore next */
function assert_array_has_16_bytes(bytes) {
    assert(((bytes instanceof Uint8Array) ||
            (bytes instanceof Buffer) ||
            (bytes instanceof Array)),
        "bytes type: " + Object.prototype.toString.call(bytes));
    assert(bytes.length >= 16, "too few bytes, bytes.length: " + bytes.length);
    assert(!isNaN(bytes[0]), "bytes does not contain numbers? " +
        " bytes[0]: " + Object.prototype.toString.call(bytes[0]));
}

module.exports = {
    assert: assert,
    child_process_spawn: child_process_spawn,
    dump: dump,
    from_json_file: from_json_file,
    split_freetext: split_freetext,
	string_to_hash: string_to_hash,
    tmp_path: tmp_path,
    to_file: to_file,
    to_json_file: to_json_file,
    uuid4_new,
    uuid4_new_string,
    uuid4_set_version_and_variant,
    uuid_bytes_to_string,
}
