import { PageHeader } from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

 export const TermsAndConditions = () => {
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
              <h1 className="sz-2 font-bold text-neutral-n4 dark:text-snow-200">Terms &amp; Conditions</h1>
              <p className="text-sm text-neutral-n5 dark:text-snow-200">Last updated: October 15, 2025</p>
            </div>
          </div>

          <div className="block-style mb-6">
            <h2 className="text-lg font-semibold text-neutral-n4 dark:text-snow-200 mb-2">Contact Information</h2>
            <p className="text-sm text-neutral-n5 dark:text-snow-200">
              For any questions about these terms and conditions, please contact us at:{" "}
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
                  Welcome to TikiAnaly. These Terms &amp; Conditions govern your use of our platforms, apps, and services
                  (collectively, our "Services"). By accessing or using our Services, you agree to be bound by these terms.
                </p>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed mb-3">
                  When we mention "TikiAnaly," "we," "us," or "our", we mean TikiAnaly, the entity responsible
                  for providing and operating the Services.
                </p>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed">
                  If you do not agree with any part of these terms, you should not use our Services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-neutral-n4 dark:text-snow-200 mb-3">2. Acceptance of Terms</h2>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed mb-3">
                  By registering an account, accessing content, or using any of our Services, you confirm that you have read,
                  understood, and agreed to these Terms &amp; Conditions.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-neutral-n5 dark:text-snow-200">
                  <li>You must be at least 18 years old, or the age of majority in your jurisdiction.</li>
                  <li>You agree to provide accurate and up-to-date information when registering.</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-neutral-n4 dark:text-snow-200 mb-3">3. Use of Our Services</h2>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed mb-3">
                  You agree to use our Services for lawful purposes only and in a manner that does not infringe the rights
                  of, or restrict or inhibit the use of the Services by, any third party.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-neutral-n5 dark:text-snow-200 mb-3">
                  <li>You may not attempt to gain unauthorized access to our systems or other users' accounts.</li>
                  <li>You may not use our Services to transmit harmful, offensive, or unlawful content.</li>
                  <li>You may not reverse engineer, copy, or reproduce any part of our Services without permission.</li>
                </ul>
                <div className="p-4 rounded border border-snow-200 dark:border-[#1F2937] bg-snow-100 dark:bg-[#161B22]">
                  <p className="text-sm text-neutral-n5 dark:text-snow-200">
                    <strong>Note:</strong> We reserve the right to suspend or terminate accounts that violate these terms.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-neutral-n4 dark:text-snow-200 mb-3">4. Intellectual Property</h2>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed mb-3">
                  All content, features, and functionality of our Services, including text, graphics, logos, and software,
                  are owned by TikiAnaly or its licensors and are protected by intellectual property laws.
                </p>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed">
                  You may not reproduce, distribute, modify, or create derivative works from any part of our Services
                  without our prior written consent.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-neutral-n4 dark:text-snow-200 mb-3">5. User Accounts</h2>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed mb-3">
                  To access certain features, you may need to create an account. You are responsible for all activity
                  that occurs under your account.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-neutral-n5 dark:text-snow-200 mb-3">
                  <li>Keep your login credentials secure and do not share them with others.</li>
                  <li>Notify us immediately of any unauthorized use of your account.</li>
                  <li>We may disable accounts that violate these terms or applicable laws.</li>
                </ul>
                <div className="p-4 rounded border border-snow-200 dark:border-[#1F2937] bg-snow-100 dark:bg-[#161B22]">
                  <p className="text-sm text-neutral-n5 dark:text-snow-200">
                    <strong>We will never ask you for your password by email or phone.</strong>
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-neutral-n4 dark:text-snow-200 mb-3">6. Third-Party Links and Content</h2>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed">
                  Our Services may contain links to third-party websites or content that we do not control. We are not
                  responsible for the content, policies, or practices of any third-party sites and recommend you review
                  their terms and policies.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-neutral-n4 dark:text-snow-200 mb-3">7. Disclaimer of Warranties</h2>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed">
                  Our Services are provided on an "as is" and "as available" basis, without warranties of any kind,
                  whether express or implied. We do not guarantee that the Services will be uninterrupted, error-free,
                  or free of harmful components.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-neutral-n4 dark:text-snow-200 mb-3">8. Limitation of Liability</h2>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed">
                  To the maximum extent permitted by law, TikiAnaly shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages, or any loss of profits or data, arising out of or related
                  to your use of our Services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-neutral-n4 dark:text-snow-200 mb-3">9. Termination</h2>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed">
                  We may terminate or suspend your access to our Services at any time, with or without notice, for conduct
                  that we believe violates these terms or is harmful to other users, third parties, or our business.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-neutral-n4 dark:text-snow-200 mb-3">10. Changes to These Terms</h2>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed">
                  We may update these Terms &amp; Conditions occasionally. Any changes will be posted on this page, and the
                  updated version will be effective immediately upon posting. Continued use of the Services after changes
                  constitutes acceptance of the revised terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-neutral-n4 dark:text-snow-200 mb-3">11. Governing Law</h2>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed">
                  These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of the relevant
                  jurisdiction, without regard to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-neutral-n4 dark:text-snow-200 mb-3">12. Contact Us</h2>
                <p className="text-sm text-neutral-n5 dark:text-snow-200 leading-relaxed">
                  For questions, concerns, or to report a violation of these terms, email us at:{" "}
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

export default TermsAndConditions;
