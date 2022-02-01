const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops the music'),
	async execute(interaction) {
		const player=interaction.client.queue.get(interaction.guildId)
		player.connection.destroy();
		player.connection=null;
		player.queue=[];
		player.player.unpause();
		return interaction.reply("Aight imma head out");
	},
};