const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('locatebus')
		.setDescription('get the current state of a bus from its registration plate')
        .addStringOption(option => option.setName('registration').setDescription("the registration plate (no spaces e.g LX09AYN or LTZ1748").setRequired(true)),
	async execute(interaction) {
        const regPlate = interaction.options.getString('registration');

		const response = await axios.get(`https://api.tfl.gov.uk/Vehicle/${regPlate}/Arrivals?app_key=32165e2dbd9e4da9a804f88d7495d9d3`);

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