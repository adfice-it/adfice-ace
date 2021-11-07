// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

/* global data used by these functions */
var message_globals = {
    patient_id: null,
    viewer_id: null,
    is_final: null,
    ws: null,
    freetexts_entered: null,
    weirdness: 0,
    messages_received: 0,
    debug: 0,
    logger: console
};

function send_message(message_type, apply) {
    let message = {};
    message.viewer_id = message_globals.viewer_id;
    message.patient_id = message_globals.patient_id;
    message.type = message_type;

    if (apply) {
        apply(message);
    }

    let msg_str = JSON.stringify(message, null, 4);
    if (message_globals.debug > 0) {
        message_globals.logger.log('sending:', msg_str);
    }
    try {
        message_globals.ws.send(msg_str);
    } catch (err) {
        message_globals.logger.log(err, 'could not send:', msg_str);
        ++message_globals.weirdness;
        message_globals.ws = null;
    }
}

function boxclicked(checkbox) {
    if (!message_globals.ws) {
        checkbox.checked = !checkbox.checked;
        message_globals.logger.error('got a check event for', checkbox,
            'but websocket is null');
        ++message_globals.weirdness;
        return;
    }
    if (message_globals.debug > 0) {
        message_globals.logger.log('Checkbox ' + checkbox.id + ' clicked' +
            ' and is now ' + checkbox.checked);
    }

    send_message('checkboxes', function(message) {
        message.checkbox_id = checkbox.id;
        message.checkbox_checked = checkbox.checked;

        message['box_states'] = {};
        let elementList = document.querySelectorAll("input[type='checkbox']");
        for (let i = 0; i < elementList.length; ++i) {
            let checkbox = elementList[i];
            message['box_states'][checkbox.id] = checkbox.checked;
        }
    });
}

function freetextentered(textfield) {
    if (message_globals.freetexts_entered != null &&
        message_globals.freetexts_entered != textfield.id) {
        send_freetext(textfield.id);
    }
    message_globals.freetexts_entered = textfield.id;
}

function updateMeas() {
    if (!message_globals.ws) {
        message_globals.logger.error(
            'got a submit_missings event but websocket is null');
        ++message_globals.weirdness;
        return;
    }

    send_message('submit_missings', function(message) {
        message.patient_id = message_globals.patient_id;

        message['submit_missings'] = {};
        let form = document.getElementById('missing_data_form');
        for (let i = 0; i < form.elements.length; ++i) {
            if (form.elements[i].id != "button_submit_missings") {
                let val = form.elements[i].value;
                message['submit_missings'][form.elements[i].id] = val;
            }
        }
        console.log(message);
    });
    localStorage.clear();
    window.location.reload(true);
}



function send_freetext(textfield_id) {
    if (!message_globals.ws) {
        message_globals.logger.error('got a freetext event for ', textfield,
            'but websocket is null');
        ++message_globals.weirdness;
        return;
    }

    send_message('freetexts', function(message) {
        message.textfield = textfield_id;

        message['field_entries'] = {};
        let elementList = document.querySelectorAll("input[type='text']");
        for (let i = 0; i < elementList.length; ++i) {
            let field = elementList[i];
            message['field_entries'][field.id] = field.value;
        }
    });
}

function process_checkbox(checkbox_id, checked) {
    var checkbox = document.getElementById(checkbox_id);
    if (checkbox) {
        checkbox.checked = checked;
    }

    let tr_row_id = checkbox_id.replace(/^cb_/, 'tr_');
    let tr_row = document.getElementById(tr_row_id);
    if (tr_row) {
        if (checked) {
            tr_row.classList.add("checkbox-checked");
            tr_row.classList.remove("checkbox-unchecked");
        } else {
            tr_row.classList.add("checkbox-unchecked");
            tr_row.classList.remove("checkbox-checked");
        }
    }

    let ehr_row_id = checkbox_id.replace(/^cb_/, 'et_');
    let ehr_row = document.getElementById(ehr_row_id);
    if (ehr_row) {
        if (checked) {
            // ehr_row.classList.add("checkbox-checked");
            // ehr_row.classList.remove("checkbox-unchecked");
            ehr_row.style.display = 'block';
        } else {
            // ehr_row.classList.add("checkbox-unchecked");
            // ehr_row.classList.remove("checkbox-checked");
            ehr_row.style.display = 'none';
        }
    }

    let patient_row_id = checkbox_id.replace(/^cb_/, 'pt_');
    let patient_row = document.getElementById(patient_row_id);
    if (patient_row) {
        if (checked) {
            // patient_row.classList.add("checkbox-checked");
            // patient_row.classList.remove("checkbox-unchecked");
            patient_row.style.display = 'block';
        } else {
            // patient_row.classList.add("checkbox-unchecked");
            // patient_row.classList.remove("checkbox-checked");
            patient_row.style.display = 'none';
        }
    }
}

