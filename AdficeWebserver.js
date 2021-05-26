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
    res.render("patient_validation", {
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
app.set('view engine', 'ejs');

app.get("/patient", renderAdviceForPatient);
app.get("/patient_validation", renderValidationAdviceForPatient);

app.get("/", renderAdviceTextsCheckboxes);
app.get("/index", renderAdviceTextsCheckboxes);
app.get("/checkboxes", renderAdviceTextsCheckboxes);
app.use("/static", express.static('static'));

const server = http.createServer(app);
const wss = new ws.Server({
    server
});
server.wss = wss;

server.receivers = new Set();
wss.on('connection', (ws) => {
    console.log(`adding receiver`);
    server.receivers.add(ws);
    ws.on('close', function clear() {
        console.log(`removing receiver`);
        server.receivers.delete(ws);
    });
    ws.on('message', function incoming(data) {
        console.log('recieved: ', data);
        server.receivers.forEach((rws) => {
            rws.send(data);
        });
    });

    let message = {};
    message.type = 'hello';
    message.info = 'world';

    ws.send(JSON.stringify(message));
});

/*
wss.on('message', function incoming(data) {
    console.log('recieved: ', data);
    server.receivers.forEach((rws) => {
        rws.send(data);
    });
});
*/

server.listen(PORT, () => {
    console.log("server is listening on " + PORT);
});

// server.on('close', function() {
//    console.log(`closing server is running on ${PORT}`);
// });
