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

module.exports = nextPlayer;