// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

var fs = require('fs');
var db = require('./adficeDB');

async function main() {

    await db.init();

    var error_code = 1;
    try {
        const rows = await db.sql_query("SELECT 1");
        error_code = 0;
    } catch (error) {
        console.log(error);
    }

    await db.close();

    process.exit(error_code);
}

main();
