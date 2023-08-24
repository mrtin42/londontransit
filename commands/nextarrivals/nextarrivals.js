const { EmbedBuilder, SlashCommandBuilder, ButtonBuilder} = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('nextarrivals')
    .setDescription('Get the next arrivals from a Tube station')
    .addStringOption((option) =>
      option
        .setName('station')
        .setDescription('The name of the Tube station')
        .setRequired(true)
    ),

    async execute(interaction) {
      await interaction.deferReply();
      const stationName = interaction.options.getString('station');
      const response = await axios.get(`https://api.tfl.gov.uk/StopPoint/Search/${stationName}?app_key=32165e2dbd9e4da9a804f88d7495d9d3&modes=tube&includeHubs=false`);

        
      const stationCode = response.data.matches[0].id;

      const naptanArrivals = await axios.get(`https://api.tfl.gov.uk/StopPoint/${stationCode}/Arrivals?app_key=32165e2dbd9e4da9a804f88d7495d9d3`)

      // Sort the arrivalsData array by timeToStation in ascending order
      const sortedArrivals = naptanArrivals.data.sort((a, b) => a.timeToStation - b.timeToStation);
      const limitedArrivals = sortedArrivals.slice(0, 4);


      const embed = new EmbedBuilder()
        .setTitle(`${stationName}`)
        .setAuthor(
          { name: 'Station Arrivals', iconURL: 'https://media.tubee.dev/assets/images/image01.png'}
        )
        .setColor(0x000F9F)
        .setTimestamp()
        .setFooter(
          { text: 'Powered by Transport for London'}
        )

      for (const arrival of limitedArrivals) {
        // get seconds and round to approx minutes
        let minutes = Math.floor(arrival.timeToStation / 60);
        let extraSeconds = arrival.timeToStation % 60;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        extraSeconds = extraSeconds < 10 ? "0" + extraSeconds : extraSeconds;

        embed.addFields(
          { name: `${arrival.lineName}`, value: `Destination: ${arrival.towards}\nEstimated Arrival in: ${minutes} mins`}
        );
      }

      try {
        await interaction.reply({
          content: ` `,
          embeds: [embed]
        });
      } catch (error) {
         console.error(error);
         await interaction.reply('An error occurred while fetching arrivals.');
      }
       
        

      let giveReply = 'Next arrivals:\n\n'
}


}