// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

/*
  '/usr/bin/node',
  '/home/ace/src/adfice-ace/node_modules/testcafe/lib/cli',
  'firefox:headless',
  'acceptance-test-cafe.js',
  'http://127.0.0.1:8090'
*/

/* To run tests not headless (using 55556 as an arbitrary port):
 node adfice-webserver-runner.js 55556
 ./node_modules/.bin/testcafe firefox acceptance-test-cafe.js http://127.0.0.1:55556
*/
let BASE_URL = process.argv[4];

import {
    Selector,
    ClientFunction
} from 'testcafe';

fixture `Adfice`;
fixture `TestController.setNativeDialogHandler`;



const getLocation = ClientFunction(() => document.location.href);

// for some reason, display: flex makes the checkboxes invisible to TestCafe.
// as a workaround, set display: inline for the duration of the test.
async function change_flex_style_to_inline(t) {
    let client_func = ClientFunction(function() {
        let sheets = document.styleSheets;
        for (let i = 0; i < sheets.length; ++i) {
            if (sheets[i] !== undefined) {
                let rules = sheets[i].cssRules;
                for (let j = 0; j < rules.length; ++j) {
                    let rule = rules[j];
                    let display_style = rule.style['display'];
                    if (display_style == 'flex') {
                        console.log('before', rule.style['display']);
                        rule.style['display'] = 'inline';
                        console.log('after', rule.style['display']);
                    }
                }
            }
        }
    });
    await client_func();
}

async function change_view(t, button, url_fragment) {
    await t.click(button);
    await t.expect(getLocation()).contains(url_fragment);
    await change_flex_style_to_inline(t);
}

async function load(t, mrn, fhir, participant) {
    let user = 'dr_bob';
    let study = 'studyid';
    let iss = 'https://fake.iss.example.com';
    let launch = 'BOGUSLAUNCH1';
    let url = `${BASE_URL}/load` +
        `?mrn=${mrn}` +
        `&fhir=${fhir}` +
        `&user=${user}` +
        `&study=${study}` +
        `&participant=${participant}` +
        `&iss=` + encodeURIComponent(iss) +
        `&launch=${launch}`;
    // console.log("load:", url);
    return await t.openWindow(url);
}

const getWindowLocation = ClientFunction(() => window.location);

async function check_checkbox_and_freetext(t, mrn, fhir, participant, id) {
    await load(t, mrn, fhir, participant);
    // ensure our cb is selected
    let cb_id = Selector('#cb_' + id);
    if (!(await cb_id.checked)) {
        await t.click(cb_id);
    }
    await t.expect(cb_id.checked).ok();

    let ft_id_1 = Selector('#ft_' + id + '_1');
    let eft_id_1 = Selector('#eft_' + id + '_1');
    let pft_id_1 = Selector('#pft_' + id + '_1');

    await t.selectText(ft_id_1);
    await t.typeText(ft_id_1, 'foo');
    await t.expect(ft_id_1.value).eql('foo');
    await t.expect(eft_id_1.innerText).eql('foo');
    await t.expect(pft_id_1.innerText).eql('foo');

    await t.selectText(ft_id_1);
    await t.typeText(ft_id_1, 'bar');
    await t.expect(ft_id_1.value).eql('bar');
    await t.expect(eft_id_1.innerText).eql('bar');
    await t.expect(pft_id_1.innerText).eql('bar');
}

test('Redirect to error page if invalid navigation is attempted', async t => {
    let mrn = 'DummyMRN-000000172';
    let fhir = 'DummyFHIR-000000172';
    let user = 'dr_bob';
    let participant = '10172';
    let url_no_participant =
        `${BASE_URL}/load` +
        `?mrn=${mrn}` +
        `&fhir=${fhir}` +
        `&user=${user}` +
        `&study=` +
        `&participant=` +
        `&iss=https%3A%2F%2Fbogus.example.com` +
        `&launch=BOGUSLAUNCH`;

    let window1 = await t.openWindow(url_no_participant);

    let getLocation = ClientFunction(() => document.location.href);
    // URL with null participant is (at least temporarily) accepted
    //    await t.expect(getLocation()).contains('load-error');
    let body = Selector('body');
    await t.expect(body.withText('Error').exists).notOk();
    //    await t.expect(body.withText('DummyMRN-000000172').exists).ok();
    let url_no_user =
        `${BASE_URL}/load` +
        `?mrn=${mrn}` +
        `&fhir=${fhir}` +
        `&user=` +
        `&study=studynr` +
        `&participant=${participant}` +
        `&iss=https%3A%2F%2Fbogus.example.com` +
        `&launch=BOGUSLAUNCH`;
    let window2 = await t.openWindow(url_no_user);
    await t.expect(getLocation()).contains('load-error');
    body = Selector('body');
    await t.expect(body.withText('Error').exists).ok();

    let url_no_mrn_no_fhir =
        `${BASE_URL}/load` +
        `?mrn=` +
        `&fhir=` +
        `&user=${user}` +
        `&study=studynr` +
        `&participant=${participant}` +
        `&iss=https%3A%2F%2Fbogus.example.com` +
        `&launch=BOGUSLAUNCH`;
    let window3 = await t.openWindow(url_no_mrn_no_fhir);
    await t.expect(getLocation()).contains('load-error');
    body = Selector('body');
    await t.expect(body.withText('Error').exists).ok();
    await t.expect(body.withText('DummyMRN-000000172').exists).notOk();
});

