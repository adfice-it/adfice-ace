// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021-2024 Stichting Open Electronics Lab
// vim: set sts=4 shiftwidth=4 expandtab :

"use strict";

// static/basic-utils.js defines:
//     function get_base_url()
//     function get_content(url, type, callback)
//     function get_json(url, callback)
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
    five_pages.patient_id = url_param('id');

    document.title = 'Patient ' + five_pages.patient_id;

    let json_url = get_base_url() + 'advice?id=' + five_pages.patient_id;
    // json_data is populated by get_data_for_patient() in adfice_webserver.js
    // json_data.patient_advice is populated by get_advice_for_patient() in adfice.js
    get_json(json_url, function(err, json_data) {
        console.log(json_data);
        if (err) {
            console.log("url:", json_url, "error:", err);
        }
        if ((!json_data.patient_advice) ||
            (json_data.patient_advice.patient_id != five_pages.patient_id)) {
            if (!json_data.patient_advice) {
                console.log("no json_data patient_advice");
            } else {
                console.log("expected patient_id '" + five_pages.patient_id +
                    "' but was '" + json_data.patient_advice.patient_id + "'.");
            }
            let url = "/load-error?err=patient_id is invalid";
            window.location = url;
            return;
        }
        five_pages.data = json_data;
        if (five_pages.debug > 0) {
            five_pages.logger.log(JSON.stringify({
                five_pages: five_pages
            }, null, 4));
        }

        let el_pi_id = document.getElementById('patient-info-id');
        el_pi_id.innerText = five_pages.data.patient_advice.mrn;

        before_socket();

        // message.js defines connect_web_socket_and_keep_alive()
        connect_web_socket_and_keep_alive();
    });
}

function fill_help_phone() {
    let phone = five_pages.data.help_phone || [];
    document.getElementById('phone_container').innerHTML = phone;
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
        get_patient_advice().meds_with_rules || []);
}

function patient_info_meds_without_rules() {
    replace_if_exists('meds-without-rules-list',
        meds_without_rules_as_html,
        get_patient_advice().meds_without_rules || []);
}

