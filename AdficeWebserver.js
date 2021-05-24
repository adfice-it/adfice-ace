var express = require('express');
var ejs = require('ejs');
var adfice = require('./adfice.js');

var app = express();
app.set('view engine', 'ejs');

app.get("/patient", async function(req, res) {
    let patient_id = req.query.id;

    var result = await adfice.getRulesForPatient(patient_id);

    res.send('<html><body>' + JSON.stringify(result) + '</body></html>');
});

app.get("/", async function(req, res) {
    let patient_id = req.query.id;

    var rule_numbers = ["6e"];
    var advice_texts = await adfice.getAdviceTextsCheckboxes(rule_numbers);

    var result = await adfice.getRulesForPatient(patient_id);

    res.render("index", {
        advice_texts: advice_texts
    }); // .ejs
});

app.listen(8080, function() {
    console.log("server is listening on 8080");
});

process.on('exit', function() {
    console.log('server is no longer listening on 8080');
});
