// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

var DEBUG = 1;
if (DEBUG > 0) {
    console.log("hello world!");
}
var ws;
var weirdness = 0;
var messages_received = 0;

function set_class_display(class_name, val) {
    let elms = document.getElementsByClassName(class_name);
    for (let i = 0; i < elms.length; ++i) {
        elms[i].style.display = val;
    }
}

function switch_to_view(view) {
    let div_clinician_view = document.getElementById("div_clinician_view");
    let div_patient_view = document.getElementById("div_patient_view");
    let div_epic_box = document.getElementById("div_epic_box");
    let checkboxes = document.querySelectorAll("[id ^= cb_]");
    let checkbox_rows = document.querySelectorAll("[id ^= tr_]");

    let non_med_advice_selection_area = document.getElementById(
        "non_med_advice_selection_area");
    let non_med_advice_patient_area = document.getElementById(
        "non_med_advice_patient_area");

    let button_clinician = document.getElementById("button_clinician_view");
    let button_condensed = document.getElementById("button_condensed_view");
    let button_patient = document.getElementById("button_patient_view");

    if (checkboxes.length !== checkbox_rows.length) {
        ++weirdness;
        console.log(`Found ${checkboxes.length} checkboxes but`,
            `${checkbox_rows.length} checkboxes so aborted switch`,
            `to '${view}'`);
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
        div_epic_box.style.display = 'none';
        set_class_display("advice_no_checkbox", 'none');
        non_med_advice_selection_area.style.display = 'none';
        non_med_advice_patient_area.style.display = 'block';
        set_class_display("clinician_view_only", 'none');
        set_class_display("patient_view_only", 'block');

        button_patient.style.backgroundColor = 'green';
        button_patient.style.color = 'white';

    } else if (view === "condensed") {
        div_clinician_view.style.display = 'block';
        div_patient_view.style.display = 'none';
        div_epic_box.style.display = 'block';
        for (let i = 0; i < checkbox_rows.length; ++i) {
            // Note: nodes should be returned in document order, which should
            // pair the checkboxes and rows.
            if (checkboxes[i].checked) {
                checkbox_rows[i].style.display = 'block';
            } else {
                checkbox_rows[i].style.display = 'none';
            }
        }
        set_class_display("advice_no_checkbox", 'none');
        non_med_advice_selection_area.style.display = 'block';
        non_med_advice_patient_area.style.display = 'none';
        set_class_display("clinician_view_only", 'block');
        set_class_display("patient_view_only", 'none');

        button_condensed.style.backgroundColor = 'green';
        button_condensed.style.color = 'white';

    } else {
        if (view !== "clinician") {
            ++weirdness;
            console.log(`attempt to switch to view with unexpected` +
                ` name' ${view}'`);
        }
        div_clinician_view.style.display = 'block';
        div_patient_view.style.display = 'none';
        div_epic_box.style.display = 'block';
        for (let i = 0; i < checkbox_rows.length; ++i) {
            checkbox_rows[i].style.display = 'block';
        }
        set_class_display("advice_no_checkbox", 'block');
        non_med_advice_selection_area.style.display = 'block';
        non_med_advice_patient_area.style.display = 'none';
        set_class_display("clinician_view_only", 'block');
        set_class_display("patient_view_only", 'none');

        button_clinician.style.backgroundColor = 'green';
        button_clinician.style.color = 'white';
    }
}

