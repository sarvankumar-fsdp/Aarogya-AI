export default function TermsAndConditions() {
    return (
        <main className="min-h-screen bg-black text-white px-6 md:px-44 py-20">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Terms & Conditions</h1>

            <section className="space-y-6 text-gray-300 text-md leading-relaxed">
                <p>
                    Welcome to Aarogya.me. By accessing or using our services, you agree to be bound by these Terms & Conditions. If you do not agree with any part of the terms, please refrain from using our website.
                </p>

                <div>
                    <h2 className="text-xl font-semibold text-white mb-2">1. Use of the Platform</h2>
                    <p>
                        Aarogya.me provides health-related features such as AI medication recommendations, prescription storage, and doctor consultations. This platform is not intended to replace professional medical advice, diagnosis, or treatment.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-white mb-2">2. User Responsibilities</h2>
                    <p>
                        You agree to use the platform only for lawful purposes and to provide accurate health information when prompted. Misuse of any features or violation of these terms may result in account suspension.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-white mb-2">3. Data Privacy</h2>
                    <p>
                        Your health data is encrypted and securely stored. We value your privacy and handle your information in accordance with our <a href="/privacy-policy" className="underline text-blue-400 hover:text-blue-300">Privacy Policy</a>.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-white mb-2">4. Modifications</h2>
                    <p>
                        Aarogya.me reserves the right to update these Terms & Conditions at any time. Continued use of the site after changes implies acceptance of the updated terms.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-white mb-2">5. Contact</h2>
                    <p>
                        For questions or concerns regarding these terms, please reach out to us via our <a href="/contact" className="underline text-blue-400 hover:text-blue-300">Contact Page</a>.
                    </p>
                </div>
            </section>
        </main>
    );
}
  