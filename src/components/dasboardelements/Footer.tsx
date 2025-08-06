// import  footerLinks  from '/data/footerLink'
const footerLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
  { label: "Help Center", href: "/help" },
  { label: "Press", href: "/press" },
  { label: "Affiliate", href: "/affiliate" },
  { label: "Sitemap", href: "/sitemap" },
  { label: "Community", href: "/community" },
  { label: "Developers", href: "/developers" },
];

export const FooterComp = () => {
  return (
      <div className="page-padding-x py-15 bg-brand-primary  text-white">
    <div className="flex-col gap-y-15 lg:flex-row flex justify-between ">
        <div className="flex flex-col gap-7
         max-w-150">
          <img src="\logos\whitelogo.png" className="w-60" alt="TikiAnaly Logo" />
          <p>
            TikiAnaly is reimagining how grassroots and elite sports communities
            connect, analyze, and celebrate every play.
          </p>
            <div className="flex gap-7">
            <a href="https://www.facebook.com/share/1CU4SPDQon/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
              <img src="\assets\icons\facebook.png" className="cursor-pointer h-8" alt="Facebook" />
            </a>
            <a href="https://x.com/TikiAnaly" target="_blank" rel="noopener noreferrer">
              <img src="\assets\icons\x.png" className="cursor-pointer h-8" alt="X (Twitter)" />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
              <img src="\assets\icons\tiktok.png" className="cursor-pointer h-8" alt="TikTok" />
            </a>
            <a href="https://www.instagram.com/tikianaly2025" target="_blank" rel="noopener noreferrer">
              <img src="\assets\icons\instagram.png" className="cursor-pointer h-8" alt="Instagram" />
            </a>
            </div>
            <div className="flex gap-3">
            <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
              <img src="\assets\icons\play_store.png" className="h-10" alt="Google Play Store" />
            </a>
            <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
              <img src="\assets\icons\apple_store.png" className="h-10" alt="Apple App Store" />
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
