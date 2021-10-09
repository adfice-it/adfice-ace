// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :

"use strict";

// static/basic-utils.js defines:
//     function get_base_url()
//     function get_content(url, type, callback)
//     function get_JSON(url, callback)
//     function get_text(url, callback)
//     function ucfirst(str)

var five_pages = {
    patient_id: null,
    data: {},
    xhttp: null,
    debug: 0,
    logger: console
};

function get_five_pages() {
    return five_pages;
}

function get_patient_advice() {
    return five_pages.data.patient_advice;
}

function start_page_set_from_json() {
    let el_pi_age = document.getElementById('patient-info-age');
    el_pi_age.innerText = get_patient_advice().age;
}

function page_load(before_socket) {
    let params = new URLSearchParams(window.location.search)
    five_pages.patient_id = params.get('id');

    let el_pi_id = document.getElementById('patient-info-id');
    el_pi_id.innerText = five_pages.patient_id;

    let json_url = get_base_url() + 'advice?id=' + patient_id;
    get_JSON(json_url, function(err, json_data) {
        if (err) {
            console.log("url:", json_url, "error:", err);
        }
        five_pages.data = json_data;
        if (five_pages.debug > 0) {
            five_pages.logger.log(JSON.stringify({
                five_pages: five_pages
            }, null, 4));
        }

        before_socket();

        // common.js defines connect_web_socket_and_keep_alive()
        connect_web_socket_and_keep_alive();
    });
}

function start_page_load() {
    page_load(start_page_set_from_json);
}

// export modules for unit testing ?
if (typeof module !== 'undefined') {
    module.exports = {
        start_page_load: start_page_load,
        get_five_pages: get_five_pages
    }
}
