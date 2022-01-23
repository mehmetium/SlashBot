const { SlashCommandBuilder } = require('@discordjs/builders');
const { createAudioPlayer,createAudioResource,joinVoiceChannel } = require('@discordjs/voice');
const { ytkey } = require('../config.json');
const ytdl = require('ytdl-core');
const { YTSearcher } = require('ytsearcher');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays a song')
        .addStringOption(option => option.setName('song').setDescription('Search song name or URL')),
	async execute(interaction) {
        const searcher= new YTSearcher({
            key: ytkey,
            revealkey: true,
        });
        let result = await searcher.search(interaction.options.getString('song'),{type: 'video', maxResults: 1})
        const songInfo = await ytdl.getInfo(result.first.url);
        let song={
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url
        };
            const stream=ytdl(song.url,{filter:'audioonly'});
            const source=createAudioResource(stream);
            const player= createAudioPlayer();
            player.play(source);
            const conc=joinVoiceChannel({
                channelId:interaction.member.voice.channelId,
                guildId:interaction.guildId,
                adapterCreator:interaction.guild.voiceAdapterCreator,
            });
            conc.subscribe(player);

		return interaction.reply(`${song.url}`);
	},
};