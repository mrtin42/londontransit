import axios from "axios";
import { EmbedBuilder } from "discord.js";
import { emoji } from "./utils";

const baseUrl = 'https://api.tfl.gov.uk/';
const baseStatusUrl = `${baseUrl}Line/Mode/`;

export default async function networkStatus(interaction: any) {
  // tube and overground lines shown in panels chosen via buttons.
  // all others in a single panel also shown via button.
  // show tube first by default.

  const embed = await getTubeEmbed(); 
  return embed;
}

export const getTubeEmbed = async () => {
  const url = `${baseStatusUrl}tube/Status?app_key=${process.env.TFL_APP_KEY}`;
  let res;
  try {
    res = await axios.get(url);
  } catch (error) {
    console.error(error);
    return new EmbedBuilder()
      .setTitle('Error')
      .setDescription('There was a network error while fetching the tube status. Please try again later.')
      .setColor(0xff0000);
  }
  const lines = res.data;
  const embed = new EmbedBuilder()
    .setTitle('TfL Network Status - Underground')
    .setColor(0x1a53ff)
    .setFooter({ text: 'Powered by Transport for London'})
    .setTimestamp();
  lines.forEach((line: any) => {
    const name = line.name;
    const status = line.lineStatuses[0].statusSeverityDescription;
    if (!name || !status) return;
    let e = emoji(line.lineStatuses[0].statusSeverity);
    embed.addFields({ name: `${e} ${name}`, value: status, inline: true });
  });
  return embed;
}

export const getOvergroundEmbed = async () => {
  const url = `${baseStatusUrl}overground/Status?app_key=${process.env.TFL_APP_KEY}`;
  let res;
  try {
    res = await axios.get(url);
  } catch (error) {
    console.error(error);
    return new EmbedBuilder()
      .setTitle('Error')
      .setDescription('There was a network error while fetching the overground status. Please try again later.')
      .setColor(0xff0000);
  }
  const lines = res.data;
  const embed = new EmbedBuilder()
    .setTitle('TfL Network Status - Overground')
    .setColor(0x1a53ff)
    .setFooter({ text: 'Powered by Transport for London'})
    .setTimestamp();
  lines.forEach((line: any) => {
    const name = line.name;
    const status = line.lineStatuses[0].statusSeverityDescription;
    if (!name || !status) return;
    let e = emoji(line.lineStatuses[0].statusSeverity);
    embed.addFields({ name: `${e} ${name}`, value: status, inline: true });
  });
  return embed;
}

export const getOtherEmbed = async () => {
  const modes = ['dlr', 'elizabeth-line', 'tram', 'cable-car'];
  const embed = new EmbedBuilder()
    .setTitle('TfL Network Status - Other Modes')
    .setColor(0x1a53ff)
    .setFooter({ text: 'Powered by Transport for London'})
    .setTimestamp();
  const url = `${baseStatusUrl}${modes.join(',')}/Status?app_key=${process.env.TFL_APP_KEY}`;
  let res;
  try {
    res = await axios.get(url);
  } catch (error) {
    console.error(error);
    return new EmbedBuilder()
      .setTitle('Error')
      .setDescription('There was a network error while fetching the other modes status. Please try again later.')
      .setColor(0xff0000);
  }
  const lines = res.data;
  lines.forEach((line: any) => {
    const name = line.name;
    const status = line.lineStatuses[0].statusSeverityDescription;
    if (!name || !status) return;
    let e = emoji(line.lineStatuses[0].statusSeverity);
    embed.addFields({ name: `${e} ${name}`, value: status, inline: true });
  });
  return embed;
}