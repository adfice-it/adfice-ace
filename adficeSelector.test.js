const adfice = require('./adfice')
const as = require('./adficeSelector')

test('full selector acceptance for patient 68', async () => {
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
        ]
    };
    var rules = await adfice.getActiveRules();
    var meds = await adfice.getAtcCodesForPatient(68);
    var result = as.evaluateSelectors(meds, rules);
    expect(result).toEqual(expected);
})