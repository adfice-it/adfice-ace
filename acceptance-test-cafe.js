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
let BASE_URL = process.argv[4];

import {
    Selector
} from 'testcafe';

fixture `Adfice`;

// TODO: make launching of the AdficeWebserver the job of the test, and
// TODO: have each test launch a different instance on a different port

test('Check multiple viewers making changes', async t => {
    let url = `${BASE_URL}/patient?id=68`;
    let window1 = await t.openWindow(url);

    let selector = Selector('body');

    // initial check that patient data is rendered
    await t.expect(selector.withText('Indicatie hypertensie').exists).ok()
    await t.expect(selector.withText('Enalapril').exists).ok()
    await t.expect(selector.withText('Hydrochlorothiazide').exists).ok()
    await t.expect(selector.withText('ACE-remmers').exists).ok()

    let atc = "C03AA03"; // hydrochlorothiazide
    let rule = "42";
    let cbn = "3";
    let checkbox_id = `cb_${atc}_${rule}_${cbn}`;
    let checkbox_css_selector = `input#${checkbox_id}`;
    let freetext_id = `ft_${atc}_${rule}_${cbn}_1`;
    let freetext_css_selector = `input#${freetext_id}`;

    let ref_page_num = 14;
    let ref_C03AA03 = Selector(`#atc_ref_page_${atc}_${ref_page_num}`);
    await t.expect(ref_C03AA03.exists).ok();

    const oldFreetext = "old";
    const newFreetext = "foo";

    // checkbox starts invisible,
    // but becomes visible via websocket message
    // thus we check that we have received the message
    let cb_selector = Selector(checkbox_css_selector);
    await t.expect(cb_selector.visible).ok();
    if (await cb_selector.checked) {
        await t.click(cb_selector);
    }
    await t.expect(cb_selector.checked).notOk();

    // type some text into the freetext field for this row.
    let freetext_selector_1 = Selector(freetext_css_selector);
    await t.selectText(freetext_selector_1);
    await t.typeText(freetext_selector_1, oldFreetext);
    await t.expect(freetext_selector_1.value).eql(oldFreetext);

    let view_cnt_css_sel = "span#viewer-count";
    await t.expect(Selector(view_cnt_css_sel).withText("1").exists).ok();
    await t.expect(Selector(view_cnt_css_sel).withText("1").visible).notOk();

    // open a second window and check a box
    let window2 = await t.openWindow(`${BASE_URL}/patient?id=68`);

    // verify that we show 2 visitors
    let cb_selector2 = Selector(`input#${checkbox_id}`, {
        timeout: 1000,
        visibilityCheck: true
    });
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
    await t.expect(freetext_selector_1.value).eql(newFreetext);

    // close the second window
    await t.switchToWindow(window2);
    await t.closeWindow(window2);
    await t.switchToWindow(window1);

    // ensure that we have one viewer after close
    await t.expect(Selector(view_cnt_css_sel).withText("1").exists).ok();
    await t.expect(Selector(view_cnt_css_sel).withText("1").visible).notOk();
});

test('Checkbox persistence', async t => {
    let checkbox_id = "cb_N02AA01_76_1";
    let checkbox_css_selector = `input#${checkbox_id}`;
    let url = `${BASE_URL}/patient?id=78`;

    // Open the patient window, uncheck the box if needed
    let window1 = await t.openWindow(url);
    let checkbox1 = Selector(checkbox_css_selector, {
        timeout: 1000,
        visibilityCheck: true
    });
    if (await checkbox1.checked) {
        await t.click(checkbox_css_selector);
    }
    await t.expect(checkbox1.checked).notOk();
    await t.closeWindow(window1);

    // Open the patient window, verify still unchecked, then check
    let window2 = await t.openWindow(url);
    let checkbox2 = Selector(checkbox_css_selector, {
        timeout: 1000,
        visibilityCheck: true
    });
    await t.expect(checkbox2.checked).notOk();
    await t.click(checkbox_css_selector);
    await t.expect(checkbox2.checked).ok();
    await t.closeWindow(window2);

    // Open the patient window, verify checked
    let window3 = await t.openWindow(url);
    let checkbox3 = Selector(checkbox_css_selector, {
        timeout: 1000,
        visibilityCheck: true
    });
    await t.expect(checkbox3.checked).ok();
});

