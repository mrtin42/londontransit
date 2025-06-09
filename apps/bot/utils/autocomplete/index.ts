import axios from 'axios';

type StationChoice = {
  name: string;
  id: string;
}

export function isAutocompleteChoice(choice: any) {
  return choice.startsWith('auto:');
}

export async function station(query: string): Promise<StationChoice[]> {
  if (!query) return [];
  try {
    const response = await axios.get(`https://api.tfl.gov.uk/StopPoint/Search/${encodeURIComponent(query)}?app_key=${process.env.TFL_APP_KEY}&modes=tube,overground,dlr,elizabeth-line,tram,national-rail&includeHubs=false`);
    /**
     * bus stops handled seperately, as they are structured differently
     * hubs cause disambiguation issues in journey planning. for the time being, we will not include them in autocomplete results
     * - in the future, they'll be available for next arrivals and other commands so as to merge arrivals from multiple modes
     * - this is because hubs serve as a parent for multiple stops which are effectively the same stop, but with different IDs
     * - for example, 'Tottenham Court Road' is a hubthat contains:
     *     *   - 'Tottenham Court Road Underground Station': 940GZZLUTCR // as mentioned, the tube station
     *     *   - 'Tottenham Court Road': 910GTOTCTRD // the elizabeth line station, which is classed as a national rail station
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