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

function page_load(before_socket) {
    let params = new URLSearchParams(window.location.search)
    five_pages.patient_id = params.get('id');

    document.title = 'Patient ' + five_pages.patient_id;

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

function meds_with_rules_as_html(rule_meds) {
    let html = '';
    for (let i = 0; i < rule_meds.length; ++i) {
        let med = rule_meds[i];
        if (i) {
            html += ', '
        }
        html += '<a href="#div_advice_' + med.ATC_code + '"';
        html += ' title="' + med.medication_name + '">';
        html += ucfirst(med.medication_name).trim();
        html += '</a>';
    }
    return html;
}

function meds_without_rules_as_html(other_meds) {
    let html = '';
    for (let i = 0; i < other_meds.length; ++i) {
        let med = other_meds[i];
        if (i) {
            html += ', '
        }
        html += ucfirst(med.medication_name).trim();
    }
    return html;
}

function patient_info_age() {
    let advice = get_patient_advice();
    let elem = document.getElementById('patient-info-age');
    if (elem) {
        elem.innerText = advice.age;
    }
}

function patient_info_meds_with_rules() {
    let advice = get_patient_advice();
    let meds = advice.meds_with_rules;
    if (meds.length == 0) {
        return;
    }
    let elem = document.getElementById('meds-with-rules-list');
    if (elem) {
        elem.innerHTML = meds_with_rules_as_html(meds);
    }
}

function patient_info_meds_without_rules() {
    let advice = get_patient_advice();
    let other_meds = advice.meds_without_rules;
    if (other_meds.length == 0) {
        return;
    }
    let elem = document.getElementById('meds-without-rules-list');
    if (elem) {
        elem.innerHTML = meds_without_rules_as_html(other_meds);
    }
}

function gauge_risk_score() {
    let advice = get_patient_advice();
    let risk_score = advice.risk_score;
    let risk_known;
    if ((risk_score == null) || (isNaN(risk_score))) {
        risk_known = 0;
    } else {
        risk_known = 1;
    }

    let elem_rs = document.getElementById('gauge-risk-score');
    if (elem_rs) {
        if (risk_known) {
            elem_rs.innerHTML = risk_score;
        }
    }
    let elem_gl = document.getElementById('gauge-line');
    if (elem_gl && risk_known) {
        elem_gl.classList.add("gauge_line");
        elem_gl.style.left = risk_score + "%";
    }
}

// the following functions specify the needed elements which vary
// between pages and need to be populated on load
// and see: function page_load(before_socket)

function start_page_setup() {
    patient_info_age();
    gauge_risk_score();
}

function prep_page_setup() {
    patient_info_age();
    patient_info_meds_with_rules();
    patient_info_meds_without_rules();
    gauge_risk_score();
}

function consult_page_setup() {
    patient_info_age();
    patient_info_meds_with_rules();
    patient_info_meds_without_rules();
    gauge_risk_score();
}

function advise_page_setup() {
    patient_info_age();
    gauge_risk_score();
}

function finalize_page_setup() {
    patient_info_age(); // is this needed?
}

// These functions will be called from the web page, e.g.:
// <script>
// window.addEventListener('load', function(event) { start_page_load(); });
// </script>

function start_page_load() {
    page_load(start_page_setup);
}

function prep_page_load() {
    page_load(prep_page_setup);
}

function consult_page_load() {
    page_load(consult_page_setup);
}

function advise_page_load() {
    page_load(advise_page_setup);
}

function finalize_page_load() {
    page_load(finalize_page_setup);
}

// export modules for unit testing ?
if (typeof module !== 'undefined') {
    module.exports = {
        start_page_load: start_page_load,
        prep_page_load: prep_page_load,
        consult_page_load: consult_page_load,
        advise_page_load: advise_page_load,
        finalize_page_load: finalize_page_load,
        get_five_pages: get_five_pages
    }
}
