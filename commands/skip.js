const { SlashCommandBuilder } = require('@discordjs/builders');
const { playing }=require('./play.js')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skips song')
        .addIntegerOption(option => option.setName('amount').setDescription('Amount of songs to skip')),
	async execute(interaction) {
        const player=interaction.client.queue.get(interaction.guildId)
        let amount = interaction.options.getInteger('amount');
        if(player.queue.length<2)
            return interaction.reply('No more songs mate.');
        else
            {
                if(amount==null||amount<=0)
                    amount=1;
                else if(amount>player.queue.length-1)
                    amount=player.queue.length-1;
                let count=1;
                for (let index = 1; index < amount; index++) {
                    player.queue.shift();
                    count++
                }
        
                interaction.reply(`${count} skipped.\n${player.player.state.status.toUpperCase()} ${player.queue[1].title}`);
    
                player.player.stop();
            }
		return
	},
};