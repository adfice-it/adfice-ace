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
        div_other_med_advice_area.style.display = 'none';
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
            console.log(`attempt to switch to view with unexpected` +
                ` name' ${view}'`);
        }
        div_clinician_view.style.display = 'block';
        div_patient_view.style.display = 'none';
        div_epic_box.style.display = 'block';
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

function ucfirst(s) {
    if (typeof s !== 'string') {
        return s;
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function boxclicked(checkbox) {
    if (!ws) {
        checkbox.checked = !checkbox.checked;
        console.error('got a check event for', checkbox,
            'but websocket is null');
        ++weirdness;
        return;
    }
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
    if (!ws) {
        console.error('got a freetext event for ', textfield,
            'but websocket is null');
        ++weirdness;
        return;
    }
    let message = {};
    message.viewer_id = viewer_id;
    message.patient_id = patient_id;
    message.type = 'freetexts';
    message.textfield = textfield.id;

    message['field_entries'] = {};
    // TODO: this will need to change if the two views contain the same
    // text fields, as they will be duplicate/conflicting
    let elementList = document.querySelectorAll("input[type='text']");
    elementList.forEach((field) => {
        message['field_entries'][field.id] = field.value;
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
    if (!('field_entries' in message)) {
        return;
    }
    let fields = message['field_entries'];
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
    let element = document.getElementById("viewer_count");
    element.style.visibility = 'visible';
    element.style.color = 'black';

    if (!('viewers' in message)) {
        return;
    }

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
        console.log(JSON.stringify({
            message: message
        }, null, 4));
        ++weirdness;
        return;
    }

    process_checkboxes(message);

    process_freetexts(message);

    process_viewer_count(message);

    if ('is_final' in message) {
        is_final = message['is_final'];
    }

    let elementList = document.querySelectorAll("input");
    elementList.forEach((input) => {
        input.disabled = is_final;
    });

    if ('debug_info' in message) {
        console.log(JSON.stringify({
            debug_info: message.debug_info
        }, null, 4));
    }
}

function ws_on_close(event) {
    let element = document.getElementById("viewer_count");
    element.innerHTML = 'Connecting ...';
    element.style.visibility = 'visible';
    element.style.color = 'red';

    let elementList = document.querySelectorAll("input");
    elementList.forEach((input) => {
        input.disabled = true;
    });

    ws = null;
    messages_received = 0;

    let one_second = 1000;
    console.log('Socket closed:', event.reason, ' will try to reconnect');
    setTimeout(function() {
        console.log('Reconnecting....');
        connect_web_socket();
    }, one_second);
}

function ws_on_error(err) {
    console.error('Socket error: ', err.message);
    ws.close();
};

function connect_web_socket() {
    let url = new URL(document.URL);
    let hostname = url.hostname;
    let port = url.port;
    let ws_protocol = 'wss:';

    // URL.protocol is not safe in older Internet Explorers
    try {
        let url_protocol = url.protocol;
        if (url_protocol == 'http:') {
            ws_protocol = 'ws:';
        }
    } catch (protocol_error) {
        console.log(protocol_error);
    }

    let ws_url = `${ws_protocol}//${hostname}:${port}/patient/${patient_id}`;
    ws = new WebSocket(ws_url);
    ws.onmessage = ws_on_message;
    ws.onclose = ws_on_close;
    ws.onerror = ws_on_error;

    return ws;
}

window.addEventListener('load', (event) => {
    connect_web_socket();

    switch_to_view("clinician");
});

async function copyEpicTextToClipboard() {
    if (!navigator.clipboard) {
        alert("browser does not support copy");
        return true;
    }

    var allEpicText = document.getElementById("div_all_epic_text");
    await navigator.clipboard.writeText(allEpicText.innerText);
    return true;
}

async function copyPatientTextToClipboard() {
    if (!navigator.clipboard) {
        alert("browser does not support copy");
        return true;
    }

    var dpv = document.getElementById("div_patient_view");
    var nma = document.getElementById("non_med_advice_patient_area_text");
    var all_text = dpv.innerText + "\n" + "\n" + nma.innerText;
    await navigator.clipboard.writeText(all_text);
    return true;
}

async function makeDefinitive() {
    let message = {};
    message.viewer_id = viewer_id;
    message.patient_id = patient_id;
    message.type = 'definitive';

    let msg_str = JSON.stringify(message, null, 4);
    if (DEBUG > 0) {
        console.log('sending:', msg_str);
    }
    ws.send(msg_str);
    return true;
}

async function patientRenew() {
    let message = {};
    message.viewer_id = viewer_id;
    message.patient_id = patient_id;
    message.type = 'patient_renew';

    let msg_str = JSON.stringify(message, null, 4);
    if (DEBUG > 0) {
        console.log('sending:', msg_str);
    }
    ws.send(msg_str);
    return true;
}

async function windowPrint() {
    window.print();
    return true;
}
