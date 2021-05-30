// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

var fs = require('fs');
const mariadb = require('mariadb');

async function main() {

    var dbconfig = require('./dbconfig.json');
    let passwd = await fs.promises.readFile('adfice_mariadb_user_password');
    dbconfig['password'] = String(passwd).trim();

    // console.log('Password: "' + passwd + '"');
    const mariadb = require('mariadb');
    const pool = mariadb.createPool(dbconfig);

    var error_code = 1;
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT 1");
        error_code = 0;
    } catch (error) {
        // console.log(error);
    } finally {
        if (conn) {
            conn.end();
        }
    }
    pool.end();
    process.exit(error_code);
}

main();
