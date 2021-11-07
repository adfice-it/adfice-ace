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

// TODO: make launching of the adfice-webserver the job of the test, and
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
    const newFreetext = "new";

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

    await t.switchToWindow(window1);

    let max_loops = 1000;
    for (let i = 0; i < max_loops; ++i) {
        console.log(i);
        await t.switchToWindow(window2);
        let numbered_freetext = newFreetext + '_' + i;

        // type some text into the freetext field for this row.
        let freetext_selector_2 = Selector(freetext_css_selector);
        await t.selectText(freetext_selector_2);
        await t.typeText(freetext_selector_2, numbered_freetext);
        await t.expect(freetext_selector_2.value).eql(numbered_freetext);

        await t.switchToWindow(window1);

        // ensure that we see the box checked in the initial window.
        await t.expect(cb_selector.checked).ok();

        // ensure the text is updated in the initial window
        await t.expect(freetext_selector_1.value).eql(numbered_freetext, {
            timeout: 10000
        });

    }

    // close the second window
    await t.switchToWindow(window2);
    await t.closeWindow(window2);
    await t.switchToWindow(window1);

    // ensure that we have one viewer after close
    await t.expect(Selector(view_cnt_css_sel).withText("1").exists).ok();
    await t.expect(Selector(view_cnt_css_sel).withText("1").visible).notOk();
});
