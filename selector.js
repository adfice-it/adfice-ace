var fs = require('fs');
const util = require("util");

async function main() {

    let passwd = await fs.promises.readFile('adfice_mariadb_user_password');
    passwd = String(passwd).trim();

    //    console.log('Password: "' + passwd + '"');
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
    const patientNumber = 68; //TODO Obviously, this should be a parameter rather than hard coded.
    // In the real system, we will load data from the patient record and assign a patient number
    // Probably we want to have a main function that ensures all the data is loaded, and then calls the other functions
    // patient 123 has N06BX03, that will trigger rule 132 (and maybe some others)
    // patient 68 has two medications that should each fire some rules
    try {
        conn = await pool.getConnection();
        const meds = await conn.query("SELECT ATC_code FROM patient_medications where patient_id=" +
            patientNumber + " and date_retrieved = (select max(date_retrieved) from patient_medications where patient_id=" + patientNumber + ");");
        const rules = await conn.query("SELECT * FROM med_rules WHERE active = 'yes';");
        medsWithRulesToFire = evaluateSelectors(meds, rules);
        // this is just a console.log to see the result. Eventually the result should go to the UI instead.
        console.log(util.inspect(medsWithRulesToFire));
    } catch (err) {
        throw err;
    } finally {
        if (conn) {
            let result = conn.end();
            pool.end();
            return result;
        }
    }
}

function evaluateSelectors(meds, rules) {
    var medsWithRulesToFire = {};
    var medCounter = 0;
    do {
        var ruleCounter = 0;
        var rulesToFire = new Array();
        medsWithRulesToFire[meds[medCounter].ATC_code] = medsWithRulesToFire[meds[medCounter].ATC_code] || [];
        do {
            if (matchesSelector(meds[medCounter].ATC_code, rules[ruleCounter].selector_or) &&
                !matchesSelector(meds[medCounter].ATC_code, rules[ruleCounter].selector_not)) {
                rulesToFire.push(rules[ruleCounter].medication_criteria_id);
            } // else do nothing
            ruleCounter++;
        } while (ruleCounter < rules.length)
        medsWithRulesToFire[meds[medCounter].ATC_code].push(rulesToFire);
        medCounter++;
    } while (medCounter < meds.length);
    return medsWithRulesToFire;
}

function matchesSelector(atcCode, selectorString) {
    if (selectorString != null) {
        var selectorStrings = selectorString.split(",");
        var selectorCounter = 0;
        do {
            var selector = selectorStrings[selectorCounter].trim();
            var subATC = atcCode.substr(0, selector.length);
            if (subATC === selector) {
                return true;
            }
            selectorCounter++;
        } while (selectorCounter < selectorStrings.length)
    }
    return false;
}

main();
