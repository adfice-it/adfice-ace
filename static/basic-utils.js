// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

function get_base_url() {
    // URL.protocol is not safe in Internet Explorer,
    // thus we shall use regex
    let protocol = 'https:';
    const url_regex = /^([^:]*):\/\/([^:/]*)(:([0-9]+))?/
    let matches = document.URL.match(url_regex);
    let url_protocol = matches[1];
    let url_hostname = matches[2];
    let url_port = matches[4];

    if (url_protocol === 'http') {
        protocol = 'http:';
        if (!url_port) {
            url_port = 80;
        }
    } else {
        if (!url_port) {
            url_port = 443;
        }
    }

    return protocol + '//' + url_hostname + ':' + url_port + '/';
}

function get_content(url, type, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = type;
// this does not seem to fix IE JSON compatability
//	if (type == "json"){
//	xhr.json = true;
//	}
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};

function get_JSON(url, callback) {
    get_content(url, 'json', callback);
}

function get_text(url, callback) {
    get_content(url, 'text', callback);
}

function ucfirst(s) {
    if (typeof s !== 'string') {
        return s;
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
}
