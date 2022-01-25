const { SlashCommandBuilder } = require('@discordjs/builders');
const { createAudioPlayer,createAudioResource,joinVoiceChannel } = require('@discordjs/voice');
const { ytkey } = require('../config.json');
const ytdl = require('ytdl-core');
const { YTSearcher } = require('ytsearcher');

  let serverPlayer={};
 

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays a song')
        .addStringOption(option => option.setName('song').setDescription('Search song name or URL')),
	async execute(interaction) {
        let serverQueue=interaction.client.queue.get(interaction.guildId);
    
        if(!interaction.member.voice.channel){
            return interaction.reply(`Please join a voice channel.`);
        }else{
            const searcher= new YTSearcher({
                key: ytkey,
                revealkey: true,
            });
            let result = await searcher.search(interaction.options.getString('song'),{type: 'video', maxResults: 1});
            const songInfo = await ytdl.getInfo(result.first.url);
            let song={
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url
            };

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
            serverPlayer.queue.push(song);
            interaction.client.queue.set(interaction.guildId,serverPlayer);
            console.log('qeuue updated')
    
            if(serverPlayer.queue.length<2){
                this.playing();
                return interaction.reply(`${song.url} now playing`);
            }else{
                return interaction.reply(`${song.url} has been added to queue.`);
            }
        }
        
	},async playing(){
        const stream=ytdl(serverPlayer.queue[0].url,{filter:'audioonly'});
        const source=createAudioResource(stream);
        serverPlayer.player.play(source);
        const conc=serverPlayer.connection;
        conc.subscribe(serverPlayer.player);
    }
};