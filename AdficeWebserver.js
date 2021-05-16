var express = require('express');
var ejs = require('ejs');
var adfice = require('./adfice.js');

var app = express();
app.set('view engine', 'ejs');

app.get("/", async function(req, res) {
    var rule_numbers = ["6e"];
    var advice_texts = await adfice.getAdviceTexts(rule_numbers);

    res.render("index", {
        advice_texts: advice_texts
    }); // .ejs
});
app.listen(8080, function() {
    console.log("server is listening on 8080");
});
