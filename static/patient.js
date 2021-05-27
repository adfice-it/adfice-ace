// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 expandtab :
"use strict";

console.log("hello world!");
var ws;
var weirdness = 0;
var messages_received = 0;

function boxclicked(checkbox) {
    console.log('Checkbox ' + checkbox.id + ' clicked' +
        ' and is now ' + checkbox.checked);
    let message = {};
    message.type = 'checkbox';
    message.patient_id = patient_id;
    message.checkbox_id = checkbox.id;
    message.checkbox_checked = checkbox.checked;

    let msg_str = JSON.stringify(message);
    console.log('sending:', msg_str);
    ws.send(msg_str);
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
    console.log('recieved: ', event.data);

    const data = JSON.parse(event.data);
    if (data.type !== 'hello' && data.patient_id != patient_id) {
        console.log(`expected id of ${patient_id} but was ${data.patient_id}`);
        ++weirdness;
        return;
    }
    if (data.type == "checkbox") {
        var checkbox = document.getElementById(data.checkbox_id);
        checkbox.checked = data.checkbox_checked;
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
