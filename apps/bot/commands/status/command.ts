import axios from "axios";
import { EmbedBuilder, Integration, SlashCommandBuilder } from "discord.js";
import networkStatus from "./network";
import lineStatus from "./line";
import { genButtonRow } from "./network/utils";

const data = new SlashCommandBuilder()
  .setName('status')
  .setDescription('Get the status of a TfL service')
  .addSubcommand(c => c
    .setName('network')
    .setDescription('Get the status of a specified TfL network')
  )
  .addSubcommand(c => c
    .setName('line')
    .setDescription('Get the status of a specified TfL line')
    .addStringOption(option =>
      option.setName('line')
        .setDescription('The line to get the status for')
        .setRequired(true)
        .setAutocomplete(true)
    )
  )
  .setIntegrationTypes([0,1])
  .setContexts([0,1,2]);

  // todo: include yellow banner messages using the new endpoint. very cool!

const execute = async (interaction: any) => {
  const subcommand = interaction.options.getSubcommand();
  let url = '';
  let title = '';

  if (subcommand === 'network') {
    await interaction.deferReply();
    const e = await networkStatus(interaction);
    const r = genButtonRow('tube');
    await interaction.editReply({ embeds: [e], components: [r] });
    return;
  } else if (subcommand === 'line') {
    const line = interaction.options.getString('line');
    if (!line) {
      await interaction.reply({ content: 'Please specify a line.', ephemeral: true });
      return;
    }
    await lineStatus(interaction, line);
    return;
  } else {
    await interaction.reply({ content: 'Invalid subcommand. This should never happen, please contact developer.', ephemeral: true });
    return;
  }
}

export { data, execute };