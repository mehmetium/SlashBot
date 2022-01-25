const { SlashCommandBuilder } = require('@discordjs/builders');
const {serverPlayer} = require('./play.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops the music'),
	async execute(interaction) {
		const player=interaction.client.queue.get(interaction.guildId)
		player.connection.destroy();
		player.connection=null;
		player.queue=[];
		return interaction.reply("Aight imma head out");
	},
};