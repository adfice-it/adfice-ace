// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const adb = require('./adficeDB');

async function export_to_portal_db(db_env_file_path, patient_id, json_advice) {
    let sqls_and_params = [];

    sqls_and_params.push([
        "DELETE FROM patient_advice WHERE patient_id = ?",
        [patient_id]
    ]);

    sqls_and_params.push([
        "INSERT INTO patient_advice (patient_id, json_advice) VALUES (?,?)",
        [patient_id, JSON.stringify(json_advice)]
    ]);

    let results = null;
    let db = await adb.init(null, db_env_file_path);
    try {
        results = await db.as_sql_transaction(sqls_and_params);
    } finally {
        await db.close();
    }

    return results;
}

module.exports = {
    export_to_portal_db: export_to_portal_db,
};
