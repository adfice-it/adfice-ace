// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021-2024 Stichting Open Electronics Lab
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const fs = require('fs');
const dotenv = require('dotenv');
const mariadb = require('mariadb');

async function init(config, env_file_path) {
    let dbconfig = {};
    config = config || {};
    env_file_path = env_file_path || 'dbconfig.env';

    var envfile = {};
    try {
        envfile = await dotenv.parse(fs.readFileSync(env_file_path));
    } catch (error) /* istanbul ignore next */ {
        console.log(error);
    }

    if (config.socketPath || process.env.DB_SOCKET_PATH ||
        envfile.DB_SOCKET_PATH) {
        dbconfig.socketPath = config.socketPath ||
            process.env.DB_SOCKET_PATH ||
            envfile.DB_SOCKET_PATH;
    } else {
        dbconfig.host = config.host ||
            process.env.DB_HOST ||
            envfile.DB_HOST ||
            '127.0.0.1';

        dbconfig.port = config.port ||
            process.env.DB_PORT ||
            envfile.DB_PORT ||
            3306;
    }

    dbconfig.user = config.user ||
        process.env.DB_USER ||
        envfile.DB_USER ||
        null;

    dbconfig.database = config.database ||
        process.env.DB_NAME ||
        envfile.DB_NAME ||
        null;

    dbconfig.password = config.password ||
        process.env.DB_PASSWORD ||
        envfile.DB_PASSWORD ||
        null;

    dbconfig.passwordFile = config.passwordFile ||
        process.env.DB_PW_FILE ||
        envfile.DB_PW_FILE ||
        null;

    dbconfig.connectionLimit = config.connectionLimit ||
        process.env.DB_CONNECTION_LIMIT ||
        envfile.DB_CONNECTION_LIMIT ||
        '5';

    if (config.acquireTimeout ||
        process.env.DB_ACQUIRE_TIMEOUT ||
        envfile.DB_ACQUIRE_TIMEOUT) {
        dbconfig.acquireTimeout = config.acquireTimeout ||
            process.env.DB_ACQUIRE_TIMEOUT ||
            envfile.DB_ACQUIRE_TIMEOUT;
    }

    if (config.connectTimeout ||
        process.env.DB_CONNECT_TIMEOUT ||
        envfile.DB_CONNECT_TIMEOUT) {
        dbconfig.connectTimeout = config.connectTimeout ||
            process.env.DB_CONNECT_TIMEOUT ||
            envfile.DB_CONNECT_TIMEOUT;
    }

    if (config.initializationTimeout ||
        process.env.DB_INITIALIZATION_TIMEOUT ||
        envfile.DB_INITIALIZATION_TIMEOUT) {
        dbconfig.initializationTimeout = config.initializationTimeout ||
            process.env.DB_INITIALIZATION_TIMEOUT ||
            envfile.DB_INITIALIZATION_TIMEOUT;
    }

    if (dbconfig.passwordFile && !dbconfig.password) {
        try {
            let passwd = await fs.promises.readFile(dbconfig.passwordFile);
            dbconfig.password = String(passwd).trim();
        } catch (error) /* istanbul ignore next */ {
            console.log(error);
        }
    }

    let db = {
        /* private member variables */
        pool: null,
        dbconfig: dbconfig,

        /* "private" member functions */
        connection_begin: connection_begin,
        connection_end: connection_end,
        connection_pool_close: connection_pool_close,
        connection_pool: connection_pool,

        /* public member functions */
        schema_name: schema_name,
        sql_query: sql_query,
        as_sql_transaction: as_sql_transaction,
        close: close,
    }

    return db;
}

async function close() {
    await this.connection_pool_close();
}

async function connection_pool_close() {
    try {
        /* istanbul ignore else */
        if (this.pool) {
            await this.pool.end();
        }
    } finally {
        this.pool = null;
    }
}

async function connection_pool() {
    if (this.pool) {
        return this.pool;
    }

    this.pool = mariadb.createPool(this.dbconfig);
    return this.pool;
}

async function connection_begin() {
    let pool = await this.connection_pool();
    let conn = await pool.getConnection();
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
        this.connection_pool_close();
        /* istanbul ignore next */
        throw error;
    }
}

async function as_sql_transaction(sqls_and_params) {
    let rs;
    let conn;
    try {
        conn = await this.connection_begin();
        conn.beginTransaction();
        for (let i = 0; i < sqls_and_params.length; ++i) {
            let sql = sqls_and_params[i][0];
            let params = sqls_and_params[i][1];
            let rv = await conn.query(sql, params);
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
        conn = await this.connection_begin();
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
        await this.connection_end(conn);
    }
    return objects;
}

async function schema_name() {
    return this.dbconfig.database;
}

module.exports = {
    init: init,
}
