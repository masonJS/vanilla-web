(async () => {

    require('../module/share/base/ff');
    require('../module/share/base/global');

    const { CREATE } = require('./scripts/create')
    Object.assign(global, FF);

    const { MySQL } = require('fxsql');
    const { CONNECT } = MySQL;
    const dbInfo = require('../config/db_info');
    const POOL = CONNECT({
        host: dbInfo.host,
        user: dbInfo.user,
        password: dbInfo.password,
        database: dbInfo.database
    });
    Object.assign(global, POOL);

    go(
      CREATE.TABLE.campain()
    )
}) ();



