const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'linestatus',
        description: 'check the status of a specific tube line',
        options: [
            {
                name: 'line',
                description: 'the line youre checking the status of',
                type: 3,
                required: true
            }
        ],
        "integration_types": [0,1],
        "contexts": [0,1,2]
    },
    async execute(interaction) {
        await interaction.deferReply();

        const requestedLine = await axios.get(`https://api.tfl.gov.uk/Line/Search/${interaction.options.getString('line')}?app_key=${process.env.TFL_APP_KEY}&modes=tube,dlr,tram,elizabeth-line,overground`);

        const response = await axios.get(`https://api.tfl.gov.uk/Line/${requestedLine.data.searchMatches[0].lineId}/Status?app_key=${process.env.TFL_APP_KEY}`);

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
}