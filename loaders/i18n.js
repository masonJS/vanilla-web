const i18n = require('i18n');


module.exports = (app) => {
  i18n.configure({
    locales:['ko', 'en'],
    directory: __dirname + '/../locales',
    cookie: 'lang'
  });
  app.use(i18n.init);
}
