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

// TODO: make launching of the adfice-webserver the job of the test
// TODO: have each test launch a different adfice instance on a different port

test('Automatic selection of free text checkbox when text entered', async t => {
    let mrn = 'DummyMRN-000000024';
    let fhir = 'DummyFHIR-000000024';
    let participant = 10024;
    let window1 = await load(t, mrn, fhir, participant);
    let patient_id = "00000000-0000-4000-8000-100000000024";
    let url = `${BASE_URL}/prep?id=${patient_id}`;
    await t.navigateTo(url);
    let ta_checkbox = Selector('#cb_N05AX08_16_2');
    let ta = Selector('#ft_N05AX08_16_2_1');
    let ta_checkbox_state1 = await ta_checkbox.checked;
    await t.click(ta);
    await t.pressKey('f');
    let ta_checkbox_state2 = await ta_checkbox.checked;
    await t.pressKey('o');
    let ta_checkbox_state3 = await ta_checkbox.checked;
    await t.pressKey('backspace');
    await t.pressKey('backspace');
    let ta_checkbox_state4 = await ta_checkbox.checked;
    await t.click(ta_checkbox);

    await t.expect(ta_checkbox_state1).notOk();
    await t.expect(ta_checkbox_state2).ok();
    await t.expect(ta_checkbox_state3).ok();
    await t.expect(ta_checkbox_state4).ok();

});

test('Test selecting views', async t => {
    let mrn = 'DummyMRN-000000085';
    let fhir = 'DummyFHIR-000000085';
    let participant = 10085;
    let window1 = await load(t, mrn, fhir, participant);
    let patient_id = "00000000-0000-4000-8000-100000000085";
    let url = `${BASE_URL}/prep?id=${patient_id}`;
    await t.navigateTo(url);
    await change_flex_style_to_inline(t);

    let button_start_view = Selector('button#button-start-view');
    let button_prep_view = Selector('button#button-prep-view');
    let button_consult_view = Selector('button#button-consult-view');
    let button_advise_view = Selector('button#button-advise-view');
    let button_finalize_view = Selector('button#button-finalize-view');

    let div_ehr_box = Selector('div#div_ehr_box');

    let div_advice_M01AB05 = Selector('div#advice_M01AB05');
    let checkbox0 = Selector('#cb_M01AB05_80b_2');
    let checkbox1_tr = Selector('#tr_M01AB05_78_3');
    let checkbox1 = Selector('#cb_M01AB05_78_3');
    let checkboxOther = Selector('#cb_OTHER_other_1');

    let row0 = Selector('#tr_M01AB05_80b_2');
    let row1 = Selector('#tr_M01AB05_78_3');
    let rowOther = Selector('#tr_OTHER_other_1');

    let ehr0 = Selector('#et_M01AB05_80b_2');
    let ehr1 = Selector('#et_M01AB05_78_3');
    let ehrOther = Selector('#et_OTHER_other_1');

    let patient0 = Selector('#pt_M01AB05_80b_2');
    let patient1 = Selector('#pt_M01AB05_78_3');
    let patientOther = Selector('#pt_OTHER_other_1');

    await t.expect(checkbox0.exists).ok();
    await t.expect(checkbox1.exists).ok();
    await t.expect(checkboxOther.exists).ok();

    // set checkbox0 to unchecked, checkbox1 to checked
    {
        if (await checkbox0.checked) {
            await t.click(checkbox0);
        }
        await t.expect(checkbox0.checked).notOk();

        await t.expect(checkbox1_tr.exists).ok();
        await t.expect(checkbox1_tr.visible).ok();
        await t.expect(checkbox1.visible).ok();
        if (!(await checkbox1.checked)) {
            await t.expect(checkbox1.visible).ok();
            await t.click(checkbox1);
        }
        await t.expect(checkbox1.checked).ok();

        if (await checkboxOther.checked) {
            await t.click(checkboxOther);
        }
        await t.expect(checkboxOther.checked).notOk();

    }

    // the buttons should exist
    await t.expect(button_start_view.exists).ok();
    await t.expect(button_prep_view.exists).ok();
    await t.expect(button_consult_view.exists).ok();
    await t.expect(button_advise_view.exists).ok();
    await t.expect(button_finalize_view.exists).ok();

    // the buttons should have the right text
    await t.expect(button_start_view.innerText).eql('Start');
    await t.expect(button_prep_view.innerText).eql('Voorbereiding');
    await t.expect(button_consult_view.innerText).eql('Consult');
    await t.expect(button_advise_view.innerText).eql('Advies');
    await t.expect(button_finalize_view.innerText).eql('Afronden');

    let page_select_buttons = [
        button_start_view,
        button_prep_view,
        button_consult_view,
        button_advise_view,
        button_finalize_view,
    ];

    // initial view should be prep view
    await t.expect(div_advice_M01AB05.visible).ok();
    await t.expect(div_ehr_box.visible).notOk();
    await t.expect(row0.visible).ok();
    await t.expect(row1.visible).ok();
    await t.expect(rowOther.visible).ok();

    // try switching to the advise view
    await change_view(t, button_advise_view,
        `${BASE_URL}/advise?id=${patient_id}`);
    await t.expect(div_advice_M01AB05.visible).notOk();
    await t.expect(div_ehr_box.visible).notOk();
    // the patient texts are only visible if checked in prep view
    await t.expect(patient0.visible).notOk();
    await t.expect(patient1.visible).ok();
    await t.expect(patientOther.visible).notOk();

    // try switching to the consult view
    await change_view(t, button_consult_view,
        `${BASE_URL}/consult?id=${patient_id}`);
    await t.expect(div_advice_M01AB05.visible).notOk();
    await t.expect(div_ehr_box.visible).notOk();
    await t.expect(row0.visible).notOk();
    await t.expect(row1.visible).ok();

    // try switching back to the prep view
    await change_view(t, button_prep_view,
        `${BASE_URL}/prep?id=${patient_id}`);
    await t.expect(div_advice_M01AB05.visible).ok();
    await t.expect(div_ehr_box.visible).notOk();
    await t.expect(row0.visible).ok();
    await t.expect(row1.visible).ok();
    await t.expect(rowOther.visible).ok();

    await change_view(t, button_finalize_view,
        `${BASE_URL}/finalize?id=${patient_id}`);
    // the ehr texts are only ever visible if checked
    await t.expect(div_ehr_box.visible).ok();
    await t.expect(ehr0.visible).notOk();
    await t.expect(ehr1.visible).ok();
    await t.expect(ehrOther.visible).notOk();
});

