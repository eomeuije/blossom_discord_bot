const {
    StreamType,
    createAudioPlayer,
    createAudioResource,
} = require('@discordjs/voice');

const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { NoSubscriberBehavior } = require('@discordjs/voice');

async function createPlayer(what, interaction){
    const videoFinder = async (query) => {
        const videoResult = await ytSearch(query);
        return (videoResult.videos.length > 1) ? videoResult : null;
    };
    const video = await videoFinder(what);
    const this_video = video.all[0];
    if (video) {
        stream = ytdl(this_video.url, { filter: 'audioonly' });
    }
    else {
        interaction.editReply('링크 검색 결과가 없습니다.');
        return;
    }
    if (video.all[0].seconds > 18000) {
        interaction.editReply(`영상이 너무 길어 플레이 리스트에 추가되지 않았습니다.(5시간 초과)`);
        return;
    }
    const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
    const player = createAudioPlayer({
	    behaviors: {
		    noSubscriber: NoSubscriberBehavior.Pause,
	    },
    });
    return { resource:resource, player:player, videoTitle:this_video.title };
}



module.exports = createPlayer;