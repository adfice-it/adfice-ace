// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

/* istanbul ignore next */
var basic_utils = {
    new_xhr: function() {
        return new XMLHttpRequest();
    },
    logger: console
};

function get_base_url(url) {
    /* istanbul ignore next */
    url = (url || document.URL);
    // URL.protocol is not safe in Internet Explorer,
    // thus we shall use regex
    let protocol = 'https:';
    const url_regex = /^([^:]*):\/\/([^:/]*)(:([0-9]+))?/
    let matches = url.match(url_regex);
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
    let xhr = basic_utils.new_xhr();
    xhr.open('GET', url, true);
    xhr.responseType = type;
    xhr.onload = function() {
        var status = xhr.status;
        // workaround for IE bug: https://github.com/naugtur/xhr/issues/123
        var response = xhr.response;
        if (type == 'json' && typeof(response) == 'string') {
            try {
                response = JSON.parse(response);
            } catch (err) /* istanbul ignore next */ {
                basic_utils.logger.log(err);
            }
        }
        if (status === 200) {
            callback(null, response);
        } else {
            callback(status, response);
        }
    };
    xhr.send();
};

function get_json(url, callback) {
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

/* istanbul ignore next */
if (typeof module !== 'undefined') {
    module.exports = {
        basic_utils: basic_utils,
        get_json: get_json,
        get_text: get_text,
        get_base_url: get_base_url,
        ucfirst: ucfirst
    }
}
