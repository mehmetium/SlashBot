const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Loops current song x amount')
    .addIntegerOption((option) => option.setName('amount').setRequired(true).setDescription('Loop maximum of 10 times')),
  async execute(interaction) {
    const player = interaction.client.queue.get(interaction.guildId);
    let amount = interaction.options.getInteger('amount');
    if (amount <= 0) return interaction.reply(`${player.queue[0].title} has not been looped`);
    if (amount > 10) amount = 10;

    for (let index = 1; index <= amount; index += 1) {
      player.queue.unshift(player.queue[0]);
    }
    return interaction.reply(`${player.queue[0].title} has been looped ${amount} times`);
  },
};
