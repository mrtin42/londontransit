import { SlashCommandBuilder, EmbedBuilder, CommandInteraction, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SectionBuilder, ButtonBuilder, ButtonStyle, MessageFlags, AutocompleteInteraction } from 'discord.js';
import axios from 'axios';
import chalk from 'chalk';
import { isAutocompleteChoice, station } from "@/utils/autocomplete";
import { Section } from '@react-email/components';
import { dub } from '@/index';
import { LinkSchema } from 'dub/dist/commonjs/models/components';
import { transportModeEmojis } from '@/utils/constants/emoji';

type RelevantInfoObject = {
  from: string;
  to: string;
  fare: string;
  duration: number;
  link: string;
  legs: {
    route: string;
    mode: string;
    emoji: string;
    from: string;
    to: string;
    duration: number;
  }[];
}

type RelevantInfoError = {
  error: string;
}

function dateCheck(date: string | null): string | false {
  if (!date) return false; // no date provided, so we will use the current date
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
  if (dateRegex.test(date)) {
    return new Date(date).toISOString(); // valid date format, return ISO string
  } else {
    console.warn(chalk.yellow('Invalid date format provided, resetting to null.'));
    return false; // invalid date format, reset to null
  }
}

function assembleJourneySteps(embed: ContainerBuilder, info: RelevantInfoObject): ContainerBuilder {
      let description = '';
    for (const leg of info.legs) {
      const { from, to, emoji, route, mode, duration } = leg;
      if (leg.mode === 'walking') {
        description += `*${info.legs.indexOf(leg) + 1}.* **Walking**:\n> _Refer to the linked website for detailed walking instructions._\n`;
      } else {
        description += `*${info.legs.indexOf(leg) + 1}.* ${emoji} **${route}${mode === 'tube' || mode === 'overground' ? ' line' : ''}**:\n`;
        description += `> **From:** ${from}\n> **To:** ${to}\n> **Duration:** ${duration} minutes\n`;
      }
      // } else if (leg.mode.id === 'bus') {
      //   const route = leg.instruction.detailed;
      //   const legDuration = leg.duration;
      //   const from = `${leg.departurePoint.commonName}, stop ${leg.departurePoint.stopLetter}`;
      //   const to = `${leg.arrivalPoint.commonName}, stop ${leg.arrivalPoint.stopLetter}`;
      //   description += `*${legs.indexOf(leg) + 1}.* `;
      //   description += `${transportModeEmojis.find(emoji => emoji.mode === 'bus')?.markdown || ''} `;
      //   description += `**${route}**:\n> **From:** ${from}\n> **To:** ${to}\n> **Duration:** ${legDuration} minutes\n`; 
      // } else if (leg.mode.id === 'walking') {
      //   description += `*${legs.indexOf(leg) + 1}.* **Walking**:\n> _Refer to the linked website for detailed walking instructions._\n`;
      // } else {
      //   description += `*${legs.indexOf(leg) + 1}.* **${leg.mode.name}**:\n> _Refer to the linked website for detailed instructions._\n`;
      // }
    }
    return embed.addTextDisplayComponents(new TextDisplayBuilder().setContent(description));

}

