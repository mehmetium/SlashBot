const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Shows songs in queue'),
  async execute(interaction) {
    const player = interaction.client.queue.get(interaction.guildId);
    let str = '';
    if (player.queue.length < 2) return interaction.reply('No more songs mate.');

    str = `${player.player.state.status.toUpperCase()} ${player.queue[0].title}\n`;
    str += '----- QUEUE -----';
    const result = player.queue.length > 11 ? 11 : player.queue.length;
    for (let index = 1; index < result; index += 1) {
      str += `\n${index}. ${player.queue[index].title}`;
    }

    if (player.queue.length > 11) str += `\n----- ${player.queue.length - 10} more songs ----`;
    return interaction.reply(str);
  },
};
