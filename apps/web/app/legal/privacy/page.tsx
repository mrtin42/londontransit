export default function Page() {
  return (
    <main className="block min-h-screen bg-background text-foreground">
      <div className="w-full md:h-[55svh] bg-[url(/brand/hero.jpg)] bg-[#00000084] bg-blend-multiply bg-cover bg-center bg-no-repeat">
        <div className="w-full h-full flex flex-col md:flex-row items-center justify-center md:justify-between backdrop-blur-sm pt-25 pb-15 md:py-0 px-5 md:px-30">
          <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left mr-4">
            <h1 className="text-5xl md:text-8xl font-bold mb-2 -ml-1">Privacy Policy</h1>
            <p className="text-lg text-foreground mb-4">
              Your privacy is important to us. Please read our policy carefully.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-center w-full py-10 px-5 md:px-30 bg-white text-black">
        <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
        <p className="mb-4">
          This Privacy Policy explains how LondonTransit (the "Service", the "Bot" or "we") collects, uses, and protects your information when you use our service.
        </p>
        <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
        <p className="mb-4">
          We collect the following discrete information when you use our service:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>Your Discord account's public information, such as your username and ID, which is used to identify you within the Discord platform.</li>
          <li>Server information, including the server ID and name, which allows us to provide the service within the context of your Discord server as well as to provide analytics on the usage of the bot.</li>
          <li>Command inputs you provide, which are used to process your requests and deliver the requested information.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
        <p className="mb-4">
          We use the information we collect to:
        </p>
        <ul className="list-disc ml-6">
          <li>Provide and improve our service, including processing your commands and delivering the requested information.</li>
        </ul>
        <br />
        <p className="mb-4">
          Certain inputs are also provided to Transport for London (TfL) to retrieve the requested information, such as names of stations, bus stops, and other TfL-related data. This is unique to the command you provide and is not stored by us. We do not store any personal data or sensitive information that could identify you beyond what is necessary for the operation of the bot.
        </p>
        <h2 className="text-2xl font-bold mb-4">4. Data Retention</h2>
        <p className="mb-4">
          Data collected upon interaction with the bot is retained for the period necessary for the requested service and information to be provided. We do not directly retain any personal data beyond what is necessary for the operation of the bot.
          <br /><br />
          Some data collected necessary for the bot to connect to and efficiently operate within Discord is retained by code libraries essential to the bot's operation, such as Discord.js. LondonTransit cannot control the retention of this data, however we do not use this data for any purpose other than to provide the service.
          <br /><br />
          For more information on how Discord handles your data, please refer to their <a href="https://discord.com/privacy" className="text-blue-500 hover:underline">Privacy Policy</a>.
        </p>
        <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
        <p className="mb-4">
          We take the security of your information seriously and implement appropriate technical and organizational measures to protect it against unauthorized access, loss, or misuse. However, no method of transmission over the internet or method of electronic storage is 100% secure, and we cannot guarantee its absolute security.
        </p>
        <h2 className="text-2xl font-bold mb-4">6. Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. Such updates will be posted on our website and/or GitHub repository; whichever holds the most recent version should be considered the most up-to-date. Your continued use of the service after any changes constitutes your acceptance of the new Privacy Policy.
        </p>
        <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
        <p className="mb-4">
          If you have any questions or concerns about this Privacy Policy or our data practices, please contact us via our <a href="https://md3v.co.uk/contact" className="text-blue-500 hover:underline">developer's contact page</a>.
        </p>
        <h2 className="text-2xl font-bold mb-4">8. Governing Law</h2>
        <p className="mb-4">
          This Privacy Policy shall be governed by and construed in accordance with the laws of England and Wales, without regard to its conflict of law principles. Any disputes arising out of or related to this Privacy Policy or the service shall be subject to the exclusive jurisdiction of the courts of England and Wales.
        </p>
        <h2 className="text-2xl font-bold mb-4">9. Entire Agreement</h2>
        <p className="mb-4">
          This Privacy Policy constitutes the entire agreement between you and us regarding your use of the service and supersedes any prior agreements or understandings, whether written or oral, relating to the subject matter of this Privacy Policy.
        </p>
      </div>
    </main>
  )
}