test('Test free text fields', async t => {
    let mrn = 'DummyMRN-000000023';
    let fhir = 'DummyFHIR-000000023';
    let participant = 10023;
    let window1 = await load(t, mrn, fhir, participant);
    let patient_id = "00000000-0000-4000-8000-100000000023";
    let url = `${BASE_URL}/prep?id=${patient_id}`;
    await t.navigateTo(url);

    let id = 'N05AD01_16_2';
    check_checkbox_and_freetext(t, mrn, fhir, participant, id);
});

test('Test non-med free text fields', async t => {
    let mrn = 'DummyMRN-000000010';
    let fhir = 'DummyFHIR-000000010';
    let participant = 10010;
    let window1 = await load(t, mrn, fhir, participant);
    let patient_id = "00000000-0000-4000-8000-100000000010";
    let url = `${BASE_URL}/prep?id=${patient_id}`;
    await t.navigateTo(url);

    let id = 'NONMED_D_1';
    check_checkbox_and_freetext(t, mrn, fhir, participant, id);
});

test('Test med lists', async t => {
    let mrn = 'DummyMRN-000000009';
    let fhir = 'DummyFHIR-000000009';
    let participant = 10009;
    let window1 = await load(t, mrn, fhir, participant);
    let patient_id = "00000000-0000-4000-8000-100000000009";
    let url = `${BASE_URL}/prep?id=${patient_id}`;
    await t.navigateTo(url);

    // ensure our cb is selected
    let meds_with_rules = Selector("#meds_with_rules");
    await t.expect(meds_with_rules.withText("Zolpidem").exists).ok();
    await t.expect(meds_with_rules.withText("Ketoconazol").exists).notOk();

    let meds_without_rules = Selector("#meds_without_rules");
    await t.expect(meds_without_rules.withText("Zolpidem").exists).notOk();
    await t.expect(meds_without_rules.withText("Ketoconazol").exists).ok();
});

