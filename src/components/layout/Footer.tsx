// import  footerLinks  from '/data/footerLink'
import { EnvelopeIcon, PencilSquareIcon, UserIcon } from "@heroicons/react/24/outline";
const footerLinks = [
  { label: "Community", href: "https://tikianaly.com" },
  { label: "Blog", href: "https://blog.tikianaly.com" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Contact", href: "mailto:info@tikianaly.com" },
];

export const FooterComp = () => {
  return (
    <>
      <div className="m-page-padding-x bg-[#D9EBFF] text-[#0F172A]">
        <div className="mx-auto max-w-[1200px] py-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-[520px]">
              <h3 className="text-2xl md:text-3xl font-semibold">
                Got feedback, suggestions,
                <br />
                or concerns?
              </h3>
              <p className="mt-3 text-sm md:text-base text-slate-700">
                We're always looking for ways to improve, and your input plays a big role in that.
                If you have a suggestion, improvement idea, or feedback you'd like to share, we'd love to hear it.
              </p>
            </div>

            <form className="w-full md:max-w-[560px]">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <div className="flex items-center gap-2 h-10 rounded bg-white px-3 text-sm text-slate-900 outline-none ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-brand-secondary">
                    <UserIcon className="w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Email Address</label>
                  <div className="flex items-center gap-2 h-10 rounded bg-white px-3 text-sm text-slate-900 outline-none ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-brand-secondary">
                    <EnvelopeIcon className="w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      placeholder="example@gmail.com"
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">Your Message</label>
                <div className="flex items-start gap-2 rounded bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-brand-secondary">
                  <PencilSquareIcon className="w-4 h-4 text-slate-500 mt-0.5" />
                  <textarea
                    rows={4}
                    placeholder="Type your message..."
                    className="min-h-[110px] w-full resize-none bg-transparent outline-none"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="m-page-padding-x py-15 bg-brand-primary  text-white">
        <div className="flex-col gap-y-15 lg:flex-row flex justify-between ">
          <div
            className="flex flex-col gap-7
         max-w-150"
          >
            <a href="/">
              <img
                src="\logos\whitelogo.png"
                className="w-60"
                alt="TikiAnaly Logo"
              />
            </a>
            <p>
              Sport Space Made for Everyone.
            </p>
            <div className="flex gap-7">
              <a
                href="https://www.facebook.com/share/1CU4SPDQon/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="\assets\icons\facebook.png"
                  className="cursor-pointer h-8"
                  alt="Facebook"
                />
              </a>
              <a
                href="https://x.com/TikiAnaly"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="\assets\icons\x.png"
                  className="cursor-pointer h-8"
                  alt="X (Twitter)"
                />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="\assets\icons\tiktok.png"
                  className="cursor-pointer h-8"
                  alt="TikTok"
                />
              </a>
              <a
                href="https://www.instagram.com/tikianaly2025"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="\assets\icons\instagram.png"
                  className="cursor-pointer h-8"
                  alt="Instagram"
                />
              </a>
            </div>
            <div className="flex gap-3">
              <a
                href=""
              >
                <img
                  src="\assets\icons\play_store.png"
                  className="h-10"
                  alt="Google Play Store"
                />
              </a>
              <a
                href=""
              >
                <img
                  src="\assets\icons\apple_store.png"
                  className="h-10"
                  alt="Apple App Store"
                />
              </a>
            </div>
          </div>
          <div className="links sz-4">
            <div className="grid grid-cols-2 gap-x-30 sm:grid-cols-2 gap-4">
              {footerLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="hover:text-brand-secondary text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <p className="text-center mb-8 mt-18">
          Copyright ©2026 Tikianaly / All rights reserved
        </p>
        <p className="text-center text-xs text-white/70 -mt-6 mb-2">
          API provided by GoalServe
        </p>
      </div>
    </>
  );
};
export default FooterComp;
