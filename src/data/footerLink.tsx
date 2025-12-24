// footerLinks.ts

export interface FooterLink {
  label: string;
  href: string;
}

export const footerLinks: FooterLink[] = [
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
export default footerLinks;