test('Checkbox preselected', async t => {
    let mrn = 'DummyMRN-000000051';
    let fhir = 'DummyFHIR-000000051';
    let participant = 10051;
    let window1 = await load(t, mrn, fhir, participant);
    let patient_id = "00000000-0000-4000-8000-100000000051";
    let url = `${BASE_URL}/prep?id=${patient_id}`;
    await t.navigateTo(url);

    let unchecked_id = "cb_C02AA02_46_5";
    let unchecked_checkbox = Selector(`input#${unchecked_id}`, {
        timeout: 1000,
        visibilityCheck: true
    });
    await t.expect(unchecked_checkbox.checked).notOk();

    let checked_id = "cb_C02AA02_46_1";
    let checked_checkbox = Selector(`input#${checked_id}`, {
        timeout: 1000,
        visibilityCheck: true
    });
    await t.expect(checked_checkbox.checked).ok();
});

test('Test finalize (with renew to reset the patient)', async t => {
    let mrn = 'DummyMRN-000000167';
    let fhir = 'DummyFHIR-000000167';
    let participant = 10167;
    let window0 = await load(t, mrn, fhir, participant);
    let patient_id = "00000000-0000-4000-8000-100000000167";
    let url = `${BASE_URL}/prep?id=${patient_id}`;
    await t.navigateTo(url);

    let checkbox_id = "cb_NONMED_V_1";
    let checkbox_css_selector = `input#${checkbox_id}`;
    let cb_selector = Selector(checkbox_css_selector);
    await t.expect(cb_selector.hasAttribute('disabled')).notOk();

    // navigate to finalize
    let button_finalize_view = Selector('button#button-finalize-view');
    await t.click(button_finalize_view);

    let button_definitive = Selector('button#definitive');
    await t.expect(button_definitive.exists).ok();
    await t.click(button_definitive);

    let button_prep_view = Selector('button#button-prep-view');
    await t.click(button_prep_view);

    await t.expect(cb_selector.hasAttribute('disabled')).ok();

    // console.log('typically, renew would _not_ be called after a finalize,');
    // console.log('however, this is a handy way to reset the test case.');
    let button_start_view = Selector('button#button-start-view');
    await t.click(button_start_view);

    let button_renew = Selector('button#patient_renew');
    await t.expect(button_renew.exists).ok();
    await t.click(button_renew);

    // go back to the prep page
    await t.click(button_prep_view);
    await t.expect(cb_selector.hasAttribute('disabled')).notOk();
});

test('Check "Geen advies"', async t => {
    let mrn = 'DummyMRN-000000162';
    let fhir = 'DummyFHIR-000000162';
    let participant = 10162;
    let window1 = await load(t, mrn, fhir, participant);
    let patient_id = "00000000-0000-4000-8000-100000000162";
    let url = `${BASE_URL}/prep?id=${patient_id}`;
    await t.navigateTo(url);
    await change_flex_style_to_inline(t);

    // levodopa has no advice pre-checked
    const checkbox_selector = Selector('#cb_N04BA01_27_2');
    if (await checkbox_selector.checked) {
        await t.click(checkbox_selector);
    }
    await t.expect(checkbox_selector.checked).notOk();

    // switch to the advies view
    let button_advise_view = Selector('button#button-advise-view');
    await t.click(button_advise_view);
    await change_flex_style_to_inline(t);

    // locate the "Geen advies" text
    let ga_selector = Selector("div#geen_advies_N04BA01");
    await t.expect(ga_selector.visible).ok();

    // go to doctor view
    let button_prep_view = Selector('button#button-prep-view');
    await t.click(button_prep_view);
    await change_flex_style_to_inline(t);

    // check some advice
    await t.click(checkbox_selector);
    await t.expect(checkbox_selector.checked).ok();

    // go to patient view
    await t.click(button_advise_view);
    await change_flex_style_to_inline(t);
    await t.expect(ga_selector.visible).notOk();

    // reset the test
    await t.click(button_prep_view);
    await change_flex_style_to_inline(t);
    await t.click(checkbox_selector);
    await t.expect(checkbox_selector.checked).notOk();
});

test('Test problem list', async t => {
    let mrn = 'DummyMRN-000000005';
    let fhir = 'DummyFHIR-000000005';
    let participant = 10005;
    let window0 = await load(t, mrn, fhir, participant);
    let patient_id = "00000000-0000-4000-8000-100000000005";
    let url = `${BASE_URL}/start?id=${patient_id}`;
    await t.navigateTo(url);

    let problem_table = Selector("#problem_table");
    await t.expect(problem_table.withText("Angststoornis").exists).ok();
    await t.expect(problem_table.withText("Angststoornis	Ja").exists).ok();
    await t.expect(problem_table.withText("Schizoaffectieve aandoening	Nee").exists).ok();
});

