// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
var fs = require('fs');

async function main() {

    let passwd = await fs.promises.readFile('adfice_mariadb_user_password');
    passwd = String(passwd).trim();

    // console.log('Password: "' + passwd + '"');
    const mariadb = require('mariadb');
    const pool = mariadb.createPool({
        host: '127.0.0.1',
        port: 13306,
        user: 'adfice',
        password: passwd,
        database: 'adfice',
        connectionLimit: 5
    });

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
