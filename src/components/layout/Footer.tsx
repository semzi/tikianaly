// import  footerLinks  from '/data/footerLink'
const footerLinks = [
  { label: "Community", href: "https://tikianaly.com" },
  { label: "Blog", href: "https://blog.tikianaly.com" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Contact", href: "mailto:info@tikianaly.com" },
];

export const FooterComp = () => {
  return (
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
            TikiAnaly is reimagining how grassroots and elite sports communities
            connect, analyze, and celebrate every play.
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
        Copyright ©2025 Tikianaly / All rights reserved
      </p>
    </div>
  );
};
export default FooterComp;
