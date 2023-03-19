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

// TODO: make launching of the adfice-webserver the job of the test
// TODO: have each test launch a different adfice instance on a different port

test('test incoming link from EHR', async t => {
    let mrn = 'DummyMRN-000000163';
    let fhir = 'DummyFHIR-000000163';
    let participant = 100163;
    let window1 = await load(t, mrn, fhir, participant);
    const getLocation = ClientFunction(() => document.location.href);
    let patient_id_span = Selector('span#patient-info-id');

    await t.expect(getLocation()).contains('/start?');
    await t.expect(patient_id_span.withText("DummyMRN-000000163").exists).ok();

});
