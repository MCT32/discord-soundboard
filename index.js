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
          replyAndDelete('Please select a voice channel.', interaction, 3000)
          return
        }

        connection = joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
          selfDeaf: false
        })

        replyAndDelete('Joined!', interaction, 3000)
      }

      if (interaction.commandName === 'leave') {
        if (connection == undefined || connection._state.status === 'destroyed') {
          replyAndDelete('Not in a voice channel.', interaction, 3000)
          return
        }

        connection.disconnect()
        connection.destroy()

        replyAndDelete('Bye!', interaction, 3000)
      }

      if (interaction.commandName === 'sounds') {
        const embed = new EmbedBuilder()
          .setTitle('Soundboard')
          .setDescription('Click a button to play a sound!')

        var rows = [
          new ActionRowBuilder()
        ]

        var buttonCount = 0

        for (k in sounds) {
          if (buttonCount < 5) {
            rows[rows.length - 1].addComponents(
              new ButtonBuilder()
                .setCustomId(k)
                .setLabel(k)
                .setStyle(ButtonStyle.Primary)
            )

            buttonCount += 1
          } else {
            rows.push(new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId(k)
                .setLabel(k)
                .setStyle(ButtonStyle.Primary)
            ))

            buttonCount = 1
          }
        }

        console.log(rows)

        interaction.reply({ embeds: [embed], components: rows, emphemeral: true })
      }
    }

    if (interaction.isButton()) {
      if (sounds[interaction.customId] == undefined) {
        replyAndDelete('That sound no longer exists.', interaction, 3000)
        return
      }

      const audio = createAudioResource(sounds[interaction.customId])
      audioPlayer.play(audio)
      connection.subscribe(audioPlayer)

      replyAndDelete(`Playing ${interaction.customId}!`, interaction, 3000)
    }
  })
})

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

async function replyAndDelete(response, interaction, time) {
  interaction.reply({ content: response, emphemeral: true })
  await delay(time)
  interaction.deleteReply()
}

client.login(process.env.TOKEN)
