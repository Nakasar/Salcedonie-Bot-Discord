const config = require('./config/config');
const Bot = require('../src/bot')(config);

Bot.login(config.BOT_TOKEN);