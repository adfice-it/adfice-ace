// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const fs = require('fs');
const adb = require('./adfice-db');

const config_path = 'adfice-db.test.temp.env';

async function delete_faux_config() {
    try {
        fs.unlinkSync(config_path, (err) => {});
    } catch (ignoreError) {}
}

async function write_test_db_config(data) {
    delete_faux_config();
    let options = {};
    await fs.writeFileSync(config_path, data, options);
}

test('test empty env', async () => {
    write_test_db_config("");
    let db = await adb.init({}, config_path);

    expect(db.dbconfig.socketPath).toBe(undefined);
    expect(db.dbconfig.host).toBe("127.0.0.1");
    expect(db.dbconfig.port).toBe(3306);

    await delete_faux_config();
});

test('test socket env', async () => {
    write_test_db_config(`
        DB_SOCKET_PATH=/path/to/mysql.sock
        DB_USER=dr_adfice
        DB_NAME=adfice1
    `);
    let db = await adb.init({}, config_path);

    expect(db.dbconfig.socketPath).toBe("/path/to/mysql.sock");
    expect(db.dbconfig.host).toBe(undefined);
    expect(db.dbconfig.port).toBe(undefined);
    expect(db.dbconfig.user).toBe("dr_adfice");
    expect(db.dbconfig.database).toBe("adfice1");

    await delete_faux_config();
});

test('test transactionality', async () => {
	let pid = '';
	let sql1 = "INSERT INTO patient (patient_id) VALUES (?)";
	let p1 = ['foo'];
	let sql2 = "INSERT INTO patient_medication (patient_id, ATC_code) VALUES (?,?)";
	let p2 = ['foo','A01AA01'];
	let list_of_transactions = [[sql1, p1], [sql2, p2], [sql2, p2]]; //2nd query is repeated, should throw a duplicate error
	let db = await adb.init();
	try{
		db.as_sql_transaction(list_of_transactions);
	} catch (error){
		console.log(error); //expect a duplicate key error
	}
	let sql3 = 'SELECT * from patient where patient_id = ?';
	let db2 = await adb.init();
	let result = db2.sql_query(sql3, p1);
	// expect(result.length).toBe(0); // expect whole transaction to fail
});