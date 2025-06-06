export default function LegalPage() {
  return (
    <main className="block h-max bg-background text-foreground">
      <div className="w-full h-[60vh] flex items-center justify-center bg-[url(/brand/hero.jpg)] bg-[#00000084] bg-blend-multiply bg-cover bg-center bg-no-repeat">
        <div className="bg-opacity-50 p-10 rounded-lg text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Legal Information</h1>
          <p className="text-lg text-white mb-6">
            This page contains important legal information regarding the use of our services.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-semibold mb-4">Terms of Service</h2>
        <p className="mb-4">
          By using our services, you agree to comply with our terms and conditions. Please read them carefully.
        </p>
        <a href="/legal/terms" className="text-blue-500 hover:underline mb-4 block">
          Read the full Terms of Service &rarr;
        </a>
        <h2 className="text-3xl font-semibold mb-4">Privacy Policy</h2>
        <p className="mb-4">
          We value your privacy and are committed to protecting your personal information. Our privacy policy outlines how we collect, use, and protect your data.
        </p>
        <a href="/legal/privacy" className="text-blue-500 hover:underline mb-4 block">
          Read the full Privacy Policy &rarr;
        </a>
        <h2 className="text-3xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions or concerns regarding our legal policies, please feel free to contact us.
        </p>
        <a href="https://md3v.co.uk/contact" className="text-blue-500 hover:underline">
          Contact Us &rarr;
        </a>
      </div>
    </main>
  );
}