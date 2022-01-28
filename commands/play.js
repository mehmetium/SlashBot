const { SlashCommandBuilder } = require('@discordjs/builders');
const { createAudioPlayer,createAudioResource,joinVoiceChannel } = require('@discordjs/voice');
const { ytkey } = require('../config.json');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const ytpl = require('ytpl');

  let serverPlayer={};
  function playing(){
    try {
        const stream=ytdl(serverPlayer.queue[0].url,{filter:'audioonly'});
        const source=createAudioResource(stream);
        serverPlayer.player.play(source);
        const conc=serverPlayer.connection;
        conc.subscribe(serverPlayer.player);
    } catch (error) {
        return console.log(error)
        
    }
   
}
function outputter(interaction,playlist){
    
    if(playlist==null){
        if(serverPlayer.queue.length<2){
            playing();
            return interaction.editReply(`${serverPlayer.queue[0].url} now playing`);
        }else{
            return interaction.editReply(`${serverPlayer.queue[serverPlayer.queue.length-1].url} has been added to queue.`);
        }
    }else{
        if(serverPlayer.player.state.status!='playing'){
            playing();
            return interaction.editReply(`Playlist ${playlist.title} now playing`);
        }else{
            return interaction.editReply(`Playlist ${playlist.title} has been added to queue.`);
        }
    }       
}



module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays a song')
        .addStringOption(option => option.setName('song').setDescription('Search song name or URL').setRequired(true)),
	async execute(interaction) {
        let serverQueue=interaction.client.queue.get(interaction.guildId);
        const input=interaction.options.getString('song');

        if(!interaction.member.voice.channel){
            return interaction.reply(`Please join a voice channel.`);
        }else{
            interaction.reply(`Processing`)
            if(!serverQueue){
                 serverPlayer={
                    player: player=createAudioPlayer(),
                    queue:[],
                    connection:joinVoiceChannel({
                        channelId:interaction.member.voice.channelId,
                        guildId:interaction.guildId,
                        adapterCreator:interaction.guild.voiceAdapterCreator,
                    })
            }
                
            serverPlayer.player.on('stateChange',() => {
                    if(serverPlayer.player.state.status=='idle'){
                        console.log("song ended");
                        serverPlayer.queue.shift();
                        if(serverPlayer.queue.length==0){
                            serverPlayer.connection.destroy();
                            serverPlayer.connection=null;
                        }else
                        this.playing();
                    }  
                })
            }else if(!serverPlayer.connection){
                serverPlayer.connection=joinVoiceChannel({
                    channelId:interaction.member.voice.channelId,
                    guildId:interaction.guildId,
                    adapterCreator:interaction.guild.voiceAdapterCreator,
                })
            }
            
            //non-robust check for playlist!!
            if(input.includes('&list=')){
                const playlist= await ytpl(input).catch(error=>{return console.log('Playlist error')});
                playlist.items.forEach(element => {
                    let song={
                        title:element.title,
                        url: element.shortUrl,
                    };
                    serverPlayer.queue.push(song);
                });
                outputter(interaction,playlist);
            }else{
                let result = await ytsr(input,{limit: 1}).catch(error =>console.log("oof"));
                let song={
                    title: result.items[0].title,
                    url: result.items[0].url,
                };
                serverPlayer.queue.push(song);
                outputter(interaction);
            }
            interaction.client.queue.set(interaction.guildId,serverPlayer);
        }
        
	},
    playing
};