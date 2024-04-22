require('dotenv').config(); //This will be used to store private keys
const path = require('path');
const fs = require('fs');
const deployCommands = require('./deploy/deployCommands');
const { Client, ActivityType, Collection, Events, GatewayIntentBits, REST, Routes } = require('discord.js');
const http = require('http');

const BOT_TOKEN = process.env.CLIENT_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);


for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

//Register our commands
deployCommands();


client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
	client.user.setActivity('the api', { type: ActivityType.Listening });
	const uptimeMonitor = http.createServer((req, res) => {
		res.appendHeader('Content-Type', 'application/json');
		res.writeHead(200);
		res.end(JSON.stringify({ status: 'ok' }));
	} /* betterstack will monitor this endpoint - if it doesnt respond, the server is down and i'll get an alert */);
	uptimeMonitor.listen(1863); // neat reference to the year the London Underground began operation
	console.log('Uptime monitor started');
	// log when uptime monitor endpoint is hit
	uptimeMonitor.on('request', (req, res) => {
		const d = new Date();
		console.log(`Uptime monitor request received from ${req.headers['X-Forwarded-For'] ? `IP ${req.headers['X-Forwarded-For']} (via proxy)` : `IP ${req.socket.remoteAddress}`} at ${d.toISOString()}`);
	});
});




client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		if (interaction.isChatInputCommand()) {
			await command.execute(interaction);
		} else if (interaction.isAutocomplete()) { 
			await command.autocomplete(interaction);
		} else {
			console.error('An interaction was received that was not a command or autocomplete.');
		}
	} catch (error) {
		console.error(error);
		if (interaction.isChatInputCommand()) await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(BOT_TOKEN);

// arrival.line_name,
//`Destination: ${arrival.destination}\nEstimated Arrival: ${arrival.estimated_arrival}`,
// false