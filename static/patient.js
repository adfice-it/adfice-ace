// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 expandtab :
"use strict";

const DEBUG = 0;
if (DEBUG > 0) {
    console.log("hello world!");
}
var ws;
var weirdness = 0;
var messages_received = 0;

function boxclicked(checkbox) {
    if (DEBUG > 0) {
        console.log('Checkbox ' + checkbox.id + ' clicked' +
            ' and is now ' + checkbox.checked);
    }
    let message = {};
    message.type = 'checkboxes';
    message.patient_id = patient_id;
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

function process_checkboxes(message) {
    let box_states = message['box_states'];
    const checkbox_ids = Object.keys(box_states);
    checkbox_ids.forEach((checkbox_id, index) => {
        let checked = box_states[checkbox_id];
        var checkbox = document.getElementById(checkbox_id);
        checkbox.checked = checked;
    });
}

function first_incoming_message(event) {
    let elementList = document.querySelectorAll("input[type='checkbox']");
    elementList.forEach((checkbox) => {
        checkbox.style.visibility = "visible";
        checkbox.onclick = () => {
            boxclicked(checkbox)
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

    const data = JSON.parse(event.data);
    if (data.type !== 'hello' && data.patient_id != patient_id) {
        console.log(`expected id of '${patient_id}'`);
        console.log(`       but was '${data.patient_id}'`);
        ++weirdness;
        return;
    }
    if (data.type == "checkboxes") {
        process_checkboxes(data);
    }

    let element = document.getElementById("viewer_count");
    element.innerHTML = `Viewers: ${data.viewers}`
    element.style.display = null;
}

window.addEventListener('load', (event) => {
    var url = new URL(document.URL);
    var hostname = url.hostname;
    var port = url.port;
    ws = new WebSocket(`ws://${hostname}:${port}/patient/${patient_id}`);
    ws.onmessage = ws_on_message;
});
