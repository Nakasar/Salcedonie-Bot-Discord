const Axios = require('axios');
const Discord = require('discord.js');

const SalcedonieParser = require('salcedonie-modules/services/analyzer.service');

function init(config) {
    const client = new Discord.Client();

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on('error', (err) => {
        console.error('A client level error occurred.');
        console.error(err);
    });

    client.on('message', async message => {
        if (message.author.bot) {
            return;
        }

        if (message.content.startsWith('[')) {
            try {
                // Attempt to parse context.
                const parsed = await SalcedonieParser.analyzeMessage(message.content);

                if (parsed.character && parsed.date && parsed.hour && parsed.event && parsed.message) {
                    await Axios.post(config.API_URL, {
                        ...parsed
                    }).catch(err => {
                        console.error('An error occurred with API when posting event data.');
                        console.error(err);
                        throw err;
                    });

                    message.react('✔');
                } else {
                    message.react('❌');
                }
            } catch (err) {
                message.react('❌');
            }

            return;
        }

        if (message.content.startsWith('!rp')) {
            message.channel.send("Je n'ai pas compris.");
        }
    });

    return client;
}

module.exports = init;