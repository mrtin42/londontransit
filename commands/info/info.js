const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');


const botInfo = new EmbedBuilder()
          .setColor(0x00059F)
          .setTitle('LondonTransit bot info')
          .setDescription('An up-and-coming bot for to help you get about london without having to leave discord.\n\nUsing the magic of JavaScript, this bot works with TfL to bring you the latest information on the most iconic transit network, the London Underground.\n\nThis bot is extremely new so features are very limited and bugs may arise. Please feel free to contact the project owner to report any issues!')
          .setThumbnail('https://bot.tubee.dev/assets/images/image01.jpg?v=d25f2a08')
          .setTimestamp()
          .setFooter({ text: 'a tube#0011 project - https://londontransit.xyz/'});


module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('gives bot info'),

    async execute(interaction) {
        
        interaction.reply({embeds: [botInfo]});

    }
};