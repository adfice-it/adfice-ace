// vim: set sts=4 expandtab :
var fs = require('fs');
const as = require('./adficeSelector');

function question_marks(num) {
    return '?,'.repeat(num - 1) + '?';
}

async function sql_select(sql, params) {
    let passwd = await fs.promises.readFile('adfice_mariadb_user_password');
    passwd = String(passwd).trim();

    const mariadb = require('mariadb');
    const pool = mariadb.createPool({
        host: '127.0.0.1',
        port: 13306,
        user: 'adfice',
        password: passwd,
        database: 'adfice',
        connectionLimit: 5
    });

    let conn;
    try {
        conn = await pool.getConnection();
        // This version of the driver seems to always place the "meta" in
        // with the rows, no matter which calling convention we try.
        let results = await conn.query(sql, params);
        // So, we will filter out anything that is not in the iterator:
        let objects = [];
        for (let i = 0; i < results.length; ++i) {
            let row = results[i];
            objects.push(row);
        }
        return objects;
    } finally {
        /* istanbul ignore else */
        if (conn) {
            let result = conn.end();
            pool.end();
        }
    }
}

async function getAdviceTextsCheckboxes(rule_numbers) {
    var sql = "" +
        "SELECT medication_criteria_id," +
        "       selectBoxNum," +
        "       selectBoxCategory," +
        "       cdss," +
        "       epic," +
        "       patient" +
        "  FROM med_advice_text" +
        " WHERE selectBoxNum IS NOT NULL" +
        "   AND medication_criteria_id IN(" +
        question_marks(rule_numbers.length) +
        ")" +
        " ORDER BY id";
    return sql_select(sql, rule_numbers);
}

async function getAdviceTextsNoCheckboxes(rule_numbers) {
    var sql = "" +
        "SELECT medication_criteria_id," +
        "       cdss" +
        "  FROM med_advice_text" +
        " WHERE selectBoxNum IS NULL" +
        "   AND medication_criteria_id IN(" +
        question_marks(rule_numbers.length) +
        ")" +
        " ORDER BY id";
    return sql_select(sql, rule_numbers);
}

async function getActiveRules() {
    var sql = "SELECT * FROM med_rules WHERE active = 'yes' ORDER BY id";
    return sql_select(sql);
}

async function getMedsForPatient(patientNumber) {
    var sql = "" +
        "SELECT ATC_code, medication_name, start_date" +
        "  FROM patient_medications" +
        " WHERE patient_id=?" +
        "   AND date_retrieved = (" +
        "           SELECT MAX(date_retrieved)" +
        "             FROM patient_medications" +
        "            WHERE patient_id=?" +
        "       )" +
        "ORDER BY ATC_code";
    return sql_select(sql, [patientNumber, patientNumber]);
}
/*
async function getProblemsForPatient(patientNumber) {
    var sql = "" +
        "SELECT name, start_date" +
        "  FROM patient_problems" +
        " WHERE patient_id=?" +
        "   AND date_retrieved = (" +
        "           SELECT MAX(date_retrieved)" +
        "             FROM patient_problems" +
        "            WHERE patient_id=?" +
        "       )" +
        "ORDER BY id";
    return sql_select(sql, [patientNumber, patientNumber]);
}

async function getAgeForPatient(patientNumber) {
    var sql = "" +
        "SELECT age" +
        "  FROM patient" +
        " WHERE patient_id=?" +
        "   AND date_retrieved = (" +
        "           SELECT MAX(date_retrieved)" +
        "             FROM patient" +
        "            WHERE patient_id=?" +
        "       )" +
        "ORDER BY id";
    return sql_select(sql, [patientNumber, patientNumber]);
}

async function getLabsForPatient(patientNumber) {
    var sql = "" +
        "SELECT lab_test_name, lab_test_result, date_measured" +
        "  FROM patient_labs" +
        " WHERE patient_id=?" +
        "   AND date_retrieved = (" +
        "           SELECT MAX(date_retrieved)" +
        "             FROM patient_labs" +
        "            WHERE patient_id=?" +
        "       )" +
        "ORDER BY id";
    return sql_select(sql, [patientNumber, patientNumber]);

function structureLabs(labQueryResult){
	//TODO structure the lab result in the format expected by adficeLabCriteria.js
}
*/
async function getRulesForPatient(patientNumber) {
    var rules = await getActiveRules();
    var meds = await getMedsForPatient(patientNumber);
    return as.evaluateSelectors(meds, rules);
}

async function getAdviceForPatient(patientNumber) {
    var rules = await getActiveRules();
    var meds = await getMedsForPatient(patientNumber);
    var medsWithRulesToFire = as.evaluateSelectors(meds, rules);
    // need to check the criteria at some point (not written yet)
    let rv = [];
    for (let i = 0; i < meds.length; ++i) {
        let fired = medsWithRulesToFire[meds[i].ATC_code];
        let v = {};
        v.ATC_code = meds[i].ATC_code.trim();
        v.medication_name = meds[i].medication_name.trim();
        v.adviceTextsCheckboxes = await getAdviceTextsCheckboxes(fired);
        v.adviceTextsNoCheckboxes = await getAdviceTextsNoCheckboxes(fired);
        rv.push(v);
    }
    //TODO get the reference field for all rules that fired for this medication and add it to this object
    return rv;
}

module.exports = {
    getActiveRules: getActiveRules,
    getAdviceForPatient: getAdviceForPatient,
    getAdviceTextsCheckboxes: getAdviceTextsCheckboxes,
    getAdviceTextsNoCheckboxes: getAdviceTextsNoCheckboxes,
    getMedsForPatient: getMedsForPatient,
    getRulesForPatient: getRulesForPatient
}
