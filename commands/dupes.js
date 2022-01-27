const { SlashCommandBuilder } = require('@discordjs/builders');
const { playing }=require('./play.js')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('dupes')
		.setDescription('Removes all duplicate songs'),
	async execute(interaction) {
		const player=interaction.client.queue.get(interaction.guildId)	
        player.queue=[...new Set(player.queue)];
		return interaction.reply(`Duplicates have been removed`);
	},
};