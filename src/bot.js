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
                    }).then(() => {
                        message.react('✔');
                    }).catch(err => {
                        console.error('An error occurred with API when posting event data.');
                        console.error(err);

                        message.react('❌');
                        message.author.send("Le message n'a pas pu être sauvegardé car le Bot n'a pas pu contacter le serveur.");
                    });
                } else {
                    message.react('❌');
                    message.author.send("Le message n'a pas pu être traité car il n'est pas dans un format accepté: `[personnage, date, heure, event] message`\nPour réessayer, envoyez un nouveau message corrigé.");
                }
            } catch (err) {
                message.react('❌');
                message.author.send("Le message n'a pas pu être traité car il n'est pas dans un format accepté: `[personnage, date, heure, event] message`\nPour réessayer, envoyez un nouveau message corrigé.");
            }

            return;
        }

        if (message.content.startsWith('!rp')) {
            message.channel.send('Retrouvez la timeline et les messages passés sur le site https://salcedonie.nakasar.me');
        }
    });

    return client;
}

module.exports = init;