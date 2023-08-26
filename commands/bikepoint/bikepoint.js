const {EmbedBuilder, SlashCommandBuilder} = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cycledock')
        .setDescription('get the current information for a santander cycle dock')
        .addStringOption((option) =>
            option
                .setName('dock')
                .setDescription('The name of the dock (usually the road its on)')
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply();
        const dockName = interaction.options.getString('dock');

        const response = await axios.get(`https://api.tfl.gov.uk/BikePoint/Search?query=${dockName}&app_key=32165e2dbd9e4da9a804f88d7495d9d3&includeHubs=false`);

        if (!response.data[0]) {
            return interaction.editReply('No dock found with that name.');
        } else {
            const dockId = response.data[0].id;
            const dockData = await axios.get(`https://api.tfl.gov.uk/BikePoint/${dockId}?app_key=32165e2dbd9e4da9a804f88d7495d9d3`);

            const embed = new EmbedBuilder()
                .setTitle(`${dockData.data.commonName}`)
                .setAuthor(
                    {name: 'Cycle Dock Information', iconURL: 'https://media.tubee.dev/assets/images/image01.png'}
                )
                .setColor(0x000F9F)
                .setTimestamp()
                .setFooter(
                    {text: 'Powered by Transport for London'}
                )
                .addFields(
                    {name: 'Bikes', value: `${dockData.data.additionalProperties[6].value}`},
                    {name: 'Docks', value: `${dockData.data.additionalProperties[7].value}`},
                    {name: 'Status', value: `${dockData.data.additionalProperties[8].value}`}
                );

            try {
                await interaction.editReply({
                    content: ` `,
                    embeds: [embed]
                });
            } catch (error) {
                console.error(error);
                await interaction.editReply('An error occurred while fetching dock information.');
            }
        }
    }
}