// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

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
