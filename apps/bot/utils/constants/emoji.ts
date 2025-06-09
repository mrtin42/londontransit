type EmojiObject = {
  [key: string]: string;
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
];

export const transportModeEmojisById: Record<string, EmojiObject> = transportModeEmojis.reduce((acc, emoji) => {
  acc[emoji.mode] = emoji;
  return acc;
}, {} as Record<string, EmojiObject>);

export const undergroundLineEmojis: EmojiObject[] = [
  {
    line: 'bakerloo',
    label: 'Bakerloo Line',
    id: '1381570759897645118',
    markdown: '<:bakerloo:1381570759897645118>'
  }, {
    line: 'central',
    label: 'Central Line',
    id: '1381570798405423164',
    markdown: '<:central:1381570798405423164>'
  }, {
    line: 'circle',
    label: 'Circle Line',
    id: '1381570833440309258',
    markdown: '<:circle:1381570833440309258>'
  }, {
    line: 'district',
    label: 'District Line',
    id: '1381570895117815808',
    markdown: '<:district:1381570895117815808>'
  }, {
    line: 'hammersmith-city',
    label: 'Hammersmith & City Line',
    id: '1381570932111446076',
    markdown: '<:hammersmith_city:1381570932111446076>'
  }, {
    line: 'jubilee',
    label: 'Jubilee Line',
    id: '1381570999404855408',
    markdown: '<:jubilee:1381570999404855408>'
  }, {
    line: 'metropolitan',
    label: 'Metropolitan Line',
    id: '1381571043168354354',
    markdown: '<:metropolitan:1381571043168354354>'
  }, {
    line: 'northern',
    label: 'Northern Line',
    id: '1381571133953806356',
    markdown: '<:northern:1381571133953806356>'
  }, {
    line: 'piccadilly',
    label: 'Piccadilly Line',
    id: '1381571166237360288',
    markdown: '<:piccadilly:1381571166237360288>'
  }, {
    line: 'victoria',
    label: 'Victoria Line',
    id: '1381571203445166111',
    markdown: '<:victoria:1381571203445166111>'
  }, {
    line: 'waterloo-city',
    label: 'Waterloo & City Line',
    id: '1381571245501321226',
    markdown: '<:waterloo_city:1381571245501321226>'
  }
];

export const undergroundLineEmojisById: Record<string, EmojiObject> = undergroundLineEmojis.reduce((acc, emoji) => {
  acc[emoji.line] = emoji;
  return acc;
}, {} as Record<string, EmojiObject>);