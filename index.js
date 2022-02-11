/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-restricted-syntax */
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
// const { token } = require('./config.json');

global.client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});
global.client.queue = new Map();
global.client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    global.client.once(event.name, (...args) => event.execute(...args));
  } else {
    global.client.on(event.name, (...args) => event.execute(...args));
  }
}

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  global.client.commands.set(command.data.name, command);
}

global.client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = global.client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line consistent-return
    return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

global.client.login(process.env.token);
