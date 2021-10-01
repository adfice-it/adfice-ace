// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

var DEBUG = 1;
if (DEBUG > 0) {
    console.log("hello world, from footer.js");
}

function get_url(view, id) {

    let protocol = 'https:';

    // URL.protocol is not safe in older Internet Explorers

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

    let url = protocol + '//' + url_hostname + ':' + url_port + '/' + view;
    url = url + '?id=' + id;
    return url;
}

function switch_view(view, id) {
    let url = get_url(view, id);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
        }
    };

    var data = '{' +
        '"patient_id": ' + id + ',' +
        '"viewer_id": ' + '0' +
        '}';

    xhr.send(data);

    alert('TODO: switch_view(' + view + ', ' + id + ')');

    return true;
}
