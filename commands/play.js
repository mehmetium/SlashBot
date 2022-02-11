const { SlashCommandBuilder } = require('@discordjs/builders');
const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const ytpl = require('ytpl');
const { getPreview, getTracks } = require('spotify-url-info');

let serverPlayer = {};
function playing() {
  const stream = ytdl(serverPlayer.queue[0].url, { filter: 'audioonly', type: 'opus' });
  const source = createAudioResource(stream);
  serverPlayer.player.play(source);
  const conc = serverPlayer.connection;
  conc.subscribe(serverPlayer.player);

  return 0;
}
function outputter(interaction, playlist, spotify, spotList) {
  if (playlist != null) {
    if (serverPlayer.player.state.status !== 'playing' && serverPlayer.player.state.status !== 'paused') {
      playing();
      return interaction.editReply(`Playlist ${playlist.title} now playing`);
    }
    return interaction.editReply(`Playlist ${playlist.title} has been added to queue.`);
  }
  if (spotList != null) {
    if (serverPlayer.player.state.status !== 'playing' && serverPlayer.player.state.status !== 'paused') {
      playing();
      return interaction.editReply(`Playlist ${spotList} now playing`);
    }
    return interaction.editReply(`Playlist ${spotList} has been added to queue.`);
  }

  if (serverPlayer.queue.length < 2) {
    playing();
    if (spotify == null) return interaction.editReply(`${serverPlayer.queue[0].url} now playing`);
    return interaction.editReply(`${spotify.link} now playing`);
  }
  if (spotify == null) return interaction.editReply(`${serverPlayer.queue[serverPlayer.queue.length - 1].url} has been added to queue.`);
  return interaction.editReply(`${spotify.link} has been added to queue.`);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song')
    .addStringOption((option) => option.setName('song').setDescription('Search song name or URL').setRequired(true)),
  async execute(interaction) {
    const serverQueue = interaction.client.queue.get(interaction.guildId);
    let input = interaction.options.getString('song');

    if (!interaction.member.voice.channel) {
      return interaction.reply('Please join a voice channel.');
    }
    interaction.reply('Processing');
    if (!serverQueue) {
      serverPlayer = {
        // eslint-disable-next-line no-undef
        player: player = createAudioPlayer(),
        queue: [],
        connection: joinVoiceChannel({
          channelId: interaction.member.voice.channelId,
          guildId: interaction.guildId,
          adapterCreator: interaction.guild.voiceAdapterCreator,
        }),
      };

      serverPlayer.player.on('stateChange', () => {
        if (serverPlayer.player.state.status === 'idle') {
          console.log('song ended');
          serverPlayer.queue.shift();
          if (serverPlayer.queue.length === 0) {
            serverPlayer.connection.destroy();
            serverPlayer.connection = null;
          } else { playing(); }
        }
      });
    } else if (!serverPlayer.connection) {
      serverPlayer.connection = joinVoiceChannel({
        channelId: interaction.member.voice.channelId,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });
    }
    if (input.includes('&list=')) {
      const playlist = await ytpl(input, { limit: Infinity });
      playlist.items.forEach((element) => {
        const song = {
          title: element.title,
          url: element.shortUrl,
        };
        serverPlayer.queue.push(song);
      });
      outputter(interaction, playlist);
    } else if (input.includes('https://open.spotify.com/playlist') || input.includes('https://open.spotify.com/album')) {
      const promisesToAwait = [];
      await getTracks(input).then((tracks) => {
        tracks.forEach(async (element) => {
          promisesToAwait.push(ytsr(`${element.artists[0].name} ${element.name}`, { limit: 1 }));
        });
      });
      const respons = await Promise.all(promisesToAwait);
      respons.forEach((element) => {
        const song = {
          title: element.items[0].title,
          url: element.items[0].url,
        };
        serverPlayer.queue.push(song);
      });
      outputter(interaction, null, null, input);
    } else {
      let result;
      let spotifyTrack = null;
      if (input.includes('https://open.spotify.com/track')) {
        spotifyTrack = await getPreview(input);
        result = await ytsr(`${spotifyTrack.artist} ${spotifyTrack.title}`, { limit: 1 });
      } else {
        // eslint-disable-next-line no-useless-escape
        input = input.replace(/\&ab_channel(.*)/, '');
        result = await ytsr(input, { limit: 1 });
      }
      const song = {
        title: result.items[0].title,
        url: result.items[0].url,
      };
      serverPlayer.queue.push(song);
      outputter(interaction, null, spotifyTrack);
    }

    interaction.client.queue.set(interaction.guildId, serverPlayer);
    return 0;
  },
};
