const axios = require('axios');
const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bustimes')
		.setDescription('get arrivals for a bus stop')
        .addStringOption(option => option.setName('stop').setDescription("bus stop name").setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply()

        const stopName = interaction.options.getString('stop')

        const searchResponse = await axios.get(`https://api.tfl.gov.uk/StopPoint/Search/${stopName}?modes=bus&maxResults=1`)

        try {
            var responseCode = searchResponse.data.matches[0].id;
        } catch (e) {
            await interaction.editReply('No results found. Try searching again');
            return;
        }

        const childStopPoints = await axios.get(`https://api.tfl.gov.uk/StopPoint/${responseCode}`)

        const searchSelect = new StringSelectMenuBuilder()
            .setCustomId('searchselect')
            .setPlaceholder('what bus stop?')

        if (childStopPoints.data.children.length() == 1) {
            var message = {
                content: ""
            }
        }

        for (const options of childStopPoints.data.children) {
            if (options.modes[0] != "bus") {
                // nothing
            } else {
                if (options.stopType != "NaptanOnstreetBusCoachStopCluster") {
                    // nothing
                } else {
                    for (const childStops of options.children) {
                        if (childStops.additionalProperties[1].key != "Towards") {
                            // nothing
                        } else {
                            searchSelect.addOptions(
                                new StringSelectMenuOptionBuilder()
                                .setLabel(`${childStops.commonName} ${childStops.indicator}`)
                                .setDescription(`${childStops.additionalProperties[1].key} ${childStops.additionalProperties[1].value}`)
                                .setValue(`${childStops.naptanId}`)
                            )
                        }
                    }
                    console.log('menu made')          
                }
            }
        }

        const row = new ActionRowBuilder()
            .addComponents(searchSelect);

        console.log('done')
        try {
            const selectStop = await interaction.editReply({content: 'found the following bus stops:', components: [row]})
            const collector = selectStop.createMessageComponentCollector({time: 3_600_000 });

        collector.on('collect', async i => {
            const selection = i.values[0];

            await interaction.editReply({content: 'Fetching arrivals...', components: []})

            const arrivals = await axios.get(`https://api.tfl.gov.uk/StopPoint/${selection}/Arrivals`)

            const sortedArrivals = arrivals.data.sort((a, b) => a.timeToStation - b.timeToStation);
            const limitedArrivals = sortedArrivals.slice(0, 4);

            const arrivalsEmbed = new EmbedBuilder()
            .setColor(0xE1251B)
            .setAuthor({name: 'Bus Times'})
            .setDescription(`Arrivals for ${arrivals.data[0].stationName}`);
        
            for (const results of limitedArrivals) {
                if (results.timeToStation < 60) {
				    var ArrivalTime = results.timeToStation / 60
				    var declareArrival = `It should arrive in approximately **${ArrivalTime} minute(s)**`
			    } else {
				    var declareArrival = `It should arrive in **less than a minute**`
			    }

                arrivalsEmbed.addFields({
                    name: `${results.lineName} to ${results.destinationName}`,
                    value: `${declareArrival}`
                })
            }

        await interaction.editReply({content: '',embeds: [arrivalsEmbed]})
        });
        } catch (e) {
            await interaction.editReply('No results. Are you sure you spelt it correctly?\n\n*tip: if "station" is in the bus stop name, remove it*')
            console.error(e)
        }
        
    }
};