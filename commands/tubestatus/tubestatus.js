const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('tubestatus')
		.setDescription('fetches the current disruption status of london underground lines'),
	async execute(interaction) {
        
        await interaction.deferReply();

        const response = await axios.get('https://api.tfl.gov.uk/Line/Mode/tube,dlr,tram,elizabeth-line,overground/Status');

        const embed = new EmbedBuilder()
          .setAuthor(
            { name: 'TfL Services Status', iconURL: 'https://media.tubee.dev/assets/images/image01.png' }
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
};