import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import path from 'path';

const { CLIENT_TOKEN, CLIENT_ID } = process.env;

export default async function deploy() {
  if (!CLIENT_TOKEN || !CLIENT_ID) {
    throw new Error('BOT_TOKEN and CLIENT_ID must be set in environment variables');
  }

  const commands: SlashCommandBuilder[] = [];
  const cmdsPath = path.join(__dirname, '../commands');
  const cmdDirs = fs.readdirSync(cmdsPath) // each folder in "commands" is a commands directory - each containing a file for it
  console.log(`Checking for command directories in ${cmdsPath}...`);
  console.log(`Directory content: ${cmdDirs.join(', ')}`);
  for (const folder of cmdDirs) {
    const dirPath = path.join(cmdsPath, folder);
    if (!fs.statSync(dirPath).isDirectory()) {
      console.log(`Skipping ${dirPath} as it is not a directory.`);
      continue;
    }
    const commandFiles = fs.readdirSync(dirPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    if (commandFiles.length === 0) {
      console.log(`No command files found in ${dirPath}.`);
      continue;
    }
    if (commandFiles.length > 0) {
      console.log(`Found ${commandFiles.length} command file(s) in ${dirPath}.`);
      // prioritise .ts over .js if both exist
      const tsFile = commandFiles.find(file => file.endsWith('.ts'));
      const jsFile = commandFiles.find(file => file.endsWith('.js'));
      const chosenFile = tsFile || jsFile;
      if (chosenFile) {
        const command = require(path.join(dirPath, chosenFile));
        if (command.data && command.execute) {
          commands.push(command.data);
        } else {
          console.log(`Command in file ${chosenFile} is missing valid data or execute properties - skipping.`);
        }
      } else {
        console.log(`No valid .ts or .js command file found in ${dirPath}.`);
      }
      continue;
    }
  }
  console.log(`Found ${commands.length} commands to deploy.`);
  if (commands.length === 0) {

    console.warn('No valid commands found to deploy.');
    return;
  }
  const rest = new REST({ version: '10' }).setToken(CLIENT_TOKEN);

  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands
    });
    console.log(`Successfully refreshed ${commands.length} application (/) commands.`);
    console.warn('Command updates will not propagate immediately to currently active clients.');
  } catch (error) {
    console.error('Error deploying commands:', error);
  }
}