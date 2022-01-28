const { SlashCommandBuilder } = require('@discordjs/builders');
const { playing }=require('./play.js')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pauses the song'),
	async execute(interaction) {
		const player=interaction.client.queue.get(interaction.guildId)	
		player.player.pause();
		return interaction.reply("Song has been paused.");
	},
};