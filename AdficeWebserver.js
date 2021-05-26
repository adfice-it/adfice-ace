// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
let express = require('express');
let ejs = require('ejs');
let util = require('util');
let showdown = require('showdown');
let adfice = require('./adfice.js');

let md = new showdown.Converter();

const PORT = process.argv[2] || 8080;
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

app.get("/", renderAdviceTextsCheckboxes);
app.get("/index", renderAdviceTextsCheckboxes);
app.get("/checkboxes", renderAdviceTextsCheckboxes);

app.listen(8080, function() {
    console.log("server is listening on " + PORT);
});
