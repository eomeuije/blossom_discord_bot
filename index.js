// Require the necessary discord.js classes
const { randomInt } = require('crypto');
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
// play command tools
let connection, play_queue = [];

// Create a new client instance
const client = new Client ({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity('/(명령어)', { type: 'PLAYING' })
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
	else if (commandName === '내정보') {
		await interaction.reply(`닉네임: ${interaction.member.nickname}
태그: ${interaction.user.tag}
서버 참여 날짜: ${interaction.member.joinedAt}
계정 생성 날짜: ${interaction.user.createdAt}`);
	
	}else if(commandName === 'play' || commandName === 'skip') {
		await interaction.reply('명령어 실행중..');
		const ytdl = require('ytdl-core');
		const {
			AudioPlayerStatus,
			StreamType,
			createAudioPlayer,
			createAudioResource,
			joinVoiceChannel,
		} = require('@discordjs/voice');
		const ytSearch = require('yt-search');

		function play_q_ctrl(need_shift) {
			if(need_shift) play_queue.shift();
			if(play_queue.length === 0) {connection.destroy(); return;}
			const player_this = play_queue[0].player;
			player_this.play(play_queue[0].src);
			connection.subscribe(player_this);
			player_this.on(AudioPlayerStatus.Idle, () => play_q_ctrl(true));
			player_this.on('error', () => {console.log('play_error')});
		}

		const client_voice_channel = interaction.member.voice.channel;
		
		if(!client_voice_channel)
		{
			await interaction.reply('음성 채널에 입장해 주세요.');
			return;
		}
		if(connection && connection.id && client_voice_channel.id != connection.id)
		{
			await interaction.reply('다른 채널에서 이용중입니다.');
			return;
		}
		
		if(commandName === 'skip')
		{
			if(!connection){
				return;	
			}
			connection.removeAllListeners();
			play_q_ctrl(true);
			await interaction.reply('스킵 완료.');
			return;
		}

		//-----------

		const what = interaction.options.getString('key');
		if(!what)
		{
			await interaction.editReply('키를 입력해주세요.');
			return;
		}
		const videoFinder = async (query) => {
			const videoResult = await ytSearch(query);
			return (videoResult.videos.length > 1) ? videoResult : null; 
		}
		
		const video = await videoFinder(what);
		if(video){
			stream = ytdl(video.all[0].url, {filter: 'audioonly'});
		}
		else {
			await interaction.reply('링크 검색 결과가 없습니다.');
			return;
		}
		if(video.all[0].seconds > 18000)
		{
			await interaction.reply(`영상이 너무 길어 플레이 리스트에 추가되지 않았습니다.(5시간 초과)`);
			return;
		}
		
		const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
		
		//-----------

		const guild = client.guilds.cache.get(interaction.guildId);
		const member = guild.members.cache.get(interaction.member.user.id);
		const voiceChannel = member.voice.channel;
		
		connection = joinVoiceChannel({
		channelId: voiceChannel.id,
		guildId: interaction.guildId,
		adapterCreator: interaction.guild.voiceAdapterCreator,
		});
		//-----------------------------------------------------------------------------------------------
		//radio start
		const { NoSubscriberBehavior } = require('@discordjs/voice');

		const player = createAudioPlayer({
			
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Pause,
			},
		});
		if(play_queue.length !== 0)
		{
			play_queue.push({ 'player': player, 'src':resource});
			await interaction.editReply(`"${video.all[0].title}"를 플레이 리스트에 넣었습니다.`);
			return;
		}
		play_queue.push({ 'player': player, 'src': resource });
		play_q_ctrl(false);

		// Subscribe the connection to the audio player (will play audio on the voice connection)
		//const subscription = connection.subscribe(player);

		// subscription could be undefined if the connection is destroyed!
		// if (subscription) {
		// 	// Unsubscribe after 5 seconds (stop playing audio on the voice connection)
		// 	setTimeout(() => subscription.unsubscribe(), 5_000);
		// }
		await interaction.editReply(`"${video.all[0].title}"를 재생합니다.`);
		//-----------------------------------------------------------------------------------------------
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
		str += '\n\n\n결과:\n';

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