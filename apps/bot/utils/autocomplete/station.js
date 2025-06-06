const axios = require('axios');

module.exports = async (interaction, scope) => {
    console.log('Autocomplete called');
    const focusedOption = interaction.options.getFocused(false);
    console.log(`Focused option: ${focusedOption}`);
    if (focusedOption == '') {
      console.log('No value entered');
      await interaction.respond([{ name: 'Enter a station name', value: 'AUTOCOMPLETE_ERROR:no_input'}]);
      return;
    }
    let choices = [];
    console.log('making request');
    const res = await axios.get(`https://api.tfl.gov.uk/StopPoint/Search/${focusedOption}?app_key=32165e2dbd9e4da9a804f88d7495d9d3&modes=${scope}&includeHubs=false`);
    console.log(`request made, response code: ${res.status}`);
    if (res.status != 200) {
      console.log('Autocomplete failed');
      await interaction.respond([{ name: 'No results found: Technical Error', value: 'AUTOCOMPLETE_ERROR:internal_error'}]);
      return;
    }
    for (const i of res.data.matches) {
      console.log(`Adding ${i.name} to choices`);
      choices.push(i.name)
      if (choices.length >= 25) {
        console.log('25 choices reached: breaking');
        break;
      }
    }
    console.log('Autocomplete succeeded');
    return choices;
}