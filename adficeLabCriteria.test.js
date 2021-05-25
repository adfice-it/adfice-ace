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

const lowNatrium = new Map();
lowNatrium.set("lab_test_result", 120);
lowNatrium.set("date_measured", new Date());

const highCalcium = new Map();
highCalcium.set("lab_test_result", 2.9);
highCalcium.set("date_measured", new Date());

const bordereGFR = new Map();
bordereGFR.set("lab_test_result", 30);
bordereGFR.set("date_measured", new Date());

var outOfDate = new Date();
outOfDate.setMonth(outOfDate.getMonth() - 12);

const oldNatrium = new Map();
oldNatrium.set("lab_test_result", 140);
oldNatrium.set("date_measured", outOfDate);

const oldeGFR = new Map();
oldeGFR.set("lab_test_result", 35);
oldeGFR.set("date_measured", outOfDate);

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

if (0) {
test('Complete normal labs, check if natrium is missing', () => {
    const labTests = new Map();
    labTests.set("natrium", normalNatrium);
    labTests.set("kalium", normalKalium);
    labTests.set("calcium", normalCalcium);
    labTests.set("eGFR", normaleGFR);
    const labString = "!lab.natrium.value";
    var result = alc.evaluateLabCriteria(labTests, labString);
    expect(result).toBe(false);
})
}

if (0) {
    test('Complete normal labs, check criteria with AND', () => {
        const labTests = new Map();
        labTests.set("natrium", normalNatrium);
        labTests.set("kalium", normalKalium);
        labTests.set("calcium", normalCalcium);
        labTests.set("eGFR", normaleGFR);
        const labString = "lab.eGFR.value <= 30 & lab.eGFR.date > now-11-months";
        var result = alc.evaluateLabCriteria(labTests, labString);
        expect(result).toBe(false);
    })

    test('low natrium, check natrium value', () => {
        const labTests = new Map();
        labTests.set("natrium", lowNatrium);
        const labString = "lab.natrium.value < 135";
        var result = alc.evaluateLabCriteria(labTests, labString);
        expect(result).toBe(true);
    })

    test('high calcium, check calcium value', () => {
        const labTests = new Map();
        labTests.set("calcium", highCalcium);
        const labString = "lab.calcium.value > 2.65";
        var result = alc.evaluateLabCriteria(labTests, labString);
        expect(result).toBe(true);
    })

	test('borderline eGFR, check eGFR value', () => {
		const labTests = new Map();
		labTests.set("eGFR", borderlineeGFR);
		const labString = "lab.eGFR.value <= 30";
		var result = alc.evaluateLabCriteria(labTests, labString);
		expect(result).toBe(true);
    })

	test('Old labs, check if natrium is recent', () => {
		const labTests = new Map();
		labTests.set("natrium", oldNatrium);
		const labString = "lab.natrium.date >= now-11-months";
		var result = alc.evaluateLabCriteria(labTests, labString);
		expect(result).toBe(true);
    })

    test('no labs, check natrium value', () => {
        const labTests = new Map();
        const labString = "lab.natrium.value < 135";
        var result = alc.evaluateLabCriteria(labTests, labString);
        expect(result).toBe(false);
    })

    test('no labs, check natrium date', () => {
		const labTests = new Map();
		const labString = "lab.natrium.date >= now-11-months";
		var result = alc.evaluateLabCriteria(labTests, labString);
		expect(result).toBe(false);
    })

    test('no labs, check missing natrium', () => {
        const labTests = new Map();
        const labString = "!lab.natrium.value";
        var result = alc.evaluateLabCriteria(labTests, labString);
        expect(result).toBe(true);
    })

// TODO!!! This criterion will not parse correctly:
// !lab.eGFR.value <= 30 & lab.eGFR.date > now-11-months
// will be interpreted as "check if eGFR is missing" but should be interpreted as "not lab value <= 30"
	test('eGFR normal, check if normal and in date', () => {
		const labTests = new Map();
		labTests.set("eGFR", normaleGFR);
		const labString = "!lab.eGFR.value <= 30 & lab.eGFR.date > now-11-months";
		var result = alc.evaluateLabCriteria(labTests, labString);
		expect(result).toBe(true);
    })

	test('eGFR low, check if normal and in date', () => {
		const labTests = new Map();
		labTests.set("eGFR", loweGFR);
		const labString = "!lab.eGFR.value <= 30 & lab.eGFR.date > now-11-months";
		var result = alc.evaluateLabCriteria(labTests, labString);
		expect(result).toBe(false);
    })

	test('old eGFR, check if normal and in date', () => {
		const labTests = new Map();
		labTests.set("eGFR", oldeGFR);
		const labString = "!lab.eGFR.value <= 30 & lab.eGFR.date > now-11-months";
		var result = alc.evaluateLabCriteria(labTests, labString);
		expect(result).toBe(false);
    })

}

// vim: set sts=4 expandtab :
