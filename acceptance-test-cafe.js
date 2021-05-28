// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

import {
    Selector
} from 'testcafe';

fixture `Adfice`;

test.page(`http://localhost:9090/patient?id=68`)
    ('Check multiple viewers making changes', async t => {

        let selector = Selector('body');
        let window1 = await t.getCurrentWindow();

        // initial check that patient data is rendered
        await t.expect(selector.withText('geen decompensatio').exists).ok()
        await t.expect(selector.withText('Enalapril').exists).ok()
        await t.expect(selector.withText('Hydrochlorothiazide').exists).ok()
        await t.expect(selector.withText('ACE-remmers').exists).ok()

        let atc = "C03AA03"; // hydrochlorothiazide
        let rule = "42";
        let cbn = "3";
        let checkbox_id = `cb_${atc}_${rule}_${cbn}`;
        let checkbox_css_selector = `input#${checkbox_id}`;

        // checkbox starts invisible,
        // but becomes visible via websocket message
        // thus we check that we have received the message
        let cb_selector = Selector(checkbox_css_selector);
        await t.expect(cb_selector.visible).ok();
        if (await cb_selector.checked) {
            await t.click(cb_selector);
        }
        await t.expect(cb_selector.checked).notOk();

        let view_cnt_css_sel = "span#viewer_count";
        await t.expect(Selector(view_cnt_css_sel).withText("1").exists).ok();
        await t.expect(Selector(view_cnt_css_sel).withText("1").visible).notOk();

        // open a second window and check a box
        let window2 = await t.openWindow('http://localhost:9090/patient?id=68');

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

        await t.expect(cb_selector2.checked).notOk();
        await t.click(cb_selector2);
        await t.expect(cb_selector2.checked).ok();

        await t.switchToWindow(window1);

        // finally ensure that we see the box checked in the initial window.
        await t.expect(cb_selector.checked).ok();

        await t.switchToWindow(window2);
        await t.closeWindow(window2);
        await t.switchToWindow(window1);

        await t.expect(Selector(view_cnt_css_sel).withText("1").exists).ok();
        await t.expect(Selector(view_cnt_css_sel).withText("1").visible).notOk();
    });

test('Checkbox persistence', async t => {
    let checkbox_id = "cb_N02AA01_72_1";
    let checkbox_css_selector = `input#${checkbox_id}`;
    let url = 'http://localhost:9090/patient?id=78';

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
    let url = 'http://localhost:9090/patient?id=85';
    let window1 = await t.openWindow(url);

    let button_clinician_view = Selector('button#button_clinician_view');
    let button_condensed_view = Selector('button#button_condensed_view');
    let button_patient_view = Selector('button#button_patient_view');

    let div_clinician_view = Selector('div#div_clinician_view');
    let div_condensed_view = Selector('div#div_condensed_view');
    let div_patient_view = Selector('div#div_patient_view');
    let div_epic_box = Selector('div#div_epic_box');

    // the buttons should exist
    await t.expect(button_clinician_view.exists).ok();
    await t.expect(button_condensed_view.exists).ok();
    await t.expect(button_patient_view.exists).ok();

    // the buttons should have the right text
    await t.expect(button_clinician_view.innerText).eql('Voorbereiding');
    await t.expect(button_condensed_view.innerText).eql('Consult');
    await t.expect(button_patient_view.innerText).eql('Advies');

    // initial view should be clinician view
    await t.expect(div_clinician_view.visible).ok();
    await t.expect(div_condensed_view.visible).notOk();
    await t.expect(div_patient_view.visible).notOk();
    await t.expect(div_epic_box.visible).ok();

    // try switching to the patient view
    await t.click(button_patient_view);
    await t.expect(div_clinician_view.visible).notOk();
    await t.expect(div_condensed_view.visible).notOk();
    await t.expect(div_patient_view.visible).ok();
    await t.expect(div_epic_box.visible).notOk();

    // try switching to the condensed view
    await t.click(button_condensed_view);
    await t.expect(div_clinician_view.visible).notOk();
    await t.expect(div_condensed_view.visible).ok();
    await t.expect(div_patient_view.visible).notOk();
    await t.expect(div_epic_box.visible).ok();

    // try switching to the clinician view
    await t.click(button_clinician_view);
    await t.expect(div_clinician_view.visible).ok();
    await t.expect(div_condensed_view.visible).notOk();
    await t.expect(div_patient_view.visible).notOk();
    await t.expect(div_epic_box.visible).ok();
});

test('Test free text fields', async t => {
    let url = 'http://localhost:9090/patient?id=85';
    let window1 = await t.openWindow(url);

    let asa_0_1_cdss = Selector('#asa_0_1_cdss_1_e');
    await t.expect(asa_0_1_cdss.exists).ok();
});
