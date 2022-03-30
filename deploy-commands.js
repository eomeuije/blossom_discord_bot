const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('무야호').setDescription('무야호를 외칩니다.'),
	new SlashCommandBuilder().setName('서버').setDescription('서버 정보를 알려줍니다.'),
	new SlashCommandBuilder().setName('내정보').setDescription('내 디코 정보를 알려줍니다.'),
	new SlashCommandBuilder().setName('가챠').setDescription('가챠')
	.addIntegerOption(option => option.setName('종류').setDescription(`어떤 가챠를 하시겠습니까?
1 = 이건 못 참지 상자
2 = 알파몬x왕룡검
3 = 미네르바몬x`))
	.addIntegerOption(option => option.setName('개수').setDescription('가챠 개수를 알려주세요.')),

	new SlashCommandBuilder().setName('play').setDescription('유튜브 비디오를 음성 재생합니다. Play youtube video audio only')
	.addStringOption(option => option.setName('key').setDescription('유튜브(검색어, 링크, 플레이리스트 링크) youtube(search key, video link, play list link)')),
	new SlashCommandBuilder().setName('skip').setDescription('start부터 count 수 만큼 스킵합니다. Skip Start to Sount')
	.addIntegerOption(option => option.setName('start').setDescription('입력 값부터 스킵합니다.(기본 1) start number to skip (default: 1)'))
	.addIntegerOption(option => option.setName('count').setDescription('스킵할 개수를 지정합니다.(기본 1개) how much skip (default: 1)')),
	new SlashCommandBuilder().setName('git').setDescription('본 디코봇 소스코드가 저장되어 있습니다. github this bot'),
	new SlashCommandBuilder().setName('getout').setDescription('봇을 음성 채널에서 내보냅니다. Get out this bot'),
	new SlashCommandBuilder().setName('shuffle').setDescription('플레이 리스트를 섞습니다. Shuffle play list'),
	new SlashCommandBuilder().setName('loop').setDescription('유튜브 비디오를 반복 모드로 음성 재생합니다. Play loop mode youtube video audio only')
	.addStringOption(option => option.setName('key').setDescription('유튜브(검색어, 링크, 플레이리스트 링크) youtube(search key, video link, play list link)')),
	new SlashCommandBuilder().setName('current').setDescription('현재 재생중인 음악 정보를 보여줍니다. Shows the currently playing music information.'),
]
	.map(command => command.toJSON());
	
const rest = new REST({ version: '9' }).setToken(token);
guildId.forEach(gId => {
	rest.put(Routes.applicationGuildCommands(clientId, gId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
})
