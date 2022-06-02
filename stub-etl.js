// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

/* Since the stub_etl does not connect to a patient record, it always uses the same patient data */
const adb = require('./adfice-db');
const autil = require('./adfice-util');

var db = null;

/*
We assume that there will be a link in the EHR that launches our page with the
required URL parameters to the adfice web server.
The adfice web server will get the MRN from the URL and then check to see
if the MRN is already in our DB. If not, it calls "etl(...)" which will
load the patient data into the DB and assign an adfice patient_id.
*/
async function etl(mrn, participant_number, options) {
    const uuid = autil.uuid4_new_string();
    if (participant_number == '') {
        participant_number = null;
    }
    let fake_bsn = Math.floor(Math.random() * 999999998) + 1;

    let list_of_inserts = [
        ['INSERT INTO etl_mrn_patient (patient_id, mrn) VALUES (?, ?)', [uuid, mrn]],
        ['/* patientListOfInserts */ INSERT INTO patient (patient_id, participant_number, birth_date, age, is_final) VALUES (?,?,?,?,0)', [uuid, participant_number, '1940-1-1', '82']],
        ['/* patientListOfInserts */ INSERT INTO etl_bsn_patient (patient_id, bsn) VALUES (?,?)', [uuid, fake_bsn]],
        ['/* medListOfInserts */\n\t\t\tINSERT INTO patient_medication (patient_id, date_retrieved, medication_name, generic_name, ATC_code, start_date, dose) VALUES (?,?,?,?,?,?,?)',
            [
                uuid,
                '2022-1-7 13:9:35',
                'Diazepam',
                'diazepam',
                'N05BA01',
                '2021-12-28 09:06:00.000',
                'Take twice daily'
            ]
        ],
        ['/* medListOfInserts */\n\t\t\tINSERT INTO patient_medication (patient_id, date_retrieved, medication_name, generic_name, ATC_code, start_date, dose) VALUES (?,?,?,?,?,?,?)',
            [
                uuid,
                '2022-1-7 13:9:35',
                'COBICIstat',
                'cobicistat',
                'V03AX03',
                '2021-01-27 10:10:00.000',
                '2dd'
            ]
        ],
        ['/* medListOfInserts */\n\t\t\tINSERT INTO patient_medication (patient_id, date_retrieved, medication_name, generic_name, ATC_code) VALUES (?,?,?,?,?)',
            [
                uuid,
                '2022-1-7 13:9:35',
                'levoDOPA',
                'levodopa',
                'N04BA01'
            ]
        ],
        ['/* medListOfInserts */\n\t\t\tINSERT INTO patient_medication (patient_id, date_retrieved, medication_name, generic_name, start_date, dose) VALUES (?,?,?,?,?,?)',
            [
                uuid,
                '2022-1-7 13:9:35',
                'zinkzalf',
                'zinkzalf',
                '2021-01-27 10:10:00.000',
                '4x daily'
            ]
        ],
        ['/* medListOfInserts */\n\t\t\tINSERT INTO patient_medication (patient_id, date_retrieved, medication_name, start_date, dose) VALUES (?,?,?,?,?)',
            [
                uuid,
                '2022-1-7 13:9:35',
                'voedingssupplement',
                '2021-01-27 10:10:00.000',
                '3x daily'
            ]
        ],
        ['/* probListOfInserts */\n\t\t\tINSERT INTO patient_problem (patient_id, date_retrieved, name, icd_10, ehr_text, start_date) VALUES (?,?,?,?,?,?)',
            [
                uuid,
                '2022-1-7 13:9:35',
                'hypertensie',
                'I10',
                'Essentiële (primaire) hypertensie',
                '2017-02-27'
            ]
        ],
        ['/* probListOfInserts */\n\t\t\tINSERT INTO patient_problem (patient_id, date_retrieved, name, icd_10, ehr_text, start_date) VALUES (?,?,?,?,?,?)',
            [
                uuid,
                '2022-1-7 13:9:35',
                'angina-pectoris',
                'I20.0',
                'Instabiele angina pectoris',
                '2020-03-15'
            ]
        ],
        ['/* probListOfInserts */\n\t\t\tINSERT INTO patient_problem (patient_id, date_retrieved, name, icd_10) VALUES (?,?,?,?)',
            [
                uuid,
                '2022-1-7 13:9:35',
                'diabetes',
                'E11.9'
            ]
        ],
        ['/* labListOfInserts */ INSERT INTO patient_lab (patient_id, date_retrieved, date_measured, lab_test_name, lab_test_code, lab_test_result, lab_test_units) VALUES (?,?,?,?,?,?,?)',
            [
                uuid,
                '2022-1-7 13:9:35',
                '2022-01-07 10:18:00',
                'eGFR',
                '33914-3',
                '>60',
                'mL/min/1.73 m²'
            ]
        ],
        ['/* labListOfInserts */ INSERT INTO patient_lab (patient_id, date_retrieved, date_measured, lab_test_name, lab_test_code, lab_test_result, lab_test_units) VALUES (?,?,?,?,?,?,?)',
            [
                uuid,
                '2022-1-7 13:9:35',
                '2022-01-07 10:18:00',
                'natrium',
                '82812-9',
                '135',
                'mmol/l'
            ]
        ],
        ['/* labListOfInserts */ INSERT INTO patient_lab (patient_id, date_retrieved, date_measured, lab_test_name, lab_test_code, lab_test_result, lab_test_units) VALUES (?,?,?,?,?,?,?)',
            [
                uuid,
                '2022-1-7 13:9:35',
                '2022-01-07 10:18:00',
                'kalium',
                '2823-3',
                '3.5',
                'mmol/l'
            ]
        ],
        ['/* measListOfInserts */ INSERT INTO patient_measurement (patient_id,date_retrieved,systolic_bp_mmHg,bp_date_measured,height_cm,height_date_measured,weight_kg,weight_date_measured,smoking, smoking_date_measured) VALUES (?,?,?,?,?,?,?,?,?,?)',
            [
                uuid,
                '2022-1-7 13:9:35',
                120,
                '2012-11-29',
                130,
                '2020-01-27',
                32,
                '2020-01-27',
                0,
                '2021-08-05'
            ]
        ]
    ];
    await sql_transaction(list_of_inserts);
    let sql = 'SELECT patient_id FROM etl_mrn_patient WHERE mrn = ?';
    let results = await sql_select(sql, [mrn]);
    let id = null;
    /* istanbul ignore next */
    if (results.length) {
        id = results[0].patient_id;
    }

    await shutdown();

    return id;

}


