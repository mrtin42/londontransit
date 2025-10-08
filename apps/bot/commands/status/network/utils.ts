import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"

export const genButtonRow = (selected: string) => {
  const row = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('status-panel-tube')
      .setLabel('Tube')
      .setDisabled(selected === 'tube')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('status-panel-overground')
      .setLabel('Overground')
      .setDisabled(selected === 'overground')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('status-panel-other')
      .setLabel('Other')
      .setDisabled(selected === 'other')
      .setStyle(ButtonStyle.Secondary),
  );
  return row;
}

export const emoji = (status: number) => {
  let emoji = '';
  switch (status) {
      case 0:
      case 19:
        emoji = 'ℹ️'; // Special Service, Information
        break;
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 16:
      case 20:
        emoji = '🚫'; // Part Closure, Closed, No Service, Planned Closure, Not Running, Service Closed
        break;
      case 6:
      case 7:
      case 11:
      case 17:
        emoji = '⚠️'; // Reduced Service, Severe Delays, Issues Reported
        break;
      case 8:
        emoji = '🚌'; // Bus Service
        break;
      case 9:
        emoji = '🚧' // Minor Delays
        break;
      case 10:
      case 18:
        emoji = '✅'; // Good Service, No Issues
        break;
      case 12:
        emoji = '➡️'; // Exits Only
        break;
      case 13:
        emoji = '♿'; // No Step-Free Access
      case 14:
        emoji = '🔀'; // Change of Frequency
        break;
      case 15:
        emoji = '⤵️'; // Diverted
      default:
        emoji = ''; // Unknown status
    }
  return emoji;
}