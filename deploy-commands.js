const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('무야호').setDescription('무야호를 외칩니다.'),
	new SlashCommandBuilder().setName('서버').setDescription('서버 정보를 알려줍니다.'),
	new SlashCommandBuilder().setName('내정보').setDescription('내 디코 정보를 알려줍니다.'),
]
	.map(command => command.toJSON());
	
const rest = new REST({ version: '9' }).setToken(token);
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);