test('Test lab list', async t => {
    let mrn = 'DummyMRN-000000027';
    let fhir = 'DummyFHIR-000000027';
    let participant = 10027;
    let window1 = await load(t, mrn, fhir, participant);
    let patient_id = "00000000-0000-4000-8000-100000000027";
    let url = `${BASE_URL}/start?id=${patient_id}`;
    await t.navigateTo(url);

    let lab_table = Selector("#lab_table");
    await t.expect(lab_table.withText("natrium").exists).ok();
    await t.expect(lab_table.withText("140").exists).ok();
});

test('Test prediction values missing', async t => {
    let mrn = 'DummyMRN-000000027';
    let fhir = 'DummyFHIR-000000027';
    let participant = 10027;
    let window1 = await load(t, mrn, fhir, participant);
    let patient_id = "00000000-0000-4000-8000-100000000027";
    let url = `${BASE_URL}/start?id=${patient_id}`;
    await t.navigateTo(url);

    let missing_table = Selector("#prediction_missing_container");
    await t.expect(missing_table.withText("grijpkracht").exists).ok();
    await t.expect(missing_table.withText("anti-epileptica").exists).notOk();
});

test('Test prediction values present', async t => {
    let mrn = 'DummyMRN-000000002';
    let fhir = 'DummyFHIR-000000002';
    let participant = 10002;
    let window1 = await load(t, mrn, fhir, participant);
    let patient_id = "00000000-0000-4000-8000-100000000002";
    let url = `${BASE_URL}/start?id=${patient_id}`;
    await t.navigateTo(url);

    let prediction_table = Selector("#prediction_data_container");
    await t.expect(prediction_table.withText("21.5").exists).ok();
    await t.expect(prediction_table.withText("anti-epileptica").exists).ok();
});

test('Test prediction values present when user-entered', async t => {
    let mrn = 'DummyMRN-000000170';
    let fhir = 'DummyFHIR-000000170';
    let participant = 10170;
    let window1 = await load(t, mrn, fhir, participant);
    let patient_id = "00000000-0000-4000-8000-100000000170";
    let url = `${BASE_URL}/start?id=${patient_id}`;
    await t.navigateTo(url);

    let prediction_table = Selector("#prediction_data_container");
    await t.expect(prediction_table.withText("16.6").exists).ok();
    await t.expect(prediction_table.withText("anti-epileptica").exists).ok();

    let missing_table = Selector("#prediction_missing_container");
    await t.expect(missing_table.withText("roker").exists).ok();
});

/*
The important tests in the following two tests are commented out, because they fail.
Emperically, the code works as expected. The first 
missing_table3.withText("1").exists).notOk();
passes, so it is probably not an issue with the wrong selector.
I've tried adding
await t.wait(5000);
and
await t.navigateTo(url);
and breaking the test up into 3 separate tests, but none of this helps.
*/
test('Test user entering values', async t => {
    let mrn = 'DummyMRN-000000173';
    let fhir = 'DummyFHIR-000000173';
    let participant = 10173;
    let window1 = await load(t, mrn, fhir, participant);
    let patient_id = "00000000-0000-4000-8000-100000000173";
    let url = `${BASE_URL}/start?id=${patient_id}`;
    await t.navigateTo(url);
    await change_flex_style_to_inline(t);

    // Selectors that are used to check state should be awaited
    let missing_table = await Selector("#prediction_missing_container");
    let prediction = await Selector("#patient_info", {
        timeout: 1000
    });
    await t.expect(prediction.withText("onbekend").exists).ok();
    await t.expect(missing_table.withText("roker").exists).ok();
    await t.expect(missing_table.visible).ok();

    let smoking_dropdown = Selector("#user_smoking");
    await t.expect(smoking_dropdown.visible).ok();
    await t.click(smoking_dropdown);
    await t.click(Selector("#user_smoking_1", {
            text: 'Ja'
        }));
    let submit_button = Selector('#button_submit_missings');
    await t.click(submit_button);

    let prediction2 = await Selector("#patient_info", {
        timeout: 1000
    });
    await t.expect(prediction2.withText("73").exists).ok();
    let user_smoking_mis1 = await Selector("#user_smoking_mis", {
        timeout: 1000
    });
    await t.expect(user_smoking_mis1.withText("1").exists, { timeout: 1000 }).ok();

    let smoking_delete = await Selector("#del_smoking");
    await t.click(smoking_delete);
	
	await t.wait(1000);
    let user_smoking_mis2 = await Selector("#user_smoking_mis", {
        timeout: 1000
    });
    await t.expect(user_smoking_mis2.withText("1").exists).notOk();
    let prediction3 = await Selector("#patient_info", {
        timeout: 1000
    });
    await t.expect(prediction3.withText("onbekend").exists).ok();

});

