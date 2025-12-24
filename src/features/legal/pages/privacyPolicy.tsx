import { PageHeader } from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

 export const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="dark:bg-[#0D1117] min-h-screen">
      <PageHeader />

      <main className="page-padding-x py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-3 text-neutral-n4 dark:text-snow-200 hover:text-brand-secondary transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="hidden sm:block">Back</span>
            </button>

            <div className="flex flex-col">
              <h1 className="sz-2 font-bold text-neutral-n4 dark:text-snow-200">Privacy Policy</h1>
              <p className="text-sm text-neutral-n5 dark:text-snow-200">Last updated: October 15, 2025</p>
            </div>
          </div>

          <div className="block-style mb-6">
            <h2 className="text-lg font-semibold text-neutral-n4 dark:text-snow-200 mb-2">Contact Information</h2>
            <p className="text-sm text-neutral-n5 dark:text-snow-200">
              For any questions about this privacy policy, please contact us at:{" "}
              <a href="mailto:info@tikianaly.com" className="text-brand-primary hover:underline">
                info@tikianaly.com
              </a>
            </p>
          </div>

          <div className="block-style">
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-bold text-neutral-n4 dark:text-snow-200 mb-3">1. Introduction</h2>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed mb-3">
                  Welcome to TikiAnaly. We respect your privacy and are committed to protecting your information.
                  This privacy policy explains how we collect, use, store, and share information when you use our
                  platforms, apps, and services (collectively, our "Services").
                </p>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed mb-3">
                  When we mention "TikiAnaly," "we," "us," or "our", we mean TikiAnaly, the entity responsible
                  for processing your data.
                </p>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed">
                  By using our Services, you agree to the terms outlined in this policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-neutral-n4 dark:text-snow-200 mb-3">2. Information We Collect</h2>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed mb-4">
                  We collect information to provide and improve our Services. The types of information we may collect include:
                </p>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-neutral-n4 dark:text-snow-200 mb-1">a. Personal Data</h3>
                    <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed">
                      Data that identifies you, such as your name, email address, profile information, or social media accounts if you connect them.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-n4 dark:text-snow-200 mb-1">b. Usage and Device Data</h3>
                    <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed">
                      Data about how you use our Services, your device type, operating system, IP address, app version, and browsing patterns.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-n4 dark:text-snow-200 mb-1">c. Aggregated Data</h3>
                    <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed">
                      Non-identifiable data, such as analytics and statistics about usage trends.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-n4 dark:text-snow-200 mb-1">d. Marketing Data</h3>
                    <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed">
                      Preferences regarding newsletters, promotions, and other communications.
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded border border-snow-200 dark:border-[#1F2937] bg-snow-100 dark:bg-[#161B22]">
                  <p className="text-sm text-neutral-n5 dark:text-snow-200">
                    <strong>Note:</strong> We do not collect sensitive personal data (e.g., race, religion, health) or criminal information.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-neutral-n4 dark:text-snow-200 mb-3">3. How We Collect Your Information</h2>
                <ul className="list-disc list-inside space-y-2 text-sm text-neutral-n5 dark:text-snow-200">
                  <li><strong>Directly from you:</strong> When you register, interact with our Services, or contact us.</li>
                  <li><strong>Automatically:</strong> Through cookies, app analytics, and usage tracking.</li>
                  <li><strong>From third parties:</strong> Only when you consent or for services related to co-branded events or promotions.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-neutral-n4 dark:text-snow-200 mb-3">4. How We Use Your Information</h2>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed mb-3">We use your information to:</p>
                <ul className="list-disc list-inside space-y-2 text-sm text-neutral-n5 dark:text-snow-200 mb-3">
                  <li>Provide, improve, and personalize our Services.</li>
                  <li>Communicate with you about updates, promotions, or support requests.</li>
                  <li>Analyze usage patterns to improve the app experience.</li>
                  <li>Comply with legal obligations.</li>
                  <li>Protect the security of our Services.</li>
                </ul>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed">
                  Wherever possible, we rely on lawful bases such as your consent, contractual necessity, or legitimate interests.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-neutral-n4 dark:text-snow-200 mb-3">5. Sharing Your Information</h2>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed mb-3">We may share your information with:</p>
                <ul className="list-disc list-inside space-y-2 text-sm text-neutral-n5 dark:text-snow-200 mb-3">
                  <li>Service providers (hosting, analytics, marketing support).</li>
                  <li>Partners for co-branded services, promotions, or competitions.</li>
                  <li>In business transactions, such as mergers or acquisitions.</li>
                </ul>
                <div className="p-4 rounded border border-snow-200 dark:border-[#1F2937] bg-snow-100 dark:bg-[#161B22]">
                  <p className="text-sm text-neutral-n5 dark:text-snow-200">
                    <strong>We never sell your personal data to third parties.</strong>
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-neutral-n4 dark:text-snow-200 mb-3">6. International Transfers</h2>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed">
                  Your information may be transferred or stored outside your country. In such cases, we ensure it receives
                  the same level of protection as required by applicable laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-neutral-n4 dark:text-snow-200 mb-3">7. Cookies and Tracking</h2>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed">
                  We use cookies and similar technologies to improve your experience and deliver personalized content.
                  You can manage cookie preferences in your browser or app settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-neutral-n4 dark:text-snow-200 mb-3">8. Your Rights</h2>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed mb-3">Under applicable laws, you may:</p>
                <ul className="list-disc list-inside space-y-2 text-sm text-neutral-n5 dark:text-snow-200 mb-3">
                  <li>Access, correct, or delete your personal data.</li>
                  <li>Object to or restrict processing.</li>
                  <li>Withdraw consent at any time.</li>
                  <li>Lodge a complaint with a data protection authority.</li>
                </ul>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed">
                  To exercise your rights, contact us at{" "}
                  <a href="mailto:info@tikianaly.com" className="text-brand-primary hover:underline">
                    info@tikianaly.com
                  </a>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-neutral-n4 dark:text-snow-200 mb-3">9. Data Security</h2>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed">
                  We implement appropriate security measures to protect your data and restrict access to authorized personnel only.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-neutral-n4 dark:text-snow-200 mb-3">10. Data Retention</h2>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed">
                  We keep your data only as long as necessary to provide our Services or comply with legal obligations.
                  Once no longer required, we delete or anonymize your data.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-neutral-n4 dark:text-snow-200 mb-3">11. Changes to This Policy</h2>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed">
                  We may update this policy occasionally. Any changes will be posted on this page, and the updated version
                  will be effective immediately.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-neutral-n4 dark:text-snow-200 mb-3">12. Contact Us</h2>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed">
                  For questions, concerns, or to exercise your rights, email us at:{" "}
                  <a href="mailto:info@tikianaly.com" className="text-brand-primary hover:underline">
                    info@tikianaly.com
                  </a>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <FooterComp />
    </div>
  );
};

export default PrivacyPolicy;
