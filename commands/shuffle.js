const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffles song'),
  async execute(interaction) {
    const player = interaction.client.queue.get(interaction.guildId);
    if (player.queue.length < 2) return interaction.reply('No more songs mate.');

    const array = player.queue.slice(0);
    array.shift();
    let currentIndex = array.length; let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    array.unshift(player.queue[0]);
    player.queue = array;
    interaction.reply('Queue has been shuffled');
    return 0;
  },
};
