const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');


const botInfo = new EmbedBuilder()
          .setColor(0x00059F)
          .setTitle('LondonTransit bot info')
          .setDescription('A handy bot to help you get about London without having to leave discord.\n\nUsing the magic of JavaScript, this bot works with TfL to bring you the latest information on the most iconic transit network, the London Underground.\n\nThis bot is quite new so features are limited and bugs may arise. Please feel free to contact the project owner to report any issues!')
          .setThumbnail('https://bot.tubee.dev/assets/images/image01.jpg?v=d25f2a08')
          .setTimestamp()
          .setFooter({ text: 'a tube#0011 project - https://londontransit.xyz/'});


module.exports = {
	// data: new SlashCommandBuilder()
	// 	.setName('info')
	// 	.setDescription('gives bot info'),
    data: {
        name: 'info',
        description: 'gives bot info',
        "integration_types": [0,1],
        "contexts": [0,1,2]
    },

    async execute(interaction) {
        
        interaction.reply({embeds: [botInfo]});

    }
};