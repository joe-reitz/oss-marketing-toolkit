/**
 * Brand Configuration
 *
 * Customize this file to match your brand identity.
 * Simply replace the values below with your own branding.
 */

export const brandConfig = {
  // Company name
  company: {
    name: "Marketing Toolkit",
    shortName: "MTK",
  },

  // Logo configuration
  // Replace these paths with your own logo files
  logo: {
    // Path to your icon (symbol/mark only) - recommended size: 512x512px
    icon: {
      light: "/images/icon-light.svg",  // For use on dark backgrounds
      dark: "/images/icon-dark.svg",    // For use on light backgrounds
    },
    // Path to your full logotype (wordmark + symbol) - recommended size: variable width, 512px height
    logotype: {
      light: "/images/logotype-light.svg",
      dark: "/images/logotype-dark.svg",
    },
    // Fallback emoji or character if no logo is provided
    fallback: "🚀",
  },

  // Color scheme (HSL format for Tailwind compatibility)
  colors: {
    // Primary brand color
    primary: {
      hue: 221,        // 0-360
      saturation: 83,  // 0-100
      lightness: 53,   // 0-100
    },
    // Accent color
    accent: {
      hue: 142,
      saturation: 71,
      lightness: 45,
    },
  },

  // Image generator background presets
  imageBackgrounds: [
    {
      id: "gradient-purple",
      name: "Purple Gradient",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      id: "gradient-blue",
      name: "Blue Gradient",
      gradient: "linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)",
    },
    {
      id: "gradient-sunset",
      name: "Sunset Gradient",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
    {
      id: "gradient-ocean",
      name: "Ocean Gradient",
      gradient: "linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)",
    },
    {
      id: "gradient-forest",
      name: "Forest Gradient",
      gradient: "linear-gradient(135deg, #134E5E 0%, #71B280 100%)",
    },
    {
      id: "gradient-fire",
      name: "Fire Gradient",
      gradient: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)",
    },
    {
      id: "solid-black",
      name: "Solid Black",
      gradient: "#000000",
    },
    {
      id: "solid-white",
      name: "Solid White",
      gradient: "#ffffff",
    },
    {
      id: "solid-navy",
      name: "Navy Blue",
      gradient: "#0f172a",
    },
    {
      id: "solid-charcoal",
      name: "Charcoal",
      gradient: "#1e293b",
    },
  ],

  // Links
  links: {
    website: "https://your-website.com",
    github: "https://github.com/yourusername/marketing-toolkit",
    documentation: "https://github.com/yourusername/marketing-toolkit#readme",
  },

  // Features to enable/disable
  features: {
    utmGenerator: true,
    imageGenerator: true,
    qrCodeGenerator: true,
    namingGenerators: true,
    contentAnalyzer: true,
    dateTimePicker: true,
    emailBuilder: true,
    emailPriorityPlanner: true,
    soqlQueryHelper: true,
  },
};

export type BrandConfig = typeof brandConfig;
