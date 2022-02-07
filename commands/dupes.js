const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dupes')
    .setDescription('Removes all duplicate songs'),
  async execute(interaction) {
    const player = interaction.client.queue.get(interaction.guildId);
    player.queue = [...new Map(player.queue.map((song) => [song.url, song])).values()];
    return interaction.reply('Duplicates have been removed');
  },
};
