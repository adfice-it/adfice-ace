// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

var DEBUG = 0;
if (DEBUG > 0) {
    console.log("hello world, from footer.js");
}

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

function switch_view(view) {
    let params = new URLSearchParams(window.location.search)
    patient_id = params.get('id');

    let base_url = get_base_url();
    let new_url = base_url + view + '?id=' + patient_id;

    // sort of surprising that this is all it takes:
    window.location = new_url;

    return true;
}
