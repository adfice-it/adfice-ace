// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

function get_patient_id_param() {
    let params = new URLSearchParams(window.location.search)
    return params.get('id');
}

function load_footer() {
    let footer_url = get_base_url() + 'assets/footer.include.html';
    get_text(footer_url, function(err, footer_include_html) {
        if (err) {
            console.log("url:", footer_url, "error:", err);
        }

        let footer = document.getElementById('div-footer-id');
        footer.innerHTML = footer_include_html;

        let footer_patient_id = document.getElementById('footer-patient-id');
        if (footer_patient_id) {
            footer_patient_id.innerText = get_patient_id_param();
        } else {
            console.log('ERROR! no element footer-patient-id?');
        }
    });
}

function switch_view(view) {
    let base_url = get_base_url();
    let new_url = base_url + view + '?id=' + get_patient_id_param();

    // sort of surprising that this is all it takes:
    window.location = new_url;

    return true;
}
