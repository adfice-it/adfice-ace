// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
import {
    Selector
} from 'testcafe';

fixture `Adfice`
    .page `http://localhost:8080/patient?id=68`;

test('Test page for patient 68', async t => {
    let selector = Selector('body');
    await t.expect(selector.withText('C09AA02').exists).ok()
    await t.expect(selector.withText('63a').exists).ok()
    await t.expect(selector.withText('C03AA03').exists).ok()
    await t.expect(selector.withText('6a').exists).notOk()
});
