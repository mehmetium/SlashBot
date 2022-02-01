const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('swap')
		.setDescription('Swaps songs')
        .addIntegerOption(option => option.setName('target').setDescription('Index of target song').setRequired(true))
        .addIntegerOption(option => option.setName('destination').setDescription('Swap target into destination (defualts 0)')),
	async execute(interaction) {
        const player=interaction.client.queue.get(interaction.guildId)

        if(player.queue.length<2)
            return interaction.reply('No more songs mate.');
        else
            {
                let target=interaction.options.getInteger('target');
                if(target<0)
                    target=0;
                else if(target>player.queue.length-1)
                    target=player.queue.length-1;
                let destination=interaction.options.getInteger('destination');
                if(destination==null||destination<=0){
                    const temp=player.queue[target];
                    interaction.reply(`Swopped ${player.queue[0].title} with ${temp.title}`);
                    player.queue[target]=player.queue[0];
                    player.queue.shift();
                    player.queue.unshift(temp);
                    player.queue.unshift(temp);
                    player.player.stop();
                }else{
                    if(destination>player.queue.length-1)
                        destination=player.queue.length-1;
                        const temp=player.queue[target];
                        interaction.reply(`Swopped ${player.queue[destination].title} with ${temp.title}`);
                        player.queue[target]=player.queue[destination];
                        player.queue[destination]=temp;
                } 
            }
		return
	},
};