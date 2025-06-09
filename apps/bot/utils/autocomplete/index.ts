import axios from 'axios';

type StationChoice = {
  name: string;
  id: string;
}

export async function station(query: string): Promise<StationChoice[]> {
  if (!query) return [];
  try {
    const response = await axios.get(`https://api.tfl.gov.uk/StopPoint/Search/${encodeURIComponent(query)}?app_key=${process.env.TFL_APP_KEY}&modes=tube,overground,dlr,elizabeth-line,tram,national-rail&includeHubs=false`);
    /**
     * bus stops handled seperately, as they are structured differently
     * hubs cause disambiguation issues in journey planning, excluding them returns different parts of the same station, which is what we want as they each have their own NAPTAN ID
     */
    if (response.data && response.data.matches) {
      return response.data.matches.map((match: any) => {
        if (!match.id.startsWith('9')) { // this isnt a NAPTAN ID, so we should not use it
          console.warn('Skipping match with non-NAPTAN ID:', match.id);
          return null; // skip this match
        } else if (response.data.matches.indexOf(match) > 24) {
          if (response.data.matches.indexOf(match) === 25) {
            console.warn('Hitting Discord-set maximum autocomplete results, stopping further processing.');
          }
          return null; // skip this match, as we have hit the maximum number of results Discord allows for autocomplete
        } else {
          console.log('Found station:', match.name, 'with ID:', match.id);
          return {
            name: match.name,
            id: `auto:${match.id}`, // prefix with 'auto:' to indicate this is an autocomplete result. that way, we can differentiate it from a free-string search and stop those from being used in the plan-a-journey command
          };
        }
      });
    }
  } catch (error) {
    console.error('Error fetching station data:', error);
  }
  return [];
}