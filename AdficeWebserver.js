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
let adfice = require('./adfice.js');

let md = new showdown.Converter();

const PORT = process.argv[2] || process.env.PORT || 8080;
console.log('PORT: ', PORT);

const DEBUG = ((process.env.DEBUG !== undefined) &&
    (process.env.DEBUG !== "0"));
console.log('DEBUG: ', DEBUG);

let render_count = 0;

async function jsonAdviceForPatient(req, res) {
    ++render_count;
    let patient_advice = await adfice.getAdviceForPatient(req.query.id || 0);
    patient_advice.patient_id = patient_advice.patient_id || 0;
    res.json({
        viewer_id: render_count,
        patient_advice: patient_advice
    });
}

async function renderAdviceForPatient(req, res) {
    ++render_count;
    let patient_id = req.query.id || 0;
    let patient_advice = await adfice.getAdviceForPatient(patient_id);
    res.render("patient", {
        lang: 'nl',
        md: md,
        viewer_id: render_count,
        patient_id: patient_id,
        patient_advice: patient_advice,
    }); // .ejs
}

async function renderValidationAdviceForPatient(req, res) {
    let patient_id = req.query.id || 0;
    let patient_advice = await adfice.getAdviceForPatient(patient_id);
    res.render("patient-validation", {
        lang: 'nl',
        md: md,
        patient_id: patient_id,
        patient_advice: patient_advice
    }); // .ejs
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

async function renderIndex(req, res) {
    res.render("index"); //.ejs
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
app.set('view engine', 'ejs');

app.get("/", renderIndex);
app.get("/index", renderIndex);
app.get("/index.html", renderIndex);

app.get("/advice", jsonAdviceForPatient);
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

async function patient_advice_message(id, kind) {
    let patient_advice = await adfice.getAdviceForPatient(id);

    let freetexts = patient_advice.free_texts;
    let selections = patient_advice.selected_advice || {};
    if (Object.keys(selections).length == 0) {
        selections = patient_advice.preselected_checkboxes;
    }

    let message = {};
    msg_header(message, kind, id);

    message.type = 'init';
    message.info = 'hello';
    message['field_entries'] = freetexts;
    message['box_states'] = selections;
    message['is_final'] = patient_advice.is_final;
    return message;
}

async function init_patient_data(ws, kind, id) {
    let message = await patient_advice_message(id, kind);
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
                    if ('box_states' in message) {
                        let patient_id = id;
                        let viewer = message.viewer_id;
                        let selections = message['box_states'];
                        await adfice.setSelectionsForPatient(
                            patient_id, viewer, selections);
                    }
                    if ('field_entries' in message) {
                        let patient_id = id;
                        let viewer = message.viewer_id;
                        let freetexts = message['field_entries'];
                        await adfice.setFreetextsForPatient(
                            patient_id, viewer, freetexts);
                    }
                    if (message.type == 'definitive') {
                        await adfice.finalizeAndExport(id);
                        let new_msg = await patient_advice_message(id, kind);
                        send_all(kind, id, new_msg);
                    } else {
                        send_all(kind, id, message);
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
