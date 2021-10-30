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
    // let params = new URLSearchParams(window.location.search)
    five_pages.patient_id = urlParam('id');

    document.title = 'Patient ' + five_pages.patient_id;

    let el_pi_id = document.getElementById('patient-info-id');
    el_pi_id.innerText = five_pages.patient_id;

    let json_url = get_base_url() + 'advice?id=' + five_pages.patient_id;
    // json_data is populated by getAdviceForPatient() in adfice.js
    get_JSON(json_url, function(err, json_data) {
        console.log(json_data);
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

function patient_info_problem_start() {
    let all_problems = get_patient_advice().all_problems;
    let problems = get_patient_advice().problems;
    let html = '<div id="problem_table_div"><table id="problem_table"><tr><th class="patient_data_td">Aandoening</th><th class="patient_data_td">Aanwezig</th></tr>';
    let all_problem_names = Object.keys(all_problems);
    for (let i = 0; i < all_problem_names.length; ++i) {
        let display_name = all_problems[all_problem_names[i]];
        html += '<tr><td class="patient_data_td">' + display_name + '</td><td class="patient_data_td">';
        let ja_nee = 'Nee';
        for (let j = 0; j < problems.length; ++j) {
            if (all_problem_names[i] == problems[j].name) {
                ja_nee = 'Ja';
            }
        }
        html += ja_nee + '</td></tr>';
    }
    html += '</table></div><!-- problem_table -->';
    document.getElementById('patient-problems').innerHTML = html;
}

function patient_info_lab_start() {
    let all_labs = get_patient_advice().all_labs;
    let labs = get_patient_advice().labs;
    let html = '<div id="lab_table_div"><table id="lab_table"><tr><th class="patient_data_td">Lab</th><th class="patient_data_td">Datum gemeten</th><th class="patient_data_td">Waarde</th></tr>';
    for (let i = 0; i < all_labs.length; ++i) {
        let lab = all_labs[i];
        html += '<tr><td class="patient_data_td">' + lab + '</td>';
        let date = '';
        let result = '';
        for (let j = 0; j < labs.length; ++j) {
            if (lab == labs[j].lab_test_name) {
                date = niceDate(labs[j].date_measured);
                result = labs[j].lab_test_result;
                let units = labs[j].lab_test_units;
                if (typeof(units) != 'undefined' && units != null) {
                    result += ' ' + units;
                }
            }
        }
        html += '<td class="patient_data_td">' + date + '</td><td class="patient_data_td">' + result + '</td></tr>';
    }
    html += '</table></div><!-- lab_table -->';
    document.getElementById('patient-labs').innerHTML = html;
}

function patient_info_meds_with_rules_start() {
    let rule_meds = get_patient_advice().meds_with_rules;
    let html = '';
    for (let i = 0; i < rule_meds.length; ++i) {
        let med = rule_meds[i];
        if (i) {
            html += ', '
        }
        html += ucfirst(med.medication_name).trim();
    }
    html += '<br>';
    document.getElementById('meds-with-rules').innerHTML = html;
}

function prediction_start() {
    let measurements = get_patient_advice().measurements;
    // for some unholy reason, measurements.prediction_result is null in IE when the page first loads. We'll use risk_score, which is not null.
    let risk_score = get_patient_advice().risk_score;
    if (risk_score == null) {
        // if we do not have a prediction result, 
        // let the user enter prediction model data and hide the prediction model info
        missing_data_form(measurements);
        document.getElementById('prediction_data_container').style.display = 'none';
    } else {
        prediction_data_start(measurements);
        // if we have a prediction model result but it came from user-entered data, allow the user to change it
        if (measurements.user_values_updated != null) {
            missing_data_form(measurements);
        } else {
            // if we actually got complete data from the EHR, don't let the user change it
            document.getElementById('prediction_missing_container').style.display = 'none';
        }
    }
}

function missing_data_form(measurements) {
    let footnote = '';
    let html = '<h3>Data voor predictiemodel</h3><p>Vul de onderstaande data in om een risico te (her)berekenen.</p>\
				<form>\
				<table class="prediction_missing" id = "prediction_missing_table">\
				<tr><th class="prediction_missing">variabel</th><th class="prediction_missing">huidige waarde</th><th class="prediction_missing" >nieuwe waarde</th></tr>';
    if (measurements.GDS_score == null) {
        html += '<tr><td class="prediction_missing">GDS score</td><td class="prediction_missing">';
        if (measurements.user_GDS_score != null) {
            html += measurements.user_GDS_score;
        }
        html += '</td><td class="prediction_missing"><select name = "GDS_dropdown">'
        for (let i = 0; i <= 30; ++i) {
            html += '<option value = "' + i + '">' + i + '</option>'
        }
        html += '</select></td>';
    }
    if (measurements.grip_kg == null) {
        html += '<tr><td class="prediction_missing">grijpkracht kg (hoogste meting)</td><td class="prediction_missing">';
        if (measurements.user_grip_kg != null) {
            html += measurements.user_grip_kg;
        }
        html += '</td><td class="prediction_missing"><input type="number" min="0.00" max="99.99"></td>';
    }
    if (measurements.walking_speed_m_per_s == null) {
        html += '<tr><td class="prediction_missing">loopsnelheid m/s (zo snel mogelijk)</td><td class="prediction_missing">';
        if (measurements.user_walking_speed_m_per_s != null) {
            html += measurements.user_walking_speed_m_per_s;
        }
        html += '</td><td class="prediction_missing"><input type="number" min="0.00" max="99.99"></td>';
    }
    if (measurements.BMI == null && (measurements.height_cm == null || measurements.weight_kg == null)) {
        html += '<tr><td class="prediction_missing">lengte cm</td><td class="prediction_missing">';
        if (measurements.user_height_cm != null) {
            html += measurements.user_height_cm;
        }
        html += '</td><td class="prediction_missing"><input type="number" min="40" max="250"></td>';
        html += '<tr><td class="prediction_missing">gewicht kg</td><td class="prediction_missing">';
        if (measurements.user_weight_kg != null) {
            html += measurements.user_weight_kg;
        }
        html += '</td><td class="prediction_missing"><input type="number" min="20" max="500"></td>';
    }
    if (measurements.systolic_bp_mmHg == null) {
        html += '<tr><td class="prediction_missing">systolische bloeddruk mmHg</td><td class="prediction_missing">';
        if (measurements.user_systolic_bp_mmHg != null) {
            html += measurements.user_systolic_bp_mmHg;
        }
        html += '</td><td class="prediction_missing"><input type="number" min="20" max="250"></td>';
    }
    if (measurements.number_of_limitations == null) {
        html += '<tr><td class="prediction_missing">aantal functionele beperkingen*</td><td class="prediction_missing">';
        if (measurements.user_number_of_limitations != null) {
            html += measurements.user_number_of_limitations;
        }
        html += '</td><td class="prediction_missing"><select name = "ADL_dropdown">'
        for (let i = 0; i <= 5; ++i) {
            html += '<option value = "' + i + '">' + i + '</option>'
        }
        html += '</select></td>';
        footnote += '*Aantal van het volgende items waarop de patient heeft enige moiete of kan niet:\n';
        footnote += '<ol><li>Kunt u een trap van 15 treden op- en aflopen zonder stil te moeten staan?</li>\n';
        footnote += '<li>Kunt u zich aan- en uitkleden?</li>\n';
        footnote += '<li>Kunt u gaan zitten en opstaan uit een stoel?</li>\n';
        footnote += '<li>Kunt u de nagels van uw tenen knippen?</li>\n';
        footnote += '<li>Kunt u buitenshuis vijf minuten aan &eacute;&eacute;n stuk lopen zonder stil te staan?</li></ol>';
    }
    if (measurements.nr_falls_12m == null) {
        html += '<tr><td class="prediction_missing">aantal valincidenten laatste 12 maanden</td><td class="prediction_missing">';
        if (measurements.user_nr_falls_12m != null) {
            html += measurements.user_nr_falls_12m;
        }
        html += '</td><td class="prediction_missing"><input type="number" min="0" max="1000"></td>';
    }
    if (measurements.smoking == null) {
        html += '<tr><td class="prediction_missing">roker</td><td class="prediction_missing">';
        if (measurements.user_smoking != null) {
            html += measurements.user_smoking;
        }
        html += '</td><td class="prediction_missing"><select id = "smoking_dropdown" name = "smoking_dropdown"><option value = "1">Ja</option><option value = "0">Nee </option></select></td>';
    }
    if (measurements.education_hml == null) {
        html += '<tr><td class="prediction_missing">opleidingsniveau**</td><td class="prediction_missing">';
        if (measurements.user_education_hml != null) {
            html += measurements.user_education_hml;
        }
        html += '</td><td class="prediction_missing"><select name = "education_dropdown"><option value = "1">Laag</option><option value = "2">Midden</option><option value = "3">Hoog</option></select></td>';
        footnote += '**Kies uit:<br>Laag: lager beroepsonderwijs: LTS, LHNO, LEAO, handels(dag)school, huishoudschool, agrarische school, praktijkdiploma, middenstandsonderwijs';
        footnote += '<br>Midden: middelbaarberoepsonderwijs: MBA, LO-akten, MTS, MEAO';
        footnote += '<br>Hoog: hoger beroepsonderwijs: HTS, HEAO, MO-opleiding, kweekschool, sociale/pedagogische academie<br>';
    }
    if (measurements.fear0 == null && measurements.fear1 == null && measurements.fear2 == null) {
        html += '<tr><td class="prediction_missing">angst om te vallen***</td><td class="prediction_missing">';
        if (measurements.user_fear0 == 1) {
            html += '0';
        }
        if (measurements.user_fear1 == 1) {
            html += '1';
        }
        if (measurements.user_fear2 == 1) {
            html += '2';
        }
        html += '</td><td class="prediction_missing"><select name = "fear_dropdown"><option value = "0">0: niet bang</option><option value = "1">1: een beetje/redelijk</option><option value = "2">2: erg bezorgd</option></select></td>';
        footnote += '***Kies 0 als de pati&euml;nt heeft <q>helemaal niet bang</q> beantwoord bij alle items op de FES-I SF7. Kies 1 als de pati&euml;nt heeft <q>Een beetje bezorgd</q> of <q>redelijk bezorgd</q> beantwoord bij tenminste 1 vraag, en kies 2 als de pati&euml;nt heeft <q>Erg bezorgd</q> beantwoord bij tenminste 1 vraag.';
    }
    html += '</table><input type="button" value="Verstuur" onclick="updateMeas()"></form>';
    html += '<div id="footnote_missing">' + footnote + '</div><!-- footnote_missing -->';
    document.getElementById('prediction_missing_container').innerHTML = html;
}

function updateMeas() {
    // TODO
}

function prediction_data_start(measurements) {
    document.getElementById('GDS_score').innerHTML = niceValue(measurements.GDS_score);
    document.getElementById('user_GDS_score').innerHTML = niceValue(measurements.user_GDS_score);
    document.getElementById('GDS_date_measured').innerHTML = niceDate(measurements.GDS_date_measured);
    document.getElementById('grip_kg').innerHTML = niceValue(measurements.grip_kg);
    document.getElementById('user_grip_kg').innerHTML = niceValue(measurements.user_grip_kg);
    document.getElementById('grip_date_measured').innerHTML = niceDate(measurements.grip_date_measured);
    document.getElementById('walking_speed_m_per_s').innerHTML = niceValue(measurements.walking_speed_m_per_s);
    document.getElementById('user_walking_speed_m_per_s').innerHTML = niceValue(measurements.user_walking_speed_m_per_s);
    document.getElementById('walking_date_measured').innerHTML = niceDate(measurements.walking_date_measured);
    let user_BMI = null;
    if (measurements.user_weight_kg != null && measurements.user_height_cm != null) {
        user_BMI = measurements.user_weight_kg / ((measurements.user_height_cm / 100) ^ 2);
    }
    document.getElementById('BMI').innerHTML = niceValue(measurements.BMI);
    document.getElementById('user_bmi_calc').innerHTML = niceValue(user_BMI);
    document.getElementById('BMI_date_measured').innerHTML = niceDate(measurements.BMI_date_measured);
    document.getElementById('systolic_bp_mmHg').innerHTML = niceValue(measurements.systolic_bp_mmHg);
    document.getElementById('user_systolic_bp_mmHg').innerHTML = niceValue(measurements.user_systolic_bp_mmHg);
    document.getElementById('bp_date_measured').innerHTML = niceDate(measurements.bp_date_measured);
    document.getElementById('number_of_limitations').innerHTML = niceValue(measurements.number_of_limitations);
    document.getElementById('user_number_of_limitations').innerHTML = niceValue(measurements.user_number_of_limitations);
    document.getElementById('functional_limit_date_measured').innerHTML = niceDate(measurements.functional_limit_date_measured);
    document.getElementById('nr_falls_12m').innerHTML = niceValue(measurements.nr_falls_12m);
    document.getElementById('user_nr_falls_12m').innerHTML = niceValue(measurements.user_nr_falls_12m);
    document.getElementById('nr_falls_date_measured').innerHTML = niceDate(measurements.nr_falls_date_measured);
    document.getElementById('smoking').innerHTML = niceValue(measurements.smoking);
    document.getElementById('user_smoking').innerHTML = niceValue(measurements.user_smoking);
    document.getElementById('smoking_date_measured').innerHTML = niceDate(measurements.smoking_date_measured);
    document.getElementById('has_antiepileptica').innerHTML = niceValue(measurements.has_antiepileptica);
    document.getElementById('has_ca_blocker').innerHTML = niceValue(measurements.has_ca_blocker);
    document.getElementById('has_incont_med').innerHTML = niceValue(measurements.has_incont_med);
    document.getElementById('education_hml').innerHTML = niceValue(measurements.education_hml);
    document.getElementById('user_education_hml').innerHTML = niceValue(measurements.user_education_hml);
    let fear = '';
    if (measurements.fear0) {
        fear = 0;
    }
    if (measurements.fear1) {
        fear = 1;
    }
    if (measurements.fear2) {
        fear = 2;
    }
    document.getElementById('fear').innerHTML = fear;
    fear = '';
    if (measurements.user_fear0) {
        fear = 0;
    }
    if (measurements.user_fear1) {
        fear = 1;
    }
    if (measurements.user_fear2) {
        fear = 2;
    }
    document.getElementById('user_fear').innerHTML = fear;
    document.getElementById('fear_of_falls_date_measured').innerHTML = niceDate(measurements.fear_of_falls_date_measured);
    if (measurements.user_values_updated != null) {
        document.getElementById('user_values_updated').innerHTML = niceDate(measurements.user_values_updated);
    }
}


function set_element_inner(id, html) {
    let elem = document.getElementById(id);
    if (elem) {
        elem.innerHTML = html;
    } else {
        five_pages.logger.error('no "' + id + '" element?');
    }
}

function cdss_freetext(cdss_split, allow_edit, ftdivclass, ftprefix,
    atc, rulenum, boxnum) {
    let html = '';
    for (let k = 0; k < cdss_split.length; ++k) {
        let chunk = cdss_split[k];
        let chunk_id = [ftprefix, atc, rulenum, boxnum, k].join('_');
        if (allow_edit && chunk.editable) {
            html += '<input id="' + chunk_id + '" type="text" placeholder="Specificeer hier..."';
            html += ' class="ft_input" value="' + chunk.text + '"/>\n';
        } else {
            html += '<div id="' + chunk_id + '" class ="' + ftdivclass + '">\n';
            let cbString = get_converter().makeHtml(chunk.text);
            // Select Box texts do not contain legit paragraphs.
            // It is already in a span so this does not need to be
            // replaced, just destroyed.
            cbString = cbString.replace("<p>", "");
            cbString = cbString.replace("</p>", "");
            html += cbString + '</div><!-- ' + chunk_id + ' -->\n';
        }
    }
    return html;
}

function input_checkbox(checkbox_id) {
    return '<input type="checkbox"' +
        ' id="' + checkbox_id + '"' +
        ' name="' + checkbox_id + '"' +
        ' value="' + checkbox_id + '"' +
        ' style="visibility:hidden" />';
}

// TODO: break this into smaller functions, perhaps at each level of nesting
function big_nested_medicine_advice_table(include_no_checkbox_advice) {
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
        html += '<div id="div_advice_' + atc +
            '" class="med_advice_container"><div id="div_advice_row1_' + atc +
            '" class="med_advice_row1">';

        html += '<div id="div_med_name_' + atc + '" class="med_name">';
        html += ucfirst(row.medication_name).trim() + '</div>';

        html += '<a href="' + med_url + '" class="fklink" target="_blank">';
        html += '<img src="static/FK_circle_with_linkout.png"';
        html += ' alt="FK" class="fkimg"/></a>' + "\n";

        let div_ref_page_atc_id = 'div_refpages_' + atc;
        html += '<div id="' + div_ref_page_atc_id + '"';
        html += ' class="refpages">Richtlijnen:';
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
        html += '</div><!-- ' + div_ref_page_atc_id + ' -->\n';
        html += '</div><!-- div_advice_row1_' + atc + ' -->\n';
        html += '<div id="div_advice_row2_' + atc + '" class="med_advice_row2">\n';

        if (include_no_checkbox_advice) {
            let div_advice_atc_id = 'advice_' + atc;
            html += '<div id="' + div_advice_atc_id + '" class="advice_no_checkbox">';
            html += '<strong>Advies:</strong>';
            let advices = row.adviceTextsNoCheckboxes;
            for (let j = 0; j < advices.length; ++j) {
                let advice = advices[j];
                let att_prefix = "att_" + i + "_" + j;
                let bogus_rule = "NonCB";
                let allow_edit = 1;
                html += '<div id="' + att_prefix + '_cdss">';
                html += cdss_freetext(advice.cdss_split, allow_edit,
                    'freetext', 'ft', atc, bogus_rule, j);
                html += '</div><!-- ' + att_prefix + '_cdss -->' + "\n";
            }
            html += '</div><!-- ' + div_advice_atc_id + ' -->' + "\n";
        }

        let cb_advices = row.adviceTextsCheckboxes;
        let div_advice_selection_area_id = 'advice_selection_area_' + i;
        html += '<div id="' + div_advice_selection_area_id + '"';
        html += ' class="advice_selection_area">';
        html += '<div class="checkbox_section_header"';
        html += '>Maatregelen (aangekruist indien aanbevolen):</div>';


        // TODO: factor out this loop
        // TODO: extract into checkbox-table.include.html
        html += '<table>\n';
        html += '<tr><td colspan = 2>Kies een of meer maatregel(en):</td></tr>\n'
        for (let j = 0; j < cb_advices.length; ++j) {
            let cb_advice = cb_advices[j];
            let asa_prefix = "asa_" + i + "_" + j;
            let rulenum = cb_advice.medication_criteria_id;
            let boxnum = cb_advice.select_box_num;
            let advice_id_base = [atc, rulenum, boxnum].join('_');
            let checkbox_id = 'cb_' + advice_id_base;
            let row_id = 'tr_' + advice_id_base;
            html += '<tr id="' + row_id + '">\n';
            html += '<td class="checkbox_row">';
            html += input_checkbox(checkbox_id);
            html += '</td>\n';
            html += '<td class="checkbox_row">';
            let asa_cdss_id = asa_prefix + '_cdss';
            html += '<div id="' + asa_prefix + '_cdss" class="med_cdss">';
            let allow_edit = 1;
            html += cdss_freetext(cb_advice.cdss_split, allow_edit, 'freetext',
                'ft', atc, rulenum, boxnum);
            html += '</div> <!-- ' + asa_cdss_id + ' --></td>\n';
            html += '</tr>\n';
        }
        html += '</table>\n';
        html += '</div><!-- advice_selection_area_' + i + ' -->\n';
        html += '</div><!-- div_advice_row2_' + atc + ' -->\n';
        html += '</div><!-- div_advice_' + atc + ' -->\n';
    }

    set_element_inner('medication-advice-list', html);
}

function patient_medicine_advice_table() {
    let html = '';
    let medication_advice = get_patient_advice().medication_advice || [];
    for (let i = 0; i < medication_advice.length; ++i) {
        let row = medication_advice[i];
        let atc = row.ATC_code;
        let cb_advices = row.adviceTextsCheckboxes;
        html += '<div id="advice_patient_area_' + atc + '"';
        html += ' class="advice_patient_area">\n';
        html += '<div id="div_patient_med_name_' + atc + '"';
        html += ' class="patient_med_name">';
        html += ucfirst(row.medication_name).trim() + '</div>\n';

        for (let j = 0; j < cb_advices.length; ++j) {
            let cb_advice = cb_advices[j];
            let paa_prefix = "paa_" + i + "_" + j;
            let rulenum = cb_advice.medication_criteria_id;
            let boxnum = cb_advice.select_box_num;
            let advice_id_base = [atc, rulenum, boxnum].join('_');
            let checkbox_id = 'cb_' + advice_id_base;
            let row_id = 'pt_' + advice_id_base;
            html += '<div id="' + row_id + '" class="patient_med_cb_row"';
            html += ' style="display:none">';
            let allow_edit = 0;
            html += cdss_freetext(cb_advice.patient_split, allow_edit,
                'patient_med_cb_text', 'pft', atc, rulenum, boxnum);
            html += '</div><!-- ' + row_id + ' -->';
        }
        // TODO: is this better done as if (cb_advices.length == 0) ?
        html += '<div id="geen_advies_' + atc + '" class="geen_advies">';
        html += 'Geen advies.</div>';
        html += '</div> <!-- advice_patient_area_' + i + ' -->\n';
    }
    set_element_inner('patient-medication-advice-list', html);
}

function other_med_advice_area() {
    /*
     * TODO: this is 95% duplicate code
     * The code supports multiple boxes only so it has the same shape as
     * other nearly duplicate code, which needs to be factored together.
     */
    let other_advices = get_patient_advice().advice_other_text;
    let html = '';
    let pre_pre = 'other';
    let row_pre = 'tr';
    let row_class = 'other_advice_row';
    let allow_edit = 0;
    for (let i = 0; i < other_advices.length; ++i) {
        let other_advice = other_advices[i];
        let other_prefix = pre_pre + '_' + i;
        let category = other_advice.medication_criteria_id;
        let boxnum = other_advice.select_box_num;
        let other_id_base = ['OTHER', category, boxnum].join('_');
        let checkbox_id = 'cb_' + other_id_base;
        let row_id = row_pre + '_' + other_id_base;
        html += '<div id="' + row_id + '" class="' + row_class + '">';
        html += '<span id="' + other_prefix + 'sbn"';
        html += ' class="other_advice_checkbox">\n';
        html += input_checkbox(checkbox_id);
        html += '</span> <!-- ' + other_prefix + 'sbn -->\n';
        html += '<div id="' + other_prefix + 'cdss_continer"';
        html += ' class="other_cdss_container">\n';
        html += '<div id="' + other_prefix + 'cdss" class="other_cdss">\n';
        let allow_edit = 1;
        html += cdss_freetext(other_advice.cdss_split, allow_edit, 'freetext',
            'ft', 'OTHER', category, boxnum);
        html += '</div> <!-- ' + other_prefix + 'cdss -->\n';
        html += '</div> <!-- other_cdss_container -->\n';
        html += '</div><!-- ' + row_id + ' -->\n';
    }
    set_element_inner('div_other_med_advice_area', html);
}

function patient_other_med_advice_area() {
    let other_advices = get_patient_advice().advice_other_text;
    let html = '';
    let pre_pre = 'poa';
    let row_pre = 'pt';
    let atc = 'OTHER';
    let row_class = 'patient_othermed_cb_row';
    for (let i = 0; i < other_advices.length; ++i) {
        let other_advice = other_advices[i];
        let other_prefix = pre_pre + '_' + i;
        let rulenum = other_advice.medication_criteria_id;
        let boxnum = other_advice.select_box_num;
        let other_id_base = ['OTHER', rulenum, boxnum].join('_');
        let checkbox_id = 'cb_' + other_id_base;
        let row_id = row_pre + '_' + other_id_base;

        html += '<div id="' + row_id + '" class="' + row_class + '"';
        html += ' style="display:none">';
        let allow_edit = 0;
        html += cdss_freetext(other_advice.patient_split, allow_edit,
            'patient_othermed_cb_text', 'pft', atc, rulenum, boxnum);
        html += '</div><!-- ' + row_id + ' -->\n'
    }
    set_element_inner('div_other_med_advice', html);
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
        html += input_checkbox(checkbox_id);
        html += '</div> <!-- ' + nma_prefix + '_sbn -->\n';
        html += '<div id="' + nma_prefix + '_cdss_continer"';
        html += ' class="nonmed_cdss_container">\n';
        html += '<div id="' + nma_prefix + '_cdss" class="nonmed_cdss">\n';
        let allow_edit = 1;
        html += cdss_freetext(nm_advice.cdss_split, allow_edit, 'freetext',
            'ft', 'NONMED', category, boxnum);
        html += '</div> <!-- ' + nma_prefix + '_cdss -->\n';
        html += '</div> <!-- nonmed_cdss_container -->\n';
        html += '</div><!-- nonmed_row -->\n';
    }
    set_element_inner('non_med_advice_selection_area', html);
}

