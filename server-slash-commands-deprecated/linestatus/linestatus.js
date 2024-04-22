const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('linestatus')
		.setDescription('check the status of a specific tube line')
		.addStringOption(option => option.setName('line').setDescription('the line youre checking the status of').setRequired(true)),
    
	async execute(interaction) {
        await interaction.deferReply();

        const requestedLine = await axios.get(`https://api.tfl.gov.uk/Line/Search/${interaction.options.getString('line')}?app_key=32165e2dbd9e4da9a804f88d7495d9d3&modes=tube,dlr,tram,elizabeth-line,overground`);

        const response = await axios.get(`https://api.tfl.gov.uk/Line/${requestedLine.data.searchMatches[0].lineId}/Status?app_key=32165e2dbd9e4da9a804f88d7495d9d3`);

        const embed = new EmbedBuilder()
        .setTitle(`${response.data[0].name} `)
        .setAuthor(
          { name: 'Line Status', iconURL: 'https://bird-with-down-syndrome.londontransit.org.uk/tfl/brand/lul-roundel.png'}
        )
        .setColor(0x000F9F)
        .setTimestamp()
        .setFooter(
          { text: 'Powered by Transport for London' }
        );

        if (response.data[0].lineStatuses[0].statusSeverityDescription != "Good Service") {
          for (const disruptions of response.data[0].lineStatuses) {
            var statusDesc = disruptions.statusSeverityDescription
            var statusDescDetailed = disruptions.reason
            embed.addFields(
              { name: `${statusDesc}`, value: `${statusDescDetailed}`}
            )
          }
        } else {
          var statusDesc = response.data[0].lineStatuses[0].statusSeverityDescription
          embed.addFields(
            { name: `${statusDesc}`, value: `No disruption reported.`}
          )
        }


        await interaction.editReply({
          embeds: [embed]
        });
  }
};