async function relevantInfo(journey: any): Promise<RelevantInfoObject | RelevantInfoError> {
  if (!journey || !journey.legs || journey.legs.length === 0) {
    console.warn(chalk.yellow('Journey data is incomplete or missing legs.'));
    return { error: 'Journey data is incomplete or missing legs.' };
  }
  const { from, to } = { from: journey.legs[0].departurePoint.commonName || 'Unknown Origin', to: journey.legs[journey.legs.length - 1].arrivalPoint.commonName || 'Unknown Destination' };
  const fare = (() => {
    if (!journey.fare) {
      console.warn(chalk.yellow('No fare information found for the journey.'));
      return 'Variable: visit website for details';
    }
    if (!journey.fare.totalCost) {
      console.warn(chalk.yellow('No total fare cost found for the journey.'));
      return 'Variable: visit website for details';
    }
    return `£${(journey.fare.totalCost / 100).toFixed(2)} (${journey.fare.fares[0].chargeLevel || 'anytime'})`;
  })();
  const duration = journey.duration || 0; // default to 0 if duration is not provided - will be displayed as 'Unknown Duration' in the embed
  const fullLink = new URL(`https://tfl.gov.uk/plan-a-journey/results/`);
  fullLink.searchParams.append('InputFrom', from);
  fullLink.searchParams.append('FromId', journey.legs[0].departurePoint.icsId);
  fullLink.searchParams.append('InputTo', to);
  fullLink.searchParams.append('ToId', journey.legs[journey.legs.length - 1].arrivalPoint.icsId);
  let link: string;
  if (process.env.NODE_ENV === 'development') {
    console.warn(chalk.yellow('Development mode: not shortening the link to avoid hitting plan link limit.'));
    link = fullLink.toString(); // in development mode, we will not shorten the link to avoid hitting the plan link limit
  } else {
    link = (await dub.links.create({
      url: fullLink.toString(),
      prefix: '/j/',
      domain: 'ldnts.it'
    })).shortLink || fullLink.toString(); // fallback to the original link if there's an error creating the short link
  }
  const legs = journey.legs.map((leg: any) => {
    const route = (() => {
      if (leg.mode.id === 'bus') {
        return leg.instruction.detailed || 'Unknown Route';
      } else if (leg.mode.id === 'walking') {
        return 'Walking';
      } else if (leg.mode.id === 'tube' || leg.mode.id === 'dlr' || leg.mode.id === 'overground' || leg.mode.id === 'national-rail' || leg.mode.id === 'elizabeth-line' || leg.mode.id === 'tram') {
        return leg.routeOptions[0]?.name || 'Unknown Route';
      }
    })();
    const mode = leg.mode.id || 'Unknown Mode';
    const emoji = transportModeEmojis.find(e => e.mode === leg.mode.id)?.markdown || '';
    const from = leg.departurePoint.commonName || 'Unknown Origin';
    const to = leg.arrivalPoint.commonName || 'Unknown Destination';
    const duration = leg.duration || 0; // default to 0 if duration is not provided
    return { route, mode, emoji, from, to, duration };
  });
  return {
    from,
    to,
    fare,
    duration,
    link,
    legs
  };
}

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
  if (!isAutocompleteChoice(from) || !isAutocompleteChoice(to)) {
    return interaction.editReply({ content: 'Please select a station from the autocomplete suggestions.' });
  }
  const f = from.split(':')[1];
  const t = to.split(':')[1];
  // let date = interaction.options.get('date')?.value as string | null;
  let invalidDate = false;
  // const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
  // if (date && !dateRegex.test(date)) {
  //   date = null; // reset date to null; conditional code will see false and use current date instead
  //   invalidDate = true;
  // }
  // const formattedDate = date ? new Date(date).toISOString() : new Date().toISOString();
  const date = interaction.options.get('date')?.value as string | null;
  const formattedDate = dateCheck(date);
  if (formattedDate === false) {
    console.warn(chalk.yellow('Invalid date format provided, resetting to null.'));
    invalidDate = true; // set invalidDate to true so we can inform the user later
  }

  try {
    const response = await axios.get(`https://api.tfl.gov.uk/Journey/JourneyResults/${f}/to/${t}?app_key=${process.env.TFL_APP_KEY}${date ? `&date=${formattedDate}` : ''}`);
    if (!response.data || !response.data.journeys || response.data.journeys.length === 0) {
      console.warn(chalk.yellow('No journeys found for the specified route and date.'));
      return interaction.editReply({ content: 'No journeys found for the specified route and date.' });
    }
    const journey = response.data.journeys[0]; /* who needs multiple journeys? you dont bring pieces of yourself at different times */
    if (!journey) {
      return interaction.editReply({ content: 'No journey found for the specified route and date.' });
    };
    // const fromName: string = response.data.journeyVector.from;
    // const toName: string = response.data.journeyVector.to;
    // this would have returned the strings given to the API - since we are using NAPTAN IDs, we should determine the names from the departure point of the first leg of the journey and the arrival point of the last leg of the journey
    const info = await relevantInfo(journey);
    if ('error' in info) {
      console.warn(chalk.yellow(info.error));
      return interaction.editReply({ content: 'An error occurred while processing the journey data. Please try again later.' });
    }
    console.log(chalk.blue('Shortened TFL journey link:') + chalk.green(` ${info.link}`));
    // divide the journey fare by 100 to convert from pence to pounds and put to two decimal places. if no fares listed, return 'Variable: visit website for details'

    const one = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ${info.from} to ${info.to}`))
      .addSeparatorComponents(new SeparatorBuilder())
      .addSectionComponents(new SectionBuilder()
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`
          **Adult fare:** ${info.fare}\n**Duration:** ${info.duration} minutes\n
          `))
        .setButtonAccessory(new ButtonBuilder().setURL(info.link).setLabel('View on tfl.gov.uk').setStyle(ButtonStyle.Link))
      );
    const embed = assembleJourneySteps(one, info);
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