function process_checkboxes(message) {
    if (!('box_states' in message)) {
        return;
    }
    let box_states = message['box_states'];
    const checkbox_ids = Object.keys(box_states);
    let atcs = {};
    for (let i = 0; i < checkbox_ids.length; ++i) {
        let checkbox_id = checkbox_ids[i];
        let atc = checkbox_id.split('_')[1];
        if (atcs[atc] === undefined) {
            atcs[atc] = 0;
        }
        let checked = box_states[checkbox_id];
        if (checked) {
            atcs[atc] += 1;
        }
        process_checkbox(checkbox_id, checked);
    }

    let atcs_keys = Object.keys(atcs);
    for (let i = 0; i < atcs_keys.length; ++i) {
        let atc = atcs_keys[i];
        let num_checked = atcs[atc];
        let geen_advies_id = 'geen_advies_' + atc;
        let geen_advies_div = document.getElementById(geen_advies_id);
        if (geen_advies_div) {
            if (num_checked > 0) {
                // geen_advies_div.classList.add('no-advice-some-checked');
                // geen_advies_div.classList.remove('no-advice-none-checked');
                geen_advies_div.style.display = 'none';
            } else {
                // geen_advies_div.classList.add('no-advice-none-checked');
                // geen_advies_div.classList.remove('no-advice-some-checked');
                geen_advies_div.style.display = 'block';
            }
        }
    }
}

function process_freetexts(message) {
    if (!('field_entries' in message)) {
        return;
    }
    let debounce_guard_allow = 1;
    let our_id = message_globals.viewer_id;
    if (message.type != 'init' && message.viewer_id == our_id) {
        debounce_guard_allow = 0;
    }
    let fields = message['field_entries'];
    // TODO? save cursor position of box we are currently typing in?
    const field_ids = Object.keys(fields);
    for (let i = 0; i < field_ids.length; ++i) {
        let field_id = field_ids[i];
        let value = fields[field_id];
        var field = document.getElementById(field_id);
        // only what changed AND from some other source
        if (field && field.value != value && debounce_guard_allow) {
            field.value = value;
        }

        let ehr_text_id = field_id.replace(/^ft_/, 'eft_');
        var ehr_field = document.getElementById(ehr_text_id);
        if (ehr_field) {
            ehr_field.innerText = value;
        }

        let patient_text_id = field_id.replace(/^ft_/, 'pft_');
        var patient_field = document.getElementById(patient_text_id);
        if (patient_field) {
            patient_field.innerText = value;
        }
    };
}

function process_viewer_count(message) {
    let element = document.getElementById("viewer-count");
    if (!element) {
        return;
    }
    element.style.visibility = 'visible';
    element.style.color = 'black';

    if (!('viewers' in message)) {
        return;
    }

    element.innerHTML = 'Viewers: ' + message.viewers;
    if (message.viewers > 1) {
        element.style.visibility = 'visible';
    } else {
        element.style.visibility = 'hidden'
    }
}

function first_incoming_message(event) {
    if (message_globals.debug > 0) {
        message_globals.logger.log('first_incoming_message');
    }
    let elementList = document.querySelectorAll("input[type='checkbox']");
    for (let i = 0; i < elementList.length; ++i) {
        var checkbox = elementList[i];
        checkbox.style.visibility = "visible";
        checkbox.onclick = function() {
            boxclicked(checkbox)
        };
        process_checkbox(checkbox.id, false)
    }

    elementList = document.querySelectorAll("input[type='text']");
    for (let i = 0; i < elementList.length; ++i) {
        let textfield = elementList[i];
        textfield.style.visibility = "visible";
        textfield.onkeyup = function() {
            freetextentered(textfield)
        };
    }
}

