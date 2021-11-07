// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const fs = require('fs');
const adb = require('./adfice-db');

async function main() {
    let config = {
        host: process.argv[2],
        port: process.argv[3],
        user: process.argv[4],
        database: process.argv[5],
        passwordFile: process.argv[6],
    };

    var db = await adb.init(config);

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
