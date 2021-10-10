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
    converter: null,
    debug: 0,
    logger: console
};

function get_five_pages() {
    return five_pages;
}

function get_patient_advice() {
    return five_pages.data.patient_advice;
}

function get_converter() {
    if (five_pages.converter == null) {
        five_pages.converter = new showdown.Converter();
    }
    return five_pages.converter;
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

function patient_problems_as_html(problems) {
    let html = '';
    for (let i = 0; i < problems.length; ++i) {
        let problem = problems[i];
        if (i) {
            html += ', '
        }
        html += '<span id="prob-' + i + '">';
        html += problem.display_name;
        html += '</span>';
    }
    return html;
}

function patient_labs_as_html(labs) {
    let html = '';
    for (let i = 0; i < labs.length; ++i) {
        let lab = labs[i];
        let lab_prefix = "lab_" + i;
        if (i) {
            html += ', '
        }
        html += '<span id="' + lab_prefix + '">';

        html += '<span id="' + lab_prefix + '_name">';
        html += lab.lab_test_name + '</span>: ';

        html += '<span id="' + lab_prefix + '_result">';
        html += lab.lab_test_result + '</span> ';

        html += '<span id="' + lab_prefix + '_date">';
        html += '(' + JSON.stringify(lab.date_measured).substring(1, 11) + ')';
        html += '</span>';

        html += '</span>'
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

function replace_if_exists(elem_id, to_html_func, objs) {
    if (objs.length == 0) {
        return;
    }
    let elem = document.getElementById(elem_id);
    if (elem) {
        elem.innerHTML = to_html_func(objs);
    }
}

function patient_info_meds_with_rules() {
    replace_if_exists('meds-with-rules-list',
        meds_with_rules_as_html,
        get_patient_advice().meds_with_rules);
}

function patient_info_meds_without_rules() {
    replace_if_exists('meds-without-rules-list',
        meds_without_rules_as_html,
        get_patient_advice().meds_without_rules);
}

function patient_info_problems() {
    replace_if_exists('patient-problems-list',
        patient_problems_as_html,
        get_patient_advice().problems);
}

function patient_info_labs() {
    replace_if_exists('patient-labs-list',
        patient_labs_as_html,
        get_patient_advice().labs);
}

function set_element_inner(id, html) {
    let elem = document.getElementById(id);
    if (elem) {
        elem.innerHTML = html;
    } else {
        five_pages.logger.error('no "' + id + '" element?');
    }
}

// TODO: break this into smaller functions, perhaps at each level of nesting
function big_nested_medicine_advice_table() {
    let medication_advice = get_patient_advice().medication_advice || [];
    let html = '';
    for (let i = 0; i < medication_advice.length; ++i) {
        let row = medication_advice[i];
        let atc = row.ATC_code;
        let generic_name = row.generic_name;
        let d = generic_name[0];
        let med_url = "https://www.farmacotherapeutischkompas.nl" +
            "/bladeren/preparaatteksten/atc/" +
            atc;
        html += '<div id="div_advice_' + atc + '">';

        html += '<div id="div_med_name_' + atc + '" class="med_name">';
        html += ucfirst(row.medication_name).trim() + '</div>';

        html += '<a href="' + med_url + '" class="fklink" target="_blank">';
        html += '<img src="static/FK_circle_with_linkout.png"';
        html += ' alt="FK" class="fkimg"/></a>' + "\n";

        let div_advice_atc_id = 'advice_' + atc;
        html += '<div id="' + div_advice_atc_id + '" class="advice_no_checkbox">';
        html += '<strong>Advies:</strong>';
        let advices = row.adviceTextsNoCheckboxes;
        for (let j = 0; j < advices.length; ++j) {
            let advice = advices[j];
            let att_prefix = "att_" + i + "_" + j;
            let bogus_rule = "NonCB";
            html += '<div id="' + att_prefix + '_cdss">';
            for (let k = 0; k < advice.cdss_split.length; ++k) {
                let chunk = advice.cdss_split[k];
                let chunk_id = 'ft_' + atc + '_' + bogus_rule + '_' + j + '_' + k;
                if (chunk.editable) {
                    html += '<input id="' + chunk_id + '" type="text"';
                    html += ' value="' + chunk.text + '"/>';
                } else {
                    html += '<div id="' + chunk_id + '">';
                    html += get_converter().makeHtml(chunk.text);
                    html += '</div> <!-- ' + chunk_id + ' -->';
                }
            }
            html += '</div><!-- ' + att_prefix + '_cdss -->' + "\n";
        }
        html += '</div><!-- ' + div_advice_atc_id + ' -->' + "\n";

        let cb_advices = row.adviceTextsCheckboxes;
        let div_advice_selection_area_id = 'advice_selection_area_' + i;
        html += '<div id="' + div_advice_selection_area_id + '"';
        html += ' class="advice_selection_area">';
        html += '<div class="checkbox_section_header"';
        html += '>Maatregelen (aangekruist indien aanbevolen):</div>';
        let div_ref_page_atc_id = 'div_refpages_' + atc;
        html += '<div id="' + div_ref_page_atc_id + '"';
        html += ' class="refpages">Referenties:';
        let referenceNumbers = row.referenceNumbers;
        for (let k = 0; k < referenceNumbers.length; ++k) {
            let ref_page_num = referenceNumbers[k].reference;
            if (k) {
                html += ', ';
            }
            let ref_page_id = 'atc_ref_page_' + atc + '_' + ref_page_num;
            html += '<span id="' + ref_page_id + '" class="atc_ref_page">';
            let ref_url = 'static/refpages/refpage' + ref_page_num + '.html';
            html += '<a href="' + ref_url + '" target="_blank ">';
            html += ref_page_num + '</a>';
            html += '</span><!-- ref_page_id -->\n';
        }
        html += '</div><!-- ' + div_ref_page_atc_id + ' -->';

        // TODO: factor out this loop
        // TODO: extract into checkbox-table.include.html
        html += '<table>\n';
        html += '<tr><td>Kies een of meer maatregel(en):</td><td></td></tr>\n'
        for (let j = 0; j < cb_advices.length; ++j) {
            let cb_advice = cb_advices[j];
            let asa_prefix = "asa_" + i + "_" + j;
            let rulenum = cb_advice.medication_criteria_id;
            let boxnum = cb_advice.select_box_num;
            let advice_id_base = [atc, rulenum, boxnum].join('_');
            let checkbox_id = 'cb_' + advice_id_base;
            let row_id = 'tr_' + advice_id_base;
            html += '<tr id="' + row_id + '">\n';
            html += '<td>';
            html += '<span id="' + asa_prefix + '_sbn">';
            html += '<input type="checkbox" id="' + checkbox_id + '"';
            html += ' name="' + checkbox_id + '"';
            html += ' value="' + checkbox_id + '"';
            html += ' style="visibility:hidden" />';
            html += '</span> <!-- ' + asa_prefix + '_sbn -->';
            html += '</td>\n';
            html += '<td>';
            let asa_cdss_id = asa_prefix + '_cdss';
            html += '<div id="' + asa_prefix + '_cdss" class="med_cdss">';
            for (let k = 0; k < cb_advice.cdss_split.length; ++k) {
                let chunk = cb_advice.cdss_split[k];
                let chunk_id = ['ft', atc, rulenum, boxnum, k].join('_');
                if (chunk.editable) {
                    html += '<input id="' + chunk_id + '" type="text"';
                    html += ' class="ft_input" value="' + chunk.text + '"/>\n';
                } else {
                    html += '<div id="' + chunk_id + '" class ="freetext">\n';
                    let cbString = get_converter().makeHtml(chunk.text);
                    // Select Box texts do not contain legit paragraphs.
                    // It is already in a span so this does not need to be replaced,
                    // just destroyed.
                    cbString = cbString.replace("<p>", "");
                    cbString = cbString.replace("</p>", "");
                    html += cbString;
                    html += '</div> <!-- ' + chunk_id + '" -->\n';
                }
            }
            html += '</div> <!-- ' + asa_cdss_id + ' --></td>\n';
            html += '</tr>\n';
        }
        html += '</table>\n';
        html += '</div><!-- advice_selection_area_' + i + ' -->\n';
        html += '</div><!-- div_advice_' + atc + ' -->\n';
    }

    set_element_inner('medication-advice-list', html);
}

function other_med_advice_area() {
    /*
     * TODO: this is 95% duplicate code
     * The code supports multiple boxes only so it has the same shape as
     * other nearly duplicate code, which needs to be factored together.
     */
    let other_advices = get_patient_advice().advice_other_text;
    let html = '';
    for (let i = 0; i < other_advices.length; ++i) {
        let other_advice = other_advices[i];
        let other_prefix = "other_" + i;
        let category = other_advice.medication_criteria_id;
        let boxnum = other_advice.select_box_num;
        let other_id_base = ['OTHER', category, boxnum].join('_');
        let checkbox_id = 'cb_' + other_id_base;
        let row_id = 'tr_' + other_id_base;
        html += '<div id="' + row_id + '" class="other_advice_row">';
        html += '<span id="' + other_prefix + 'sbn"';
        html += ' class="other_advice_checkbox">\n';
        html += '<input type="checkbox"\n';
        html += '    id="' + checkbox_id + '"\n';
        html += '    name="' + checkbox_id + '"\n';
        html += '    value="' + checkbox_id + '"\n';
        html += '    style="visibility:hidden"\n';
        html += '/>\n';
        html += '</span> <!-- ' + other_prefix + 'sbn -->\n';
        html += '<div id="' + other_prefix + 'cdss_continer"';
        html += ' class="other_cdss_container">\n';
        html += '<div id="' + other_prefix + 'cdss" class="other_cdss">\n';
        for (let k = 0; k < other_advice.cdss_split.length; ++k) {
            let chunk = other_advice.cdss_split[k];
            let chunk_id = ['ft', 'OTHER', category, boxnum, k].join('_');
            if (chunk.editable) {
                html += '<input id="' + chunk_id + '" type="text"';
                html += ' class="ft_input" value="' + chunk.text + '"/>\n';
            } else {
                html += '<div id="' + chunk_id + '" class ="freetext">\n';
                let cbString = get_converter().makeHtml(chunk.text);
                cbString = cbString.replace("<p>", "");
                cbString = cbString.replace("</p>", "");
                html += cbString;
                html += '</div> <!-- ' + chunk_id + ' -->\n';
            }
        }
        html += '</div> <!-- ' + other_prefix + 'cdss -->\n';
        html += '</div> <!-- other_cdss_container -->\n';
        html += '</div><!-- ' + row_id + ' -->\n';
    }
    set_element_inner('div_other_med_advice_area', html);
}

// TODO: This is mostly duplicate code
function non_med_advice_area(hide_additional) {
    let html = '';
    let nm_advices = get_patient_advice().advice_text_non_med;
    let last_category_name = '';
    for (let i = 0; i < nm_advices.length; ++i) {
        let nm_advice = nm_advices[i];
        let nma_prefix = "nma_" + i;
        let category = nm_advice.category_id;
        let boxnum = nm_advice.select_box_num;
        let nma_id_base = ['NONMED', category, boxnum].join('_');
        let checkbox_id = 'cb_' + nma_id_base;
        let row_id = 'tr_' + nma_id_base;
        let category_name = nm_advice.category_name;
        let category_name_class = "nm_category_entry_additional";
        if (category_name != last_category_name) {
            last_category_name = category_name;
            category_name_class = "nm_category_entry_first";
        }
        html += '<div id="' + row_id + '" class="nonmed_row">\n';
        let td_nm_cat_id = ['td', 'nm', 'category', 'name',
            nm_advice.category_id, boxnum
        ].join('_');
        html += '<div id="' + td_nm_cat_id + '"';
        html += ' class="td_nm_category_name ' + category_name_class + '"';
        if (hide_additional &&
            category_name_class == "nm_category_entry_additional") {
            html += ' style="visibility:hidden"';
        }
        html += '>';
        html += category_name + '</div>\n';
        html += '<div id="' + nma_prefix + '_sbn" class="nonmed_checkbox">\n';
        html += '<input type="checkbox"\n';
        html += '    id="' + checkbox_id + '"\n';
        html += '    name="' + checkbox_id + '"\n';
        html += '    value="' + checkbox_id + '"\n';
        html += '    style="visibility:hidden"\n';
        html += '/>\n';
        html += '</div> <!-- ' + nma_prefix + '_sbn -->\n';
        html += '<div id="' + nma_prefix + '_cdss_continer"';
        html += ' class="nonmed_cdss_container">\n';
        html += '<div id="' + nma_prefix + '_cdss" class="nonmed_cdss">\n';
        for (let k = 0; k < nm_advice.cdss_split.length; ++k) {
            let chunk = nm_advice.cdss_split[k];
            let chunk_id = ['ft', 'NONMED', category, boxnum, k].join('_');
            if (chunk.editable) {
                html += '<input id="' + chunk_id + '"';
                html += ' type="text" class="ft_input"';
                html += ' value="' + chunk.text + '"/>\n';
            } else {
                html += '<div id="' + chunk_id + '" class ="freetext">\n';
                let cbString = get_converter().makeHtml(chunk.text);
                // Select Box texts do not contain legit paragraphs.
                // It is already in a span so this does not need to be replaced,
                // just destroyed.
                cbString = cbString.replace("<p>", "");
                cbString = cbString.replace("</p>", "");
                html += cbString + '</div><!-- ' + chunk_id + ' -->\n';
            }
        }
        html += '</div> <!-- ' + nma_prefix + '_cdss -->\n';
        html += '</div> <!-- nonmed_cdss_container -->\n';
        html += '</div><!-- nonmed_row -->\n';
    }
    set_element_inner('non_med_advice_selection_area', html);

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
    patient_info_problems();
    patient_info_labs();
    gauge_risk_score();
    big_nested_medicine_advice_table();
    other_med_advice_area();
    let hide_additional = 1;
    non_med_advice_area(hide_additional);
}

function consult_page_setup() {
    patient_info_age();
    patient_info_meds_with_rules();
    patient_info_meds_without_rules();
    patient_info_problems();
    patient_info_labs();
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
