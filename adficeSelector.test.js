var fs = require('fs');
const util = require("util");

const as = require('./adficeSelector')

var meds;
var rules;
var medsWithRulesToFire;

async function patient68() {
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
        meds = await conn.query("SELECT ATC_code FROM patient_medications where patient_id=" +
            patientNumber + " and date_retrieved = (select max(date_retrieved) from patient_medications where patient_id=" + patientNumber + ");");

        rules = await conn.query("SELECT * FROM med_rules WHERE active = 'yes';");

        medsWithRulesToFire = as.evaluateSelectors(meds, rules);
	return medsWithRulesToFire;
    } catch (err) {
        throw err;
    } finally {
        if (conn) {
            let result = conn.end();
            pool.end();
        }
    }
}

test('full selector acceptance for patient 68', async () => {
    await patient68();
    var expected = {
        C09AA02: [ [ '45', '48', '63', '63a', '63b' ] ],
        C03AA03: [
          [
            '35',  '40',  '40a',
            '40b', '40c', '41',
            '42',  '43',  '44',
            '45',  '48'
          ]
        ]
      };

    var result = as.evaluateSelectors(meds, rules);
    expect(result).toEqual(expected);
})
