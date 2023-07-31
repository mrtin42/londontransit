const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crowding')
        .setDescription('fetches current crowding level')
        .addStringOption(option => option
            .setName('station').setDescription('the station in question').setRequired(true)),

    async execute(interaction) {

        interaction.reply('command not yet available.')
        /* interaction.deferReply();

        const requestedStation = await axios.get(`https://api.tfl.gov.uk/StopPoint/Search/${interaction.options.getString('station')}?app_key=32165e2dbd9e4da9a804f88d7495d9d3&modes=tube,dlr,overground,cable-car,&includeHubs=false`);
        const response = await axios.get(`https://api.tfl.gov.uk/crowding/${requestedStation}/Live?app_key=32165e2dbd9e4da9a804f88d7495d9d3`);

        if (response.dataAvailable == true) {
            const data = new EmbedBuilder()
                .setAuthor({
                    name: 'Crowding Data', iconURL: 'https://tlantent.sirv.com/Images/Underground_(no_text).svg.png'
                })
                .setColor(0x000F9F)

        }
        */ 
    }

}