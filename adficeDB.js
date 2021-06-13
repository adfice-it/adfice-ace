// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const fs = require('fs');
const dotenv = require('dotenv');
const mariadb = require('mariadb');

var pool = null;
var dbconfig = null;

/* istanbul ignore next */
async function init(config, env_file_path) {
    dbconfig = dbconfig || {};
    config = config || {};
    env_file_path = env_file_path || 'dbconfig.env';

    var envfile = {};
    try {
        envfile = await dotenv.parse(fs.readFileSync(env_file_path));
    } catch (error) {
        console.log(error);
    }

    dbconfig.host = config.host ||
        process.env.DB_HOST ||
        envfile.DB_HOST ||
        '127.0.0.1';

    dbconfig.port = config.port ||
        process.env.DB_PORT ||
        envfile.DB_PORT ||
        3306;

    dbconfig.user = config.user ||
        process.env.DB_USER ||
        envfile.DB_USER ||
        'adfice';

    dbconfig.database = config.database ||
        process.env.DB_NAME ||
        envfile.DB_NAME ||
        'adfice';

    dbconfig.password = config.passowrd ||
        process.env.DB_PASSWORD ||
        envfile.DB_PASSWORD ||
        null;

    dbconfig.passwordFile = config.passowrd ||
        process.env.DB_PW_FILE ||
        envfile.DB_PW_FILE ||
        'adfice_mariadb_user_password';

    dbconfig.connectionLimit = config.connectionLimit ||
        process.env.DB_CONNECTION_LIMIT ||
        envfile.DB_CONNECTION_LIMIT ||
        '5';

    /* istanbul ignore else */
    if (!dbconfig.password) {
        let passwd = await fs.promises.readFile(dbconfig.passwordFile);
        dbconfig.password = String(passwd).trim();
    }

    return dbconfig;
}

async function close() {
    await connection_pool_close();
    dbconfig = null;
}

async function connection_pool_close() {
    try {
        /* istanbul ignore else */
        if (pool) {
            await pool.end();
        }
    } finally {
        pool = null;
    }
}

async function connection_pool() {
    if (pool) {
        return pool;
    }

    /* istanbul ignore else */
    if (!dbconfig) {
        await init();
    }

    pool = mariadb.createPool(dbconfig);
    return pool;
}

async function connection_begin() {
    let _pool = await connection_pool();
    let conn = await _pool.getConnection();
    return conn;
}

async function connection_end(conn) {
    try {
        /* istanbul ignore else */
        if (conn) {
            conn.end();
        }
    } catch (error) {
        /* istanbul ignore next */
        connection_pool_close();
        /* istanbul ignore next */
        throw error;
    }
}

async function as_sql_transaction(sqls_and_params) {
    let rs;
    let conn;
    try {
        conn = await connection_begin();
        conn.beginTransaction();
        for (let i = 0; i < sqls_and_params.length; ++i) {
            let sql = sqls_and_params[i][0];
            let params = sqls_and_params[i][1];
            conn.query(sql, params);
        }
        rs = await conn.commit();
    } finally {
        await connection_end(conn);
    }
    return rs;
}

async function sql_query(sql, params) {
    let objects = [];
    let conn;
    try {
        conn = await connection_begin();
        // This version of the driver seems to always place the "meta" in
        // with the rows, no matter which calling convention we try.
        let result_set;
        if (!params || params.length == 0) {
            result_set = await conn.query(sql);
        } else {
            result_set = await conn.query(sql, params);
        }
        // So, we will filter out anything that is not in the iterator:
        for (let i = 0; i < result_set.length; ++i) {
            let row = result_set[i];
            objects.push(row);
        }
    } finally {
        await connection_end(conn);
    }
    return objects;
}

module.exports = {
    init: init,
    close: close,
    as_sql_transaction: as_sql_transaction,
    sql_query: sql_query
}
