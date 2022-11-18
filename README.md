# discord-soundboard
 Allows users to play sounds in a voice channel.

## Configuration

### .env
Create a file in the root folder called ".env". Inside this file, simple put `TOKEN=<Discord bot token here>`.

### sounds.json
Create another file in the root directory called "sounds.json". Inside the file, put a json object with a list of sound names and directories. These directories can be absolute or relative. Heres a sample: (sounds folder is not required, but a good way to organise your sounds)
```json
{
 "Vine Boom": "sounds/vineboom.mp3",
 "Roblox Oof": "sounds/robloxoof.mp3",
 "Fart Reverb": "reverbfart.mp3"
}
```

### Discord Bot Application
Make a discord bot through the developer portal. Create an invite and make sure it has permissions to join voice channels and speak.

## Usage
Use the `/join` command to make the bot join a voice channel. Then use `/sounds` to display the soundboard. Use `/leave` to make the bot leave the server. You dont need to be in the voice channel for the bot to join, making it excelent for a little trolling. 😉
