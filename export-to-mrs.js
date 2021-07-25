// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const adfice_factory = require('./adfice');
const exporter = require('./portal-export');

async function main() {
    let patient = process.argv[2];
    let portal_db_env_path = process.argv[3] || './portal-dbconfig.env';
    var error_code = 1;
    var adfice = adfice_factory.adfice_init();

    try {
        let data = await adfice.getExportData(patient);

        console.log(JSON.stringify({
            'patient_id': patient,
            'data': data
        }, null, 4));

        await exporter.export_to_portal_db(portal_db_env_path, patient, data);

        error_code = 0;
    } catch (error) {
        console.log('Error:', error);
    } finally {
        await adfice.shutdown();
    }

    process.exit(error_code);
}

main();
