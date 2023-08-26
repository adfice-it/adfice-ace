// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const http = require('http');
const ws = require('ws');
const express = require('express');
const session = require('express-session');
const ejs = require('ejs');
const util = require('util');
const showdown = require('showdown');
const adfice_factory = require('./adfice.js');
const autil = require('./adfice-util');

const cookie_secret = autil.uuid4_new_string();

const DEBUG = ((process.env.DEBUG !== undefined) &&
    (process.env.DEBUG !== "0"));

// this is actually a kind of constant, but we can "check" it on each page load
var iss = "";

function log_debug(server, msg) {
    if (DEBUG) {
        server.logger.log(msg);
    }
}

log_debug({
    logger: console
}, `DEBUG: ${DEBUG}`);

async function create_webserver(hostname, port, logger, etl, etl_opts_path) {

    let adfice = adfice_factory.adfice_init();

    async function get_data_for_patient(req, res) {
        let patient_id = req.query.id || req.query.patient || 0;
        let patient_advice = await adfice.get_advice_for_patient(patient_id);
        let help_phone = await adfice.get_help_phone();
        let data = {
            patient_id: patient_id,
            patient_advice: patient_advice,
            help_phone: help_phone,
        };
        return data;
    }

    async function json_advice(req, res) {
        res.json(await get_data_for_patient(req, res));
    }

    async function render_validation_advice(req, res) {
        let data = await get_data_for_patient(req, res);
        data['md'] = new showdown.Converter();
        data['lang'] = 'nl';
        res.render("patient-validation", data); // .ejs
    }

    let app = express();

    let max_session_ms = 8 * 60 * 60 * 1000; // 8 hours
    var session_manager = session({
        secret: cookie_secret,
        cookie: {
            maxAge: max_session_ms
        }
    });
    app.use(session_manager);

    const server = http.createServer(app);
    server.wss = new ws.Server({
        noServer: true
    });

    app.use("/static", express.static('static'));
    app.use("/assets", express.static('static'));

    app.use('/favicon.ico', express.static('static/favicon.ico'));

    app.use("/start", express.static('static/start.html'));

    app.use("/prep", express.static('static/prep.html'));
    app.use("/consult", express.static('static/consult.html'));
    app.use("/advise", express.static('static/advise.html'));
    app.use("/finalize", express.static('static/finalize.html'));

    app.set('view engine', 'ejs');
    app.get("/advice", json_advice);

    async function render_index(req, res) {
        res.render("index"); //.ejs
    }
    app.get("/", render_index);
    app.get("/index", render_index);
    app.get("/index.html", render_index);

    app.get("/patient", express.static('static/start.html'));

    app.get("/patient-validation", render_validation_advice);

    app.use("/load-error", express.static('static/load-error.html'));
    let standalone_flag = await adfice.get_env_var('STANDALONE');
    if (standalone_flag) { // note that any value for STANDALONE seems to evaluate to TRUE
        // gets basic info to create session and patient
        app.use("/dataentry", express.static('static/dataentry.html'));

        // allow user to add data about patient
        app.use("/dataentry2", express.static('static/dataentry2.html'));

        app.get('/user-entered', async function(req, res) {
            let id = null;
            let mrn = req.query.mrn;
            let birth_date = req.query.birthdate;
            let participant = req.query.participant;
            let patient = {
                mrn: mrn,
                ehr_pid: null,
                bsn: null,
                refresh_token: 'none',
                birth_date: birth_date,
                participant_number: participant
            };
            try {
                id = await adfice.write_patient_from_json(patient);
            } catch (error) {
                console.log(error);
// TODO add error message for user
                res.redirect('/dataentry');
                return;
            }
            let user_id = req.query.user;
            let doctor_id = await adfice.doctor_id_for_user(user_id);
            log_debug(server, 'setting doctor id:', doctor_id);
            req.session.doctor_id = doctor_id;

            res.redirect('/dataentry2?id=' + id); // TODO go to second data entry page to handle rest of patient data
        });
		
		app.get('/user-entered-patients', async function(req, res) {
            let user_id = req.query.user;
            let doctor_id = await adfice.doctor_id_for_user(user_id);
            log_debug(server, 'setting doctor id:', doctor_id);
            req.session.doctor_id = doctor_id;
			// TODO create page that lists existing patients            
        });
    }

    app.get('/auth', async function(req, res) {
        let code = req.query.code;
        let state = req.query.state;
        let etl_opts = await autil.from_json_file(etl_opts_path);
        let adfice_url = 'https://' + req.get('host') + '/auth';

        let token_json = await etl.getToken(code, state, adfice_url, etl_opts);
        let id = null;
        let mrn = null;
        let fhir = null;
        if (!token_json || Object.keys(token_json).length === 0) {
            res.redirect('/load-error?err=Authorisatiefout');
            return;
        }
        let decoded_state = Buffer.from(state, 'base64').toString('utf-8');
        let state_json = JSON.parse(decoded_state);
        let user_id = token_json.user;
        if (state_json.patient_id) {
            id = state_json.patient_id;
            mrn = state_json.mrn;
            fhir = state_json.ehr_pid;
        } else {
            let etl_patient = await etl.etl(token_json, etl_opts);
            if (!etl_patient || Object.keys(etl_patient).length === 0) {
                res.redirect('/load-error?err=Error%20met%20laden%20van%20patientdata');
                return;
            }
            try {
                id = await adfice.write_patient_from_json(etl_patient);
                mrn = etl_patient.mrn;
                fhir = etl_patient.ehr_pid;
            } catch (error) {
                res.redirect('/load-error?err=Error%20met%20laden%20van%20patientdata');
                return;
            }
        }
        if (!id) {
            res.redirect('/load-error?err=Error%20met%20laden%20van%20patientdata');
            return;
        }
        await adfice.add_log_event_access(user_id, id);
        let doctor_id = await adfice.doctor_id_for_user(user_id);
        log_debug(server, 'setting doctor id:', doctor_id);
        req.session.doctor_id = doctor_id;

        // For testing, allow the session timeout to be set to a shorter value. It cannot be set to a longer value.
        let tsec = state_json.tsec;
        if (tsec < max_session_ms / 1000) {
            req.session.cookie.maxAge = tsec * 1000;
        }

        res.redirect('/start?id=' + id);
    });

    app.get('/load', async function(req, res) {
        res.set('Cache-Control', 'no-cache, must-revalidate, max-age=-1');
        res.set('Pragma', 'no-cache, must-revalidate');
        res.set('Expires', '-1');

        let mrn = req.query.mrn;
        let fhir = req.query.fhir;
        let user_id = req.query.user;
        // ISSuer identifier authorization server
        iss = req.query.iss;

        let etl_opts = await autil.from_json_file(etl_opts_path);
        let adfice_url = 'https://' + req.get('host') + '/auth';
        let id = null;
        let error_string = '';

        if (fhir == null || fhir == '' || typeof(fhir) != 'string' /* 2 FHIRs in URL */ ) {
            fhir = null;
            error_string += "no FHIR id ";
        }
        if (mrn == null || mrn == '' || typeof(mrn) != 'string' /* 2 MRNs in URL */ ) {
            mrn = null;
            error_string += "no MRN ";
        }
        if (user_id == null || user_id == '' || typeof(user_id) != 'string' /* 2 user */ ) {
            user_id = null;
            error_string += "no user ID";
        }
        if ((!fhir && !mrn) || !user_id) {
            let p_str = '?err=' + error_string;
            res.redirect('/load-error' + p_str);
            return;
        }

        if (fhir) {
            id = await adfice.id_for_fhir(fhir);
        } else {
            id = await adfice.id_for_mrn(mrn);
        };

        let encoded_err = null;

        try {
            let etl_opts = await autil.from_json_file(etl_opts_path);
            let auth = await etl.getAuth(etl_opts, adfice_url, req.url, id, req.query.tsec);
            if (Object.keys(auth).length == 0) {
                res.redirect('/load-error?err=authorisatiefout');
            } else {
                res.set(auth.headers);
                res.redirect(auth.url);
            }
        } catch (err) {
            encoded_err = encodeURIComponent('' + err);
            res.redirect('/load-error?err=' + encoded_err);
        }
    });

    // // sketch of post support
    // app.use(express.urlencoded({extended:false}));
    // app.post('/load', function (req, res) {
    //    mrn = req.body.mrn;
    //    // ...
    // });


    server.receivers = {};

    function msg_header(message, kind, id) {
        message.kind = kind;
        let id_key = `${kind}_id`;
        message[id_key] = id;
        message.viewers = server.receivers[kind][id].size;
    }

    function send_all(kind, id, message) {
        msg_header(message, kind, id);
        let msg_string = JSON.stringify(message, null, 4);
        if (DEBUG > 0) {
            console.log('sending all:\n', msg_string);
        }
        server.receivers[kind][id].forEach((rws) => {
            rws.send(msg_string);
        });
    }

    function hello_all(kind, id) {
        let message = {};
        message.type = 'hello';
        message.info = 'world';
        send_all(kind, id, message);
    }

    function make_error_message(text, kind, patient_id) {
        let err_msg = {};
        err_msg.type = 'error_message';
        err_msg.text = text;
        err_msg.time = Date.now();
        try {
            msg_header(err_msg, kind, patient_id);
        } catch (error) {
            console.log(error);
        }
        return err_msg;
    }

    function send_error(ws, text, kind, patient_id) {
        let err_msg = make_error_message(text, kind, patient_id);
        let msg_string = JSON.stringify(err_msg, null, 4);
        ws.send(msg_string);
    }

    function has_user_activity(message) {
        if (message.type != 'ping') {
            return true;
        }
        if (message.reset_session_timeout) {
            return true;
        }
        return false;
    }

    async function handle_patient_message(ws, doctor_id, patient_id, kind,
        message, timeout_ms_remaining) {
        if (('box_states' in message) ||
            ('field_entries' in message)) {
            let selections = message['box_states'];
            let freetexts = message['field_entries'];
            await adfice.set_advice_for_patient(
                patient_id, doctor_id, selections, freetexts);
        }
        if (message.type == 'definitive') {
            let result = await adfice.finalize_and_export(patient_id);
            if (result.error) {
                send_error(ws, result.error, kind, patient_id);
            } else {
                let new_msg = await patient_advice_message(kind,
                    patient_id);
                send_all(kind, patient_id, new_msg);
            }
        } else if (message.type == 'remove_med') {
            await adfice.remove_med(message.atc_code, patient_id);
        } else if (message.type == 'patient_renew') {
            await adfice.add_log_event_renew(doctor_id, patient_id);
            let etl_opts = await autil.from_json_file(etl_opts_path);
            let refresh_data = await adfice.get_refresh_data(patient_id);
            let etl_patient = await etl.renew(refresh_data, etl_opts);
            if (!etl_patient || Object.keys(etl_patient).length == 0) {
                let err_text_en = "etl_renew failed to retrieve new patient data for " + patient_id;
                send_error(ws, err_text_en, kind, patient_id);
            } else {
                let returned_patient = await adfice.renew_patient(patient_id, etl_patient);
                if (returned_patient != patient_id) {
                    let err_text_en = "etl_renew( " +
                        patient_id +
                        " ) unexpectedly returned " +
                        returned_patient;
                    console.log(err_text_en);
                    send_error(ws, err_text_en, kind, patient_id);
                } else {
                    let new_msg = await patient_advice_message(kind,
                        patient_id);
                    // console.log(new_msg);
                    send_all(kind, patient_id, new_msg);
                }
            }
        } else if (message.type == 'was_printed') {
            await adfice.add_log_event_print(doctor_id, patient_id);
        } else if (message.type == 'was_copied_patient') {
            await adfice.add_log_event_copy_patient_text(doctor_id,
                patient_id);
        } else if (message.type == 'was_copied_ehr') {
            await adfice.add_log_event_copy_ehr_text(doctor_id,
                patient_id);
        } else if (message.type == 'ping') {
            let pong = {};
            pong.type = 'pong';
            pong.sent = message.sent;
            pong.recv = Date.now();
            pong.timeout_ms_remaining = timeout_ms_remaining;
            msg_header(pong, kind, patient_id);
            let msg_string = JSON.stringify(pong, null, 4);
            if (DEBUG > 2) {
                console.log('sending reply:\n', msg_string);
            }
            ws.send(msg_string);
        } else if (message.type == 'submit_missings') {
            await adfice.update_prediction_with_user_values(
                patient_id, message['submit_missings']);
        } else if (message.type == 'submit_single_med') {
			await adfice.add_single_med(
                patient_id, message['submit_single_med']);
		} else {
            send_all(kind, patient_id, message);
        }
    }

    var global_patient_advice_message_count = 0;
    async function patient_advice_message(kind, id) {
        ++global_patient_advice_message_count;
        /* viewer_id should come from the session */
        let viewer_id = global_patient_advice_message_count;
        let patient_advice = await adfice.get_advice_for_patient(id);
        if (patient_advice.patient_id != id) {
            return make_error_message('patient id not valid', kind, id);
        }
        let freetexts = patient_advice.free_texts;
        let selections = patient_advice.selected_advice || {};

        let message = {};
        msg_header(message, kind, id);

        message.type = 'init';
        message.info = 'hello';
        message.viewer_id = viewer_id;
        message['field_entries'] = freetexts;
        message['box_states'] = selections;
        message['is_final'] = patient_advice.is_final;
        if ('debug_info' in patient_advice) {
            message['debug_info'] = patient_advice.debug_info;
        }
        return message;
    }

    async function init_patient_data(ws, kind, id) {
        let message = await patient_advice_message(kind, id);
        let msg_string = JSON.stringify(message, null, 4);
        if (DEBUG > 0) {
            console.log('sending init:\n', msg_string);
        }
        ws.send(msg_string);
    }

    server.on('upgrade', function upgrade(request, socket, head) {

        // reconnect session/cookie info to request using express API
        // TODO: consider pull request on express-session to add this
        session_manager(request, {}, function() {});

        const pathname = request.url;
        server.wss.handleUpgrade(request, socket, head,
            async function done(ws) {
                let path_parts = pathname.split('/');
                let id = path_parts.pop();
                let kind = path_parts.pop();

                if (kind == 'advice') { // JSON version
                    kind = 'patient'; // EJS version
                }

                if (DEBUG > 0) {
                    console.log(`adding receiver[${kind}][${id}]`);
                }
                if (server.receivers[kind] == null) {
                    server.receivers[kind] = {};
                }
                if (server.receivers[kind][id] == null) {
                    server.receivers[kind][id] = new Set();
                }
                server.receivers[kind][id].add(ws);

                ws.on('close', function clear() {
                    if (DEBUG > 0) {
                        console.log(`removing receiver[${kind}][${id}]`);
                    }
                    server.receivers[kind][id].delete(ws);
                    hello_all(kind, id);
                });

                ws.on('message', async function incoming(data) {
                    if (DEBUG > 2) {
                        console.log('received: ', data);
                    }
                    if (request.session.cookie.maxAge < 1) {
                        ws.close();
                        return;
                    }
                    try {
                        if (!request.session) {
                            throw 'No session?';
                        }
                        let doctor_id = request.session.doctor_id;
                        if (DEBUG > 0) {
                            console.log('got doctor id:', doctor_id);
                        }
                        if (!doctor_id) {
                            const err_msg_txt = 'No doctor_id in session';
                            if (DEBUG > 0) {
                                console.log(JSON.stringify({
                                    err_msg: err_msg_txt,
                                    data: data,
                                    request: request,
                                }));
                            }
                            send_error(ws, err_msg_txt, kind, id);
                            throw err_msg_txt;
                        }

                        let message = JSON.parse(data);
                        let user_activity = has_user_activity(message);
                        if (user_activity) {
                            request.session.touch();
                        }
                        if (DEBUG > 0 && message.type != 'ping') {
                            console.log('received: ', data);
                        }
                        message.viewers = server.receivers[kind][id].size;
                        let id_key = `${kind}_id`;
                        let timeout_ms_remaining = request.session.cookie.maxAge;
                        if (message[id_key] == id) {
                            let patient_id = id;
                            handle_patient_message(ws, doctor_id, patient_id,
                                kind, message, timeout_ms_remaining);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                });
                if (kind == 'patient') {
                    await init_patient_data(ws, kind, id);
                }
                hello_all(kind, id);
            });

    });

    server.listen(port, () => {
        console.log(`server is listening on ${port}`);
    });

    server.on('close', function() {
        adfice.shutdown();
        console.log(`closing server running on ${port}`);
    });

    return server;
}

module.exports = {
    create_webserver: create_webserver,
}
