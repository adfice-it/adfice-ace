// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021-2024 Stichting Open Electronics Lab
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const PORT = process.argv[2] || process.env.PORT || 8080;

const ETL_LIB = process.argv[3] || process.env.ETL_LIB || './stub-etl';

const ETL_OPTIONS_JSON_PATH = process.argv[4] ||
    process.env.ETL_OPTIONS_JSON_PATH || './stub-etl-options.json';

const DEBUG = ((process.env.DEBUG !== undefined) &&
    (process.env.DEBUG !== "0"));

console.log('DEBUG: ', DEBUG);
console.log('ETL_OPTIONS_JSON_PATH: ', ETL_OPTIONS_JSON_PATH);
console.log('ETL_LIB: ', ETL_LIB);
console.log('PORT: ', PORT);

const etl = require(ETL_LIB);
const adfice_webserver = require('./adfice-webserver');

process.on('exit', function() {
    console.log('server is not listening on ' + PORT);
});

let server = adfice_webserver.create_webserver(
    'localhost', PORT, console, etl, ETL_OPTIONS_JSON_PATH);
