export const BRAND = {
  name: "Cure-Care",
  legalName: "Cure-Care Essentials Co.",
  tagline: "Care Beyond Borders",
  description:
    "Thoughtfully designed lifestyle, daily care, and carry essentials crafted with premium materials, smart organization, and timeless minimalist aesthetics.",
  foundedYear: 2021,
  origin: "Designed in Portland & Copenhagen",
  contact: {
    email: "support@curecare.com",
    press: "press@curecare.com",
    wholesale: "wholesale@curecare.com",
    phone: "+1 (800) 555-0199",
    hours: "Mon – Fri, 9am – 6pm EST",
  },
  social: {
    instagram: "https://instagram.com/curecare",
    twitter: "https://twitter.com/curecare",
    youtube: "https://youtube.com/@curecare",
    pinterest: "https://pinterest.com/curecare",
  },
  metrics: {
    retailPartners: 140,
    averageRating: 4.88,
    totalReviews: 12450,
    certification: "Certified B Corp & Climate Neutral",
  },
  currencies: [
    { code: "USD", symbol: "$", name: "US Dollar", rate: 1.0 },
    { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
    { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
    { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 1.52 },
    { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", rate: 119.5 },
  ],
  defaultCurrency: "USD",
} as const;
