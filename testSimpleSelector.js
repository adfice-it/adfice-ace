var fs = require('fs');

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
    try {
        conn = await pool.getConnection();
        // patient 123 has N06BX03, that will trigger rule 132
        const meds = await conn.query("SELECT ATC_code FROM patient_medications where patient_id=123 and date_retrieved = (select max(date_retrieved) from patient_medications where patient_id=123);");

        counter = 0;
        do {
            console.log(meds[counter].ATC_code);
            counter++;

        } while (counter < meds.length);





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

main();