/*
The user can also press the "vernieuwen" button, which should reload all the data for a particular patient.
In this case, we will get a patient ID and look up the MRN.
Tables patient and etl_patient_bsn are updated; for the other tables
we delete any old data before adding new data.
*/
async function etl_renew(patient_id, options) {
	let fake_bsn = '888000' 
		+  patient_id.substring(patient_id.length-4, patient_id.length);
    let list_of_transactions = [
        ['/* patientListOfUpdates */ UPDATE patient SET birth_date = ?, age = ?, is_final = 0 WHERE patient_id = ?',
            ['1940-1-1', '82', patient_id]
        ],
        ['/* patientListOfUpdates */ UPDATE etl_bsn_patient SET bsn = ? WHERE patient_id = ?',
            [fake_bsn, patient_id]
        ],
        ['SET @patient_id= ?', [patient_id]],
        ['DELETE FROM patient_medication where patient_id = ?', [patient_id]],
        ['/* medListOfInserts */\n\t\t\tINSERT INTO patient_medication (patient_id, date_retrieved, medication_name, generic_name, ATC_code, start_date, dose) VALUES (@patient_id,?,?,?,?,?,?)',
            [
                '2022-1-7 13:9:35',
                'Diazepam',
                'diazepam',
                'N05BA01',
                '2021-12-28 09:06:00.000',
                'Take twice daily'
            ]
        ],
        ['/* medListOfInserts */\n\t\t\tINSERT INTO patient_medication (patient_id, date_retrieved, medication_name, generic_name, ATC_code, start_date, dose) VALUES (@patient_id,?,?,?,?,?,?)',
            [
                '2022-1-7 13:9:35',
                'COBICIstat',
                'cobicistat',
                'V03AX03',
                '2021-01-27 10:10:00.000',
                '2dd'
            ]
        ],
        ['/* medListOfInserts */\n\t\t\tINSERT INTO patient_medication (patient_id, date_retrieved, medication_name, generic_name, ATC_code) VALUES (@patient_id,?,?,?,?)',
            [
                '2022-1-7 13:9:35',
                'levoDOPA',
                'levodopa',
                'N04BA01'
            ]
        ],
        ['/* medListOfInserts */\n\t\t\tINSERT INTO patient_medication (patient_id, date_retrieved, medication_name, generic_name, start_date, dose) VALUES (@patient_id,?,?,?,?,?)',
            [
                '2022-1-7 13:9:35',
                'zinkzalf',
                'zinkzalf',
                '2021-01-27 10:10:00.000',
                '4x daily'
            ]
        ],
        ['/* medListOfInserts */\n\t\t\tINSERT INTO patient_medication (patient_id, date_retrieved, medication_name, start_date, dose) VALUES (@patient_id,?,?,?,?)',
            [
                '2022-1-7 13:9:35',
                'voedingssupplement',
                '2021-01-27 10:10:00.000',
                '3x daily'
            ]
        ],
        ['DELETE FROM patient_problem where patient_id = ?', [patient_id]],
        ['/* probListOfInserts */\n\t\t\tINSERT INTO patient_problem (patient_id, date_retrieved, name, icd_10, ehr_text, start_date) VALUES (@patient_id,?,?,?,?,?)',
            [
                '2022-1-7 13:9:35',
                'hypertensie',
                'I10',
                'Essentiële (primaire) hypertensie',
                '2017-02-27'
            ]
        ],
        ['/* probListOfInserts */\n\t\t\tINSERT INTO patient_problem (patient_id, date_retrieved, name, icd_10, ehr_text, start_date) VALUES (@patient_id,?,?,?,?,?)',
            [
                '2022-1-7 13:9:35',
                'angina-pectoris',
                'I20.0',
                'Instabiele angina pectoris',
                '2020-03-15'
            ]
        ],
        ['/* probListOfInserts */\n\t\t\tINSERT INTO patient_problem (patient_id, date_retrieved, name, icd_10) VALUES (@patient_id,?,?,?)',
            [
                '2022-1-7 13:9:35',
                'diabetes',
                'E11.9'
            ]
        ],
        ['DELETE FROM patient_lab where patient_id = ?', [patient_id]],
        ['/* labListOfInserts */ INSERT INTO patient_lab (patient_id, date_retrieved, date_measured, lab_test_name, lab_test_code, lab_test_result, lab_test_units) VALUES (@patient_id,?,?,?,?,?,?)',
            [
                '2022-1-7 13:9:35',
                '2022-01-07 10:18:00',
                'eGFR',
                '33914-3',
                '>60',
                'mL/min/1.73 m²'
            ]
        ],
        ['/* labListOfInserts */ INSERT INTO patient_lab (patient_id, date_retrieved, date_measured, lab_test_name, lab_test_code, lab_test_result, lab_test_units) VALUES (@patient_id,?,?,?,?,?,?)',
            [
                '2022-1-7 13:9:35',
                '2022-01-07 10:18:00',
                'natrium',
                '82812-9',
                '135',
                'mmol/l'
            ]
        ],
        ['/* labListOfInserts */ INSERT INTO patient_lab (patient_id, date_retrieved, date_measured, lab_test_name, lab_test_code, lab_test_result, lab_test_units) VALUES (@patient_id,?,?,?,?,?,?)',
            [
                '2022-1-7 13:9:35',
                '2022-01-07 10:18:00',
                'kalium',
                '2823-3',
                '3.5',
                'mmol/l'
            ]
        ],
        ['DELETE FROM patient_measurement where patient_id = ?', [patient_id]],
        ['/* measListOfInserts */ INSERT INTO patient_measurement (patient_id,date_retrieved,systolic_bp_mmHg,bp_date_measured,height_cm,height_date_measured,weight_kg,weight_date_measured,smoking, smoking_date_measured) VALUES (@patient_id,?,?,?,?,?,?,?,?,?)',
            [
                '2022-1-7 13:9:35',
                120,
                '2012-11-29',
                130,
                '2020-01-27',
                32,
                '2020-01-27',
                0,
                '2021-08-05'
            ]
        ],
        ['DELETE FROM patient_advice_selection where patient_id = ?', [patient_id]],
        ['DELETE FROM patient_advice_freetext where patient_id = ?', [patient_id]]
    ];

    await sql_transaction(list_of_transactions);

    await shutdown();
    return patient_id;

}

// db functions
async function db_init() {
    if (db == null) {
        db = await adb.init();
    }
    return db;
}

async function sql_select(sql, params) {
    db = await db_init();
    return await db.sql_query(sql, params);
}

async function sql_transaction(sqls_and_params) {
    db = await db_init();
    return await db.as_sql_transaction(sqls_and_params);
}

async function shutdown() {
    try {
        /* istanbul ignore else */
        if (db) {
            await db.close();
        }
    } finally {
        db = null;
    }
}

module.exports = {
    etl: etl,
    etl_renew: etl_renew,
};
