const { Client, Events, GatewayIntentBits, ApplicationCommandOptionType, ApplicationCommandType, ChannelType, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js')
const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource } = require('@discordjs/voice')
require('dotenv').config()

const sounds = require('./sounds.json')

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] })

const audioPlayer = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Pause
  }
})

var connection

client.once(Events.ClientReady, c => {
  console.log(`Logged in as ${c.user.tag}`)

  client.application.commands.create({
    'name': 'join',
    'description': 'Join a Voice Channel.',
    'options': [
      {
        'name': 'channel',
        'description': 'Which channel the bot should join.',
        'type': ApplicationCommandOptionType.Channel,
        'required': true
      }
    ]
  })

  client.application.commands.create({
    'name': 'leave',
    'description': 'Leave the Voice Channel.'
  })

  client.application.commands.create({
    'name': 'sounds',
    'description': 'List playable sounds.'
  })

  client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === 'join') {
        const channel = await interaction.options.getChannel('channel')

        if (channel.type != ChannelType.GuildVoice) {
          interaction.reply({ content: 'Please select a voice channel.', emphemeral: true })
          return
        }

        connection = joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
          selfDeaf: false
        })

        await interaction.reply({ content: `Joined!`, emphemeral: true })
      }

      if (interaction.commandName === 'leave') {
        connection.disconnect()
        connection.destroy()

        await interaction.reply({ content: `Bye!`, emphemeral: true })
      }

      if (interaction.commandName === 'sounds') {
        const embed = new EmbedBuilder()
          .setTitle('Soundboard')
          .setDescription('Click a button to play a sound!')

        const row = new ActionRowBuilder()

        for (k in sounds) {
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(k)
              .setLabel(k)
              .setStyle(ButtonStyle.Primary)
          )
        }

        await interaction.reply({ embeds: [embed], components: [row], emphemeral: true })
      }
    }

    if (interaction.isButton()) {
      const audio = createAudioResource(sounds[interaction.customId])
      audioPlayer.play(audio)
      connection.subscribe(audioPlayer)
    }
  })
})

client.login(process.env.TOKEN)
