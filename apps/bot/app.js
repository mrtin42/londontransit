require('dotenv').config(); //This will be used to store private keys
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const deployCommands = require('./deploy/deployCommands.js');
const { Client, ActivityType, Collection, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const http = require('http');
const { PrismaClient } = require('@prisma/client');

const BOT_TOKEN = process.env.CLIENT_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const db = new PrismaClient();

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// just putting this here so it forces me into the DB
db.user.create({
	data: {
		discordId: '488061232461381643',
		lines: {
			create: {
				name: 'bakerloo'
			}
		}
	}
});

const statusPoller = async () => {
	const d = new Date();
	console.log(`Polling status at ${d.toISOString()}`);

	const lines = axios.get(`https://api.tfl.gov.uk/Line/Mode/tube/Status?app_key=${process.env.TFL_APP_KEY}`).then(async (response) => {
		for (const line of response.data) {
			const lineName = line.name;
			const status = line.lineStatuses[0].statusSeverity;
			const prevStatus = db.lines.findFirst({
				where: {
					name: lineName
				}
			});
			if (prevStatus.statusCode !== status) {
				const statusDesc = line.lineStatuses[0].statusSeverityDescription;
				const embed = new EmbedBuilder()
					.setColor(status === 10 ? '#00FF00' : '#FF0000')
					.setTitle(`Status of the ${lineName} line has changed`)
					.setDescription(statusDesc);
				// trigger a message to be sent to registered users
				const users = await db.user.findMany({
					where: {
						notifications: {
							has: 'bakerloo'
						}
					}
				});
				console.log(`users: ${users}`);
				for (const user of users) {
					client.users.fetch(user.discordId).then(u => {
						console.log(`Sending message to ${u.username}`);
						u.send(`⚠️ The status of the ${lineName} line has changed`, { embeds: [embed] });
					});
				}
				// update the status in the database
				db.lines.update({
					where: {
						name: lineName
					},
					data: {
						statusCode: status
					}
				});
			}
		}
	});
}

// Poll the status of the tube lines every minute
setInterval(statusPoller, 60000);
statusPoller();

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
		if (interaction.isChatInputCommand()) await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(BOT_TOKEN);

// arrival.line_name,
//`Destination: ${arrival.destination}\nEstimated Arrival: ${arrival.estimated_arrival}`,
// false