test('Redirect to error page if doctor_id is lost', async t => {
    // attempt to navigate directly to a patient page without going via the
    // "/load" page first
    let url_not_redirected =
        `${BASE_URL}/start` +
        `?id=00000000-0000-4000-8000-100000000172`;
    let window1 = await t.openWindow(url_not_redirected);
    // Redirect takes a moment. We have to wait.
    await t.wait(4000);
    let getLocation = ClientFunction(() => document.location.href);
    await t.expect(getLocation()).contains('load-error');
    let body = Selector('body');
    await t.expect(body.withText('Error').exists).ok();
    await t.expect(body.withText('verloren').exists).ok();
    await t.expect(body.withText('DummyMRN-000000172').exists).notOk();
});

test('Redirect to error page if patient_id is bad', async t => {
    let mrn = 'DummyMRN-000000160';
    let fhir = 'DummyFHIR-000000160';
    let participant = 10160;
    let window1 = await load(t, mrn, fhir, participant);
    // attempt to navigate directly to a different (invalid) patient page
    let url_bad_patient_id =
        `${BASE_URL}/start` +
        `?id=00000000-0000-4000-8000-000000000000`;
    window1 = await t.navigateTo(url_bad_patient_id);
    // Will sometimes show "session is lost" (verloren) error instead if we do
    // not wait. So we wait:
    await t.wait(3000);
    let getLocation = ClientFunction(() => document.location.href);
    await t.expect(getLocation()).contains('load-error');
    let body = Selector('body');
    await t.expect(body.withText('Error').exists).ok();
    await t.expect(body.withText('invalid').exists).ok();
    await t.expect(body.withText('verloren').exists).notOk();
    await t.expect(body.withText('DummyMRN-000000172').exists).notOk();
});

test('Redirect to error page if URL has multiple mrns or user_ids', async t => {
    let mrn = 'DummyMRN-000000160';
    let fhir = 'DummyFHIR-000000160';
    let participant = 10160;
    let window1 = await load(t, mrn, fhir, participant);
    // attempt to navigate directly to a different (invalid) patient page
    let url_duplicate =
        `${BASE_URL}/load` +
        `?mrn=DummyMRN-000000143&user=dr_bob&participant=10143` +
        `?mrn=DummyMRN-000000144&user=dr_alice&participant=10144`;
    window1 = await t.navigateTo(url_duplicate);
    // Will sometimes show "session is lost" (verloren) error instead if we do
    // not wait. So we wait.
    await t.wait(3000);
    let getLocation = ClientFunction(() => document.location.href);
    await t.expect(getLocation()).contains('load-error');
    let body = Selector('body');
    await t.expect(body.withText('Error').exists).ok();
    await t.expect(body.withText('verloren').exists).notOk();
});

test('Fail portal export if patient has no BSN', async t => {
    let mrn = 'DummyMRN-000000161';
    let fhir = 'DummyFHIR-000000161';
    let participant = 10161;
    let window1 = await load(t, mrn, fhir, participant);
    let button_finalize_view = Selector('button#button-finalize-view');
    await t.click(button_finalize_view);
    let button_definitive = Selector('button#definitive');
    await t.setNativeDialogHandler(() => true);
    // I think the dialog handler actually persists between tests.
    // Maybe better to put it as a constant for the suite?
    await t.click(button_definitive);
    let alertHistory = await t.getNativeDialogHistory();

    await t.expect(alertHistory[0].text).contains('Valportaal');
});

test('Test redirect to error page if etl failed', async t => {
    let mrn = 'sir_not_appearing';
    let fhir = 'sir_not_appearing';
    let participant = 10000;
    let window0 = await load(t, mrn, fhir, participant);
    //this test assumes we are using the stub_etl

    let getLocation = ClientFunction(() => document.location.href);
    await t.expect(getLocation()).contains('load-error');

});

