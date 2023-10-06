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

// set a new random participant number every time the test runs
let this_test_part = 'P' + (Math.floor(Math.random() * 10000) + 200);

// TODO: make launching of the adfice-webserver the job of the test
// TODO: have each test launch a different adfice instance on a different port

test('test if we are in standalone mode', async t => {
    let url = `${BASE_URL}/dataentry`;
    let window1 = await t.openWindow(url);
    
    let datadiv = Selector('div#dataentry1');

    await t.expect(getLocation()).contains('/dataentry');
    await t.expect(datadiv.withText("gegevens").exists).ok();
});

test('enter a new patient', async t => {
    let url = `${BASE_URL}/dataentry`;
    let window1 = await t.openWindow(url);
    
    let doctor_field = Selector('#doctor_field');
	let participant_field = Selector('#participant');
	let birthdate_field = Selector('#birthdate');
	let send = Selector('#button_submit_patient');
	
	await t.selectText(doctor_field);
    await t.typeText(doctor_field, 'arts');
	
	await t.selectText(participant_field);
    await t.typeText(participant_field, this_test_part);
	
	await t.typeText(birthdate_field, '1940-01-01');
	
	await t.click(send);
	
    await t.expect(getLocation()).contains('/dataentry2');

});