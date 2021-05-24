import { Selector } from 'testcafe';

fixture `Adfice`
    .page `http://localhost:8080/patient?id=68`;

/*
    var expected = {
        C09AA02: [
            ['45', '48', '63', '63a', '63b']
        ],
        C03AA03: [
            [
                '35', '40', '40a',
                '40b', '40c', '41',
                '42', '43', '44',
                '45', '48'
            ]
*/

test('Test page for patient 68', async t => {
    let selector = Selector('body');
    await t.expect(selector.withText('C09AA02').exists).ok()
    await t.expect(selector.withText('63a').exists).ok()
    await t.expect(selector.withText('C03AA03').exists).ok()
    await t.expect(selector.withText('40c').exists).ok()
    await t.expect(selector.withText('6a').exists).notOk()
});
