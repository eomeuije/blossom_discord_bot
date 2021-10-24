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

module.exports = getConnectionIndex;