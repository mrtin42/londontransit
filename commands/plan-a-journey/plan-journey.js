const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { default: axios } = require('axios');
const chalk = import('chalk');
const autocomplete = require('../../utils/autocomplete/station.js');

module.exports = {
    // data: new SlashCommandBuilder().
    //   .setName('journey')
    //   .setDescription('Search for a journey using TfL Journey Planner')
    //   .addStringOption(option => option
    //     .setName('origin')
    //     .setDescription('Starting point of the journey - must be a tube station')
    //     .setRequired(true)
    //     .setAutocomplete(true))
    //   .addStringOption(option => option
    //     .setName('destination')
    //     .setDescription('Destination of the journey - must be a tube station')
    //     .setRequired(true)
    //     .setAutocomplete(true)),
    data: {
      name: 'journey',
      description: 'Search for a journey using TfL Journey Planner',
      "integration_types": [0,1],
      "contexts": [0,1,2],
      options: [
        {
          name: 'origin',
          description: 'Starting point of the journey - reccomended be a tube station',
          type: 3,
          required: true,
          autocomplete: true
        },
        {
          name: 'destination',
          description: 'Destination of the journey - reccomended be a tube station',
          type: 3,
          required: true,
          autocomplete: true
        }
      ]
    },
    async autocomplete(interaction) {
      const choices = await autocomplete(interaction, 'bus,cable-car,dlr,elizabeth-line,interchange-keep-sitting,interchange-secure,national-rail,overground,river-bus,tram,tube,walking');
      await interaction.respond(
        choices.map(choice => ({name: choice, value: choice}))
      )
    },
  
    async execute(interaction) {
      await interaction.deferReply()
      const origin = interaction.options.getString('origin');
      const destination = interaction.options.getString('destination');

      if (origin == 'AUTOCOMPLETE_ERROR:internal_error' || destination == 'AUTOCOMPLETE_ERROR:internal_error') {
        await interaction.editReply('Your input failed due to an internal error when producing autocomplete results. Please try again.');
        return;
      }
      if (origin == 'AUTOCOMPLETE_ERROR:no_input' || destination == 'AUTOCOMPLETE_ERROR:no_input') {
        await interaction.editReply('You must enter a station name to search for a journey.');
        return;
      }
    
      const originNaptan = await axios.get(`https://api.tfl.gov.uk/StopPoint/Search/${origin}?app_key=32165e2dbd9e4da9a804f88d7495d9d3&modes=tube,bus,national-rail,dlr&includeHubs=false`);
      const destinNaptan = await axios.get(`https://api.tfl.gov.uk/StopPoint/Search/${destination}?app_key=32165e2dbd9e4da9a804f88d7495d9d3&modes=tube,bus,national-rail,dlr&includeHubs=false`);

      if (!originNaptan.data.matches[0]) {
        await interaction.editReply('Origin station was not found')
        return;
      } else if (!destinNaptan.data.matches[0]) {
        await interaction.editReply('Destination station was not found')
        return;
      } else {
        const response = await axios.get(`https://api.tfl.gov.uk/Journey/JourneyResults/${originNaptan.data.matches[0].id}/to/${destinNaptan.data.matches[0].id}?app_key=32165e2dbd9e4da9a804f88d7495d9d3&mode=tube,bus,national-rail,walking,dlr`);


        const embed = new EmbedBuilder()
          .setTitle(`${origin} to ${destination}`)
          .setAuthor(
            { name: 'Journey Planner', iconURL: 'https://bird-with-down-syndrome.londontransit.org.uk/tfl/brand/lul-roundel.png'}
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
          } else if (journeyPlan.mode.id == "walking") {
            const originFormatted = originNaptan.data.matches[0].name.replace(/ /g, '%20');
            const destinationFormatted = destinNaptan.data.matches[0].name.replace(/ /g, '%20');
            embed.addFields({
              name: `${journeyPlan.instruction.summary}- ${journeyPlan.duration}min`,
              value: `*Displaying walking options within the embed would enlarge it and be obtrusive, so please refer to street-level signage, the [TfL website](https://tfl.gov.uk/plan-a-journey/results?InputFrom=${originFormatted}&InputTo=${destinationFormatted}&app_key=32165e2dbd9e4da9a804f88d7495d9d3), Tfl Go or a navigation app for more information.*`
            });
          } else if (journeyPlan.mode.id == "national-rail") {
            embed.addFields({
              name: `${journeyPlan.routeOptions[0].name} - ${journeyPlan.duration}min`,
              value: `from ${journeyPlan.departurePoint.commonName} to ${journeyPlan.arrivalPoint.commonName}`
            });
          } else if (journeyPlan.mode.id == "dlr") {
            embed.addFields({
              name: `${journeyPlan.routeOptions[0].name} - ${journeyPlan.duration}min`,
              value: `from ${journeyPlan.departurePoint.commonName} to ${journeyPlan.arrivalPoint.commonName}`
            });
          } else if (journeyPlan.mode.id == "tram") {
            embed.addFields({
              name: `${journeyPlan.routeOptions[0].lineIdentifier.name} - ${journeyPlan.duration}min`,
              value: `from ${journeyPlan.departurePoint.commonName} to ${journeyPlan.arrivalPoint.commonName}`
            });
          } else if (journeyPlan.mode.id == "river-bus") {
            embed.addFields({
              name: `${journeyPlan.instruction.detailed} - ${journeyPlan.duration}min`,
              value: `from ${journeyPlan.departurePoint.commonName} to ${journeyPlan.arrivalPoint.commonName}`
            })
          } else if (journeyPlan.mode.id == "overground") {
            embed.addFields({
              name: `${journeyPlan.routeOptions[0].name} - ${journeyPlan.duration}min`,
              value: `from ${journeyPlan.departurePoint.commonName} to ${journeyPlan.arrivalPoint.commonName}`
            });
            
          }
        }

        
    
        // Create and send the reply message
        await interaction.editReply({ content: ' ', embeds: [embed] });
      }


    }
  };