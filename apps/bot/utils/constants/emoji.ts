type EmojiObject = {
  mode: string;
  label: string;
  id: string;
  markdown: string;
}

export const transportModeEmojis: EmojiObject[] = [
  {
    mode: 'tube',
    label: 'Tube',
    id: '1381391813906141204',
    markdown: '<:tube:1381391813906141204>'
  }, {
    mode: 'overground',
    label: 'Overground',
    id: '1381391887344074832',
    markdown: '<:overground:1381391887344074832>'
  }, {
    mode: 'dlr',
    label: 'DLR',
    id: '1381391854159003828',
    markdown: '<:dlr:1381391854159003828>'
  }, {
    mode: 'bus',
    label: 'Buses',
    id: '1381391712705974403',
    markdown: '<:buses:1381391712705974403>'
  }, {
    mode: 'tram',
    label: 'Trams',
    id: '1381391936555843755',
    markdown: '<:trams:1381391936555843755>'
  }, {
    mode: 'national-rail',
    label: 'National Rail',
    id: '1381391976699662466',
    markdown: '<:national_rail:1381391976699662466>'
  }, {
    mode: 'elizabeth-line',
    label: 'Elizabeth Line',
    id: '1381393727502815242',
    markdown: '<:elizabeth_line:1381393727502815242>'
  }
]