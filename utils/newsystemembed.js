const { EmbedBuilder } = require('discord.js');

module.exports = new EmbedBuilder()
    .setAuthor(
        { name: 'Notification', iconURL: 'https://bird-with-down-syndrome.londontransit.org.uk/tfl/brand/lul-roundel.png' }
    )
    .setColor(0x000F9F)
    .setTimestamp()
    .setFooter(
        { text: 'Powered by Transport for London • This embed should stop appearing alongside replies in a few days' }
    ).setTitle('Important update to the application')
    .setDescription('LondonTransit has been updated to support global, user-scoped installations. This means that you can now use the application in any server, DM, or group chat. Commands have not changed, and the application will continue to function as normal. To get started, re-authenticate with the application by visiting [this link](https://discord.com/oauth2/authorize?client_id=1120820313379319880) and selecting "Use this app everywhere\n\nIf you have any questions or concerns, please contact the developer at [this link](https://www.martin.blue/contact).');

