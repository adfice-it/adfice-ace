// vim: set sts=4 expandtab :
var fs = require('fs');

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

module.exports = {
    getOurData: function() {
        return {
            N: [1, 1, 2, 3, 5, 8, 13, 21]
        };
    },

    getAdviceTexts: async function(rule_numbers) {
        var sql = "SELECT * FROM med_advice_text" +
            " WHERE medication_criteria_id IN (" +
            question_marks(rule_numbers.length) +
            ") ORDER BY id";
        return sql_select(sql, rule_numbers);
    }
}
