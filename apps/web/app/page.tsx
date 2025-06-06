import Image from "next/image";

export default function Home() {
  return (
    <main className="block min-h-screen bg-background text-foreground">
      <div className="w-full md:h-[55svh] bg-[url(/brand/hero.jpg)] bg-[#00000084] bg-blend-multiply bg-cover bg-center bg-no-repeat">
        <div className="w-full h-full flex flex-col md:flex-row items-center justify-center md:justify-between backdrop-blur-sm pt-25 pb-15 md:py-0 px-5 md:px-30">
          <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left mr-4">
            <h1 className="text-5xl md:text-8xl font-bold mb-2 -ml-1">Next Stop: your server.</h1>
            <p className="text-lg text-foreground mb-4">
              LondonTransit brings live Transport for London data to your Discord server.
            </p>
            <a
            href="https://discord.com/oauth2/authorize?client_id=1109170357568557156"
            target="_blank"
            rel="noopener noreferrer"
            className="self-center md:self-start bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl transition-colors duration-300"
            >
              Add to Discord
            </a>
          </div>
          <div className="h-max flex items-center justify-center">
            <Image
              src="/demo/profile.png"
              alt="A picture of an Apple iPhone displaying LondonTransit's bot user profile."
              width={300}
              height={300}
              className="hidden md:block hover:scale-105 hover:rotate-3 transition-transform duration-1000 ease-in-out"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full py-10 px-5 md:px-30 bg-white">
        <h2 className="text-center text-4xl font-bold text-black mb-4">
          Join over 50 servers bringing live TfL data to their communities
        </h2>
        <p className="text-center text-lg text-gray-800">
          LondonTransit is the go-to bot for real-time, accurate, and easy-to-use Transport for London data in Discord. Whether you're a commuter, tourist, enthusiast, or just curious, LondonTransit has you covered.
          <br /><br />
          Check station departures and cycle docks. Check network status and individual lines. Track down buses and check bus times (coming soon). Wherever you go, make LondonTransit your companion.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center w-full pt-10 bg-gradient-to-b from-[#3a2b82] to-[#2a39aa] text-white text-center">
        <div className="flex flex-col md:flex-row items-center text-center justify-between w-full px-5 md:px-30 border-b-2">
          <div className="flex flex-col items-center md:items-start max-w-1/2">
            <h2 className="text-4xl font-bold mb-2">Station Departures</h2>
            <p className="text-lg mb-4 md:text-left">
              Get up-to-date departure information for any Tube station, showing line, destination, and time to arrival.
            </p>
          </div>
          <div className="flex flex-col items-end justify-center">
            <Image
              src="/demo/departures.png"
              alt="A screenshot of the LondonTransit bot displaying station departures."
              width={400}
              height={300}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center text-center justify-between w-full px-5 md:px-30 border-b-2 mt-10">
          <div className="flex flex-col items-center md:items-start max-w-1/2">
            <h2 className="text-4xl font-bold mb-2">Bus Tracking</h2>
            <p className="text-lg mb-4 md:text-left">
              Track buses by their license plate, get real-time route information, and see their next stop.
            </p>
          </div>
          <div className="flex flex-col items-end justify-center">
            <Image
              src="/demo/buses.png"
              alt="A screenshot of the LondonTransit bot displaying a bus's route and location."
              width={400}
              height={300}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center text-center justify-between w-full px-5 md:px-30 border-b-2 mt-10">
          <div className="flex flex-col items-center md:items-start max-w-1/2">
            <h2 className="text-4xl font-bold mb-2">Status Updates</h2>
            <p className="text-lg mb-4 md:text-left">
              Receive real-time updates on service disruptions and delays, including full network overviews and specific line information.
            </p>
          </div>
          <div className="flex flex-col items-end justify-center">
            <Image
              src="/demo/status.png"
              alt="A screenshot of the LondonTransit bot displaying live updates."
              width={400}
              height={300}
            />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-between w-full px-5 md:px-30 py-10">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            And more...
          </h2>
          <ul className="list-outside text-lg lg:text-right text-foreground">
            <li>
              <span className="lg:hidden">&#8226; </span>Check live cycle dock availability and locations.<span className="hidden lg:inline"> &#8226;</span>
            </li><li>
              <span className="lg:hidden">&#8226; </span>Plan journeys and see each step in an embed, or view it on TfL's website.<span className="hidden lg:inline"> &#8226;</span>
            </li><li>
              <span className="lg:hidden">&#8226; </span>Get live bus times from any bus stop in London (coming soon).<span className="hidden lg:inline"> &#8226;</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full py-10 px-5 md:px-30 bg-white">
        <h2 className="text-4xl font-bold text-black mb-4">
          Add LondonTransit now and traverse London with ease.
        </h2>
        <p className="text-lg text-gray-800 mb-4">
          LondonTransit can be added to your server for all-member use, or added to your account for use anywhere on Discord<sup>1</sup>. It is free to use, and will always be free to use.
          <br /><br />
          Consider supporting the project by donating on Buy Me a Coffee. Your support helps keep the bot running and allows for continued development and improvements.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center space-x-0 md:space-x-4 space-y-4 md:space-y-0">
          <a
            href="https://discord.com/oauth2/authorize?client_id=1109170357568557156"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl transition-colors duration-300"
          >
            Add to Discord
          </a>
          <a
            href="https://coff.ee/md3v"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-2xl transition-colors duration-300"  
          >
            Support us on Buy Me a Coffee
          </a> 
        </div> 
        <p className="text-sm text-gray-500 mt-4">
          1. When added as a user account, LondonTransit can be used in any server, DM or group DM. In servers with over 25 members, responses are private if the bot is not also added to that server.
        </p>
      </div>
    </main>
  );
}
