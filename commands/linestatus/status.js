const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'networkstatus',
        description: 'check the status of the transport for london network',
        "integration_types": [0,1],
        "contexts": [0,1,2]
    },
    async execute(interaction) {   
        await interaction.deferReply();

        const response = await axios.get('https://api.tfl.gov.uk/Line/Mode/tube,dlr,tram,elizabeth-line,overground/Status?app_key=32165e2dbd9e4da9a804f88d7495d9d3');

        const embed = new EmbedBuilder()
          .setAuthor(
            { name: 'TfL Services Status', iconURL: 'https://assets.app.londontransit.xyz/branding/tfl/roundels/pngimage/roundel-tube.png' }
          )
          .setColor(0x000F9F)
          .setTimestamp()
          .setFooter(
            { text: 'Powered by Transport for London' }
          );

        for (const linedisruptions of response.data) {
          embed.addFields({
            name: `${linedisruptions.name}`, 
            value: `${linedisruptions.lineStatuses[0].statusSeverityDescription}`, 
            inline: true
          })
        }

        await interaction.editReply({content: 'Use `/linestatus` to view more information for a specific line', embeds: [embed]})
    }
}