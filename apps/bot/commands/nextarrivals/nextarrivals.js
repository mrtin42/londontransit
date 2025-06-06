const { EmbedBuilder, SlashCommandBuilder, ButtonBuilder} = require('discord.js');
const axios = require('axios');
const autocomplete = require('../../utils/autocomplete/station.js');

module.exports = {
    // data: new SlashCommandBuilder()
    // .setName('nextarrivals')
    // .setDescription('Get the next arrivals from a Tube station')
    // .addStringOption((option) =>
    //   option
    //     .setName('station')
    //     .setDescription('The name of the Tube station')
    //     .setRequired(true)
    // ),
    data: {
      name: 'nextarrivals',
      description: 'Get the next arrivals from a Tube station',
      "integration_types": [0,1],
      "contexts": [0,1,2],
      options: [
        {
          name: 'station',
          description: 'The name of the Tube station',
          type: 3,
          required: true,
          autocomplete: true
        }
      ]
    },

    async autocomplete(interaction) {
      const choices = await autocomplete(interaction, 'tube,dlr,overground,tram,elizabeth-line,replacement-bus,river-bus');
      await interaction.respond(
        choices.map(choice => ({name: choice, value: choice}))
      )
    },

    async execute(interaction) {
      await interaction.deferReply();
      const stationName = interaction.options.getString('station');
      const response = await axios.get(`https://api.tfl.gov.uk/StopPoint/Search/${stationName}?app_key=${process.env.TFL_APP_KEY}&modes=tube,dlr,overground,tram,elizabeth-line,replacement-bus,river-bus&includeHubs=false`);

        
      const stationCode = response.data.matches[0].id;

      const naptanArrivals = await axios.get(`https://api.tfl.gov.uk/StopPoint/${stationCode}/Arrivals?app_key=${process.env.TFL_APP_KEY}`)

      // Sort the arrivalsData array by timeToStation in ascending order
      const sortedArrivals = naptanArrivals.data.sort((a, b) => a.timeToStation - b.timeToStation);
      const limitedArrivals = sortedArrivals.slice(0, 4);


      const embed = new EmbedBuilder()
        .setTitle(`${stationName}`)
        .setAuthor(
          { name: 'Station Arrivals', iconURL: 'https://bird-with-down-syndrome.londontransit.org.uk/tfl/brand/lul-roundel.png'}
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
          { name: `${arrival.lineName}`, value: `Destination: ${arrival.towards}\nEstimated Arrival: ${`${minutes}` === '00' ? "Due now" : `${minutes} min(s)`}` }
        );
      }

      try {
        await interaction.editReply({
          content: ` `,
          embeds: [embed]
        });
      } catch (error) {
         console.error(error);
         await interaction.editReply('An error occurred while fetching arrivals.');
      }
       
        

      let giveReply = 'Next arrivals:\n\n'
}


}