function patient_info_problem_start() {
    let all_problems = get_patient_advice().all_problems || {};
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
    let all_labs = get_patient_advice().all_labs || [];
    let labs = get_patient_advice().labs || [];
    let html = '<div id="lab_table_div"><table id="lab_table"><tr><th class="patient_data_td">Lab</th><th class="patient_data_td">Datum gemeten</th><th class="patient_data_td">Waarde</th></tr>';
    for (let i = 0; i < all_labs.length; ++i) {
        let lab = all_labs[i];
        html += '<tr><td class="patient_data_td">' + lab + '</td>';
        let date = '';
        let result = '';
        for (let j = 0; j < labs.length; ++j) {
            if (lab == labs[j].lab_test_name) {
                date = nice_date(labs[j].date_measured);
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
    console.log("Contents of get_patient_advice");
    console.log(get_patient_advice());
    console.log("end get_patient_advice()");
    let rule_meds = get_patient_advice().meds_with_rules || [];
    let html = '<table><tr><th>Medicatie</th><th>Verwijderen</th></tr>';
    for (let i = 0; i < rule_meds.length; ++i) {
        let med = rule_meds[i];
        html += '<tr id="start_row_' + med.ATC_code + '"><td>'
        html += ucfirst(med.medication_name).trim();
        html += '</td><td><button id="remove_' + med.ATC_code +
            '" onclick="remove_med(\'' + med.ATC_code +
            '\')">Niet actueel</button></td></tr>'
    }
    html += '<br>';
    document.getElementById('meds-with-rules').innerHTML = html;
}

function prediction_start() {
    let measurements = get_patient_advice().measurements || {};
    // for some unholy reason, measurements.prediction_result is null in IE when the page first loads. We'll use risk_score, which is not null.
    let risk_score = get_patient_advice().risk_score;
    let html = create_meas_user_entered_html();
    document.getElementById('prediction_missing_form_container').innerHTML = html;
    let footnote = create_meas_footnote_html();
    document.getElementById('footnote_missing').innerHTML = footnote;
    prediction_data_start(measurements);
    fill_user_entered_meas(measurements);
}

function prediction_data_start(measurements) {
    document.getElementById('GDS_score').innerHTML = nice_value(measurements.GDS_score);
    document.getElementById('d_user_GDS_score').innerHTML = nice_value(measurements.user_GDS_score);
    document.getElementById('GDS_date_measured').innerHTML = old_date(nice_date(measurements.GDS_date_measured));

    document.getElementById('grip_kg').innerHTML = nice_value(measurements.grip_kg);
    document.getElementById('d_user_grip_kg').innerHTML = nice_value(measurements.user_grip_kg);
    document.getElementById('grip_date_measured').innerHTML = old_date(nice_date(measurements.grip_date_measured));

    document.getElementById('walking_speed_m_per_s').innerHTML = nice_value(measurements.walking_speed_m_per_s);
    document.getElementById('d_user_walking_speed_m_per_s').innerHTML = nice_value(measurements.user_walking_speed_m_per_s);
    document.getElementById('walking_date_measured').innerHTML = old_date(nice_date(measurements.walking_date_measured));

    let user_BMI = null;
    if (measurements.user_weight_kg != null && measurements.user_height_cm != null) {
        user_BMI = measurements.user_weight_kg / ((measurements.user_height_cm / 100) * (measurements.user_height_cm / 100));
    }
    let BMI = null;
    if (!user_BMI) {
        if (measurements.weight_kg != null && measurements.height_cm != null) {
            BMI = measurements.weight_kg / ((measurements.height_cm / 100) * (measurements.user_height_cm / 100));
        }
    }
    document.getElementById('BMI').innerHTML = nice_value(measurements.BMI) || nice_value(BMI);
    document.getElementById('d_user_bmi_calc').innerHTML = nice_value(user_BMI);
    document.getElementById('BMI_date_measured').innerHTML = old_date(nice_date(measurements.BMI_date_measured));

    document.getElementById('systolic_bp_mmHg').innerHTML = nice_value(measurements.systolic_bp_mmHg);
    document.getElementById('d_user_systolic_bp_mmHg').innerHTML = nice_value(measurements.user_systolic_bp_mmHg);
    document.getElementById('bp_date_measured').innerHTML = old_date(nice_date(measurements.bp_date_measured));

    document.getElementById('number_of_limitations').innerHTML = nice_value(measurements.number_of_limitations);
    document.getElementById('d_user_number_of_limitations').innerHTML = nice_value(measurements.user_number_of_limitations);
    document.getElementById('functional_limit_date_measured').innerHTML = old_date(nice_date(measurements.functional_limit_date_measured));

    document.getElementById('nr_falls_12m').innerHTML = nice_value(measurements.nr_falls_12m);
    document.getElementById('d_user_nr_falls_12m').innerHTML = nice_value(measurements.user_nr_falls_12m);
    document.getElementById('nr_falls_date_measured').innerHTML = old_date(nice_date(measurements.nr_falls_date_measured));

    document.getElementById('smoking').innerHTML = nice_value(measurements.smoking);
    document.getElementById('d_user_smoking').innerHTML = nice_value(measurements.user_smoking);
    document.getElementById('smoking_date_measured').innerHTML = old_date(nice_date(measurements.smoking_date_measured));

    document.getElementById('has_antiepileptica').innerHTML = nice_value(measurements.has_antiepileptica);
    document.getElementById('has_ca_blocker').innerHTML = nice_value(measurements.has_ca_blocker);
    document.getElementById('has_incont_med').innerHTML = nice_value(measurements.has_incont_med);

    document.getElementById('education_hml').innerHTML = nice_value(measurements.education_hml);
    document.getElementById('d_user_education_hml').innerHTML = nice_value(measurements.user_education_hml);

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
    let user_fear = null;
    if (measurements.user_fear0) {
        fear = 0;
        user_fear = 0;
    }
    if (measurements.user_fear1) {
        fear = 1;
        user_fear = 1;
    }
    if (measurements.user_fear2) {
        fear = 2;
        user_fear = 2;
    }
    document.getElementById('d_user_fear').innerHTML = user_fear;
    document.getElementById('fear_of_falls_date_measured').innerHTML = old_date(nice_date(measurements.fear_of_falls_date_measured));

    if (measurements.user_values_updated != null) {
        document.getElementById('user_values_updated').innerHTML = nice_date(measurements.user_values_updated);
    }
}

function fill_user_entered_meas(measurements) {
    document.getElementById('user_GDS_score_mis').innerHTML = nice_value(measurements.user_GDS_score) || nice_value(measurements.GDS_score) || '<span class =\'missing\'>invoeren</span>';
    document.getElementById('user_grip_kg_mis').innerHTML = nice_value(measurements.user_grip_kg) || nice_value(measurements.grip_kg) || '<span class =\'missing\'>invoeren</span>';
    document.getElementById('user_walking_speed_m_per_s_mis').innerHTML = nice_value(measurements.user_walking_speed_m_per_s) || nice_value(measurements.walking_speed_m_per_s) || '<span class =\'missing\'>invoeren</span>';
    document.getElementById('user_height_cm_mis').innerHTML = nice_value(measurements.user_height_cm) || nice_value(measurements.height_cm) || '<span class =\'missing\'>invoeren</span>';
    document.getElementById('user_weight_kg_mis').innerHTML = nice_value(measurements.user_weight_kg) || nice_value(measurements.weight_kg) || '<span class =\'missing\'>invoeren</span>';
    document.getElementById('user_systolic_bp_mmHg_mis').innerHTML = nice_value(measurements.user_systolic_bp_mmHg) || nice_value(measurements.systolic_bp_mmHg) || '<span class =\'missing\'>invoeren</span>';
    document.getElementById('user_number_of_limitations_mis').innerHTML = nice_value(measurements.user_number_of_limitations) || nice_value(measurements.number_of_limitations) || '<span class =\'missing\'>invoeren</span>';
    document.getElementById('user_nr_falls_12m_mis').innerHTML = nice_value(measurements.user_nr_falls_12m) || nice_value(measurements.nr_falls_12m) || '<span class =\'missing\'>invoeren</span>';
    document.getElementById('user_smoking_mis').innerHTML = nice_value(measurements.user_smoking) || nice_value(measurements.smoking) || '<span class =\'missing\'>invoeren</span>';
    document.getElementById('user_education_hml_mis').innerHTML = nice_value(measurements.user_education_hml) || nice_value(measurements.education_hml) || '<span class =\'missing\'>invoeren</span>';
    let fear = null;
    if (measurements.user_fear0 || measurements.fear0) {
        fear = 0;
    }
    if (measurements.user_fear1 || measurements.fear1) {
        fear = 1;
    }
    if (measurements.user_fear2 || measurements.fear2) {
        fear = 2;
    }
    if (fear == null) {
        document.getElementById('user_fear_mis').innerHTML = '<span class =\'missing\'>invoeren</span>';
    } else {
        document.getElementById('user_fear_mis').innerHTML = fear;
    }
}

function create_meas_user_entered_html() {
    let html = '<table class="meas_user_entered" id="meas_user_entered_table">' +
        '<tbody>' +
        '	<tr><th class="meas_user_entered">variabel</th><th class="meas_user_entered">huidige waarde</th><th class="meas_user_entered">nieuwe waarde</th><th class="meas_user_entered">verwijder waarde</th></tr>' +
        '	<tr>' +
        '		<td class="meas_user_entered">GDS score</td>' +
        '		<td class="meas_user_entered" id="user_GDS_score_db"><div id="user_GDS_score_mis"></div></td>' +
        '		<td class="meas_user_entered"><select id="user_GDS_score" name="GDS_dropdown"><option id="GDS_dropdown_null" value=""></option><option id="GDS_dropdown_0" value="0">0</option><option id="GDS_dropdown_1" value="1">1</option><option id="GDS_dropdown_2" value="2">2</option><option id="GDS_dropdown_3" value="3">3</option><option id="GDS_dropdown_4" value="4">4</option><option id="GDS_dropdown_5" value="5">5</option><option id="GDS_dropdown_6" value="6">6</option><option id="GDS_dropdown_7" value="7">7</option><option id="GDS_dropdown_8" value="8">8</option><option id="GDS_dropdown_9" value="9">9</option><option id="GDS_dropdown_10" value="10">10</option><option id="GDS_dropdown_11" value="11">11</option><option id="GDS_dropdown_12" value="12">12</option><option id="GDS_dropdown_13" value="13">13</option><option id="GDS_dropdown_14" value="14">14</option><option id="GDS_dropdown_15" value="15">15</option></select></td>' +
        '		<td><button type="button" id="del_GDS_score" onclick="delete_user_entered(\'user_GDS_score\')">Verwijder</button> </td></tr>' +
        '	<tr>' +
        '		<td class="meas_user_entered">grijpkracht kg (hoogste meting)</td>' +
        '		<td class="meas_user_entered" id="user_grip_kg_db"><div id="user_grip_kg_mis"></div></td>' +
        '		<td class="meas_user_entered"><input id="user_grip_kg" type="number" min="0.00" max="99.99"></td>' +
        '		<td><button type="button" id="del_grip_kg" onclick="delete_user_entered(\'user_grip_kg\')">Verwijder</button> </td></tr>' +
        '	<tr>' +
        '		<td class="meas_user_entered">loopsnelheid m/s (zo snel mogelijk)</td>' +
        '		<td class="meas_user_entered" id="user_walking_speed_m_per_s_db"><div id="user_walking_speed_m_per_s_mis"></div></td>' +
        '		<td class="meas_user_entered"><input id="user_walking_speed_m_per_s" type="number" min="0.00" max="99.99"></td>' +
        '		<td><button type="button" id="del_walking_speed" onclick="delete_user_entered(\'user_walking_speed_m_per_s\')">Verwijder</button> </td></tr>' +
        '	<tr>' +
        '		<td class="meas_user_entered">lengte cm</td>' +
        '		<td class="meas_user_entered" id="user_height_cm_db"><div id="user_height_cm_mis"></div></td>' +
        '		<td class="meas_user_entered"><input id="user_height_cm" type="number" min="40" max="250"></td>' +
        '		<td><button type="button" id="del_height_cm" onclick="delete_user_entered(\'user_height_cm\')">Verwijder</button> </td></tr>' +
        '	<tr>' +
        '		<td class="meas_user_entered">gewicht kg</td>' +
        '		<td class="meas_user_entered" id="user_weight_kg_db"><div id="user_weight_kg_mis"></div></td></td>' +
        '		<td class="meas_user_entered"><input id="user_weight_kg" type="number" min="20" max="500"></td>' +
        '		<td><button type="button" id="del_weight_kg" onclick="delete_user_entered(\'user_weight_kg\')">Verwijder</button> </td></tr>' +
        '	<tr>' +
        '		<td class="meas_user_entered">systolische bloeddruk mmHg</td>' +
        '		<td class="meas_user_entered" id="user_systolic_bp_mmHg_db"><div id="user_systolic_bp_mmHg_mis"></div></td>' +
        '		<td class="meas_user_entered"><input id="user_systolic_bp_mmHg" type="number" min="20" max="250"></td>' +
        '		<td><button type="button" id="del_systolic_bp_mmHg" onclick="delete_user_entered(\'user_systolic_bp_mmHg\')">Verwijder</button> </td></tr>' +
        '	<tr>' +
        '		<td class="meas_user_entered">aantal functionele beperkingen*</td>' +
        '		<td class="meas_user_entered" id="user_number_of_limitations_db"><div id="user_number_of_limitations_mis"></div></td>' +
        '		<td class="meas_user_entered"><select id="user_number_of_limitations" name="ADL_dropdown"><option id="ADL_dropdown_null" value=""></option><option id="ADL_dropdown_0" value="0">0</option><option id="ADL_dropdown_1" value="1">1</option><option id="ADL_dropdown_2" value="2">2</option><option id="ADL_dropdown_3" value="3">3</option><option id="ADL_dropdown_4" value="4">4</option><option id="ADL_dropdown_5" value="5">5</option><option id="ADL_dropdown_6" value="6">6</option></select></td>' +
        '		<td><button type="button" id="del_number_of_limitations" onclick="delete_user_entered(\'user_number_of_limitations\')">Verwijder</button> </td></tr>' +
        '	<tr>' +
        '		<td class="meas_user_entered">aantal valincidenten laatste 12 maanden</td>' +
        '		<td class="meas_user_entered" id="user_nr_falls_12m_db"><div id="user_nr_falls_12m_mis"></div></td>' +
        '		<td class="meas_user_entered"><input id="user_nr_falls_12m" type="number" min="0" max="1000"></td>' +
        '		<td><button type="button" id="del_nr_falls_12m" onclick="delete_user_entered(\'user_nr_falls_12m\')">Verwijder</button> </td></tr>' +
        '	<tr>' +
        '		<td class="meas_user_entered">roker</td>' +
        '		<td class="meas_user_entered" id="user_smoking_db"><div id="user_smoking_mis"></div></td>' +
        '		<td class="meas_user_entered"><select id="user_smoking" name="smoking_dropdown"><option id="user_smoking_null" value=""></option><option id="user_smoking_1" value="1">Ja</option><option id="user_smoking_0" value="0">Nee </option></select></td>' +
        '		<td><button type="button" id="del_smoking" onclick="delete_user_entered(\'user_smoking\')">Verwijder</button> </td></tr>' +
        '	<tr>' +
        '		<td class="meas_user_entered">opleidingsniveau**</td>' +
        '		<td class="meas_user_entered" id="user_education_hml_db"><div id="user_education_hml_mis"></div></td>' +
        '		<td class="meas_user_entered"><select id="user_education_hml" name="education_dropdown"><option id="edu_dropdown_null" value=""></option><option id="edu_dropdown_1" value="1">Laag</option><option id="edu_dropdown_2" value="2">Midden</option><option id="edu_dropdown_3" value="3">Hoog</option></select></td>' +
        '		<td><button type="button" id="del_education_hml" onclick="delete_user_entered(\'user_education_hml\')">Verwijder</button> </td></tr>' +
        '	<tr>' +
        '		<td class="meas_user_entered">angst om te vallen***</td>' +
        '		<td class="meas_user_entered" id="fear_db"><div id="user_fear_mis"></div></td>' +
        '		<td class="meas_user_entered"><select id="fear_dropdown" name="fear_dropdown"><option  id="fear_dropdown_null" value=""></option><option id="fear_dropdown_0" value="0">0: niet bang</option><option id="fear_dropdown_1" value="1">1: een beetje/redelijk</option><option id="fear_dropdown_2" value="2">2: erg bezorgd</option></select></td>' +
        '		<td><button type="button" id="del_fear" onclick="delete_user_entered(\'user_fear0\');delete_user_entered(\'user_fear1\');delete_user_entered(\'user_fear2\')">Verwijder</button> </td>' +
        '		</tr>' +
        '</tbody></table>'
    return html;
}

function create_meas_footnote_html() {
    let html = '*Totaalscore van KATZ-ADL-6 <br>** Kies uit:<br>Laag: lager beroepsonderwijs: LTS, LHNO, LEAO, handels(dag)school, huishoudschool, agrarische school, praktijkdiploma, middenstandsonderwijs<br>Midden: middelbaarberoepsonderwijs: MBA, LO-akten, MTS, MEAO<br>Hoog: hoger beroepsonderwijs: HTS, HEAO, MO-opleiding, kweekschool, sociale/pedagogische academie<br>***Kies 0 als de patient \'Helemaal niet bezorgd\' heeft beantwoord bij alle FES vragen. Kies 1 als het totaalscore van de FES 1-7 is. Kies 2 als het totaalscore 8 of hoger is.';
    return html;
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
            html += '<textarea rows=1 id="' + chunk_id + '" type="text" placeholder="Specificeer hier..."';
            html += ' class="ft_input">' + chunk.text + '</textarea>\n';
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
        html += '<table class="checkbox_table">\n';
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
            html += '<td class="checkbox_row td_checkbox">';
            html += input_checkbox(checkbox_id);
            html += '</td>\n';
            html += '<td class="checkbox_row td_advice">';
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
    }
    set_element_inner('patient-medication-advice-list', html);
}

function other_med_advice_area() {
    /*
     * This code has some overlap with the other html-generating functions. 
	 * However, factoring out the overlapping functionality runs the risk of 
	 * making it difficult to understand what is actually happening.
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
    // add css class to "other advice" area - ugly but functional
    document.getElementById("ft_OTHER_other_1_1").className = "ft_input ft_big";
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

// This code has some overlap with the previous block
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
        let category_name_class = "";
        if(hide_additional){
			if (category_name != last_category_name) {
				last_category_name = category_name;
				category_name_class = "nm_category_entry_first";
			} else {
				category_name_class = "nm_category_entry_additional";
			}
		}
        html += '<div id="' + row_id + '" class="nonmed_row">\n';
        let td_nm_cat_id = ['td', 'nm', 'category', 'name',
            nm_advice.category_id, boxnum
        ].join('_');
        html += '<div id="' + td_nm_cat_id + '"';
        html += ' class="td_nm_category_name ' + category_name_class + '"';
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
    // add css class to "other advice" area - ugly but functional
    document.getElementById("ft_NONMED_V_1_1").className = "ft_input ft_big";
}

function non_med_advice_area_consult(){
	let nm_headers = document.querySelectorAll('[id^=td_nm_category_name_]');
	nm_headers.forEach((header) => {
	  header.style.visibility = 'hidden';
	});
	let nm_map = get_selected_nonmed_cb_map();
	nm_map.forEach (function(cb_num, cb_key) {
		let lowest_nm_header = 'td_nm_category_name_' + cb_key.substring(10,11) + '_' + cb_num;
		console.log(lowest_nm_header);
		document.getElementById(lowest_nm_header).style.visibility = 'visible';
	});
}

function get_selected_nonmed_cb_map(){
	let cb_list = get_patient_advice().selected_advice;
	let cb_keys = Object.keys(cb_list);
	let nm_map = new Map();
	for (let i = 0; i < cb_keys.length; ++i) {
		if(cb_keys[i].lastIndexOf("cb_NONMED_", 0) === 0 
			&& cb_list[cb_keys[i]] == true){
			let cb_number = cb_keys[i].substring(12,cb_keys[i].length);
			let prefix = cb_keys[i].substring(0,11);
			if(nm_map.get(prefix) == null || cb_number < nm_map.get(prefix)){
				nm_map.set(prefix, cb_number);
			}
		}
	}
	return nm_map;
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
        html += '<div id="' + 'patient_nm_cat_' + category + '_' + boxnum + '"' +
            ' class="patient_nm_category_name ' +
            '" style="display:none">' +
            category_name + '</div><!-- patient_nm_cat -->\n'
        html += '<div id="' + row_id + '" class="patient_nonmed_cb_row"';
        html += ' style="display:none">\n';
        let allow_edit = 0;
        html += cdss_freetext(nm_advice.patient_split, allow_edit,
            "patient_nonmed_cb_text", 'pft', 'NONMED', category, boxnum);
        html += '</div> <!-- ' + row_id + ' -->\n';
    }
    set_element_inner('patient-non-med-advice-list', html);
	// adjust visibility of headers on nonmed advice
	let nm_map = get_selected_nonmed_cb_map();
	nm_map.forEach (function(cb_num, cb_key) {
		let lowest_nm_header = 'patient_nm_cat_' + cb_key.substring(10,11) + '_' + cb_num;
		document.getElementById(lowest_nm_header).style.display = 'block';
	});
	
}

// See above note regarding duplication
function div_all_ehr_text() {
    // <div id="div_all_ehr_text" class="div_all_ehr_text">
    let html = '';
    let medication_advice = get_patient_advice().medication_advice || [];
    for (let i = 0; i < medication_advice.length; ++i) {
        //html += '<div id="advice_ehr_area_' + i + '" class="advice_ehr_area">';
        let row = medication_advice[i];
        let atc = row.ATC_code;
        let cb_advices = row.adviceTextsCheckboxes;
        let med_name = ucfirst(row.medication_name).trim();
        html += '<div id = "' + med_name + '_name" class="med_name_ehr">' + med_name + ':</div><!-- med_name -->\n';
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
            //TODO the structure of this HTML is not great.
            /* <div id="et_bla">static text<div id="eft_bla">free text</div></div>
               would be more correct 
               Guessing it's equally ugly in the other areas with free text. */
            html += cdss_freetext(cb_advice.ehr_split, allow_edit, 'efreetext',
                'eft', atc, rulenum, boxnum);
            html += '</div><!-- ' + row_id + ' -->\n';
        }
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
        //TODO but this is parsed correctly by our Copy workaround - what's the difference?
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

function data_entry_age(){
	let age = get_patient_advice().age;
	let agediv = document.getElementById('data_entry_age');
	agediv.innerHTML = "Leeftijd: " + age;
}

function data_entry_medications() {
    let meds = get_patient_advice().medications;
    let html = '';
    if (meds && meds.length > 0) {
        html += '<table><tr><th>ATC</th><th>naam</th><th>startdatum</th><th></th></tr>';
        for (let i = 0; i < meds.length; ++i) {
            html += '<tr><td>' + meds[i].ATC_code + '</td>' +
                '<td>' + meds[i].medication_name + '</td>' +
                '<td>' + nice_date(meds[i].start_date) + '</td>' + 
				'</td><td><button id="remove_' + meds[i].ATC_code +
				'" onclick="remove_med(\'' + meds[i].ATC_code +
				'\')">Verwijder</button></td></tr>'
        }
        html += '</table>';
    } else {
        html += 'Geen geneesmiddelen gevonden.'
    }
    set_element_inner('data_entry_med_list', html);
}

function data_entry_problem_list() {
    let all_problems = get_patient_advice().all_problems || {};
    let all_problem_names = Object.keys(all_problems);
    let problems = get_patient_advice().problems;
    let html = '<table><tr><th>Aandoening</th><th>Ja</th><th>Nee</th></tr>';
    for (let i = 0; i < all_problem_names.length; ++i) {
        let display_name = all_problems[all_problem_names[i]];
        html += '<tr><td>' + display_name + '</td>';
        html += '<td><input type="radio" name="' + all_problem_names[i] + '_rb" id="' + all_problem_names[i] + '_rb_y" value="Ja"></td>'
        html += '<td><input type="radio" name="' + all_problem_names[i] + '_rb" id="' + all_problem_names[i] + '_rb_n" value="Nee" checked = "checked"></td></tr>'
    }
    html += '</table>';
    document.getElementById('data_entry_problems').innerHTML = html;
    if(problems){
		for (let i = 0; i < problems.length; ++i) {
			let radio_button = document.getElementById(problems[i].name + '_rb_y');
			radio_button.checked = true;
		}
	}
}

function data_entry_labs() {
    let labs = get_patient_advice().labs;
	if(labs){
		let lab_keys = Object.keys(labs);
		for (let i = 0; i < lab_keys.length; ++i) {
			if (labs[i].lab_test_name == "natrium") {
				document.getElementById('labs_natrium').value = labs[i].lab_test_result;
			}
			if (labs[i].lab_test_name == "kalium") {
				document.getElementById('labs_kalium').value = labs[i].lab_test_result;
			}
			if (labs[i].lab_test_name == "calcium") {
				document.getElementById('labs_calcium').value = labs[i].lab_test_result;
			}
			if (labs[i].lab_test_name == "eGFR") {
				if (labs[i].lab_test_result == ">60") {
					document.getElementById('labs_egfr_n').checked = true;
				} else {
					document.getElementById('labs_egfr').value = labs[i].lab_test_result;
				}
			}
		}
    }
}

function data_entry_meas() {
    let html = create_meas_user_entered_html();
    document.getElementById('user_entered_meas_container').innerHTML = html;
    let footnote = create_meas_footnote_html();
    document.getElementById('footnote_meas').innerHTML = footnote;
    let measurements = get_patient_advice().measurements || {};
    fill_user_entered_meas(measurements);
}

function data_entry_assess(){
	let data_assessed = get_patient_advice().data_assessed;
	let html = 'Bekeken door arts: ';
	html += '<input type="radio" name="data_assessed_rb" id="data_assessed_y_rb" value="Ja"';
	if(data_assessed){
		html += 'checked = "checked"';
	}
	html += '> Ja  ';
	html += '<input type="radio" name="data_assessed_rb" id="data_assessed_n_rb" value="Nee"';
	if(!data_assessed){
		html += 'checked = "checked"';
	}
	html += '> Nee';
	document.getElementById('data_entry_assess').innerHTML = html;
}

function data_entry_done() {
	let meds = document.getElementById('data_entry_med_list');
	if(meds.innerHTML.startsWith('Geen')){
		document.getElementById('single_med_error').innerHTML = 'Er moet tenminste 1 medicatie vermeld worden voordat u naar de CDSS gaat.';
	} else {
		window.location.href='start?id=' + five_pages.patient_id;
	}
}

function duplicate_med_check() {
	let form = document.getElementById('single_med_form');
	let meds = get_patient_advice().medications;
	for (let i = 0; i < meds.length; ++i) {
		if(meds[i].ATC_code == form.elements['single_med_atc'].value.toUpperCase()){
			document.getElementById('single_med_error').innerHTML = "Elk medicatie moet een uniek ATC hebben. Als de pati\&euml;nt 2 medicaties met dezelfde ATC gebruikt, verwijder de huidige en voer een nieuwe medicatie in met beide namen (met een / tussen de namen).";
			return false;
		} else if(meds[i].medication_name.toUpperCase() == form.elements['single_med_name'].value.toUpperCase()){
			document.getElementById('single_med_error').innerHTML = "Elk medicatie moet een uniek naam hebben. Controleer even de medicatielijst.";
			return false;
		}
	}
	return true;
}


function nice_date(dtstring) {
    if (dtstring == null) {
        return '';
    }
    // expects string in the form of YYYY-MM-DDTHH:MM:SS.mmmZ
    if (dtstring.match(/^([0-9]{4}.[0-9]{2}.[0-9]{2}.*)$/)) {
        let z = dtstring.substring((dtstring.length)-1, dtstring.length);
		let year = null;
		let m = null;
		let d = null;
		if(z == 'Z'){
			let date = new Date(dtstring);			
			year = date.getFullYear();
			let month = (date.getMonth() + 1).toString(); //javascript 0-offset months
			if(month.length == 1) {
				m = '0' + month;
			} else {
				m = month;
			}
			let day = (date.getDate()).toString();
			if(day.length == 1) {
				d = '0' + day;
			} else {
				d = day;
			}
		} else {
			year = dtstring.substring(0, 4);
			m = dtstring.substring(5, 7);
			d = dtstring.substring(8, 10);			
		}
		
        return d + '-' + m + '-' + year;
    } else {
        return 'onbekend';
    }
}

//expects to get a nice_date
function old_date(nice_d) {
    // nice_d is in dd-mm-yyyy
    let dateParts = nice_d.split("-");
    let niceDateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    let diff = (new Date() - niceDateObject) / (1000 * 3600 * 24);
    if (!nice_d.match(/^([0-9]{2}.[0-9]{2}.[0-9]{4})$/) ||
        !diff || diff < 30) // <30 days old
    {
        return '<span class="date_okay">' + nice_d + '</span>';
    } else {
        return '<span class="date_old">' + nice_d + '</span>';
    }
}

// Workaround for IE literally displaying "null" for null values
function nice_value(value) {
    if (value == null || typeof(value) == 'unknown') {
        return '';
    } else {
        return value.toString();
    }
}

// Prints the page without the navigation footer
function print_page() {
    document.getElementById('div-footer-id').style.display = 'none';
    window_print();
    document.getElementById('div-footer-id').style.display = 'block';
}


// the following functions specify the needed elements which vary
// between pages and need to be populated on load
// and see: function page_load(before_socket)

function start_page_setup() {
    fill_help_phone();
    patient_info_age();
    gauge_risk_score();
    patient_info_problem_start();
    patient_info_lab_start();
    patient_info_meds_with_rules_start();
    patient_info_meds_without_rules();
    prediction_start();
    is_final();
}

function prep_page_setup() {
    fill_help_phone();
    patient_info_age();
    patient_info_meds_with_rules();
    patient_info_meds_without_rules();
    gauge_risk_score();
    let include_no_checkbox_advice = 1;
    big_nested_medicine_advice_table(include_no_checkbox_advice);
    other_med_advice_area();
    let hide_additional = 1;
    non_med_advice_area(hide_additional);
    is_final();
}

function consult_page_setup() {
    fill_help_phone();
    patient_info_age();
    patient_info_meds_with_rules();
    patient_info_meds_without_rules();
    gauge_risk_score();
    let include_no_checkbox_advice = 0;
    big_nested_medicine_advice_table(include_no_checkbox_advice);
	var checkboxAreaArray = document.getElementsByClassName("advice_selection_area");
    for(var i = (checkboxAreaArray.length - 1); i >= 0; i--){
        checkboxAreaArray[i].className = "advice_selection_area_consult";
    }
    other_med_advice_area();
    let hide_additional = 0;
    non_med_advice_area(hide_additional);
	non_med_advice_area_consult();
    is_final();
}

function advise_page_setup() {
    patient_info_age();
    gauge_risk_score();
    patient_medicine_advice_table();
    patient_other_med_advice_area();
    patient_non_med_advice();
    is_final();
}

function finalize_page_setup() {
    fill_help_phone();
    patient_info_age(); // is this needed?
    gauge_risk_score();
    div_all_ehr_text();
    is_final();
}

function data_entry_page_setup() {
	data_entry_age();
    data_entry_medications();
    data_entry_problem_list();
    data_entry_labs();
    data_entry_meas();
	data_entry_assess();
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

function data_entry_page_load() {
    page_load(data_entry_page_setup);
}

function top_function() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function is_final() {
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
        data_entry_page_load: data_entry_page_load,
        get_five_pages: get_five_pages
    }
}