function ws_on_message(event) {
    if (message_globals.messages_received == 0) {
        first_incoming_message(event);
    }
    ++message_globals.messages_received;
    if (message_globals.debug > 0) {
        message_globals.logger.log('received: ', event.data);
    }

    const message = JSON.parse(event.data);

    if (message.type == 'init' && !message_globals.viewer_id) {
        /* viewer_id should come from the session */
        message_globals.viewer_id = message.viewer_id;
    }

    if ((!('patient_id' in message)) ||
        (message.patient_id != message_globals.patient_id)) {
        message_globals.logger.log('expected patient_id of:',
            message_globals.patient_id);
        message_globals.logger.log('               but was:',
            message.patient_id);
        message_globals.logger.log(JSON.stringify({
            message: message
        }, null, 4));
        ++message_globals.weirdness;
        return;
    }

    process_checkboxes(message);

    process_freetexts(message);

    process_viewer_count(message);

    if ('is_final' in message) {
        message_globals.is_final = message['is_final'];
    }

    let elementList = document.querySelectorAll("input");
    for (let i = 0; i < elementList.length; ++i) {
        let input = elementList[i];
        input.disabled = message_globals.is_final;
    }

    if ('debug_info' in message) {
        message_globals.logger.log(JSON.stringify({
            debug_info: message.debug_info
        }, null, 4));
    }
}

function ws_on_close(event) {
    let element = document.getElementById("viewer-count");
    element.innerHTML = 'Connecting ...';
    element.style.visibility = 'visible';
    element.style.color = 'red';

    let elementList = document.querySelectorAll("input");
    for (let i = 0; i < elementList.length; ++i) {
        let input = elementList[i];
        input.disabled = true;
    };

    message_globals.ws = null;
    message_globals.messages_received = 0;

    let one_second = 1000;
    message_globals.logger.log('Socket closed:', event.reason,
        ' will try to reconnect');
    setTimeout(function() {
        message_globals.logger.log('Reconnecting....');
        connect_web_socket();
    }, one_second);
}

function ws_on_error(err) {
    message_globals.logger.error('Socket error: ', err.message);
    message_globals.ws.close();
};

function connect_web_socket() {

    let ws_protocol = 'wss:';

    // URL.protocol is not safe in older Internet Explorers

    const url_regex = /^([^:]*):\/\/([^:/]*)(:([0-9]+))?/
    let matches = document.URL.match(url_regex);
    let url_protocol = matches[1];
    let url_hostname = matches[2];
    let url_port = matches[4];

    if (url_protocol === 'http') {
        ws_protocol = 'ws:';
        if (!url_port) {
            url_port = 80;
        }
    } else {
        if (!url_port) {
            url_port = 443;
        }
    }

    // URLSearchParams does not work in IE
    // let params = new URLSearchParams(window.location.search);
    message_globals.patient_id = urlParam('id');

    let base_url = ws_protocol + '//' + url_hostname + ':' + url_port;
    let ws_url = base_url + '/patient/' + message_globals.patient_id;
    message_globals.ws = new WebSocket(ws_url);
    message_globals.ws.onmessage = ws_on_message;
    message_globals.ws.onclose = ws_on_close;
    message_globals.ws.onerror = ws_on_error;

    if (message_globals.debug > 0) {
        message_globals.logger.log('creating websocket with url:', ws_url);
    }

    return message_globals.ws;
}

function urlParam(parName) {
    var results = new RegExp('[\?&]' + parName + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return decodeURI(results[1]) || 0;
    }
}

function connect_web_socket_and_keep_alive() {
    connect_web_socket();

    let one_second = 1000;
    let ping_interval = 4 * one_second;
    setInterval(function() {
        if (message_globals.ws) {
            send_message("ping", function(msg) {
                msg.sent = Date.now();
            });
        }
    }, ping_interval);

    let freetext_interval = (one_second / 4);
    setInterval(function() {
        if (message_globals.ws) {
            let textfield_id = message_globals.freetexts_entered;
            if (textfield_id != null) {
                send_freetext(textfield_id);
                message_globals.freetexts_entered = null;
            }
        }
    }, freetext_interval);
}

function copyTextToClipboard(text, type) {
    if (navigator.clipboard != undefined) {
        navigator.clipboard.writeText(text);
    } else if (window.clipboardData) {
        // Internet Explorer
        window.clipboardData.setData("Text", text);
    } else {
        alert("browser does not support copy");
    }

    send_message(type);

    return true;
}

//TODO does not work in IE. Copies the text from both the selected AND NONSELECTED options.
function copyEHRTextToClipboard() {
    var allEHRText = document.getElementById("div_all_ehr_text");
    return copyTextToClipboard(allEHRText.innerText, 'was_copied_ehr');
}

function copyPatientTextToClipboard() {
    var dpv = document.getElementById("div_patient_view");
    var nma = document.getElementById("non_med_advice_patient_area_text");
    var all_text = dpv.innerText + "\n" + "\n" + nma.innerText;
    return copyTextToClipboard(all_text, 'was_copied_patient');
}

function makeDefinitive() {
    send_message('definitive');
    return true;
}

function patientRenew() {
    send_message('patient_renew');
    return true;
}

function windowPrint() {
    window.print();
    send_message('was_printed');
    return true;
}
