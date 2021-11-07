// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

// TODO: make starting and stopping the AdficeWebserver much more friendly
// for testing.

let http = require('http');
let ws = require('ws');
let express = require('express');
let ejs = require('ejs');
let util = require('util');
let showdown = require('showdown');
let adfice_factory = require('./adfice.js');

let adfice = adfice_factory.adfice_init();

let md = new showdown.Converter();

const PORT = process.argv[2] || process.env.PORT || 8080;
console.log('PORT: ', PORT);

const DEBUG = ((process.env.DEBUG !== undefined) &&
    (process.env.DEBUG !== "0"));
console.log('DEBUG: ', DEBUG);

async function get_data_for_patient(req, res) {
    let patient_id = req.query.id || req.query.patient || 0;
    let patient_advice = await adfice.get_advice_for_patient(patient_id);
    let data = {
        patient_id: patient_id,
        patient_advice: patient_advice,
    };
    return data;
}

async function render_index(req, res) {
    res.render("index"); //.ejs
}

async function json_advice(req, res) {
    res.json(await get_data_for_patient(req, res));
}

async function render_advice(req, res) {
    res.render("patient" /* .ejs */ , await get_data_for_patient(req, res));
}

async function render_validation_advice(req, res) {
    let data = await get_data_for_patient(req, res);
    data['md'] = md;
    data['lang'] = 'nl';
    res.render("patient-validation", data); // .ejs
}

async function render_prediction_explanation(req, res) {
    let patient_id = req.query.id || 0;
    let patient_measurements = await adfice.get_patient_measurements(patient_id);
    let patient_measurement;
    if (patient_measurements == null) {
        patient_measurement = null;
    } else {
        patient_measurement = patient_measurements[0];
    }

    res.render("prediction_explanation", {
        lang: 'nl',
        patient_id: patient_id,
        patient_measurement: patient_measurement
    }); // .ejs
}

async function render_advice_texts_checkboxes(req, res) {
    let query_id = req.query.id || "6e";
    let rule_numbers = query_id.split(',');
    let advice_texts = await adfice.get_advice_texts_checkboxes(rule_numbers);
    res.render("checkboxes", {
        rule_numbers: rule_numbers,
        advice_texts: advice_texts
    }); // .ejs
}


process.on('exit', function() {
    console.log('server is not listening on ' + PORT);
});

let app = express();
const server = http.createServer(app);
server.wss = new ws.Server({
    noServer: true
});

app.use("/static", express.static('static'));
app.use("/assets", express.static('static'));

app.use("/start", express.static('static/start.html'));
app.use("/prep", express.static('static/prep.html'));
app.use("/consult", express.static('static/consult.html'));
app.use("/advise", express.static('static/advise.html'));
app.use("/finalize", express.static('static/finalize.html'));

app.set('view engine', 'ejs');
app.get("/advice", json_advice);

app.get("/", render_index);
app.get("/index", render_index);
app.get("/index.html", render_index);

app.get("/patient", express.static('static/start.html'));

app.get("/patient-validation", render_validation_advice);

app.get('/load', async function(req, res) {
    let mrn = req.query.mrn;
    let id = await adfice.id_for_mrn(mrn);
    // if (!id) {
    //     let etl = requrie(ETL_LIB);
    //     let etl_options = await autil.from_json_file(ETL_OPTIONS_JSON_PATH);
    //     let user_id = req.query.user_id;
    //     let participant_number = req.query.participant_number;
    //     id = await etl.etl(mrn, user_id, participant_number, etl_options);
    // }
    res.redirect('/start?id=' + id);
});

// // sketch of post support
// app.use(express.urlencoded({extended:false}));
// app.post('/load', function (req, res) {
//    mrn = req.body.mrn;
//    // ...
// });


server.receivers = {};

function msg_header(message, kind, id) {
    message.kind = kind;
    let id_key = `${kind}_id`;
    message[id_key] = id;
    message.viewers = server.receivers[kind][id].size;
}

function send_all(kind, id, message) {
    msg_header(message, kind, id);
    let msg_string = JSON.stringify(message, null, 4);
    if (DEBUG > 0) {
        console.log('sending all:\n', msg_string);
    }
    server.receivers[kind][id].forEach((rws) => {
        rws.send(msg_string);
    });
}

function hello_all(kind, id) {
    let message = {};
    message.type = 'hello';
    message.info = 'world';
    send_all(kind, id, message);
}

