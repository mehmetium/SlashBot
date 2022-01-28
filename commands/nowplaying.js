const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('nowplaying')
		.setDescription('Shows song that is currently playing'),
	async execute(interaction) {
		const player=interaction.client.queue.get(interaction.guildId)	
        if(player.player.state.status=='playing')
        {
            return interaction.reply(`${player.queue[0].title} currently playing`);
        }
        else
            return interaction.reply("No song is playing");

	},
};