function patient_non_med_advice() {
    let html = '';
    let nm_advices = get_patient_advice().advice_text_non_med;
    for (let i = 0; i < nm_advices.length; ++i) {
        let nm_advice = nm_advices[i];
        let nma_prefix = "nma_" + i;
        let category = nm_advice.category_id;
        let category_name = nm_advice.category_name;
        let boxnum = nm_advice.select_box_num;
        let nma_id_base = ['NONMED', category, boxnum].join('_');
        let row_id = 'pt_' + nma_id_base;

        html += '<div id="' + row_id + '" class="patient_nonmed_cb_row"';
        html += ' style="display:none">\n';
        let allow_edit = 0;
        html += cdss_freetext(nm_advice.patient_split, allow_edit,
            "patient_nonmed_cb_text", 'pft', 'NONMED', category, boxnum);
        html += '</div> <!-- ' + row_id + ' -->\n';
    }
    set_element_inner('patient-non-med-advice-list', html);
}

// TODO: lots of duplication here, too
function div_all_ehr_text() {
    // <div id="div_all_ehr_text" class="div_all_ehr_text">
    let html = '';
    let medication_advice = get_patient_advice().medication_advice || [];
    for (let i = 0; i < medication_advice.length; ++i) {
        html += '<div id="advice_ehr_area_' + i + '" class="advice_ehr_area">';
        let row = medication_advice[i];
        let atc = row.ATC_code;
        let cb_advices = row.adviceTextsCheckboxes;
        html += ucfirst(row.medication_name).trim() + ':\n';
        for (let j = 0; j < cb_advices.length; ++j) {
            let cb_advice = cb_advices[j];
            let aea_prefix = "aea_" + i + "_" + j;
            let rulenum = cb_advice.medication_criteria_id;
            let boxnum = cb_advice.select_box_num;
            let advice_id_base = [atc, rulenum, boxnum].join('_');
            let checkbox_id = 'cb_' + advice_id_base;
            let row_id = 'et_' + advice_id_base;
            html += '<div id="' + row_id + '"';
            html += ' style="display:none">\n';
            let allow_edit = 0;
            html += cdss_freetext(cb_advice.ehr_split, allow_edit, 'efreetext',
                'eft', atc, rulenum, boxnum);
            html += '</div><!-- ' + row_id + ' -->\n';
        }
        html += '</div> <!-- advice_ehr_area_' + i + ' -->\n';
    }
    html += '<!-- Begin OTHER -->\n';
    let other_advices = get_patient_advice().advice_other_text || [];
    for (let i = 0; i < other_advices.length; ++i) {
        let other_advice = other_advices[i];
        let other_prefix = "other_" + i;
        let category = other_advice.medication_criteria_id;
        let boxnum = other_advice.select_box_num;
        let other_id_base = ['OTHER', category, boxnum].join('_');
        let row_id = 'et_' + other_id_base;
        html += '<div id="' + row_id + '"';
        html += ' style="display:none;">\n';
        let allow_edit = 0;
        html += cdss_freetext(other_advice.ehr_split, allow_edit, 'efreetext',
            'eft', 'OTHER', category, boxnum);
        html += '</div> <!-- ' + row_id + ' -->\n';
    }
    html += '<!-- End OTHER -->\n';

    html += '<!-- Begin NonMed -->\n';
    let nm_advices = get_patient_advice().advice_text_non_med || [];
    for (let i = 0; i < nm_advices.length; ++i) {
        let nm_advice = nm_advices[i];
        let category = nm_advice.category_id;
        let boxnum = nm_advice.select_box_num;
        let nma_id_base = ['NONMED', category, boxnum].join('_');
        let row_id = 'et_' + nma_id_base;
        html += '<div id="' + row_id + '"';
        html += ' style="display:none">\n';
        let allow_edit = 0;
        html += cdss_freetext(nm_advice.ehr_split, allow_edit, 'efreetext',
            'eft', 'NONMED', category, boxnum);
        html += '</div> <!-- ' + row_id + ' -->\n';
    }
    html += '<!-- End NonMed -->\n';
    set_element_inner('div_all_ehr_text', html);
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
            elem_rs.innerHTML = risk_score + '%';
        }
    }
    let elem_gl = document.getElementById('gauge-line');
    if (elem_gl && risk_known) {
        elem_gl.style.left = risk_score + "%";
        elem_gl.style.visibility = 'visible';
    }
}

