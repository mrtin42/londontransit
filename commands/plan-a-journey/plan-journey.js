const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { default: axios } = require('axios');

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
      await interaction.deferReply()
      const origin = interaction.options.getString('origin');
      const destination = interaction.options.getString('destination');

    
      const originNaptan = await axios.get(`https://api.tfl.gov.uk/StopPoint/Search/${origin}?app_key=32165e2dbd9e4da9a804f88d7495d9d3&modes=tube,bus&includeHubs=false`);
      const destinNaptan = await axios.get(`https://api.tfl.gov.uk/StopPoint/Search/${destination}?app_key=32165e2dbd9e4da9a804f88d7495d9d3&modes=tube,bus&includeHubs=false`);

      if (!originNaptan.data.matches[0]) {
        await interaction.editReply('Origin station was not found')
      } else if (!destinNaptan.data.matches[0]) {
        await interaction.editReply('Destination station was not found')
      } else {
        const response = await axios.get(`https://api.tfl.gov.uk/Journey/JourneyResults/${originNaptan.data.matches[0].id}/to/${destinNaptan.data.matches[0].id}?app_key=32165e2dbd9e4da9a804f88d7495d9d3&mode=tube,bus`);


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
          if (journeyPlan.mode.id == "tube") {
            embed.addFields({
              name: `${journeyPlan.routeOptions[0].name} line - ${journeyPlan.duration}min`,
              value: `from ${journeyPlan.departurePoint.commonName} to ${journeyPlan.arrivalPoint.commonName}`
            });
          } else if (journeyPlan.mode.id == "bus") {
            embed.addFields({
              name: `${journeyPlan.instruction.detailed} - ${journeyPlan.duration}min`,
              value: `${journeyPlan.departurePoint.commonName} stop ${journeyPlan.departurePoint.stopLetter} to ${journeyPlan.arrivalPoint.commonName} stop ${journeyPlan.arrivalPoint.stopLetter}`
            });
          };
        }

        
    
        // Create and send the reply message
        await interaction.editReply({ content: ' ', embeds: [embed] });
      }


    },
  };