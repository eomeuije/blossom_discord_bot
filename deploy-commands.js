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

	new SlashCommandBuilder().setName('play').setDescription('링크 또는 키를 재생합니다.')
	.addStringOption(option => option.setName('key').setDescription('링크 또는 키를 알려주세요.')),
	new SlashCommandBuilder().setName('skip').setDescription('현재 재생중인 음악을 스킵합니다.'),
	new SlashCommandBuilder().setName('git').setDescription('본 디코봇 소스코드가 저장되어 있습니다.'),
]
	.map(command => command.toJSON());
	
const rest = new REST({ version: '9' }).setToken(token);
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);