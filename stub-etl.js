// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

/* Since the stub_etl does not connect to a patient record, it always uses the same patient data */

const autil = require('./adfice-util');

async function getAuth(options, adfice_url, req_url) {
    let url = new URL('http://example.org' + req_url);
    let launch = url.searchParams.get('launch');
    let iss = url.searchParams.get('iss');
    let state_obj = {
        token_url: 'http://example.org/token',
        iss: iss,
        mrn: url.searchParams.get('mrn'),
        fhir: url.searchParams.get('fhir'),
        user: url.searchParams.get('user'),
        study: url.searchParams.get('study'),
        participant: url.searchParams.get('participant')
    };
    let state_json = JSON.stringify(state_obj);
    let state_base64 = Buffer.from(state_json).toString('base64');

    let redir_url = new URL(adfice_url);
    redir_url.searchParams.append('code', 'fake_code');
    redir_url.searchParams.append('state', state_base64);
    redir_url.protocol = 'http';
    let rv = {
        url: redir_url.toString(),
        headers: {}
    };
    return rv;
}

async function getToken(code, state, adfice_url, options) {
    let decoded_state = Buffer.from(state, 'base64').toString('utf-8');
    let state_json = JSON.parse(decoded_state);
    let token_json = {};
	token_json.state = state;
	token_json.user = state_json.user;
	return token_json;
	
}

async function renew(refresh_data, etl_opts){
	let refresh_json = JSON.stringify(refresh_data);
console.log(refresh_json);	
	// the actual etl will need to do stuff with the refresh_token from the refresh_data,
	// but the only vars stub cares about are mrn and fhir, 
	// which are the same in token_json and refresh_data
	let encoded_state = Buffer.from(refresh_json).toString('base64');
	let token_json = refresh_data;
	token_json.state = encoded_state;
	return etl(token_json, etl_opts);
}

/*
We assume that there will be a link in the EHR that launches our page with the
required URL parameters to the adfice web server.
The adfice web server will get the MRN from the URL and then check to see
if the MRN is already in our DB. If not, it calls "etl(...)" which will
load the patient data into the DB and assign an adfice patient_id.
*/
async function etl(token_json, etl_opts) {
	let state = token_json.state;
    let decoded_state = Buffer.from(state, 'base64').toString('utf-8');
    let state_json = JSON.parse(decoded_state);
    let mrn = state_json.mrn;
    let fhir = state_json.fhir;
    let fake_bsn = Math.floor(Math.random() * 999999998) + 1;

    let patient_json = {
        ehr_pid: fhir,
        mrn: mrn,
		refresh_token: 'bogus_token',
        bsn: fake_bsn,
        birth_date: '1930-01-01',
        medications: [{
                ATC: 'N05BA01',
                generic_name: 'diazepam',
                display_name: 'Diazepam',
                start_date: '2022-1-7 13:09:35',
                dose_text: 'Take twice daily'
            },
            {
                ATC: 'V03AX03',
                generic_name: 'cobicistat',
                display_name: 'COBICIstat',
                start_date: '2022-1-7 13:09:35',
                dose_text: '2dd'
            },
            {
                ATC: 'N04BA01',
                generic_name: 'levodopa',
                display_name: 'levoDOPA',
                start_date: '2022-1-7 13:09:35',
                dose_text: null
            },
            {
                ATC: null,
                generic_name: 'zinkzalf',
                display_name: 'zinkzalf',
                start_date: '2021-01-27 10:10:00.000',
                dose_text: '4x daily'
            },
            {
                ATC: null,
                generic_name: null,
                display_name: 'voedingssupplement',
                start_date: '2021-01-27 10:10:00.000',
                dose_text: '4x daily'
            }
        ],
        problems: [{
                name: 'hypertensie',
                icd_10: 'I10',
                ehr_text: 'Essenti??le (primaire) hypertensie',
                start_date: '2017-02-27'
            },
            {
                name: 'angina-pectoris',
                icd_10: 'I20.0',
                ehr_text: 'Instabiele angina pectoris',
                start_date: '2020-03-15'
            },
            {
                name: 'diabetes',
                icd_10: 'E11.9',
                ehr_text: null,
                start_date: '2022-1-7 13:9:35'
            }
        ],
        labs: [{
                name: 'eGFR',
                date_measured: '2022-01-07 10:18:00',
                lab_test_code: '33914-3',
                lab_test_result: '> 60',
                lab_test_units: 'mL/min/1.73 m??'
            },
            {
                name: 'natrium',
                date_measured: '2022-01-07 10:18:00',
                lab_test_code: '82812-9',
                lab_test_result: '135',
                lab_test_units: 'mmol/l'
            },
            {
                name: 'kalium',
                date_measured: '2022-01-07 10:18:00',
                lab_test_code: '2823-3',
                lab_test_result: '3.5',
                lab_test_units: 'mmol/l'
            }
        ],
        measurements: {
            systolic_bp_mmHg: 120,
            bp_date_measured: '2012-11-29',
            height_cm: 130,
            height_date_measured: '2020-01-27',
            weight_kg: 32,
            weight_date_measured: '2020-01-27',
            smoking: 0,
            smoking_date_measured: '2021-08-05',
        }
    };

    return patient_json;

}


module.exports = {
    etl: etl,
	renew: renew,
    getAuth: getAuth,
    getToken: getToken,
};