test('Test selecting views', async t => {
    let url = `${BASE_URL}/patient?id=85`;
    let window1 = await t.openWindow(url);

    let button_clinician_view = Selector('button#button_clinician_view');
    let button_condensed_view = Selector('button#button_condensed_view');
    let button_patient_view = Selector('button#button_patient_view');

    let div_clinician_view = Selector('div#div_clinician_view');
    let div_condensed_view = Selector('div#div_condensed_view');
    let div_patient_view = Selector('div#div_patient_view');
    let div_ehr_box = Selector('div#div_ehr_box');
    let div_advice_M01AB05 = Selector('div#advice_M01AB05');

    let checkbox0 = Selector('#cb_M01AB05_80b_2');
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


    // set checkbox0 to unchecked, checkbox1 to checked
    {
        if (await checkbox0.checked) {
            await t.click(checkbox0);
        }
        await t.expect(checkbox0.checked).notOk();

        if (!(await checkbox1.checked)) {
            await t.click(checkbox1);
        }
        await t.expect(checkbox1.checked).ok();

        if (await checkboxOther.checked) {
            await t.click(checkboxOther);
        }
        await t.expect(checkboxOther.checked).notOk();

    }

    // the buttons should exist
    await t.expect(button_clinician_view.exists).ok();
    await t.expect(button_condensed_view.exists).ok();
    await t.expect(button_patient_view.exists).ok();

    // the buttons should have the right text
    await t.expect(button_clinician_view.innerText).eql('Voorbereiding');
    await t.expect(button_condensed_view.innerText).eql('Consult');
    await t.expect(button_patient_view.innerText).eql('Advies');

    // and the right colors

    let test_button_style = true;
    if (test_button_style) {
        await t.expect(button_clinician_view.style).contains({
            'background-color': 'rgb(0, 128, 0)'
        });
        await t.expect(button_clinician_view.style).contains({
            'color': 'rgb(255, 255, 255)'
        });
        await t.expect(button_condensed_view.style).contains({
            'background-color': 'rgb(255, 255, 255)'
        });
        await t.expect(button_condensed_view.style).contains({
            'color': 'rgb(0, 128, 0)'
        });
        await t.expect(button_patient_view.style).contains({
            'background-color': 'rgb(255, 255, 255)'
        });
        await t.expect(button_patient_view.style).contains({
            'color': 'rgb(0, 128, 0)'
        });
    }

    // initial view should be clinician view
    await t.expect(div_clinician_view.visible).ok();
    await t.expect(div_advice_M01AB05.visible).ok();
    await t.expect(div_patient_view.visible).notOk();
    await t.expect(div_ehr_box.visible).ok();
    await t.expect(row0.visible).ok();
    await t.expect(row1.visible).ok();
    await t.expect(rowOther.visible).ok();

    // try switching to the patient view
    await t.click(button_patient_view);
    await t.expect(div_clinician_view.visible).notOk();
    await t.expect(div_advice_M01AB05.visible).notOk();
    await t.expect(div_patient_view.visible).ok();
    await t.expect(div_ehr_box.visible).notOk();
    // the patient texts are only visible if checked in clinician view
    await t.expect(patient0.visible).notOk();
    await t.expect(patient1.visible).ok();
    await t.expect(patientOther.visible).notOk();

    // check button colors
    if (test_button_style) {
        await t.expect(button_clinician_view.style).contains({
            'background-color': 'rgb(255, 255, 255)'
        });
        await t.expect(button_clinician_view.style).contains({
            'color': 'rgb(0, 128, 0)'
        });
        await t.expect(button_condensed_view.style).contains({
            'background-color': 'rgb(255, 255, 255)'
        });
        await t.expect(button_condensed_view.style).contains({
            'color': 'rgb(0, 128, 0)'
        });
        await t.expect(button_patient_view.style).contains({
            'background-color': 'rgb(0, 128, 0)'
        });
        await t.expect(button_patient_view.style).contains({
            'color': 'rgb(255, 255, 255)'
        });
    }

    // try switching to the condensed view
    await t.click(button_condensed_view);
    await t.expect(div_clinician_view.visible).ok();
    await t.expect(div_advice_M01AB05.visible).notOk();
    await t.expect(div_patient_view.visible).notOk();
    await t.expect(div_ehr_box.visible).ok();
    await t.expect(row0.visible).notOk();
    await t.expect(row1.visible).ok();

    // and the right colors
    if (test_button_style) {
        await t.expect(button_clinician_view.style).contains({
            'background-color': 'rgb(255, 255, 255)'
        });
        await t.expect(button_clinician_view.style).contains({
            'color': 'rgb(0, 128, 0)'
        });
        await t.expect(button_condensed_view.style).contains({
            'background-color': 'rgb(0, 128, 0)'
        });
        await t.expect(button_condensed_view.style).contains({
            'color': 'rgb(255, 255, 255)'
        });
        await t.expect(button_patient_view.style).contains({
            'background-color': 'rgb(255, 255, 255)'
        });
        await t.expect(button_patient_view.style).contains({
            'color': 'rgb(0, 128, 0)'
        });
    }

    // try switching to the clinician view
    await t.click(button_clinician_view);
    await t.expect(div_clinician_view.visible).ok();
    await t.expect(div_advice_M01AB05.visible).ok();
    await t.expect(div_patient_view.visible).notOk();
    await t.expect(div_ehr_box.visible).ok();
    await t.expect(row0.visible).ok();
    await t.expect(row1.visible).ok();
    await t.expect(rowOther.visible).ok();

    // check colors one more time.
    if (test_button_style) {
        await t.expect(button_clinician_view.style).contains({
            'background-color': 'rgb(0, 128, 0)'
        });
        await t.expect(button_clinician_view.style).contains({
            'color': 'rgb(255, 255, 255)'
        });
        await t.expect(button_condensed_view.style).contains({
            'background-color': 'rgb(255, 255, 255)'
        });
        await t.expect(button_condensed_view.style).contains({
            'color': 'rgb(0, 128, 0)'
        });
        await t.expect(button_patient_view.style).contains({
            'background-color': 'rgb(255, 255, 255)'
        });
        await t.expect(button_patient_view.style).contains({
            'color': 'rgb(0, 128, 0)'
        });
    }

    // the ehr texts are only ever visible if checked
    await t.expect(ehr0.visible).notOk();
    await t.expect(ehr1.visible).ok();
    await t.expect(ehrOther.visible).notOk();
});

