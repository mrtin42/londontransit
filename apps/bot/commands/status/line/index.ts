import axios from 'axios';
import { EmbedBuilder } from 'discord.js';

const baseStatusUrl = 'https://api.tfl.gov.uk/Line/';

export default async function lineStatus(interaction: any, line: string) {
  const url = `${baseStatusUrl}${line}/Status?app_key=${process.env.TFL_APP_KEY}`;
  let res;
  try {
    res = await axios.get(url);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was a network error while fetching the line status. Please try again later.', ephemeral: true });
    return;
  }
  const lineData = res.data[0];
  if (!lineData) {
    await interaction.reply({ content: 'Invalid line specified. Please check the line name and try again.', ephemeral: true });
    return;
  }
  const name = lineData.name;
  const status = lineData.lineStatuses[0].statusSeverityDescription;
  const details = lineData.lineStatuses[0].reason || 'No additional details provided.';
  const embed = new EmbedBuilder()
    .setTitle(`TfL Line Status - ${name}`)
    .setColor(0x1a53ff)
    .setFooter({ text: 'Powered by Transport for London'})
    .setTimestamp()
    .addFields(
      { name: 'Status', value: status },
      { name: 'Details', value: details }
    );
  await interaction.reply({ embeds: [embed], ephemeral: false });
}

export { lineStatus };