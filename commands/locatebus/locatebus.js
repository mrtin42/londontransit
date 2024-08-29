const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
	// data: new SlashCommandBuilder()
	// 	.setName('locatebus')
	// 	.setDescription('get the current state of a bus from its registration plate')
    //     .addStringOption(option => option.setName('registration').setDescription("the registration plate (no spaces e.g LX09AYN or LTZ1748").setRequired(true)),
	data: {
		name: 'locatebus',
		description: 'get the current state of a bus from its registration plate',
		options: [
			{
				name: 'registration',
				description: 'the registration plate (no spaces e.g LX09AYN or LTZ1748',
				type: 3,
				required: true
			}
		],
		"integration_types": [0,1],
		"contexts": [0,1,2]
	},
	async execute(interaction) {
        const regPlate = interaction.options.getString('registration');

		const response = await axios.get(`https://api.tfl.gov.uk/Vehicle/${regPlate}/Arrivals?app_key=${process.env.TFL_APP_KEY}`);

		await interaction.deferReply();

		if (!response.data[0]) {
			await interaction.editReply('No data. Either the bus is not in service or you have entered an invalid registration plate.')
		} else {
			const busData = response.data[0]

			if (busData.timeToStation < 60) {
				var approxArrival = `**less than a minute**`
			} else {
				var ArrivalTime = Math.floor(busData.timeToStation / 60)
				var approxArrival = `approximately **${ArrivalTime} minute(s)**`
			}

			const embed = new EmbedBuilder()
				.setAuthor(
					{ name: 'Vehicle Search', iconURL: `https://bird-with-down-syndrome.londontransit.org.uk/tfl/brand/bus-roundel.png` }
				)
				.setColor(0xE1251B)
				.setTitle(`${busData.vehicleId} is currently operating the ${busData.lineName} to ${busData.destinationName}`)
				.setDescription(`The next stop will be **${busData.stationName}**\nIt should arrive in ${approxArrival}`);

			await interaction.editReply({embeds: [embed]})
		}
	}
};