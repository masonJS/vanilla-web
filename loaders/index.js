const expressLoader = require('./express');
const mysqlLoader = require('./mysql');
const i18nLoader = require('./i18n');

module.exports = (app) => {
  mysqlLoader();
  console.log('mysql Initialized')
  require('./global');
  console.log('global Initialized')
  expressLoader(app);
  console.log('express Initialized');
  i18nLoader(app);

}

