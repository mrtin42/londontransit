import { SlashCommandBuilder, EmbedBuilder, CommandInteraction, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SectionBuilder, ButtonBuilder, ButtonStyle, MessageFlags, AutocompleteInteraction } from 'discord.js';
import axios from 'axios';
import chalk from 'chalk';
import { station } from "@/utils/autocomplete";
import { Section } from '@react-email/components';
import { dub } from '@/index';
import { LinkSchema } from 'dub/dist/commonjs/models/components';
import { transportModeEmojis } from '@/utils/constants/emoji';

const data = new SlashCommandBuilder()
  .setName('journey')
  .setDescription('Plan a journey between two points')
  .addStringOption(option =>
    option.setName('from')
      .setDescription('Starting station')
      .setRequired(true)
      .setAutocomplete(true))
  .addStringOption(option =>
    option.setName('to')
      .setDescription('Destination station')
      .setRequired(true)
      .setAutocomplete(true))
  .addStringOption(option =>
    option.setName('date')
      .setDescription('Date of the journey (YYYY-MM-DD) (optional, defaults to now)')
      .setRequired(false));

async function execute(interaction: CommandInteraction) {
  console.log(chalk.blue('Executing command:') + chalk.green(` ${interaction.commandName}`));
  await interaction.deferReply();

  const from = interaction.options.get('from')?.value as string;
  const to = interaction.options.get('to')?.value as string;
  if (!from.startsWith('auto:') || !to.startsWith('auto:')) {
    return interaction.editReply({ content: 'Please select a station from the autocomplete suggestions.' });
  }
  const f = from.split(':')[1];
  const t = to.split(':')[1];
  let date = interaction.options.get('date')?.value as string | null;
  let invalidDate = false;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
  if (date && !dateRegex.test(date)) {
    date = null; // reset date to null; conditional code will see false and use current date instead
    invalidDate = true;
  }
  const formattedDate = date ? new Date(date).toISOString() : new Date().toISOString();

  try {
    const response = await axios.get(`https://api.tfl.gov.uk/Journey/JourneyResults/${f}/to/${t}?app_key=${process.env.TFL_APP_KEY}${date ? `&date=${formattedDate}` : ''}`);
    if (!response.data || !response.data.journeys || response.data.journeys.length === 0) {
      console.warn(chalk.yellow('No journeys found for the specified route and date.'));
      return interaction.editReply({ content: 'No journeys found for the specified route and date.' });
    }
    const journey = response.data.journeys[0]; /* who needs multiple journeys? you dont bring pieces of yourself at different times */
    // const fromName: string = response.data.journeyVector.from;
    // const toName: string = response.data.journeyVector.to;
    // this would have returned the strings given to the API - since we are using NAPTAN IDs, we should determine the names from the departure point of the first leg of the journey and the arrival point of the last leg of the journey
    const fromLeg = journey.legs[0];
    const toLeg = journey.legs[journey.legs.length - 1];
    const fromName = fromLeg.departurePoint.commonName || 'Unknown Origin';
    const toName = toLeg.arrivalPoint.commonName || 'Unknown Destination';
    console.log(chalk.blue('Journey found:') + chalk.green(` ${fromName} to ${toName}`));

    // generate tfl.gov.uk journey planner link, with appropriate URL encoding
    const tflJourneyLink = new URL(`https://tfl.gov.uk/plan-a-journey/results/`);
    // example link for my reference when debugging: https://tfl.gov.uk/plan-a-journey/results?InputFrom=Oxford+Circus+Underground+Station&FromId=1000173&InputTo=Colliers+Wood+Underground+Station&ToId=1000055&Date=20250621&Time=1900
    tflJourneyLink.searchParams.append('InputFrom', fromName);
    tflJourneyLink.searchParams.append('FromId', fromLeg.departurePoint.icsId);
    tflJourneyLink.searchParams.append('InputTo', toName);
    tflJourneyLink.searchParams.append('ToId', toLeg.arrivalPoint.icsId);
    // if date is provided, append it to the link in the format YYYYMMDD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
    if (date) {
      const [year, month, day] = date.split('-');
      tflJourneyLink.searchParams.append('Date', `${year}${month}${day}`); // TFL expects date in YYYYMMDD format
    }
    date && tflJourneyLink.searchParams.append('date', date);
    console.log(chalk.blue('Generated TFL journey link:') + chalk.green(` ${tflJourneyLink.toString()}`));
    let link: {
      shortLink: string;
    } | LinkSchema;
    if (process.env.NODE_ENV === 'development') {
      console.log(chalk.yellow('Development mode: to avoid hitting plan link limit, not shortening the link.'));
      link = { shortLink: tflJourneyLink.toString() };
    } else {
      link = await dub.links.create({
        url: tflJourneyLink.toString(),
        prefix: '/j/',
        domain: 'ldnts.it'
      }).catch((error: any) => {
        console.error(chalk.red('Error creating short link:'), error);
        return { shortLink: tflJourneyLink.toString() }; // fallback to the original link if there's an error
      });
      if (!link || !link.shortLink) {
        console.error(chalk.red('Failed to create a short link, using the original link instead.'));
        link = { shortLink: tflJourneyLink.toString() };
      }
    }
    console.log(chalk.blue('Shortened TFL journey link:') + chalk.green(` ${link.shortLink}`));
    if (!journey) {
      return interaction.editReply({ content: 'No journey found for the specified route and date.' });
    };
    // divide the journey fare by 100 to convert from pence to pounds and put to two decimal places. if no fares listed, return 'Variable: visit website for details'
    let fare: string;
    if (!journey.fare || !journey.fare.totalCost) {
      console.warn(chalk.yellow('No fare information found for the journey.'));
      fare = 'Variable: visit website for details';
    } else {
      fare = (journey.fare.totalCost / 100).toFixed(2);
    }

    const embed = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ${fromName} to ${toName}`))
      .addSeparatorComponents(new SeparatorBuilder())
      .addSectionComponents(new SectionBuilder()
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`
          **Adult fare:** ${
            fare.includes('Variable') ? fare : `£${fare}`
          }${
            fare.includes('Variable') ? '' : ` ${journey.fare.fares[0].chargeLevel}`
          }\n**Duration:** ${journey.duration} minutes\n
          `))
        .setButtonAccessory(new ButtonBuilder().setURL(link.shortLink).setLabel('View on tfl.gov.uk').setStyle(ButtonStyle.Link))
      );
    let description = '';
    for (const leg of journey.legs) {
      if (leg.mode.id === 'tube' || leg.mode.id === 'dlr' || leg.mode.id === 'overground' || leg.mode.id === 'national-rail' || leg.mode.id === 'elizabeth-line' || leg.mode.id === 'tram') {
        const routeName = leg.routeOptions[0].name;
        const legDuration = leg.duration;
        const from = leg.departurePoint.commonName;
        const to = leg.arrivalPoint.commonName;
        description += `*${journey.legs.indexOf(leg) + 1}.* `;
        description += `${transportModeEmojis.find(emoji => emoji.mode === leg.mode.id)?.markdown || ''} `;
        description += `**${routeName}${leg.mode.id === 'tube' || leg.mode.id === 'overground' ? ' line' : ''}**:\n> **From:** ${from}\n> **To:** ${to}\n> **Duration:** ${legDuration} minutes\n`;
      } else if (leg.mode.id === 'bus') {
        const route = leg.instruction.detailed;
        const legDuration = leg.duration;
        const from = `${leg.departurePoint.commonName}, stop ${leg.departurePoint.stopLetter}`;
        const to = `${leg.arrivalPoint.commonName}, stop ${leg.arrivalPoint.stopLetter}`;
        description += `*${journey.legs.indexOf(leg) + 1}.* `;
        description += `${transportModeEmojis.find(emoji => emoji.mode === 'bus')?.markdown || ''} `;
        description += `**${route}**:\n> **From:** ${from}\n> **To:** ${to}\n> **Duration:** ${legDuration} minutes\n`; 
      } else if (leg.mode.id === 'walking') {
        description += `*${journey.legs.indexOf(leg) + 1}.* **Walking**:\n> _Refer to the linked website for detailed walking instructions._\n`;
      } else {
        description += `*${journey.legs.indexOf(leg) + 1}.* **${leg.mode.name}**:\n> _Refer to the linked website for detailed instructions._\n`;
      }
    }
    embed.addTextDisplayComponents(new TextDisplayBuilder().setContent(description));
    if (invalidDate) {
      embed.addSeparatorComponents(new SeparatorBuilder()).addTextDisplayComponents(new TextDisplayBuilder().setContent('**Note:** The date you provided was invalid, so the current date was used instead.'));
    }
    interaction.editReply({ flags: MessageFlags.IsComponentsV2, components: [embed] });
    console.log(chalk.green('Journey data sent successfully.'));
    return;

  } catch (error) {
    console.error(chalk.red('Error fetching journey data:'), error);
    return interaction.editReply({ content: 'An error occurred while fetching the journey data. Please try again later.' });
  }
}

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

export default {
  data,
  execute,
  autocomplete
};

module.exports = {
  data,
  execute,
  autocomplete
};

