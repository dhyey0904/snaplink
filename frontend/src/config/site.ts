export const siteConfig = {
  name: "SnapLinks",
  shortName: "SnapLinks",
  description: "The Ultimate All-in-One Utility Platform. Link Shortener, Link-in-Bio, vCard, PDF Tools, and more.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://snaplinks.in",
  themeColor: "#1557b0",
  backgroundColor: "#ffffff",
  
  // Centralized Branding: Change this single string to rebrand all dynamic icons!
  brandText: "S", 
  brandColorLight: "#1557b0",
  brandColorDark: "#60a5fa",
  
  // Future-proofing: If you switch to an image logo instead of text-based dynamic generation
  logoUrl: "/logo.png",
};

export type SiteConfig = typeof siteConfig;