test('Test user entering incomplete values', async t => {
    let mrn = 'DummyMRN-000000176';
    let fhir = 'DummyFHIR-000000176';
    let participant = 10176;
    let window1 = await load(t, mrn, fhir, participant);
    let patient_id = "00000000-0000-4000-8000-100000000176";
    let url = `${BASE_URL}/start?id=${patient_id}`;
    await t.navigateTo(url);
    await change_flex_style_to_inline(t);

    let missing_table = await Selector("#prediction_missing_container", {
        timeout: 1000
    });
    await t.expect(missing_table.withText("GDS").exists).ok();
    await t.expect(missing_table.visible).ok();

    let GDS_dropdown = Selector("#user_GDS_score");
    await t.expect(GDS_dropdown.visible).ok();
    await t.click(GDS_dropdown)
    await t.click(Selector('#GDS_dropdown_1', {
            text: '1'
        }));

    let submit_button = Selector('#button_submit_missings');
    await t.click(submit_button);

    let user_GDS_score_mis1 = await Selector("#user_GDS_score_mis");
    await t.expect(user_GDS_score_mis1.withText("1").exists).ok();

    let GDS_delete = Selector("#del_GDS_score");
    await t.click(GDS_delete);

    let user_GDS_score_mis2 = await Selector("#user_GDS_score_mis");
    await t.expect(user_GDS_score_mis2.withText("1").exists).notOk();

});

test('Test load new patient data', async t => {
	// http://127.0.0.1:8080/load?mrn=DummyMRN-000000175&fhir=DummyFHIR-000000175&user=dr_bob&study=AMC2021_061&participant=10175
    let mrn = 'DummyMRN-000000175';
    let fhir = 'DummyFHIR-000000175';
    let participant = 10175;
    let window0 = await load(t, mrn, fhir, participant);
    //this test assumes we are using the stub_etl

    let lab_table = Selector("#lab_table", {
        timeout: 1000
    });
    await t.expect(lab_table.withText("natrium").exists).ok();
    await t.expect(lab_table.withText("135").exists).ok();
	
	let pred_table = Selector("#prediction_data_table", {
        timeout: 1000
    });
	await t.expect(pred_table.withText("0.6").exists).ok();

});

test('Test load new patient data with duplicated participant number', async t => {
    let mrn = 'DummyMRN-000000177';
    let fhir = 'DummyFHIR-000000177';
    let participant = 10175;
    let window0 = await load(t, mrn, fhir, participant);
    //this test assumes we are using the stub_etl

    let lab_table = Selector("#lab_table", {
        timeout: 1000
    });
    await t.expect(lab_table.withText("natrium").exists).ok();
    await t.expect(lab_table.withText("135").exists).ok();

});

test('Test load new patient data with null participant number', async t => {
    let mrn = 'DummyMRN-000000178';
    let fhir = 'DummyFHIR-000000178';
    let user = 'dr_bob';
    let study = '';
    let participant = '';
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
    let window0 = await t.openWindow(url);
    //this test assumes we are using the stub_etl

    let lab_table = Selector("#lab_table", {
        timeout: 1000
    });
    await t.expect(lab_table.withText("natrium").exists).ok();
    await t.expect(lab_table.withText("135").exists).ok();

});

