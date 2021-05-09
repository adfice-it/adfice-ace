var fs = require('fs');

async function main() {

    let passwd = await fs.promises.readFile('adfice_mariadb_user_password');
    passwd = String(passwd).trim();

    console.log('Password: "' + passwd + '"');
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
        const rows = await conn.query("SELECT * FROM patient_labs");
        console.log(rows);

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
