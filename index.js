// Require the necessary discord.js classes
const { randomInt } = require('crypto');
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity('/(명령어)', { type: 'PLAYING' })
});

const wait = require('util').promisify(setTimeout);

client.on('interactionCreate', async interaction => {
	//console.log(interaction);
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
	}else if (commandName === 'ping') {
		await interaction.reply('Pong!');
		await wait(2000);
		await interaction.editReply('Pong again!');
	}else if (commandName === '가챠') {
		const what = interaction.options.getInteger('종류');
		const count = interaction.options.getInteger('개수');
		if(!what | !count)
		{
			await interaction.reply(`종류나 개수가 입력되지 않았습니다. 탭이나 방향키를 이용해 입력해 주십시오.`);	
			return;
		}
		if(what == 1 && count > 50)
		{
			await interaction.reply(`1번 종류의 개수는 50개까지 허용합니다.`);	
			return;
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
				gachastr[i] = `${i+1}번째: < ${gachadet[o]} > `
				gacharesult[o - 1] += 1;
			}
		}
		if(what == 2){	// x항체는 결과만 출력
			for(var i=0;i<count;i++)
			{
				var o;
				var j;
				var st = parseInt(Math.random() * 10000);
				if(st < 100*(j=0.1))
					o = 1;
				else if(st < 100*(j+=99.9))
					o = 2;
				gacharesult[o - 1] += 1;
			}
		}
		if(what == 3){	// x항체는 결과만 출력
			for(var i=0;i<count;i++)
			{
				var o;
				var j;
				var st = parseInt(Math.random() * 10000);
				if(st < 100*(j=0.75))
					o = 1;
				else if(st < 100*(j+=99.25))
					o = 2;
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
		await interaction.reply(str);
	}
});

// Login to Discord with your client's token
client.login(token);