var global_patient_advice_message_count = 0;
async function patient_advice_message(kind, id) {
    ++global_patient_advice_message_count;
    /* viewer_id should come from the session */
    let viewer_id = global_patient_advice_message_count;
    let patient_advice = await adfice.get_advice_for_patient(id);

    let freetexts = patient_advice.free_texts;
    let selections = patient_advice.selected_advice || {};

    let message = {};
    msg_header(message, kind, id);

    message.type = 'init';
    message.info = 'hello';
    message.viewer_id = viewer_id;
    message['field_entries'] = freetexts;
    message['box_states'] = selections;
    message['is_final'] = patient_advice.is_final;
    if ('debug_info' in patient_advice) {
        message['debug_info'] = patient_advice.debug_info;
    }
    return message;
}

async function init_patient_data(ws, kind, id) {
    let message = await patient_advice_message(kind, id);
    let msg_string = JSON.stringify(message, null, 4);
    if (DEBUG > 0) {
        console.log('sending init:\n', msg_string);
    }
    ws.send(msg_string);
}

server.on('upgrade', function upgrade(request, socket, head) {
    const pathname = request.url;
    server.wss.handleUpgrade(request, socket, head, async function done(ws) {
        let path_parts = pathname.split('/');
        let id = path_parts.pop();
        let kind = path_parts.pop();

        if (kind == 'advice') { // JSON version
            kind = 'patient'; // EJS version
        }

        if (DEBUG > 0) {
            console.log(`adding receiver[${kind}][${id}]`);
        }
        if (server.receivers[kind] == null) {
            server.receivers[kind] = {};
        }
        if (server.receivers[kind][id] == null) {
            server.receivers[kind][id] = new Set();
        }
        server.receivers[kind][id].add(ws);

        ws.on('close', function clear() {
            if (DEBUG > 0) {
                console.log(`removing receiver[${kind}][${id}]`);
            }
            server.receivers[kind][id].delete(ws);
            hello_all(kind, id);
        });

        ws.on('message', async function incoming(data) {
            if (DEBUG > 2) {
                console.log('received: ', data);
            }
            try {
                let message = JSON.parse(data);
                if (DEBUG > 0 && message.type != 'ping') {
                    console.log('received: ', data);
                }
                message.viewers = server.receivers[kind][id].size;
                let id_key = `${kind}_id`;
                if (message[id_key] == id) {
                    let patient_id = id;
                    let viewer_id = message.viewer_id;
                    if (('box_states' in message) ||
                        ('field_entries' in message)) {
                        let selections = message['box_states'];
                        let freetexts = message['field_entries'];
                        await adfice.set_advice_for_patient(
                            patient_id, viewer_id, selections, freetexts);
                    }
                    if (message.type == 'definitive') {
                        await adfice.finalize_and_export(patient_id);
                        let new_msg = await patient_advice_message(kind,
                            patient_id);
                        send_all(kind, patient_id, new_msg);
                    } else if (message.type == 'patient_renew') {
                        await adfice.reload_patient_data(patient_id);
                        let new_msg = await patient_advice_message(kind,
                            patient_id);
                        send_all(kind, patient_id, new_msg);
                    } else if (message.type == 'was_printed') {
                        await adfice.add_log_event_print(viewer_id, patient_id);
                    } else if (message.type == 'was_copied_patient') {
                        await adfice.add_log_event_copy_patient_text(viewer_id,
                            patient_id);
                    } else if (message.type == 'was_copied_ehr') {
                        await adfice.add_log_event_copy_ehr_text(viewer_id,
                            patient_id);
                    } else if (message.type == 'ping') {
                        let pong = {};
                        pong.type = 'pong';
                        pong.sent = message.sent;
                        pong.recv = Date.now();
                        msg_header(pong, kind, patient_id);
                        let msg_string = JSON.stringify(pong, null, 4);
                        if (DEBUG > 2) {
                            console.log('sending reply:\n', msg_string);
                        }
                        ws.send(msg_string);
                    } else if (message.type == 'submit_missings') {
                        await adfice.update_prediction_with_user_values(
                            patient_id, message['submit_missings']);
                    } else {
                        send_all(kind, patient_id, message);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        });
        if (kind == 'patient') {
            await init_patient_data(ws, kind, id);
        }
        hello_all(kind, id);
    });
});

server.listen(PORT, () => {
    console.log(`server is listening on ${PORT}`);
});

server.on('close', function() {
    console.log(`closing server running on ${PORT}`);
});
