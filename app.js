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
		console.log(`Uptime monitor request received from ${
			req.socket.remoteAddress === '::1' || req.socket.remoteAddress === '::ffff:127.0.0.1' || req.socket.remoteAddress === '127.0.0.1' ? req.headers['x-forwarded-for'] : req.socket.remoteAddress
		}`);
	});
});




client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
			try {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			} catch (err) {
				// if reply failed due to deffered response, try editting the deffered response
				try { await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true }); } catch (e) {
					console.error(e);
					// if all else fails, log the error
				}
			}
		
	}
});

client.login(BOT_TOKEN);

// arrival.line_name,
//`Destination: ${arrival.destination}\nEstimated Arrival: ${arrival.estimated_arrival}`,
// false