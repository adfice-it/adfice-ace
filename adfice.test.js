// vim: set sts=4 expandtab :
const adfice = require('./adfice')

test('test advice text 6e', async () => {
    var rule_numbers = ["6e"];
    var texts = await adfice.getAdviceTexts(rule_numbers);
    expect(texts.length).toBe(12);
    expect(texts[10].id).toBe(14);
    expect(texts[10].cdss).toBe('Continueren');
    expect(texts[10].epic).toBe('Continueren');
    expect(texts[10].patient).toBe('Gebruik dit medicijn zoals u tot nu toe doet.');
})
