const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('restart')
    .setDescription('Restarts song'),
  async execute(interaction) {
    const player = interaction.client.queue.get(interaction.guildId);
    player.queue.unshift(player.queue[0]);
    player.player.stop();
    return interaction.reply('Restarting song');
  },
};
