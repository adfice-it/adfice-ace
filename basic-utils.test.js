// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021-2024 Stichting Open Electronics Lab
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const bu = require('./static/basic-utils.js');
const http = require('http');

test('ucfirst', function() {
    expect(bu.ucfirst('foo bar')).toBe('Foo bar');
    expect(bu.ucfirst('FOOo')).toBe('FOOo');
    expect(bu.ucfirst(null)).toBe(null);
    expect(bu.ucfirst(7)).toBe(7);
});

test('get_base_url', function() {
    let document_URL = 'https://www.exmaple.org:8443/foo/bar?id=val&whiz=bang';
    let expectd_base = 'https://www.exmaple.org:8443/'
    expect(bu.get_base_url(document_URL)).toBe(expectd_base);

    document_URL = 'https://www.exmaple.org:/foo/bar?id=val&whiz=bang';
    expectd_base = 'https://www.exmaple.org:443/'
    expect(bu.get_base_url(document_URL)).toBe(expectd_base);

    document_URL = 'http://www.exmaple.org:8080/foo/bar?id=val&whiz=bang';
    expectd_base = 'http://www.exmaple.org:8080/'
    expect(bu.get_base_url(document_URL)).toBe(expectd_base);

    document_URL = 'http://www.exmaple.org:/foo/bar?id=val&whiz=bang';
    expectd_base = 'http://www.exmaple.org:80/'
    expect(bu.get_base_url(document_URL)).toBe(expectd_base);
});

function mock_xhr_request(bu_get_func, status_code, resp_in, resp_out) {
    let open_called = 0;
    let test_url = 'http://example.org/test?foo=bar';
    let mock_xhr = {
        response: resp_in,
        status: status_code,
        open: function(method, url, is_async) {
            ++open_called;
            expect(method).toBe('GET');
            expect(url).toBe(test_url);
            expect(is_async).toBe(true);
        },
        responseType: null,
        onload: function() {},
        send: function() {
            mock_xhr.onload();
        }
    };

    let orig_new_xhr = bu.basic_utils.new_xhr;
    bu.basic_utils.new_xhr = function() {
        return mock_xhr;
    };
    bu_get_func(test_url, function(err, data) {
        if (status_code === 200) {
            expect(err).toBe(null);
        } else {
            expect(err).toBe(status_code);
        }
        expect(data).toStrictEqual(resp_out);
    });
    bu.basic_utils.new_xhr = orig_new_xhr;

    expect(open_called).toBe(1);

    if (bu_get_func === bu.get_json) {
        expect(mock_xhr.responseType).toBe('json');
    } else {
        expect(mock_xhr.responseType).toBe('text');
    }
}

test('get_json', async function() {
    let status_code = 200;
    let resp = {
        foo: 'bar'
    };
    mock_xhr_request(bu.get_json, status_code, resp, resp);
});

test('get_json_text', async function() {
    let status_code = 200;
    let resp_in = '{ "foo": "bar" }';
    let resp_out = {
        foo: 'bar'
    };
    mock_xhr_request(bu.get_json, status_code, resp_in, resp_out);
});

test('get_json_404', async function() {
    let status_code = 404;
    let resp_in = '"Not found."';
    let resp_out = JSON.parse('"Not found."');
    mock_xhr_request(bu.get_json, status_code, resp_in, resp_out);
});

test('get_text', async function() {
    let status_code = 200;
    let resp = 'hello, world';
    mock_xhr_request(bu.get_text, status_code, resp, resp);
});
