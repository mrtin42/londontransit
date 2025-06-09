import { SlashCommandBuilder, ButtonBuilder, CommandInteraction, ContainerBuilder, SeparatorBuilder, TextDisplayBuilder, MessageFlags, AutocompleteInteraction } from "discord.js";
import axios from "axios";
import chalk from "chalk";
import { isAutocompleteChoice, station } from "@/utils/autocomplete";
import { transportModeEmojis, undergroundLineEmojis, undergroundLineEmojisById } from "@/utils/constants/emoji";

const data = new SlashCommandBuilder()
  .setName('nextarrivals')
  .setDescription('Get the next arrivals at a station')
  .addStringOption(option =>
    option.setName('station')
      .setDescription('Station to get next arrivals for')
      .setRequired(true)
      .setAutocomplete(true));

const execute = async (interaction: CommandInteraction) => {
  console.log(chalk.blue('Executing command:') + chalk.green(` ${interaction.commandName}`));
  await interaction.deferReply();

  const stationOption = interaction.options.get('station')?.value as string;
  if (stationOption && !isAutocompleteChoice(stationOption)) {
    return interaction.editReply({ content: 'Please select a station from the autocomplete suggestions.' });
  };


  const stationId = stationOption.split(':')[1];
  try {
    const response = await axios.get(`https://api.tfl.gov.uk/StopPoint/${stationId}/Arrivals?app_key=${process.env.TFL_APP_KEY}`);
    if (!response.data || response.data.length === 0) {
      console.warn(chalk.yellow('No arrivals found for the specified station.'));
      return interaction.editReply({ content: 'No arrivals found for the specified station.' });
    }

    const nextArrivals = response.data.sort((a: any, b: any) => a.timeToStation - b.timeToStation).slice(0, 5); // Get the next 5 arrivals sorted by time to station
    const embed = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## Next arrivals at ${response.data[0].stationName}:`))
      .addSeparatorComponents(new SeparatorBuilder());

    nextArrivals.forEach((arrival: any) => {
      const lineEmoji = arrival.modeName === 'tube' ? undergroundLineEmojis.find(e => e.line === arrival.lineId)?.markdown || '🚇' : transportModeEmojis.find(e => e.mode === arrival.modeName)?.markdown || '🚉';
      const timeToStation = Math.round(arrival.timeToStation / 60); // Convert seconds to minutes
      const lineName = arrival.lineName || 'Unknown Line';
      const destination = arrival.towards || 'Unknown Destination';
      embed.addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`${lineEmoji} **${lineName}** to ${destination} - ${timeToStation < 1 ? 'Arriving soon' : `${timeToStation} min`}`)
      );
    });
    await interaction.editReply({ components: [embed], flags: [MessageFlags.IsComponentsV2] });
  } catch (error) {
    console.error(chalk.red('Error fetching next arrivals:'), error);
    return interaction.editReply({ content: 'There was an error fetching the next arrivals. Please try again later.' });
  }  
};

const autocomplete = async (interaction: AutocompleteInteraction) => {
  const choices = await station(interaction.options.getFocused(true).value as string);
  await interaction.respond(
    choices
      .map((choice) => {
        if (!choice) return null; // skip null choices
        return {
          name: choice.name,
          value: choice.id
        };
      })
      .filter((choice): choice is { name: string; value: string } => choice !== null)
  );
}

export default { data, execute, autocomplete };

module.exports = {
  data,
  execute,
  autocomplete
};
