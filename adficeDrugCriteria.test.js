const adc = require('./adficeDrugCriteria')

test('one', () => {
    const drugList = ["J02AB02", "C09AA01", "C07AA01"];
    const drugString = "!C09A,!C09B";
    const startDate = new Date();
    var result = adc.evaluateDrugCriteria(drugList, drugString,
        startDate);
    expect(result).toBe(false);
})

test('two', () => {
    const drugList = ["J02AB02", "C09AA01", "C07AA01"];
    const drugString = "J02AB02,J02AC04,J02AC03,J02AC02,J01FA09" +
        ",V03AX03,J05AE03,J05AE01,J05AR10";
    const startDate = new Date();
    var result = adc.evaluateDrugCriteria(drugList, drugString,
        startDate);
    expect(result).toBe(true);
})

test('three', () => {
    const drugList = ["J02AB02", "C09AA01", "C07AA01"];
    // this doesn't exist currently but it is handled by this code
    const drugString = "C09A,!C09B";
    const startDate = new Date();
    var result = adc.evaluateDrugCriteria(drugList, drugString,
        startDate);
    expect(result).toBe(true);
})

test('four', () => {
    const drugList = ["J02AB02", "C09AA01", "C07AA01"];
    const drugString = "!C09A,!C09B";
    const startDate = new Date();
    var result = adc.evaluateDrugCriteria(drugList, drugString,
        startDate);
    expect(result).toBe(false);
})

test('five', () => {
    const drugList = ["J02AB02", "C09AA01", "C07AA01"];
    const drugString = "&(medication.startDate < now-6-months)";
    const startDate = new Date();
    var result = adc.evaluateDrugCriteria(drugList, drugString,
        startDate);
    expect(result).toBe(false);
})


test('six', () => {
    const drugList = ["J02AB02", "C09AA01", "C07AA01"];
    var drugString = "&(medication.startDate >= now-6-months" +
        " | !medication.startDate)";
    const startDate = new Date();
    var result = adc.evaluateDrugCriteria(drugList, drugString,
        startDate);
    expect(result).toBe(true);
})


// vim: set sts=4 expandtab :
