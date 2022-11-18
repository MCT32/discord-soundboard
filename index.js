const { Client, Events, GatewayIntentBits } = require('discord.js')
const { TOKEN } = require('dotenv').config()


const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once(Events.ClientReady, c => {
  console.log(`Logged in as ${c.user.tag}`)
})

client.login(TOKEN)
