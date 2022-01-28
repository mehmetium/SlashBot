const { SlashCommandBuilder } = require('@discordjs/builders');
const { playing }=require('./play.js')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('Shuffles song'),
	async execute(interaction) {
        const player=interaction.client.queue.get(interaction.guildId)
        if(player.queue.length<2)
            return interaction.reply('No more songs mate.');
        else
            {
                const array=player.queue.slice(0);
                array.shift();
                    //Fisher-Yates
        let currentIndex=array.length,randomIndex;

        while(currentIndex!=0){
            randomIndex=Math.floor(Math.random()*currentIndex)
            currentIndex--
            [array[currentIndex],array[randomIndex]]=[array[randomIndex],array[currentIndex]]
        }
        array.unshift(player.queue[0])
        player.queue=array
                interaction.reply(`Queue has been shuffled`);
            }
		return
	},
};