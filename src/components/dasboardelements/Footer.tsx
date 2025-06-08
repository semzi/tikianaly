import React from "react";
import type { FooterLink } from "../../data/footerlink";
// import  footerLinks  from '/data/footerLink'
const footerLinks: FooterLink[] = [
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
          <h1 className="text-xl md:text-2xl font-bold">TikiAnaly</h1>
          <p className="">
            TikiAnaly is a dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labor.
          </p>
          <div className="flex gap-7">
            <img src="\assets\icons\facebook.png" className=" h-8" alt="" />
            <img src="\assets\icons\x.png" className=" h-8" alt="" />
            <img src="\assets\icons\tiktok.png" className=" h-8" alt="" />
            <img src="\assets\icons\instagram.png" className=" h-8" alt="" />
          </div>
          <div className="flex gap-3">
            <img src="\assets\icons\play_store.png" className="h-10" alt="" />
            <img src="\assets\icons\apple_store.png" className="h-10" alt="" />
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
