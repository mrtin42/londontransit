<a href="https://londontransit.org.uk">
    <img src="https://londontransit.org.uk/assets/images/botlogo.svg" alt="LOGO" title="LondonTransit" align="right" height="60"/>
</a>

# LondonTransit

> **LondonTransit is now available as a user application! For more info, see ['Add to server'](#add-to-server)**

[![GPL Licence](https://badges.frapsoft.com/os/gpl/gpl.svg?v=103)](https://opensource.org/licenses/GPL-3.0/)
[![codebeat badge](https://codebeat.co/badges/4db1b9fd-e976-4203-93be-671952d6f00f)](https://codebeat.co/projects/github-com-t-ub3-londontransit-main)
[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v1/monitor/14mic.svg)](https://status.martindev.xyz)

LondonTransit is a discord bot that provides realtime public transport information for London, including the London Underground and the London Bus network, using the [Transport For London Unified API](https://api-portal.tfl.gov.uk/).

## Features

#### Real-time information

All returned information is always up to date, meaning that you will always know when your next bus or train is coming, and journeys will always be planned to account for current delays and disruptions.
> *COMING SOON*: /nextarrivals responses updated LIVE (if user selects option)

#### Easy to use

LondonTransit is easy to use, with a simple command structure and a easy-to-read format.

#### View more information

Wherever LondonTransit cant provide detail, LondonTransit will provide a link to the TFL website, where you can find more information. Journey Planner will also display this journey on the TFL website.

## Add to server

To add LondonTransit to your server, click [here](https://discord.com/oauth2/authorize?client_id=1109170357568557156). There are two ways to use LondonTransit:
- **Bot user**: Add the bot user to a server you manage. Replies are visible to everyone and can be used by all members, even if they havent added the bot themselves (limited to the server the bot user is in)
- **User app**: Install the app to your personal account, and you can use its commands everywhere, including DMs and Group DMs. (When executed in a server it is not in, messages are forced to only be visible to you if the server has more than 25 members as per Discord policies

## Contributing

Your help is always appreciated, as I am one man working on this and teamwork makes the dream work. If you would like to contribute, please feel free to fork this repository and make a pull request. If you would like to discuss a feature, please open an issue. CONTRIBUTING.md will be coming soon.

If you've found a bug, you can either open an issue or email me at [hello@londontransit.org.uk](mailto:hello@londontransit.org.uk)

## Commands

### Table of Contents
- [Service Status](#servicestatus)
- [Line Status](#linestatus)
- [Journey Planner](#journey)
- [Next Arrivals](#nextarrivals)
- [Locate Bus](#locatebus)
- [Cycle Dock](#cycledock)
- [Bot Info](#info)

### Introduction
LondonTransit offers a variety of commands to help you navigate London's transport network. Below is a detailed list of available commands, their descriptions, and usage examples.

### `/servicestatus`
Displays the current status of the TfL network.

**Usage Example:**
```
/servicestatus
```

### `/linestatus {line}`
Displays the current status of a specific TfL line.

**Usage Example:**
```
/linestatus Central
```

### `/journey {origin} {destination}`
Displays the fastest route between two stations. Shows results inline with current service availability.

**Usage Example:**
```
/journey King's Cross St. Pancras Waterloo
```

### `/nextarrivals {station}`
Displays the next arrivals at a specific station. *currently only supports the tube*

**Usage Example:**
```
/nextarrivals Victoria
```

### `/locatebus {regplate}`
Displays the current location of a specific bus.

**Usage Example:**
```
/locatebus LTZ1748
```

### `/cycledock {dock}`
Displays the current availability of a specific cycle dock. *protip: the name is usually the road its on*

**Usage Example:**
```
/cycledock Baker Street
```

### `/info`
Displays information about the bot.

**Usage Example:**
```
/info
```

## License

This project is licensed under the GNU General Public License v3.0 - see the [license](LICENSE) file for details.

## Acknowledgements

-   [TfL Unified API](https://api-portal.tfl.gov.uk/)
-   [Discord.js](https://discord.js.org/#/)
-   [Node.js](https://nodejs.org/en/)
-   [Axios](https://axios-http.com/)
-   [GitHub](https://github.co.uk/)

## Contact

Got questions? email me at [me@martin.blue](mailto:me@martin.blue).
