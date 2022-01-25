const { SlashCommandBuilder } = require('@discordjs/builders');
const { playing }=require('./play.js')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Restarts song'),
	async execute(interaction) {
		playing();
		return interaction.reply("Restarting song");
	},
};