test('Nonmed headers display correctly', async t => {
    let mrn = 'DummyMRN-000000160';
    let fhir = 'DummyFHIR-000000160';
    let participant = 10160;
    let window1 = await load(t, mrn, fhir, participant);
    // check some nonmed advice
    let patient_id = "00000000-0000-4000-8000-100000000160";
    let url = `${BASE_URL}/prep?id=${patient_id}`;
    await t.navigateTo(url);
    await change_flex_style_to_inline(t);
    let cb_selector = Selector('#cb_NONMED_B_2');
    await t.expect(cb_selector.visible).ok();
    let b2_is_checked = await cb_selector.checked;
    if (!b2_is_checked) {
        await t.click(cb_selector);
    }
    let cb_selector2 = Selector('#cb_NONMED_G_1');
    await t.expect(cb_selector2.visible).ok();
    let g_is_checked = await cb_selector2.checked;
    if (!g_is_checked) {
        await t.click(cb_selector2);
    }
    // check that correct headers appear
    let beweg1 = Selector('#td_nm_category_name_B_1');
    let beweg2 = Selector('#td_nm_category_name_B_2');
    let fysio = Selector('#td_nm_category_name_C_1');
    let shoe = Selector('#td_nm_category_name_G_1');
    await t.expect(beweg1.visible).ok();
    await t.expect(beweg2.visible).notOk();
    await t.expect(fysio.visible).ok();
    await t.expect(shoe.visible).ok();

    // switch to consult view
    let button_consult_view = Selector('button#button-consult-view');
    await t.click(button_consult_view);
    await change_flex_style_to_inline(t);
    // check that correct headers appear
    beweg1 = Selector('#td_nm_category_name_B_1');
    beweg2 = Selector('#td_nm_category_name_B_2');
    fysio = Selector('#td_nm_category_name_C_1');
    shoe = Selector('#td_nm_category_name_G_1');
    await t.expect(beweg1.visible).ok();
    await t.expect(beweg2.visible).notOk();
    await t.expect(fysio.visible).notOk();
    await t.expect(shoe.visible).ok();

    // switch to advies view
    let button_advise_view = Selector('button#button-advise-view');
    await t.click(button_advise_view);
    await change_flex_style_to_inline(t);
    // check that correct headers appear
    beweg1 = Selector('#patient_nm_cat_B_1');
    beweg2 = Selector('#patient_nm_cat_B_2');
    fysio = Selector('#patient_nm_cat_C_1');
    shoe = Selector('#patient_nm_cat_G_1');
    await t.expect(beweg1.visible).ok();
    await t.expect(beweg2.visible).notOk();
    await t.expect(fysio.visible).notOk();
    await t.expect(shoe.visible).ok();

});

test('Other med advice box', async t => {
    let mrn = 'DummyMRN-000000160';
    let fhir = 'DummyFHIR-000000160';
    let participant = 10160;
    let window1 = await load(t, mrn, fhir, participant);

    //check that Other-other box is not visible to start
    let button_consult_view = Selector('button#button-consult-view');
    await t.click(button_consult_view);
    await change_flex_style_to_inline(t);
    let other_text_box = Selector('#ft_OTHER_other_1_1');
    await t.expect(other_text_box.withText('This is a test').exists).notOk();

    let button_advise_view = Selector('button#button-advise-view');
    await t.click(button_advise_view);
    await change_flex_style_to_inline(t);
    let other_advice_row = Selector('#pt_OTHER_other_1');
    let other_advice_header = Selector('#pft_OTHER_other_1_0');
    let other_advice_box = Selector('#pft_OTHER_other_1_1');
    await t.expect(other_advice_row.visible).notOk();
    await t.expect(other_advice_header.visible).notOk();
    await t.expect(other_advice_box.visible).notOk();

    //back to prep view, enter some text
    let button_prep_view = Selector('button#button-prep-view');
    await t.click(button_prep_view);
    await change_flex_style_to_inline(t);
    let cb_selector = Selector('#cb_OTHER_other_1');
    await t.expect(cb_selector.visible).ok();
    let other_is_checked = await cb_selector.checked;
    if (!other_is_checked) {
        await t.click(cb_selector);
    }
    other_text_box = Selector('#ft_OTHER_other_1_1');
    await t.click(other_text_box);
    await t.typeText(other_text_box, 'This is a test', {
        speed: 0.1,
        replace: true
    });
    // switch to consult view
    await t.click(button_consult_view);
    await change_flex_style_to_inline(t);
    other_text_box = Selector('#ft_OTHER_other_1_1');
    await t.expect(other_text_box.value).eql('This is a test');

    // switch to advies view
    await t.click(button_advise_view);
    await change_flex_style_to_inline(t);
    other_advice_row = Selector('#pt_OTHER_other_1');
    other_advice_header = Selector('#pft_OTHER_other_1_0');
    other_advice_box = Selector('#pft_OTHER_other_1_1');
    await t.expect(other_advice_row.visible).ok();
    await t.expect(other_advice_header.withText('Uw arts').exists).ok();
    await t.expect(other_advice_box.withText('This is a test').exists).ok();

    //clean up
    await t.click(button_prep_view);
    await change_flex_style_to_inline(t);
    await t.click(other_text_box);
    // apparently this is what you have to do to clear the text box:
    await t.pressKey('ctrl+a delete');
    await t.expect(cb_selector.visible).ok();
    other_is_checked = await cb_selector.checked;
    if (other_is_checked) {
        await t.click(cb_selector);
    }
});

