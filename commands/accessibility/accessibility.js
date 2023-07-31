const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('accessiblity')
        .setDescription('gets accessiblity information ')
        .addStringOption(option => option
            .setName('station').setDescription('the station in question').setRequired(true)),

    async execute(interaction) {
        interaction.reply('command not yet available.')
    },
};