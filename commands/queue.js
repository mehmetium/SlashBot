const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Restarts song'),
	async execute(interaction) {
        const player=interaction.client.queue.get(interaction.guildId)
        let str="";
        if(player.queue.length<2)
        return interaction.reply('No more songs mate.');
        else
        {
            str=`Now playing ${player.queue[0].title}\n`
            console.log(player.queue)
            
            for (let index = 1; index < player.queue.length; index++) {
                str+=`\n${index}. ${player.queue[index].title}`
                
            }
        }
    return interaction.reply(str)
	},
};