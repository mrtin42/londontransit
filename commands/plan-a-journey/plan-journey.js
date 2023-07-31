const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { default: axios } = require('axios');
const https = require('follow-redirects').https;

module.exports = {
    data: new SlashCommandBuilder()
      .setName('journey')
      .setDescription('Search for a journey using TfL Journey Planner')
      .addStringOption(option => option
        .setName('origin')
        .setDescription('Starting point of the journey - must be a tube station')
        .setRequired(true)
        .setAutocomplete(true))
      .addStringOption(option => option
        .setName('destination')
        .setDescription('Destination of the journey - must be a tube station')
        .setRequired(true)
        .setAutocomplete(true)),

    /* async autocomplete(interaction) {
      const focusedOption = interaction.options.getFocused(true);
      let choices = [];
      const choicesSearch = string
    }, */
  
    async execute(interaction) {
      const origin = interaction.options.getString('origin');
      const destination = interaction.options.getString('destination');

    
      const originNaptan = await axios.get(`https://api.tfl.gov.uk/StopPoint/Search/${origin}?app_key=32165e2dbd9e4da9a804f88d7495d9d3&modes=tube&includeHubs=false`);
      const destinNaptan = await axios.get(`https://api.tfl.gov.uk/StopPoint/Search/${destination}?app_key=32165e2dbd9e4da9a804f88d7495d9d3&modes=tube&includeHubs=false`);
  

      const response = await axios.get(`https://api.tfl.gov.uk/Journey/JourneyResults/${originNaptan.data.matches[0].id}/to/${destinNaptan.data.matches[0].id}?app_key=32165e2dbd9e4da9a804f88d7495d9d3&mode=tube`);


      const embed = new EmbedBuilder()
        .setTitle(`${origin} to ${destination}`)
        .setAuthor(
          { name: 'Journey Planner', iconURL: 'https://media.tubee.dev/assets/images/image01.png'}
        )
        .setDescription(`This journey will take ${response.data.journeys[0].duration.toString()} minutes.`)
        .setColor(0x000F9F)
        .setTimestamp()
        .setFooter(
          { text: 'Powered by Transport for London'}
        );

      for (const journeyPlan of response.data.journeys[0].legs) {
        embed.addFields(
          { name: `${journeyPlan.routeOptions[0].name} - ${journeyPlan.duration}min`,  value: `from ${journeyPlan.departurePoint.commonName} to ${journeyPlan.arrivalPoint.commonName}`}
        )


      }


  
      // Create and send the reply message
      await interaction.reply({ content: ' ', embeds: [embed] });
      78
    },
  };