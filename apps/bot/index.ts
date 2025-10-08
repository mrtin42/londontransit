import 'dotenv/config';
import { ActivityType, Client, Collection, Events, GatewayIntentBits, AutocompleteInteraction, CommandInteraction, MessageFlags } from 'discord.js';
import chalk from 'chalk';
import axios from 'axios';
import path from 'path';
import http from 'http';
import fs from 'fs';
import deploy from './deploy';
import { Dub } from 'dub';
import { networkStatusButtonHandler } from './commands/status/network/buttons';

interface ExtendedClient extends Client {
  commands: Collection<string, { data: { name: string }, execute: (interaction: CommandInteraction | AutocompleteInteraction) => Promise<void>, autocomplete?: (interaction: AutocompleteInteraction) => Promise<void> }>;
}

const { CLIENT_TOKEN } = process.env;

export const dub = new Dub();

const c = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const client: ExtendedClient = c as ExtendedClient;
client.commands = new Collection();

client.once(Events.ClientReady, () => {
  console.log(chalk.green(`LondonTransit online as ${client.user?.tag}`));
  client.user?.setActivity('the status updates', { type: ActivityType.Watching });
  const uptimeMonitor = http.createServer((req, res) => {
    console.log(chalk.blue(`Uptime monitor received request from ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
    }));
  });
  uptimeMonitor.listen(1863);
  console.log(chalk.blue('Uptime monitor is running on port 1863'));
});

for (const folder of fs.readdirSync(path.join(__dirname, 'commands'))) {
  const commandPath = path.join(__dirname, 'commands', folder);
  const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
  for (const file of commandFiles) {
    // const command = require(path.join(commandPath, file));
    const command = require(path.join(commandPath, file));
    if (command.data && command.execute) {
      (client as ExtendedClient).commands.set(command.data.name, command);
      console.log(chalk.blue(`Loaded command: ${command.data.name}`));
    } else {
      console.warn(chalk.yellow(`Command in file ${file} is missing data or execute properties - skipping.`));
    }
  }
}

deploy();
client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
        const command = (client as ExtendedClient).commands.get(interaction.commandName);
        if (!command) {
          console.warn(chalk.red(`Command ${interaction.commandName} not found.`));
          !interaction.isAutocomplete() && await interaction.reply({ content: 'This command is not supported.', ephemeral: true });
          return;
        }
      await command.execute(interaction);
    } else if (interaction.isAutocomplete()) {
        const command = (client as ExtendedClient).commands.get(interaction.commandName);
        if (!command) {
          console.warn(chalk.red(`Command ${interaction.commandName} not found.`));
          return await interaction.respond([]);
        }
      if (!command.autocomplete) {
        console.warn(chalk.yellow(`Command ${interaction.commandName} does not support autocomplete.`));
        await interaction.respond([]);
        return;
      }
      await command.autocomplete(interaction) as any;
    } else if (interaction.isButton()) {
      if (interaction.customId.startsWith('status-panel-')) {
        await networkStatusButtonHandler(interaction);
        return;
      } else {
        // i dont have many buttons so just handle them here for now.
        await interaction.reply({ content: 'Unknown button interaction. This should never happen, please contact developer.', flags: [MessageFlags.Ephemeral] });
        return;
      }
    }
  } catch (error) {
    console.error(chalk.red(`Error executing command:`), error);
    if (!interaction.isAutocomplete()) {
      try {
        await interaction.reply({ content: 'There was an error while executing this command.', flags: [MessageFlags.Ephemeral] });
      } catch (replyError) {
        if (replyError instanceof Error && replyError.message.includes('already been replied to')) {
          try {
            await interaction.editReply({ content: 'There was an error while executing this command.' });
          } catch (editError) {
            console.error(chalk.red('Also failed to edit reply:'), editError);
            try {
              await interaction.followUp({ content: 'There was an error while executing this command.', flags: [MessageFlags.Ephemeral] });
            } catch (followUpError) {
              console.error(chalk.red('are you fucking serious i give up: '), followUpError);
              return;
            }
          }
        } else {
          console.error(chalk.red('Failed to reply to interaction:'), replyError);
        }
      }
    }
  }
});

client.login(CLIENT_TOKEN).catch(error => {
  console.error(chalk.red('Failed to login to Discord: '), error);
  process.exit(1);
});