test('Show session timeout warning 2m before session timeout; session reset if button is clicked', async t => {
    let mrn = 'DummyMRN-000000160';
    let fhir = 'DummyFHIR-000000160';
    let participant = 10160;
    let window1 = await load(t, mrn, fhir, participant);
    let expiration = Selector('#expiration');
    await t.expect(expiration.visible).notOk();

    let url_short =
        `${BASE_URL}/load` +
        `?mrn=DummyMRN-000000160&user=dr_bob&participant=10160` +
        `&tsec=121`;
    window1 = await t.navigateTo(url_short);
    await t.wait(1100); //wait a bit more than 1 sec
    expiration = Selector('#expiration');
    await t.expect(expiration.visible).ok();

    let tbutton = Selector('#button-reset-timeout');
    await t.click(tbutton);
    expiration = Selector('#expiration');
    await t.expect(expiration.visible).notOk();

    // TODO is there a way to check that the timeout has been correctly reset?
    // fixture `[API] Get Cookies`;
    // should have a method getCookies() that allows us to inspect cookies, but this does not seem to work.
});

test('Session expires if time <10s', async t => {
    let mrn = 'DummyMRN-000000160';
    let fhir = 'DummyFHIR-000000160';
    let participant = 10160;
    let window1 = await load(t, mrn, fhir, participant);
    let expiration = Selector('#expiration');
    await t.expect(expiration.visible).notOk();

    let url_short =
        `${BASE_URL}/load` +
        `?mrn=DummyMRN-000000160&user=dr_bob&participant=10160` +
        `&tsec=11`;
    window1 = await t.navigateTo(url_short);
    await t.wait(4000); //wait 4 sec for next ping
    let getLocation = ClientFunction(() => document.location.href);
    await t.expect(getLocation()).contains('load-error');
    let body = Selector('body');
    await t.expect(body.withText('Error').exists).ok();

});

// slow tests run last
test('Check multiple viewers making changes', async t => {
    let mrn = 'DummyMRN-000000068';
    let fhir = 'DummyFHIR-000000068';
    let participant = 10068;
    let window1 = await load(t, mrn, fhir, participant);
    let patient_id = "00000000-0000-4000-8000-100000000068";
    let url = `${BASE_URL}/prep?id=${patient_id}`;
    await t.navigateTo(url);

    let selector = Selector('body');
    await t.expect(selector.exists).ok();
    await change_flex_style_to_inline(t);

    // initial check that patient data is rendered
    await t.expect(selector.withText('Indicatie hypertensie').exists).ok();
    await t.expect(selector.withText('Enalapril').exists).ok();
    await t.expect(selector.withText('Hydrochlorothiazide').exists).ok();
    await t.expect(selector.withText('ACE-remmers').exists).ok();

    let atc = "C03AA03"; // hydrochlorothiazide
    let rule = "42";
    let cbn = "6";
    let checkbox_id = `cb_${atc}_${rule}_${cbn}`;
    let checkbox_css_selector = `input#${checkbox_id}`;
    let freetext_id = `ft_${atc}_${rule}_${cbn}_1`;
    let freetext_css_selector = `textarea#${freetext_id}`;

    let ref_page_num = 14;
    let ref_C03AA03 = Selector(`#atc_ref_page_${atc}_${ref_page_num}`);
    await t.expect(ref_C03AA03.exists).ok();

    const oldFreetext = "old";
    const newFreetext = "foo";

    let cb_selector = Selector('#cb_C03AA03_42_6');
    await t.expect(cb_selector.visible).ok();
    if (await cb_selector.checked) {
        await t.click(cb_selector);
    }
    await t.expect(cb_selector.checked).notOk();

    // console.log('type some text into the freetext field for this row.');
    let freetext_selector_1 = Selector(freetext_css_selector);
    await t.selectText(freetext_selector_1);
    await t.typeText(freetext_selector_1, oldFreetext);
    await t.expect(freetext_selector_1.value).eql(oldFreetext);

    let view_cnt_css_sel = "span#viewer-count";
    await t.expect(Selector(view_cnt_css_sel).withText("1").exists).ok();
    await t.expect(Selector(view_cnt_css_sel).withText("1").visible).notOk();

    // open a second window and check a box
    let window2 = await t.openWindow(`${BASE_URL}/prep?id=${patient_id}`);
    await change_flex_style_to_inline(t);

    // verify that we show 2 visitors
    let cb_selector2 = Selector('#cb_C03AA03_42_6');
    await t.expect(Selector(view_cnt_css_sel).withText("2").exists).ok();
    await t.expect(Selector(view_cnt_css_sel).withText("2").visible).ok();
    await t.switchToWindow(window1);
    await t.expect(Selector(view_cnt_css_sel).withText("2").exists).ok();
    await t.expect(Selector(view_cnt_css_sel).withText("2").visible).ok();
    await t.switchToWindow(window2);

    // click on the checkbox
    await t.expect(cb_selector2.checked).notOk();
    await t.click(cb_selector2);
    await t.expect(cb_selector2.checked).ok();

    // type some text into the freetext field for this row.
    let freetext_selector_2 = Selector(freetext_css_selector);
    await t.selectText(freetext_selector_2);
    await t.typeText(freetext_selector_2, newFreetext);
    await t.expect(freetext_selector_2.value).eql(newFreetext);

    await t.switchToWindow(window1);

    // ensure that we see the box checked in the initial window.
    await t.expect(cb_selector.checked).ok();

    // ensure the text is updated in the initial window
    await t.expect(freetext_selector_1.value).eql(newFreetext, {
        timeout: 10000
    });

    // close the second window
    await t.switchToWindow(window2);
    await t.closeWindow(window2);
    await t.switchToWindow(window1);

    // ensure that we have one viewer after close
    await t.expect(Selector(view_cnt_css_sel).withText("1").exists).ok();
    await t.expect(Selector(view_cnt_css_sel).withText("1").visible).notOk();
});

