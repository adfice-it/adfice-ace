// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const adfice_factory = require('./adfice');

async function main() {
    let patient = process.argv[2];
    var error_code = 1;
    var adfice = adfice_factory.adfice_init();
    try {
        let data = await adfice.getExportData(patient);

        console.log(JSON.stringify({
            'faux exporting for patient id': patient,
            'data': data
        }, null, 4));

        error_code = 0;
    } catch (error) {
        console.log('Error:', error);
    } finally {
        await adfice.shutdown();
    }

    process.exit(error_code);
}

main();
