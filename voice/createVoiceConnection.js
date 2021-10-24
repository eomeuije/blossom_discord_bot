const {
    joinVoiceChannel,
} = require('@discordjs/voice');

function CreateConnection(voiceChannelId, guildId, AdapterCreator){
    const connection = joinVoiceChannel({
        channelId: voiceChannelId,
        guildId: guildId,
        adapterCreator: AdapterCreator,
    });
    return connection;
}

module.exports = CreateConnection;