// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
// play command tools
let cntPlayQ = [];
// Create a new client instance
const client = new Client ({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity('/commands', { type: 'PLAYING' })
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === '무야호') {
		await interaction.reply(`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣴⣾⣿⣶⣶⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ 
		⠀⣀⠀⣤⠀⢀⡀⢀⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀ 
		⣶⢻⣧⣿⡀⣿⠇⢸⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⣾⡟⣿⡷⠀⠀⠀⠀⠀⠀⠀ 
		⠈⠳⣿⣾⣿⣿⠀⠈⢿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀ 
		⠀⠀⢿⣿⣿⣿⣤⡶⠺⣿⣿⣿⣿⣿⣿⣿⢄⣤⣼⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀ 
		⠀⢀⣼⣿⣿⣿⠟⠀⠀⠹⣿⣿⣿⣿⣿⣿⣎⠙⢿⣿⣿⣷⣤⣀⡀⠀⠀⠀⠀⠀ 
		⠀⢸⣿⣿⣿⡿⠀⠀⠀⣤⣿⣿⣿⣿⣿⣿⣿⣄⠈⢿⣿⣿⣿⣿⣿⣷⡀⠀⠀⠀ 
		⢀⣿⣿⣿⣿⣷⣀⣀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣾⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀ 
		⣿⣿⠛⠋⠉⠉⢻⣿⣿⣿⣿⡇⠀⠘⣿⣿⣿⣿⣿⣿⣿⠛⠻⢿⣿⣿⣿⣿⣷⣦ 
		⣿⣿⣧⠀⠿⠇⣰⣿⡟⠉⠉⢻⡆⠀⠟⠛⣿⣿⣿⣯⡉⢁⣀⣈⣉⣽⣿⣿⣿⣿ 
		⡿⠛⠛⠒⠚⠛⠉⢻⡇⠘⠃⢸⡇⠀⣤⣾⠋⢉⠻⠏⢹⠁⢤⠀⢉⡟⠉⡙⠏⣹ 
		⣿⣦⣶⣶⠀⣿⣿⣿⣿⣿⣿⣿⡇⠀⣀⣹⣶⣿⣷⠾⠿⠶⠀⠰⠾⢷⣾⣷⣶⣿ 
		⣿⣿⣿⣿⣇⣿⣿⣿⣿⣿⣿⣿⣇⣰⣿⣿⣿⣿⣿⣷⣤⣴⣶⣶⣦⣼⣿⣿⣿⣿ 
		`);
	}
	else if (commandName === '서버') {
		await interaction.reply(`서버 이름: ${interaction.guild.name}
총 인원수: ${interaction.guild.memberCount}
서버 생성 날짜: ${interaction.guild.createdAt}`);
	}
	else if (commandName === 'git') {
		await interaction.reply('https://github.com/eomeuije/blossom_discord_bot');
	}
	else if (commandName === '내정보') {
		await interaction.reply(`닉네임: ${interaction.member.nickname}
태그: ${interaction.user.tag}
서버 참여 날짜: ${interaction.member.joinedAt}
계정 생성 날짜: ${interaction.user.createdAt}`);
	
	}else if(commandName === 'play' || commandName === 'loop') {
		await interaction.reply('명령어 실행중..');
		const guild = client.guilds.cache.get(interaction.guildId);
		const member = guild.members.cache.get(interaction.member.user.id);
		const voiceChannel = member.voice.channel;

		//-----------

		const { 
			nextPlayer, 
			getConnectionIndex, 
			mainPlayer,
		} = require('./voice/voiceManager');

		if(voiceChannel.id === null){
			interaction.editReply('채널에 입장해주세요.');
			return;
		}
		cntIndex = getConnectionIndex(cntPlayQ, voiceChannel.id, interaction.guildId);
		if(cntIndex !== -1){
			cntPlayQ[cntIndex].playMode = commandName;
		}
		const what = interaction.options.getString('key');
		if(!what)
		{
			await interaction.editReply(`${commandName}모드로 변경되었습니다.`);
			return;
		}
		mainPlayer(cntPlayQ, voiceChannel, interaction, what, commandName);
	
	}else if(commandName === 'current') {
		const guild = client.guilds.cache.get(interaction.guildId);
		const member = guild.members.cache.get(interaction.member.user.id);
		const voiceChannel = member.voice.channel;

		//-----------

		const { 
			nextPlayer, 
			getConnectionIndex, 
			mainPlayer,
			videoFinder,
			createPlayEmbed,
		} = require('./voice/voiceManager');

		if(voiceChannel.id === null){
			interaction.editReply('채널에 입장해주세요.');
			return;
		}
		cntIndex = getConnectionIndex(cntPlayQ, voiceChannel.id, interaction.guildId);
		if(cntIndex === -1){
			interaction.reply('플레이 리스트가 없습니다.');
			return;
		}
		video = await videoFinder(cntPlayQ[cntIndex].playerObjArray[0].url);
		interaction.reply({ 
            embeds: [await createPlayEmbed(video.videos[0])] 
        });

	}else if(commandName === 'skip'){
		const guild = client.guilds.cache.get(interaction.guildId);
		const member = guild.members.cache.get(interaction.member.user.id);
		const voiceChannel = member.voice.channel;
		const {
			getConnectionIndex,
			nextPlayer,
		} = require('./voice/voiceManager');
		
		cntIndex = getConnectionIndex(cntPlayQ, voiceChannel.id, interaction.guildId);
		if(cntIndex === -1){
			await interaction.reply('플레이 리스트가 없습니다.');
			return;	
		}
		const playLength = cntPlayQ[cntIndex].playerObjArray.length;
		let skipStart = interaction.options.getInteger('시작');
		let skipCount = interaction.options.getInteger('개수');
		
		skipStart = (!skipStart && skipStart !== 0) ? 1: skipStart;
		skipStart = (skipStart > playLength) ? playLength : skipStart;
		skipCount = (!skipCount && skipCount !== 0) ? 1 : skipCount;
		skipCount = (skipCount > playLength - skipStart) ? playLength - skipStart + 1 : skipCount;
		if(skipStart === 0){
			await interaction.reply('플레이 리스트는 1부터 시작합니다.');
			return;
		}
		if(skipCount !== 0){
			if(skipStart === 1){
				if(skipCount !== 1){
					cntPlayQ[cntIndex].playerObjArray.splice(skipStart, skipCount - 1);
				}
				await cntPlayQ[cntIndex].connection.removeAllListeners();
				mode = cntPlayQ[cntIndex].playMode;
				cntPlayQ[cntIndex].playMode = 'play';
				await nextPlayer(cntPlayQ, cntIndex);
				cntPlayQ[cntIndex].playMode = mode;
			}else{
				cntPlayQ[cntIndex].playerObjArray.splice(skipStart - 1, skipCount);
			}	
		}
		await interaction.reply(`${skipCount}개 스킵되었습니다.`);
	
	}else if(commandName === 'getout'){
		const guild = client.guilds.cache.get(interaction.guildId);
		const member = guild.members.cache.get(interaction.member.user.id);
		const voiceChannel = member.voice.channel;
		const {
			getConnectionIndex,
			nextPlayer,
		} = require('./voice/voiceManager');

		
		cntIndex = getConnectionIndex(cntPlayQ, voiceChannel.id, interaction.guildId);

		if(cntIndex === -1){
			await interaction.reply('음성 채널에 연결되지 않았습니다.');
			return;	
		}
		cntPlayQ[cntIndex].connection.destroy();
		cntPlayQ.splice(cntIndex, 1);

		await interaction.reply(':sob:');
	}else if (commandName === 'shuffle') {
		const guild = client.guilds.cache.get(interaction.guildId);
		const member = guild.members.cache.get(interaction.member.user.id);
		const voiceChannel = member.voice.channel;
		const {
			getConnectionIndex,
			nextPlayer,
		} = require('./voice/voiceManager');

		
		
		cntIndex = getConnectionIndex(cntPlayQ, voiceChannel.id, interaction.guildId);
		if(cntIndex === -1){
			await interaction.reply('음성 채널에 연결되지 않았습니다.');
			return;	
		}
		cntTarget = cntPlayQ[cntIndex].playerObjArray.length - 1;
		for(let i = 0; i < cntTarget; i++){
			const random = Math.floor(Math.random() * (cntTarget - i)+ 1);
			cntPlayQ[cntIndex].playerObjArray.push(cntPlayQ[cntIndex].playerObjArray.splice(random, 1)[0]);
		}
		await interaction.reply('정상적으로 작동되었습니다.');
	}else if (commandName === '가챠') {
		const what = interaction.options.getInteger('종류');
		var count = interaction.options.getInteger('개수');
		var tooMuch;
		if(!what | !count)
		{
			await interaction.reply(`종류나 개수가 입력되지 않았습니다. 탭이나 방향키를 이용해 입력해 주십시오.`);	
			return;
		}
		
		if(count > 100000000)
		{
			tooMuch = 1;
			await interaction.reply(`개수가 너무 많아 자동으로 1억번만 시행합니다.`);
			count = 100000000;
		}

		var gacha = require('./data/gacha.json');
		var gachadet = gacha[`${what}`]
		if(!gachadet)
		{
			await interaction.reply(`해당 종류의 가챠가 없습니다.`);	
			return;
		}
		var gachastr = [];
		var gacharesult = [];
		var objcount = Object.keys(gachadet).length;
		for(var i=0;i<objcount;i++)
			gacharesult.push(0);
		if(what == 1){
			for(var i=0;i<count;i++)
			{
				var o;
				var j;
				var st = parseInt(Math.random() * 10000);
				if(st < 100*(j=0.5))
					o = 1;
				else if(st < 100*(j+=0.5))
					o = 2;
				else if(st < 100*(j+=5))
					o = 3;
				else if(st < 100*(j+=9))
					o = 4;
				else if(st < 100*(j+=15))
					o = 5;
				else if(st < 100*(j+=17))
					o = 6;
				else if(st < 100*(j+=17))
					o = 7;
				else if(st < 100*(j+=18))
					o = 8;
				else if(st < 100*(j+=18))
					o = 9;
				if(count<50)gachastr[i] = `${i+1}번째: < ${gachadet[o]} > `;
				gacharesult[o - 1] += 1;
			}
		}
		if(what == 2){
			for(var i=0;i<count;i++)
			{
				var o;
				var j;
				var st = parseInt(Math.random() * 10000);
				if(st < 100*(j=0.1))
					o = 1;
				else if(st < 100*(j+=99.9))
					o = 2;
				if(count<50)gachastr[i] = `${i+1}번째: < ${gachadet[o]} > `;
				gacharesult[o - 1] += 1;
			}
		}
		if(what == 3){
			for(var i=0;i<count;i++)
			{
				var o;
				var j;
				var st = parseInt(Math.random() * 10000);
				if(st < 100*(j=0.75))
					o = 1;
				else if(st < 100*(j+=99.25))
					o = 2;
				if(count<50)gachastr[i] = `${i+1}번째: < ${gachadet[o]} > `;
				gacharesult[o - 1] += 1;
			}
		}
		var str = "";
		for(var i=0;i<gachastr.length;i++)
		{
			if(i != 0 && i % 2 == 0)
				str += '\n';
				
			str += gachastr[i];
			for(var s=gachastr[i].length;s<27;s++)
				if(i % 2 == 0)
					str += '　';
		}
		str += `\n\n\n결과:\n총 개수: ${count}개\n`;

		for(var i=0;i<objcount;i++)
		{
			str += `${gachadet[i+1]}	${gacharesult[i]}개\n`
		}
		if(tooMuch)
		{
			interaction.editReply(str);
			return;
		}
		await interaction.reply(str);
	}
});

// Login to Discord with your client's token
client.login(token);