function niceDate(dtstring) {
    if (dtstring == null) {
        return '';
    }
    // expects string in the form of YYYY-MM-DDTHH:MM:SS.mmmm
    if (dtstring.match(/^([0-9]{4}.[0-9]{2}.[0-9]{2}.*)$/)) {
        let year = dtstring.substring(0, 4);
        let m = dtstring.substring(5, 7);
        let d = dtstring.substring(8, 10);
        return d + '-' + m + '-' + year;
    } else {
        return 'onbekend';
    }
}

// Workaround for IE literally displaying "null" for null values
function niceValue(value) {
    if (value == null || typeof(value) == 'unknown') {
        return '';
    } else {
        return value.toString();
    }
}

// the following functions specify the needed elements which vary
// between pages and need to be populated on load
// and see: function page_load(before_socket)

function start_page_setup() {
    patient_info_age();
    gauge_risk_score();
    patient_info_problem_start();
    patient_info_lab_start();
    patient_info_meds_with_rules_start();
    patient_info_meds_without_rules();
    prediction_start();
    isFinal();
}

function prep_page_setup() {
    patient_info_age();
    patient_info_meds_with_rules();
    patient_info_meds_without_rules();
    gauge_risk_score();
    let include_no_checkbox_advice = 1;
    big_nested_medicine_advice_table(include_no_checkbox_advice);
    other_med_advice_area();
    let hide_additional = 1;
    non_med_advice_area(hide_additional);
    isFinal();
}

function consult_page_setup() {
    patient_info_age();
    patient_info_meds_with_rules();
    patient_info_meds_without_rules();
    gauge_risk_score();
    let include_no_checkbox_advice = 0;
    big_nested_medicine_advice_table(include_no_checkbox_advice);
    let hide_additional = 0;
    non_med_advice_area(hide_additional);
    isFinal();
}

function advise_page_setup() {
    patient_info_age();
    gauge_risk_score();
    patient_medicine_advice_table();
    patient_other_med_advice_area();
    patient_non_med_advice();
    isFinal();
}

function finalize_page_setup() {
    patient_info_age(); // is this needed?
    gauge_risk_score();
    div_all_ehr_text();
    isFinal();
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

function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function isFinal() {
    let is_final = get_patient_advice().is_final;
    if (is_final) {
        document.body.style.opacity = 0.5;
        document.getElementById("locked").style.visibility = "visible";
    }
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
