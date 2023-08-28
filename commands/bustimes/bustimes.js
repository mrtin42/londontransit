const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bustimes')
        .setDescription('get the current information for a bus stop')
        .addStringOption((option) =>
            option
                .setName('stop')  
                .setDescription('The name of the bus stop')
                .setRequired(true) 
        ),

    async execute(interaction) {
        const stopName = interaction.options.getString('stop');
        const stopSearch = await axios.get(`https://api.tfl.gov.uk/StopPoint/Search?query=${stopName}&modes=bus&app_key=32165e2dbd9e4da9a804f88d7495d9d3`);

        if (!stopSearch.data.matches[0]) {
            await interaction.reply('No stop found with that name.');
        } else {
            const stopId = stopSearch.data.matches[0].id;
            getStopsFromGroup = await axios.get(`https://api.tfl.gov.uk/StopPoint/${stopId}`);

            if (getStopsFromGroup.data.stopType === 'NaptanPublicBusCoachTram') {
                await interaction.reply('No bus stops found with that name.');
            } else {

            }


        }
    }
}