// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021-2024 Stichting Open Electronics Lab
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

test('Test remove a medication', async t => {
    console.log('Test remove a medication can only run correctly once.');
    let mrn = 'DummyMRN-000000160';
    let fhir = 'DummyFHIR-000000160';
    let participant = 10160;
    let window0 = await load(t, mrn, fhir, participant);
    await change_flex_style_to_inline(t);
    let meds = Selector('#meds-with-rules');
    await t.expect(meds.withText("Levodopa").exists).ok();

    let remove_levo = Selector('#remove_N04BA01');
    await t.click(remove_levo);

    let meds2 = Selector('#meds-with-rules');
    await t.expect(meds2.withText("Levodopa").exists).notOk();

    // test cannot clean up after itself. Will only run correctly the first time.
});

test('Test reload data', async t => {
    console.log('Test reload data can only run correctly once.');
    let mrn = 'DummyMRN-000000174';
    let fhir = 'DummyFHIR-000000174';
    let participant = 10174;
    let window0 = await load(t, mrn, fhir, participant);
    //this test assumes we are using the stub_etl
    let patient_id = "00000000-0000-4000-8000-100000000174";
    let url = `${BASE_URL}/prep?id=${patient_id}`;
    await t.navigateTo(url);
    await change_flex_style_to_inline(t);

    let cb_levo_stop = Selector('#cb_N04BA01_27_2');
    await t.click(cb_levo_stop);
    await t.expect(cb_levo_stop.checked).ok();
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
    await t.expect(cb_levo_stop.checked).notOk();
    await t.expect(cb_diaz_stop.exists).ok();


    // test cannot clean up after itself; will only run correctly 1x

});