function ucfirst(s) {
    if (typeof s !== 'string') {
        return s;
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function boxclicked(checkbox) {
    if (DEBUG > 0) {
        console.log('Checkbox ' + checkbox.id + ' clicked' +
            ' and is now ' + checkbox.checked);
    }
    let message = {};
    message.viewer_id = viewer_id;
    message.patient_id = patient_id;
    message.type = 'checkboxes';
    message.checkbox_id = checkbox.id;
    message.checkbox_checked = checkbox.checked;

    message['box_states'] = {};
    let elementList = document.querySelectorAll("input[type='checkbox']");
    elementList.forEach((checkbox) => {
        message['box_states'][checkbox.id] = checkbox.checked;
    });

    let msg_str = JSON.stringify(message, null, 4);
    if (DEBUG > 0) {
        console.log('sending:', msg_str);
    }
    ws.send(msg_str);
}

function freetextentered(textfield) {
    let message = {};
    message.viewer_id = viewer_id;
    message.patient_id = patient_id;
    message.type = 'freetexts';
    message.textfield = textfield.id;

    message['field_entires'] = {};
    // TODO: this will need to change if the two views contain the same
    // text fields, as they will be duplicate/conflicting
    let elementList = document.querySelectorAll("input[type='text']");
    elementList.forEach((field) => {
        message['field_entires'][field.id] = field.value;
    });

    let msg_str = JSON.stringify(message, null, 4);
    if (DEBUG > 0) {
        console.log('sending:', msg_str);
    }
    ws.send(msg_str);
}

function process_checkbox(checkbox, checked) {
    checkbox.checked = checked;

    let checkbox_id = checkbox.id;

    let epic_row_id = checkbox_id.replace(/^cb_/, 'et_');
    let epic_row = document.getElementById(epic_row_id);
    if (checked) {
        epic_row.style.display = 'block';
    } else {
        epic_row.style.display = 'none';
    }

    let patient_row_id = checkbox_id.replace(/^cb_/, 'pt_');
    let patient_row = document.getElementById(patient_row_id);
    if (checked) {
        patient_row.style.display = 'block';
    } else {
        patient_row.style.display = 'none';
    }
}

function process_checkboxes(message) {
    if (!('box_states' in message)) {
        return;
    }
    let box_states = message['box_states'];
    const checkbox_ids = Object.keys(box_states);
    checkbox_ids.forEach((checkbox_id, index) => {
        let checked = box_states[checkbox_id];
        var checkbox = document.getElementById(checkbox_id);
        process_checkbox(checkbox, checked);
    });
}

function process_freetexts(message) {
    if (!('field_entires' in message)) {
        return;
    }
    let fields = message['field_entires'];
    // TODO? save cursor position of box we are currently typing in?
    const field_ids = Object.keys(fields);
    field_ids.forEach((field_id, index) => {
        let value = fields[field_id];
        var field = document.getElementById(field_id);
        // only what changed AND from some other source
        if (field.value != value && message.viewer_id != viewer_id) {
            field.value = value;
        }

        let epic_text_id = field_id.replace(/^ft_/, 'eft_');
        var epic_field = document.getElementById(epic_text_id);
        if (!epic_field) {
            console.log('missing:', epic_text_id);
        } else {
            epic_field.innerText = value;
        }

        let patient_text_id = field_id.replace(/^ft_/, 'pft_');
        var patient_field = document.getElementById(patient_text_id);
        if (!patient_field) {
            console.log('missing:', patient_text_id);
        } else {
            patient_field.innerText = value;
        }
    });
}

function process_viewer_count(message) {
    if (!('viewers' in message)) {
        return;
    }
    let element = document.getElementById("viewer_count");
    element.innerHTML = `Viewers: ${message.viewers}`
    if (message.viewers > 1) {
        element.style.visibility = 'visible';
    } else {
        element.style.visibility = 'hidden'
    }
}

function first_incoming_message(event) {
    let elementList = document.querySelectorAll("input[type='checkbox']");
    elementList.forEach((checkbox) => {
        checkbox.style.visibility = "visible";
        checkbox.onclick = () => {
            boxclicked(checkbox)
        };
        process_checkbox(checkbox, false)
    })
    elementList = document.querySelectorAll("input[type='text']");
    elementList.forEach((textfield) => {
        textfield.style.visibility = "visible";
        textfield.onkeyup = () => {
            freetextentered(textfield)
        };
    })
}

function ws_on_message(event) {
    if (messages_received == 0) {
        first_incoming_message(event);
    }
    ++messages_received;
    if (DEBUG > 0) {
        console.log('received: ', event.data);
    }

    const message = JSON.parse(event.data);
    if ((!('patient_id' in message)) || (message.patient_id != patient_id)) {
        console.log(`expected patient_id of '${patient_id}'`);
        console.log(`               but was '${message.patient_id}'`);
        ++weirdness;
        return;
    }

    process_checkboxes(message);

    process_freetexts(message);

    process_viewer_count(message);
}

window.addEventListener('load', (event) => {
    var url = new URL(document.URL);
    var hostname = url.hostname;
    var port = url.port;
    ws = new WebSocket(`ws://${hostname}:${port}/patient/${patient_id}`);
    ws.onmessage = ws_on_message;
    switch_to_view("clinician");
});
