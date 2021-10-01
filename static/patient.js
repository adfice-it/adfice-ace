// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

function set_class_display(class_name, val) {
    let elms = document.getElementsByClassName(class_name);
    for (let i = 0; i < elms.length; ++i) {
        elms[i].style.display = val;
    }
}

function switch_to_view(view) {
    let div_clinician_view = document.getElementById("div_clinician_view");
    let div_patient_view = document.getElementById("div_patient_view");
    let div_ehr_box = document.getElementById("div_ehr_box");
    let checkboxes = document.querySelectorAll("[id ^= cb_]");
    let checkbox_rows = document.querySelectorAll("[id ^= tr_]");

    let nm_category_headings_additional = document.querySelectorAll(
        ".nm_category_entry_additional");

    let non_med_advice_selection_area = document.getElementById(
        "non_med_advice_selection_area");
    let non_med_advice_patient_area = document.getElementById(
        "non_med_advice_patient_area");
    let div_other_med_advice_area = document.getElementById(
        "div_other_med_advice_area");

    let button_clinician = document.getElementById("button_clinician_view");
    let button_condensed = document.getElementById("button_condensed_view");
    let button_patient = document.getElementById("button_patient_view");

    if (checkboxes.length !== checkbox_rows.length) {
        ++weirdness;
        console.log('Found', checkboxes.length, 'checkboxes but',
            checkbox_rows.length, 'checkboxes so aborted switch to', view);
        return;
    }

    button_clinician.style.backgroundColor = 'white';
    button_clinician.style.color = 'green';
    button_condensed.style.backgroundColor = 'white';
    button_condensed.style.color = 'green';
    button_patient.style.backgroundColor = 'white';
    button_patient.style.color = 'green';


    if (view === "patient") {
        div_clinician_view.style.display = 'none';
        div_patient_view.style.display = 'block';
        div_ehr_box.style.display = 'none';
        set_class_display("advice_no_checkbox", 'none');
        non_med_advice_selection_area.style.display = 'none';
        non_med_advice_patient_area.style.display = 'block';
        div_other_med_advice_area.style.display = 'none';
        set_class_display("clinician_view_only", 'none');
        set_class_display("patient_view_only", 'block');

        button_patient.style.backgroundColor = 'green';
        button_patient.style.color = 'white';

    } else if (view === "condensed") {
        div_clinician_view.style.display = 'block';
        div_patient_view.style.display = 'none';
        div_ehr_box.style.display = 'block';
        for (let i = 0; i < checkbox_rows.length; ++i) {
            // Note: nodes should be returned in document order, which should
            // pair the checkboxes and rows.
            if (checkboxes[i].checked) {
                checkbox_rows[i].style.display = 'block';
            } else {
                checkbox_rows[i].style.display = 'none';
            }
        }
        for (let i = 0; i < nm_category_headings_additional.length; ++i) {
            nm_category_headings_additional[i].style.visibility = 'visible';
        }
        set_class_display("advice_no_checkbox", 'none');
        non_med_advice_selection_area.style.display = 'block';
        non_med_advice_patient_area.style.display = 'none';
        div_other_med_advice_area.style.display = 'block';
        set_class_display("clinician_view_only", 'block');
        set_class_display("patient_view_only", 'none');

        button_condensed.style.backgroundColor = 'green';
        button_condensed.style.color = 'white';

    } else {
        if (view !== "clinician") {
            ++weirdness;
            console.log('attempt to switch to view with unexpected name:',
                view);
        }
        div_clinician_view.style.display = 'block';
        div_patient_view.style.display = 'none';
        div_ehr_box.style.display = 'block';
        for (let i = 0; i < checkbox_rows.length; ++i) {
            checkbox_rows[i].style.display = 'block';
        }
        for (let i = 0; i < nm_category_headings_additional.length; ++i) {
            nm_category_headings_additional[i].style.visibility = 'hidden';
        }
        set_class_display("advice_no_checkbox", 'block');
        non_med_advice_selection_area.style.display = 'block';
        non_med_advice_patient_area.style.display = 'none';
        div_other_med_advice_area.style.display = 'block';
        set_class_display("clinician_view_only", 'block');
        set_class_display("patient_view_only", 'none');

        button_clinician.style.backgroundColor = 'green';
        button_clinician.style.color = 'white';
    }
}

window.addEventListener('load', function(event) {
    switch_to_view("clinician");
});
