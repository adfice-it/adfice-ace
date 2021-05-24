import { Selector } from 'testcafe';

fixture `Adfice`
    .page `http://localhost:8080/`;

test('Submit a form', async t => {
    let selector = Selector('table').withText('angststoornis')
    await t.expect(selector.exists).ok()
});