test('Test patients with no meds, probs, labs, or meas', async t => {
    let mrn1 = 'sir_no_med';
    let fhir1 = 'sir_no_med';
    let participant1 = 20000;
    let window1 = await load(t, mrn1, fhir1, participant1);
    //this test assumes we are using the stub_etl

    let lab_table1 = Selector("#lab_table", {
        timeout: 1000
    });
    await t.expect(lab_table1.withText("natrium").exists).ok();
    await t.expect(lab_table1.withText("135").exists).ok();

    let mrn2 = 'sir_no_prob';
    let fhir2 = 'sir_no_prob';
    let participant2 = 20001;
    let window2 = await load(t, mrn2, fhir2, participant2);

    let lab_table2 = Selector("#lab_table", {
        timeout: 1000
    });
    await t.expect(lab_table2.withText("natrium").exists).ok();
    await t.expect(lab_table2.withText("135").exists).ok();

    let mrn3 = 'sir_no_lab';
    let fhir3 = 'sir_no_lab';
    let participant3 = 20002;
    let window3 = await load(t, mrn3, fhir3, participant3);

    let meds = Selector("#meds-with-rules", {
        timeout: 1000
    });
    await t.expect(meds.withText("LevoDOPA").exists).ok();

    let mrn4 = 'sir_no_meas';
    let fhir4 = 'sir_no_meas';
    let participant4 = 20003;
    let window4 = await load(t, mrn4, fhir4, participant4);

    let lab_table4 = Selector("#lab_table", {
        timeout: 1000
    });
    await t.expect(lab_table4.withText("natrium").exists).ok();
    await t.expect(lab_table4.withText("135").exists).ok();

});

test('Test fail to reload data', async t => {
    let mrn = 'sir_no_renew';
    let fhir = 'sir_no_renew';
    let participant = 10179;
    let window0 = await load(t, mrn, fhir, participant);
    //this test assumes we are using the stub_etl

    let patient_id = "00000000-0000-4000-8000-100000000179";
    let url = `${BASE_URL}/prep?id=${patient_id}`;
    await t.navigateTo(url);
    await change_flex_style_to_inline(t);

    let cb_levo_stop = Selector('#cb_N04BA01_27_2');
    await t.expect(cb_levo_stop.exists).ok();
    let cb_diaz_stop = Selector('#cb_N05BA01_6e_1');
    await t.expect(cb_diaz_stop.exists).notOk();
    let button_start_view = Selector('button#button-start-view');
    await t.click(button_start_view);
    await change_flex_style_to_inline(t);
    let patient_renew = Selector('#patient_renew');
    await t.click(patient_renew);
    let button_prep_view = Selector('button#button-prep-view');
    await t.click(button_prep_view);
    await change_flex_style_to_inline(t);
    await t.expect(cb_levo_stop.exists).ok();
    await t.expect(cb_diaz_stop.exists).notOk();

    //todo can we test whether a popup showed?

});

test('Test getAuth failure', async t => {
    //this test assumes we are using the stub_etl
    let user = 'dr_bob';
    let study = 'studyid';
    let iss = 'https://fake.iss.example.com';
    let launch = 'BOGUSLAUNCH1';
    let thisrnd = Math.floor(Math.random() * 1000);
    let url = `${BASE_URL}/load` +
        `?mrn=AuthFail` + thisrnd +
        `&fhir=AuthFail` + thisrnd +
        `&user=${user}` +
        `&study=${study}` +
        `&participant=1` + thisrnd +
        `&iss=` + encodeURIComponent(iss) +
        `&launch=${launch}`;
    return await t.openWindow(url);
    let getLocation = ClientFunction(() => document.location.href);
    await t.expect(getLocation()).contains('load-error');
});

test('Test getToken failure', async t => {
    //this test assumes we are using the stub_etl
    let user = 'dr_bob';
    let study = 'studyid';
    let iss = 'https://fake.iss.example.com';
    let launch = 'BOGUSLAUNCH1';
    let thisrnd = Math.floor(Math.random() * 1000);
    let url = `${BASE_URL}/load` +
        `?mrn=TokenFail` + thisrnd +
        `&fhir=TokenFail` + thisrnd +
        `&user=${user}` +
        `&study=${study}` +
        `&participant=1` + thisrnd +
        `&iss=` + encodeURIComponent(iss) +
        `&launch=${launch}`;
    return await t.openWindow(url);
    let getLocation = ClientFunction(() => document.location.href);
    await t.expect(getLocation()).contains('load-error');
});

test('Test unauthorized user', async t => {
    //this test assumes we are using the stub_etl
    let user = 'dr_bad';
    let study = 'studyid';
    let iss = 'https://fake.iss.example.com';
    let launch = 'BOGUSLAUNCH1';
    let thisrnd = Math.floor(Math.random() * 1000);
    let url = `${BASE_URL}/load` +
        `?mrn= thisrnd` +
        `&fhir= thisrnd` +
        `&user=${user}` +
        `&study=${study}` +
        `&participant=1` + thisrnd +
        `&iss=` + encodeURIComponent(iss) +
        `&launch=${launch}`;
    return await t.openWindow(url);
    let getLocation = ClientFunction(() => document.location.href);
    await t.expect(getLocation()).contains('load-error');
});
