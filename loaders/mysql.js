const { MySQL } = require('fxsql')
const { CONNECT } = MySQL;
const dbInfo = require('../config/db_info.json');

module.exports =  () => {
  const POOL = CONNECT({
    host: dbInfo.host,
    user: dbInfo.user,
    password: dbInfo.password,
    database: dbInfo.database
  });
  Object.assign(global, POOL);
}
