export default function Page() {
  return (
    <main className="block min-h-screen bg-background text-foreground">
      <div className="w-full md:h-[55svh] bg-[url(/brand/hero.jpg)] bg-[#00000084] bg-blend-multiply bg-cover bg-center bg-no-repeat">
        <div className="w-full h-full flex flex-col md:flex-row items-center justify-center md:justify-between backdrop-blur-sm pt-25 pb-15 md:py-0 px-5 md:px-30">
          <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left mr-4">
            <h1 className="text-5xl md:text-8xl font-bold mb-2 -ml-1">Terms of Service</h1>
            <p className="text-lg text-foreground mb-4">
              Please read these terms carefully before using our service.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-center w-full py-10 px-5 md:px-30 bg-white text-black">
        <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By using our service, you agree to these terms and conditions. If you do not agree, please do not use our service.
        </p>
        <h2 className="text-2xl font-bold mb-4">2. Service Description</h2>
        <p className="mb-4">
          LondonTransit (the "Service", the "Bot" or "we") provides real-time Transport for London (TfL) information to users via Discord slash commands. The Service is designed to enhance the user experience by providing accurate and timely TfL data.
        </p>
        <h2 className="text-2xl font-bold mb-4">3. User Responsibilities</h2>
        <p className="mb-4">
          Users are responsible for ensuring that their use of the Service complies with all applicable laws and regulations. Users must not use the Service for any illegal or unauthorized purpose.
        </p>
        <h2 className="text-2xl font-bold mb-4">4. Data Usage</h2>
        <p className="mb-4">
          Refer to our <a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a> for information on how we collect, use, and protect your data.
        </p>
        <h2 className="text-2xl font-bold mb-4">5. Changes to Terms</h2>
        <p className="mb-4">
          We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website or GitHub repository, whichever holds the most recent version. Your continued use of the Service after any changes constitutes your acceptance of the new terms.
        </p>
        <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
        <p className="mb-4">
          The Service is provided "as is" and we make no warranties or representations about the accuracy or completeness of the information provided. We will not be liable for any damages arising from your use of the Service, including but not limited to direct, indirect, incidental, or consequential damages.
        </p>
        <h2 className="text-2xl font-bold mb-4">7. Service Termination</h2>
        <p className="mb-4">
          We reserve the right to terminate or suspend access to the Service at any time, without notice, for conduct that we believe violates these terms or is harmful to other users of the Service, us, or third parties, or for any other reason.
        </p>
        <h2 className="text-2xl font-bold mb-4">8. Contact Information</h2>
        <p className="mb-4">
          If you have any questions about these terms, please contact us via our <a href="https://md3v.co.uk/contact" className="text-blue-500 hover:underline">developer's contact page</a>.
        </p>
        <h2 className="text-2xl font-bold mb-4">9. Governing Law</h2>
        <p className="mb-4">
          These terms shall be governed by and construed in accordance with the laws of England and Wales, without regard to its conflict of law principles. Any disputes arising out of or related to these terms or the Service shall be subject to the exclusive jurisdiction of the courts of England and Wales.
        </p>
        <h2 className="text-2xl font-bold mb-4">10. Entire Agreement</h2>
        <p className="mb-4">
          These terms constitute the entire agreement between you and us regarding your use of the Service and supersede any prior agreements or understandings, whether written or oral, relating to the subject matter of these terms.
        </p>
      </div>
    </main>
  )
}