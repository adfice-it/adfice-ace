// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

var fs = require('fs');

async function main() {

    var dbconfig = require('./dbconfig.json');
    let passwd = await fs.promises.readFile('adfice_mariadb_user_password');
    dbconfig['password'] = String(passwd).trim();

    const mariadb = require('mariadb');
    const pool = mariadb.createPool(dbconfig);

    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM patient_labs");
        console.log(rows);

    } catch (err) {
        throw err;
    } finally {
        if (conn) {
            let result = conn.end();
            pool.end();
            return result;
        }
    }
}

main();
