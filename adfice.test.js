// vim: set sts=4 expandtab :
const adfice = require('./adfice')

test('test advice text 6e', async () => {
    var rule_numbers = ["6e"];
    var texts = await adfice.getAdviceTextsCheckboxes(rule_numbers);
    expect(texts.length).toBe(11);
    expect(texts[9].cdss).toBe('Continueren');
    expect(texts[9].epic).toBe('Continueren');
    expect(texts[9].patient).toBe('Gebruik dit medicijn zoals u tot nu toe doet.');

    texts = await adfice.getAdviceTextsNoCheckboxes(rule_numbers);
    expect(texts.length).toBe(1);
    expect(texts[0].cdss).toContain('angststoornis');
})
