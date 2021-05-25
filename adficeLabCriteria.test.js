const alc = require('./adficeLabCriteria')

/* we need to reuse these a lot, so I'm parking them up here */
const normalNatrium = new Map();
normalNatrium.set("lab_test_result", 140);
normalNatrium.set("date_measured", new Date());
const normalKalium = new Map();
normalKalium.set("lab_test_result", 3.5);
normalKalium.set("date_measured", new Date());
const normalCalcium = new Map();
normalCalcium.set("lab_test_result", 2.6);
normalCalcium.set("date_measured", new Date());
const normaleGFR = new Map();
normaleGFR.set("lab_test_result", 60);
normaleGFR.set("date_measured", new Date());

test('Complete normal labs, check for hyponatremia', () => {
    const labTests = new Map();
    labTests.set("natrium", normalNatrium);
    labTests.set("kalium", normalKalium);
    labTests.set("calcium", normalCalcium);
    labTests.set("eGFR", normaleGFR);
    const labString = "lab.natrium.value < 135";
    var result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(false);
})

test('Complete normal labs, check for hypercalcemia', () => {
    const labTests = new Map();
    labTests.set("natrium", normalNatrium);
    labTests.set("kalium", normalKalium);
    labTests.set("calcium", normalCalcium);
    labTests.set("eGFR", normaleGFR);
    const labString = "lab.calcium.value > 2.65";
    var result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(false);
})

test('Complete normal labs, check for low eGFR', () => {
    const labTests = new Map();
    labTests.set("natrium", normalNatrium);
    labTests.set("kalium", normalKalium);
    labTests.set("calcium", normalCalcium);
    labTests.set("eGFR", normaleGFR);
    const labString = "lab.eGFR.value <= 30";
    var result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(false);
})

if (0) {
    test('Complete normal labs, check if natrium is recent', () => {
        const labTests = new Map();
        labTests.set("natrium", normalNatrium);
        labTests.set("kalium", normalKalium);
        labTests.set("calcium", normalCalcium);
        labTests.set("eGFR", normaleGFR);
        const labString = "lab.natrium.date >= now-11-months";
        var result = alc.evaluateLabCriteria(labTests, labString);
        expect(result).toBe(true);
    })
}

test('Complete normal labs, check if natrium is missing', () => {
    const labTests = new Map();
    labTests.set("natrium", normalNatrium);
    labTests.set("kalium", normalKalium);
    labTests.set("calcium", normalCalcium);
    labTests.set("eGFR", normaleGFR);
    const labString = "!lab.natrium.value";
    var result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(true);
})

if (0) {
    test('Complete normal labs, check criteria with AND', () => {
        const labTests = new Map();
        labTests.set("natrium", normalNatrium);
        labTests.set("kalium", normalKalium);
        labTests.set("calcium", normalCalcium);
        labTests.set("eGFR", normaleGFR);
        const labString = "lab.eGFR.value <= 30 & lab.eGFR.date > now-11-months";
        var result = alc.evaluateLabCriteria(labTests, labString);
        expect(result).toBe(true);
    })
}

// vim: set sts=4 expandtab :
