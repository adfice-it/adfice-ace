// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 expandtab :
"use strict";

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

async function renderAdviceForPatient(req, res) {
    let patient_id = req.query.id || 0;
    let patient_advice = await adfice.getAdviceForPatient(patient_id);
    res.render("patient", {
        lang: 'nl',
        md: md,
        patient_id: patient_id,
        patient_advice: patient_advice
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

async function renderAdviceTextsCheckboxes(req, res) {
    let query_id = req.query.id || "6e";
    let rule_numbers = query_id.split(',');
    let advice_texts = await adfice.getAdviceTextsCheckboxes(rule_numbers);
    res.render("index", {
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

app.set('view engine', 'ejs');

app.get("/patient", renderAdviceForPatient);
app.get("/patient-validation", renderValidationAdviceForPatient);

app.get("/", renderAdviceTextsCheckboxes);
app.get("/index", renderAdviceTextsCheckboxes);
app.get("/checkboxes", renderAdviceTextsCheckboxes);
app.use("/static", express.static('static'));

server.receivers = {};

function send_all(kind, id, message) {
    message.kind = kind;
    let id_key = `${kind}_id`;
    message[id_key] = id;
    message.viewers = server.receivers[kind][id].size;

    let msg_string = JSON.stringify(message, null, 4);
    server.receivers[kind][id].forEach((rws) => {
        rws.send(msg_string);
    });
}

function hello_all(kind, id) {
    let message = {};
    message.info = 'hello';
    send_all(kind, id, message);
}

server.on('upgrade', function upgrade(request, socket, head) {
    const pathname = request.url;
    server.wss.handleUpgrade(request, socket, head, function done(ws) {
        let path_parts = pathname.split('/');
        let id = path_parts.pop();
        let kind = path_parts.pop();
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

        ws.on('message', function incoming(data) {
            if (DEBUG > 0) {
                console.log('received: ', data);
            }
            try {
                let message = JSON.parse(data);
                message.viewers = server.receivers[kind][id].size;
                let id_key = `${kind}_id`;
                if (message[id_key] == id) {
                    send_all(kind, id, message);
                }
            } catch (error) {
                console.log(error);
            }
        });
        let message = {};
        message.info = 'hello';
        send_all(kind, id, message);
    });
});

server.listen(PORT, () => {
    console.log(`server is listening on ${PORT}`);
});

server.on('close', function() {
    console.log(`closing server running on ${PORT}`);
});