test('Checkbox persistence', async t => {
    let mrn = 'DummyMRN-000000078';
    let fhir = 'DummyFHIR-000000078';
    let participant = 10078;
    let window1 = await load(t, mrn, fhir, participant);
    let checkbox_id = "cb_N02AA01_76_1";
    let checkbox_css_selector = `input#${checkbox_id}`;
    let patient_id = "00000000-0000-4000-8000-100000000078";
    let url = `${BASE_URL}/prep?id=${patient_id}`;

    // Open the patient window, uncheck the box if needed
    await t.navigateTo(url);
    await change_flex_style_to_inline(t);
    let checkbox1 = Selector('#cb_N02AA01_76_1');
    if (await checkbox1.checked) {
        await t.click(checkbox_css_selector);
    }
    await t.expect(checkbox1.checked).notOk();
    await t.closeWindow(window1);

    // Open the patient window, verify still unchecked, then check
    let window2 = await t.openWindow(url);
    await change_flex_style_to_inline(t);
    let checkbox2 = Selector('#cb_N02AA01_76_1');
    await t.expect(checkbox2.checked).notOk();
    await t.click(checkbox_css_selector);
    await t.expect(checkbox2.checked).ok();
    await t.closeWindow(window2);

    // Open the patient window, verify checked
    let window3 = await t.openWindow(url);
    await change_flex_style_to_inline(t);
    let checkbox3 = Selector('#cb_N02AA01_76_1');
    await t.expect(checkbox3.checked).ok();
});



test('Test that contact phone displays', async t => {
    let mrn = 'DummyMRN-000000085';
    let fhir = 'DummyFHIR-000000085';
    let participant = 10085;
    let window1 = await load(t, mrn, fhir, participant);
    let patient_id = "00000000-0000-4000-8000-100000000085";
    let url = `${BASE_URL}/start?id=${patient_id}`;
    await t.navigateTo(url);

    let button_prep_view = Selector('button#button-prep-view');
    let button_advise_view = Selector('button#button-advise-view');

    await change_flex_style_to_inline(t);
	let div_help_box = Selector('div#help_container');
    await t.expect(div_help_box.withText('06').exists).ok();

//	await change_view(t, button_prep_view,        `${BASE_URL}/prep?id=${patient_id}`);
	await t.click(button_prep_view);
	await change_flex_style_to_inline(t);
	div_help_box = Selector('div#help_container');
    await t.expect(div_help_box.withText('06').exists).ok();

//    await change_view(t, button_advise_view,         `${BASE_URL}/advise?id=${patient_id}`);
	await t.click(button_advise_view);
    await change_flex_style_to_inline(t);
	div_help_box = Selector('div#help_container');
    await t.expect(div_help_box.exists).notOk();


});
//TODO check what etl returns when some meas are missing, and make sure adfice handles this correctly.
//JSON tends to just delete null values; make sure this doesn't cause problems.
