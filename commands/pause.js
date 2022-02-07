const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses the song'),
  async execute(interaction) {
    const player = interaction.client.queue.get(interaction.guildId);
    player.player.pause();
    return interaction.reply('Song has been paused.');
  },
};