async function check_checkbox_and_freetext(t, id) {
    // ensure our cb is selected
    let cb_id = await Selector('#cb_' + id);
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

test('Test free text fields', async t => {
    let url = `${BASE_URL}/patient?id=23`;
    let window1 = await t.openWindow(url);

    let id = 'N05AD01_16_2';
    check_checkbox_and_freetext(t, id);
});

test('Test non-med free text fields', async t => {
    let url = `${BASE_URL}/patient?id=10`;
    let window1 = await t.openWindow(url);

    let id = 'NONMED_D_1';
    check_checkbox_and_freetext(t, id);
});

test('Test med lists', async t => {
    let url = `${BASE_URL}/patient?id=9`;
    let window1 = await t.openWindow(url);

    // ensure our cb is selected
    let meds_with_rules = Selector("#meds_with_rules");
    await t.expect(meds_with_rules.withText("Zolpidem").exists).ok();
    await t.expect(meds_with_rules.withText("Ketoconazol").exists).notOk();

    let meds_without_rules = Selector("#meds_without_rules");
    await t.expect(meds_without_rules.withText("Zolpidem").exists).notOk();
    await t.expect(meds_without_rules.withText("Ketoconazol").exists).ok();
});

test('Checkbox preselected', async t => {
    let url = `${BASE_URL}/patient?id=51`;
    let window1 = await t.openWindow(url);

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

test('Test finalize and renew', async t => {
    let url = `${BASE_URL}/patient?id=161`;
    let window1 = await t.openWindow(url);

    let button_definitive = Selector('button#definitive');
    await t.expect(button_definitive.exists).ok();

    let checkbox_id = "cb_NONMED_V_1";
    let checkbox_css_selector = `input#${checkbox_id}`;
    let cb_selector = Selector(checkbox_css_selector);
    await t.expect(cb_selector.hasAttribute('disabled')).notOk();

    await t.click(button_definitive);

    await t.expect(cb_selector.hasAttribute('disabled')).ok();

    // typically, renew would _not_ be called after a finalize,
    // however, this is a handy way to reset the test case.

    let button_renew = Selector('button#page_renew');
    await t.expect(button_renew.exists).ok();

    await t.click(button_renew);

    await t.expect(cb_selector.hasAttribute('disabled')).notOk();
});

test('Check "Geen advies"', async t => {
    let url = `${BASE_URL}/patient?id=162`;
    let window1 = await t.openWindow(url);

    // levodopa has no advice pre-checked
    // (we could verify they are un-selected)

    // switch to the advies view
    let button_patient_view = Selector('button#button_patient_view');
    await t.click(button_patient_view);

    // locate the "Geen advies" text
    let ga_selector = Selector("div#geen_advies_N04BA01");
    await t.expect(ga_selector.visible).ok();

    // go to doctor view
    let button_clinician_view = Selector('button#button_clinician_view');
    await t.click(button_clinician_view);

    // check some advice
    let checkbox_selector = Selector(`input#cb_N04BA01_27_2`);
    await t.click(checkbox_selector);
    await t.expect(checkbox_selector.checked).ok();

    // go to patient view
    await t.click(button_patient_view);
    await t.expect(ga_selector.visible).notOk();
});
