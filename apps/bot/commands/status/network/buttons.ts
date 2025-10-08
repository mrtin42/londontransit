import { EmbedBuilder } from 'discord.js';
import axios from "axios";
import { genButtonRow } from "./utils";
import { getOtherEmbed, getOvergroundEmbed, getTubeEmbed } from ".";

export const networkStatusButtonHandler = async (interaction: any) => {
  const id = interaction.customId;
  let embed;
  let row;
  if (id === 'status-panel-tube') {
    await interaction.deferUpdate();
    embed = await getTubeEmbed();
    row = await genButtonRow('tube');
  } else if (id === 'status-panel-overground') {
    await interaction.deferUpdate();
    embed = await getOvergroundEmbed();
    row = await genButtonRow('overground');
  } else if (id === 'status-panel-other') {
    await interaction.deferUpdate();
    embed = await getOtherEmbed();
    row = await genButtonRow('other');
  } else {
    await interaction.reply({ content: 'Unknown button interaction. This should never happen, please contact developer.', ephemeral: true });
    return;
  }
  await interaction.editReply({ embeds: [embed], components: [row] });
}