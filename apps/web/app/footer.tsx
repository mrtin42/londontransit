export default function Footer() {
  return (
    <footer className="w-full bg-background text-white flex flex-col items-end py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm mb-2 md:mb-0">
            © {new Date().getFullYear()} LondonTransit, a <a href="https://md3v.co.uk" className="text-blue-500 hover:underline">MartinDEV</a> project. Hero image © 2024 <a href="https://md3v.co.uk" className="text-blue-500 hover:underline">MartinDEV</a>.
            <br /><br />
            LondonTransit uses open data provided by Transport for London (TfL) under the Open Government Licence v3.0. LondonTransit is not affiliated with Transport for London (TfL) or any other government body.
            <br /><br />
            <a href="/legal/privacy" className="text-sm text-blue-500 hover:underline">Privacy Policy</a>
            {' | '}
            <a href="/legal/terms" className="text-sm text-blue-500 hover:underline">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
}