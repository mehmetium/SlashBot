const { SlashCommandBuilder } = require('@discordjs/builders');
const { playing }=require('./play.js')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Unpauses the song'),
	async execute(interaction) {
		const player=interaction.client.queue.get(interaction.guildId)	
		player.player.unpause();
		return interaction.reply("Song resumed");
	},
};