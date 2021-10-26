const {
    AudioPlayerStatus,
} = require('@discordjs/voice');

async function nextPlayer(cntPlayQ, cntIndex){
    cntPlayQ[cntIndex].playerObj.shift();
	if(cntPlayQ[cntIndex].playerObj.length === 0) {
		cntPlayQ[cntIndex].connection.destroy(); 
		cntPlayQ.splice(cntIndex, 1);
		return;
	}
	const player_tmp = cntPlayQ[cntIndex].playerObj[0].player;
	player_tmp.play(cntPlayQ[cntIndex].playerObj[0].resource);
	cntPlayQ[cntIndex].connection.subscribe(player_tmp);
    player_tmp.on(AudioPlayerStatus.Idle, () => nextPlayer(cntPlayQ, cntIndex));
	player_tmp.on('error', () => console.log('play_error'));
    return cntPlayQ;
}
function getConnectionIndex(cntPlayQ, channelId, guildId){
    if(cntPlayQ.length === -1){           //empty
        return-1;
    }
    for(let i=0;i<cntPlayQ.length;i++){	//connection is exist
		if(cntPlayQ[i].connection.joinConfig.channelId === channelId && cntPlayQ[i].connection.joinConfig.guildId === guildId){
			return i;
		}
	}
	return -1;							//connection is not exist
}
const {
    joinVoiceChannel,
} = require('@discordjs/voice');

function createVoiceConnection(voiceChannelId, guildId, AdapterCreator){
    const connection = joinVoiceChannel({
        channelId: voiceChannelId,
        guildId: guildId,
        adapterCreator: AdapterCreator,
    });
    return connection;
}
const {
    StreamType,
    createAudioPlayer,
    createAudioResource,
} = require('@discordjs/voice');

const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { NoSubscriberBehavior } = require('@discordjs/voice');

async function createPlayer(what){
    const videoFinder = async (query) => {
        const videoResult = await ytSearch(query);
        return (videoResult.videos.length > 1) ? videoResult : null;
    };
    const video = await videoFinder(what);
    if(!video){              //video is not found
        return null;
    }
    const this_video = video.all[0];
    if (this_video.seconds > 18000) {
        return -1;
    }
    stream = ytdl(this_video.url, { filter: 'audioonly' });
    const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
    const player = createAudioPlayer({
	    behaviors: {
		    noSubscriber: NoSubscriberBehavior.Pause,
	    },
    });
    return { resource:resource, player:player, videoTitle:this_video.title };
}

module.exports = { createVoiceConnection, getConnectionIndex, createPlayer, nextPlayer };