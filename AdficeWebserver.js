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

let render_count = 0;

async function getDataForPatient(req, res) {
    ++render_count;
    let patient_id = req.query.id || req.query.patient || 0;
    let viewer_id = render_count; /* viewer_id should come from the session */
    let patient_advice = await adfice.getAdviceForPatient(patient_id);
    let data = {
        lang: 'nl',
        md: md,
        viewer_id: viewer_id,
        patient_id: patient_id,
        patient_advice: patient_advice,
    };
    return data;
}

async function renderIndex(req, res) {
    res.render("index"); //.ejs
}

async function jsonAdviceForPatient(req, res) {
    res.json(await getDataForPatient(req, res));
}

async function renderStart(req, res) {
    res.render("start" /* .ejs */ );
}

async function renderPrep(req, res) {
    res.render("prep" /* .ejs */ , await getDataForPatient(req, res));
}

async function renderConsult(req, res) {
    res.render("consult" /* .ejs */ , await getDataForPatient(req, res));
}

async function renderAdvise(req, res) {
    res.render("advise" /* .ejs */ , await getDataForPatient(req, res));
}

async function renderFinalize(req, res) {
    res.render("finalize" /* .ejs */ , await getDataForPatient(req, res));
}

async function renderAdviceForPatient(req, res) {
    res.render("patient" /* .ejs */ , await getDataForPatient(req, res));
}

async function renderValidationAdviceForPatient(req, res) {
    res.render("patient-validation", await getDataForPatient(req, res)); // .ejs
}

async function renderPredictionExplanation(req, res) {
    let patient_id = req.query.id || 0;
    let patient_measurements = await adfice.getPatientMeasurements(patient_id);
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

async function renderAdviceTextsCheckboxes(req, res) {
    let query_id = req.query.id || "6e";
    let rule_numbers = query_id.split(',');
    let advice_texts = await adfice.getAdviceTextsCheckboxes(rule_numbers);
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
app.set('view engine', 'ejs');

app.get("/", renderIndex);
app.get("/index", renderIndex);
app.get("/index.html", renderIndex);

app.get("/advice", jsonAdviceForPatient);

app.get("/start", renderStart);
app.get("/prep", renderPrep);
app.get("/consult", renderConsult);
app.get("/advise", renderAdvise);
app.get("/finalize", renderFinalize);

app.get("/patient", renderAdviceForPatient);

app.get("/patient-validation", renderValidationAdviceForPatient);

app.get("/prediction_explanation", renderPredictionExplanation);

app.get("/checkboxes", renderAdviceTextsCheckboxes);

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

async function patient_advice_message(kind, id) {
    let patient_advice = await adfice.getAdviceForPatient(id);

    let freetexts = patient_advice.free_texts;
    let selections = patient_advice.selected_advice || {};

    let message = {};
    msg_header(message, kind, id);

    message.type = 'init';
    message.info = 'hello';
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
            if (DEBUG > 0) {
                console.log('received: ', data);
            }
            try {
                let message = JSON.parse(data);
                message.viewers = server.receivers[kind][id].size;
                let id_key = `${kind}_id`;
                if (message[id_key] == id) {
                    let patient_id = id;
                    let viewer_id = message.viewer_id;
                    if ('box_states' in message) {
                        let selections = message['box_states'];
                        await adfice.setSelectionsForPatient(
                            patient_id, viewer_id, selections);
                    }
                    if ('field_entries' in message) {
                        let freetexts = message['field_entries'];
                        await adfice.setFreetextsForPatient(
                            patient_id, viewer_id, freetexts);
                    }
                    if (message.type == 'definitive') {
                        await adfice.finalizeAndExport(patient_id);
                        let new_msg = await patient_advice_message(kind,
                            patient_id);
                        send_all(kind, patient_id, new_msg);
                    } else if (message.type == 'patient_renew') {
                        await adfice.reloadPatientData(patient_id);
                        let new_msg = await patient_advice_message(kind,
                            patient_id);
                        send_all(kind, patient_id, new_msg);
                    } else if (message.type == 'was_printed') {
                        await adfice.addLogPrintEvent(viewer_id, patient_id);
                    } else if (message.type == 'ping') {
                        let pong = {};
                        pong.type = 'pong';
                        pong.sent = message.sent;
                        pong.recv = Date.now();
                        msg_header(pong, kind, patient_id)
                        ws.send(JSON.stringify(pong, null, 4));
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
