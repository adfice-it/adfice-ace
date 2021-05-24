// vim: set sts=4 expandtab :
var fs = require('fs');
const as = require('./adficeSelector')

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
        return await conn.query(sql, params);
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

async function getAtcCodesForPatient(patientNumber) {
    var sql = "" +
        "SELECT ATC_code, medication_name" +
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

async function getRulesForPatient(patientNumber) {
    var rules = await getActiveRules();
    var meds = await getAtcCodesForPatient(patientNumber);
    return as.evaluateSelectors(meds, rules);
}

module.exports = {
    getActiveRules: getActiveRules,
    getAdviceTextsCheckboxes: getAdviceTextsCheckboxes,
    getAdviceTextsNoCheckboxes: getAdviceTextsNoCheckboxes,
    getAtcCodesForPatient: getAtcCodesForPatient,
    getRulesForPatient: getRulesForPatient
}
