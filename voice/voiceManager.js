const {
    AudioPlayerStatus,
} = require('@discordjs/voice');


const play = async (cntPlayQ, cntIndex) => {
    try {
        const playerObj = cntPlayQ[cntIndex].playerObjArray[0];
        const player = await createPlayer();
        const stream = await createStream(playerObj.url);
        const resource = createAudioResource(stream, { 
            inputType: StreamType.Arbitrary 
        });
        console.log(cntPlayQ[cntIndex].playerObjArray.length);  
        // cntPlayQ[cntIndex].playerObjArray[0].resource = resource;
        // cntPlayQ[cntIndex].playerObjArray[0].player = player;
        // const playerObj = cntPlayQ[cntIndex].playerObjArray[0];

        cntPlayQ[cntIndex].connection.subscribe(player);
        player.play(resource);
        player.on(AudioPlayerStatus.Buffering, async () => {
            console.log('Buffering');
        })
        player.on(AudioPlayerStatus.Idle, async () => {
            await nextPlayer(cntPlayQ, cntIndex);
        });
        player.on('error', async (error) => {
            console.log(error);
            await errorPlay(cntPlayQ, cntIndex);
        });
    } catch (error) {
        console.log(error);
        await nextPlayer(cntPlayQ, cntIndex);
    }
} 

async function errorPlay(cntPlayQ, cntIndex){
    console.log('play_error');
    
    // // cntPlayQ[cntIndex].connection.removeAllListeners();
    // const errorStream = await createStream(playerObj.url, errorDate - playerObj.startDate);
    // const errorResource = createAudioResource(errorStream, { inputType: StreamType.Arbitrary });
    // playerObj.resource = errorResource;
    // playerObj.errorDate = errorDate;
    // await play(cntPlayQ, cntIndex, playerObj);
    // nextPlayer(cntPlayQ, cntIndex);
}

async function nextPlayer(cntPlayQ, cntIndex){
    if(cntPlayQ[cntIndex].playMode === 'loop'){
        cntPlayQ[cntIndex].playerObjArray.push(cntPlayQ[cntIndex].playerObjArray[0])
    }
    cntPlayQ[cntIndex].playerObjArray.shift();
    if(cntPlayQ[cntIndex].playerObjArray.length === 0) {
        cntPlayQ[cntIndex].connection.destroy(); 
        cntPlayQ.splice(cntIndex, 1);
        return;
    }
    await play(cntPlayQ, cntIndex);
}

function getConnectionIndex(cntPlayQ, channelId, guildId){
    if(cntPlayQ.length === 0){           //empty
        return -1;
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

async function createVoiceConnection(voiceChannelId, guildId, voiceAdapterCreator){
    const connection = joinVoiceChannel({
        channelId: voiceChannelId,
        guildId: guildId,
        adapterCreator: voiceAdapterCreator,
    });
    return connection;
}
const {
    StreamType,
    createAudioPlayer,
    createAudioResource,
    NoSubscriberBehavior,
} = require('@discordjs/voice');

const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

const videoFinder = async (query) => {
    const videoResult = await ytSearch(query);
    return (videoResult.videos.length > 1) ? videoResult : null;
};

async function createStream(url){
    const stream = ytdl(url, { 
        filter: 'audioonly',
        liveBuffer: 30000,
        highWaterMark:100*1024*1024
    });
    stream.on('error', (error) => console.log(error));
    stream.on('end', () => console.log('session_end'));
    return stream;
}

async function createPlayer(){
    const player = createAudioPlayer({
	    behaviors: {
		    noSubscriber: NoSubscriberBehavior.Pause,
	    },
    });
    return player;
}

// at the top of your file
const { MessageEmbed } = require('discord.js');



async function createPlayEmbed(video){

    // inside a command, event listener, etc.
    const playEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(video.title)
        .setURL(video.url)
        .setAuthor({ name: video.author.name, url: video.author.url })
        .setDescription(video.description)
        .setThumbnail(video.thumbnail)
        .setImage(video.image)
        .setTimestamp(new Date())
        .addFields(
            { name: '길이', value: video.duration.timestamp, inline: true },
            { name: '조회수', value: video.views.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","), inline: true },
            { name: '게시일', value: video.ago, inline: true,  },
        );
        
    return playEmbed;
}

async function createPlayListEmbed(pl){

    const playListEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setURL(pl.url)
        .setTitle(pl.title)
        .setDescription(pl.description)
        .setImage(pl.bestThumbnail.url)
        .setAuthor({ name: pl.author.name, url: pl.author.url, iconURL: pl.author.bestAvatar.url })
        .setThumbnail(pl.bestThumbnail.url)
        .setTimestamp(new Date())
        .addFields(
            { name: '개수', value: pl.estimatedItemCount.toString(), inline: true },
            { name: '조회수', value: pl.views.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","), inline: true },
            { name: '마지막 업데이트', value: pl.lastUpdated, inline: true },
        );
    
    return playListEmbed;
}

async function mainPlayer(cntPlayQ, voiceChannel, interaction, what, mode){
    let cntIndex;
    const playHead = async (videoTitle, url) => {
        if(cntPlayQ[cntIndex].playerObjArray.length === 0){  //play music
            await interaction.editReply(`"${videoTitle}"를 재생합니다.`);
        }else{
            await interaction.editReply(`"${videoTitle}"를 플레이 리스트에 넣었습니다.`);
        }
        const playerObj = { 
            videoTitle:videoTitle, 
            url:url
        };
        cntPlayQ[cntIndex].playerObjArray.push(playerObj);
        if(cntPlayQ[cntIndex].playerObjArray.length === 1){  //play music
            await play(cntPlayQ, cntIndex);
        }
    }

    const createConnection = async () => {
        const connection = await createVoiceConnection(voiceChannel.id, interaction.guildId, interaction.guild.voiceAdapterCreator);
        cntPlayQ.push({
            connection:connection,
            playMode:mode,
            playerObjArray:[] 
        });
        connection.on('stateChange', async (oldState, newState) => {
            if(oldState.status === 'ready' && newState.status === 'disconnected'){
                cntPlayQ[cntIndex].connection.destroy();
		        cntPlayQ.splice(cntIndex, 1);
            }
        })
        return cntPlayQ.length - 1;
    };
    const video = await videoFinder(what);
    if(!video){              //video is not found
        const ytpl = require('ytpl');

        const playlist = async (query) => {
            try{
                const pl = await ytpl(query);
                return (pl.items.length > 1) ? pl : null;
            }catch{
                return null;
            }
        };
        const pl = await playlist(what);
        if(pl === null){
            await interaction.editReply(`Video Not Found`);
            return;
        }
        interaction.editReply({ 
            embeds: [await createPlayListEmbed(pl)] 
        });
        cntIndex = getConnectionIndex(cntPlayQ, voiceChannel.id, interaction.guildId);
        if(cntIndex === -1){
            cntIndex = await createConnection();
		}
        pl.items.forEach(async ele => {
            await playHead(ele.title, ele.shortUrl);
        });
        interaction.editReply(`"${pl.items[0].title}"등 ${pl.items.length}개 음악을 플레이 리스트에 넣었습니다.`);
    }else{
        cntIndex = getConnectionIndex(cntPlayQ, voiceChannel.id, interaction.guildId);

        if(cntIndex === -1){
			cntIndex = await createConnection();
		}
        interaction.editReply({ 
            embeds: [await createPlayEmbed(video.videos[0])] 
        });
        playHead(video.videos[0].title, video.videos[0].url);
    }
}



module.exports = { createVoiceConnection, getConnectionIndex, mainPlayer, nextPlayer, videoFinder, createPlayEmbed };