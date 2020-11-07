const moment = require('moment')

const currentDate = (format) => moment().format(format)


module.exports = {
  currentDate
}
