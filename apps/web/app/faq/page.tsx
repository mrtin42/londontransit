export default function Page() {
  return (
    <main className="block min-h-screen bg-background text-foreground">
      <div className="w-full md:h-[55svh] bg-[url(/brand/hero.jpg)] bg-[#00000084] bg-blend-multiply bg-cover bg-center bg-no-repeat">
        <div className="w-full h-full flex flex-col md:flex-row items-center justify-center md:justify-between backdrop-blur-sm pt-25 pb-15 md:py-0 px-5 md:px-30">
          <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left mr-4">
            <h1 className="text-5xl md:text-8xl font-bold mb-2 -ml-1">Frequently Asked Questions</h1>
            <p className="text-lg text-foreground mb-4">
              Answers to common questions about LondonTransit.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-center w-full py-10 px-5 md:px-30 bg-white text-black">
        <h2 className="text-2xl font-bold mb-4">1. What is LondonTransit?</h2>
        <p className="mb-4">
          LondonTransit is a Discord bot that provides live Transport for London (TfL) data, including station departures, network status, and more.
        </p>
        <h2 className="text-2xl font-bold mb-4">2. How do I add LondonTransit to my server?</h2>
        <p className="mb-4">
          You can add LondonTransit to your server by clicking the "Add to Discord" button on our homepage or by visiting our GitHub repository.
        </p>
        <h2 className="text-2xl font-bold mb-4">3. What commands does LondonTransit support?</h2>
        <p className="mb-4">
          LondonTransit supports a variety of commands, including checking station departures, planning journeys, and checking network status. For a full list of commands, please refer to our documentation.
        </p>
        <h2 className="text-2xl font-bold mb-4">4. Is LondonTransit free to use?</h2>
        <p className="mb-4">
          Yes, LondonTransit is completely free to use. It is an open-source project developed by the community for the community.
        </p>
        <h2 className="text-2xl font-bold mb-4">5. How can I contribute to LondonTransit?</h2>
        <p className="mb-4">
          We welcome contributions from the community! You can contribute by reporting issues, suggesting features, or submitting pull requests on our GitHub repository.
        </p>
        <h2 className="text-2xl font-bold mb-4">6. Where can I find more information about LondonTransit?</h2>
        <p className="mb-4">
          You can find more information about LondonTransit on our <a href="/docs" className="text-blue-500 hover:underline">documentation page</a>, or by <a href="https://md3v.co.uk/contact" className="text-blue-500 hover:underline">contacting the developer</a> directly. If you have any questions or need support, feel free to reach out!
        </p>
      </div>
    </main>
  )
}