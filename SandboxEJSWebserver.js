var express = require('express');
var ejs = require('ejs');
var adfice = require('./adfice.js');

var app = express();
app.set('view engine', 'ejs');

var pageData = adfice.getOurData();

app.get("/", function(req, res) {
    res.render("index", pageData ); // .ejs
});
app.listen(8080, function() {
    console.log("server is listening on 8080");
});

