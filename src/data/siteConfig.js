// ============================================================
// FLUENCYO SITE CONFIG — Dynamic Data
// ============================================================
// This file is the single source of truth for all dynamic 
// content on the site. When you build the admin panel later,
// it will write to this file (or a database that feeds this).
// ============================================================

const siteConfig = {

  // ---- HERO STATS (shown under the headline) ----
  stats: {
    learners: "5000+",
    languages: "25+",
    countries: "150+",
    rating: "4.9",
  },

  // ---- TICKER (scrolling language bar) ----
  // uses same languages list below — auto generated

  // ---- LANGUAGES LIST ----
  // flag: ISO 3166-1 alpha-2 country code (used to get real flag images)
  // flagCode: same code for flagcdn.com
  // learners: shown on language card
  // speakers: shown in globe info bubble
  // fun: fun fact shown in globe info bubble
  // hot: shows "🔥 Hot" badge on the chip
  // lon/lat: globe coordinates for the country
  languages: [
    {
      id: "es",
      name: "Spanish",
      flagCode: "es",
      learners: "12,400 learners",
      speakers: "500M+ speakers",
      fun: "2nd most spoken language",
      hot: true,
      lon: -3.7,
      lat: 40.4,
    },
    {
      id: "fr",
      name: "French",
      flagCode: "fr",
      learners: "9,800 learners",
      speakers: "280M+ speakers",
      fun: "Official language in 29 countries",
      hot: false,
      lon: 2.3,
      lat: 48.8,
    },
    {
      id: "de",
      name: "German",
      flagCode: "de",
      learners: "7,200 learners",
      speakers: "130M+ speakers",
      fun: "Most spoken native language in EU",
      hot: false,
      lon: 13.4,
      lat: 52.5,
    },
    {
      id: "jp",
      name: "Japanese",
      flagCode: "jp",
      learners: "11,100 learners",
      speakers: "125M+ speakers",
      fun: "3 writing systems!",
      hot: true,
      lon: 139.6,
      lat: 35.7,
    },
    {
      id: "kr",
      name: "Korean",
      flagCode: "kr",
      learners: "8,600 learners",
      speakers: "77M+ speakers",
      fun: "K-pop & K-drama power",
      hot: true,
      lon: 126.9,
      lat: 37.5,
    },
    {
      id: "cn",
      name: "Mandarin",
      flagCode: "cn",
      learners: "6,900 learners",
      speakers: "1B+ speakers",
      fun: "Most spoken language on Earth",
      hot: false,
      lon: 116.4,
      lat: 39.9,
    },
    {
      id: "in",
      name: "Hindi",
      flagCode: "in",
      learners: "5,400 learners",
      speakers: "600M+ speakers",
      fun: "3rd most spoken worldwide",
      hot: false,
      lon: 77.2,
      lat: 28.6,
    },
    {
      id: "sa",
      name: "Arabic",
      flagCode: "sa",
      learners: "4,100 learners",
      speakers: "420M+ speakers",
      fun: "Language of the Quran",
      hot: false,
      lon: 46.7,
      lat: 24.6,
    },
    {
      id: "br",
      name: "Portuguese",
      flagCode: "br",
      learners: "6,200 learners",
      speakers: "250M+ speakers",
      fun: "Spoken on 5 continents",
      hot: false,
      lon: -47.9,
      lat: -15.8,
    },
    {
      id: "it",
      name: "Italian",
      flagCode: "it",
      learners: "5,700 learners",
      speakers: "85M+ speakers",
      fun: "Language of art & cuisine",
      hot: false,
      lon: 12.5,
      lat: 41.9,
    },
    {
      id: "ru",
      name: "Russian",
      flagCode: "ru",
      learners: "3,800 learners",
      speakers: "260M+ speakers",
      fun: "Most spoken Slavic language",
      hot: false,
      lon: 37.6,
      lat: 55.7,
    },
    {
      id: "tr",
      name: "Turkish",
      flagCode: "tr",
      learners: "3,200 learners",
      speakers: "88M+ speakers",
      fun: "Bridges Europe and Asia",
      hot: false,
      lon: 32.9,
      lat: 39.9,
    },
    {
      id: "nl",
      name: "Dutch",
      flagCode: "nl",
      learners: "2,900 learners",
      speakers: "24M+ speakers",
      fun: "Gateway to Germanic languages",
      hot: false,
      lon: 4.9,
      lat: 52.4,
    },
    {
      id: "pl",
      name: "Polish",
      flagCode: "pl",
      learners: "2,100 learners",
      speakers: "45M+ speakers",
      fun: "Rich literary tradition",
      hot: false,
      lon: 21.0,
      lat: 52.2,
    },
    {
      id: "se",
      name: "Swedish",
      flagCode: "se",
      learners: "1,900 learners",
      speakers: "10M+ speakers",
      fun: "Most similar to English among Nordics",
      hot: false,
      lon: 18.1,
      lat: 59.3,
    },
  ],

  // ---- TESTIMONIALS ----
  testimonials: [
    {
      text: "Fluencyo is honestly the most fun I've had learning a language. The AI tutor actually feels like a real conversation.",
      author: "Aarav S.",
      detail: "Learning Spanish",
      flag: "🇮🇳",
      initials: "AS",
      stars: 5,
    },
    {
      text: "I tried Duolingo for 2 years and barely progressed. 3 months with Fluencyo and I'm having full conversations in French.",
      author: "Mia T.",
      detail: "Learning French",
      flag: "🇺🇸",
      initials: "MT",
      stars: 5,
    },
    {
      text: "The streak system is dangerously addictive. My 90-day streak is my most prized achievement.",
      author: "Carlos R.",
      detail: "Learning Japanese",
      flag: "🇲🇽",
      initials: "CR",
      stars: 5,
    },
    {
      text: "As a busy professional, I love that I can squeeze in 10 minutes anywhere. The lessons are bite-sized but actually effective.",
      author: "Priya K.",
      detail: "Learning German",
      flag: "🇮🇳",
      initials: "PK",
      stars: 5,
    },
    {
      text: "The voice feature is incredible. It corrects my pronunciation in real-time in a way no other app does.",
      author: "Tom B.",
      detail: "Learning Mandarin",
      flag: "🇬🇧",
      initials: "TB",
      stars: 5,
    },
    {
      text: "I love how Fluencyo adapts to my pace. It knows when to push me harder and when to slow down.",
      author: "Yuki M.",
      detail: "Learning Korean",
      flag: "🇯🇵",
      initials: "YM",
      stars: 5,
    },
    {
      text: "Started learning Portuguese for a trip to Brazil. Ended up staying 3 months because I actually spoke the language!",
      author: "Emma L.",
      detail: "Learning Portuguese",
      flag: "🇨🇦",
      initials: "EL",
      stars: 5,
    },
    {
      text: "The gamification is so well done. I feel like I'm playing a game but I'm actually becoming fluent.",
      author: "Raj P.",
      detail: "Learning Spanish",
      flag: "🇮🇳",
      initials: "RP",
      stars: 5,
    },
  ],

  // ---- APP LINKS ----
  appLinks: {
    appStore: "#",       // Replace with real App Store URL
    playStore: "#",      // Replace with real Play Store URL
    appStoreRating: "4.9",
    appStoreReviews: "NA",
  },

  // ---- SOCIAL LINKS ----
  social: {
    instagram: "https://www.instagram.com/fluencyo_app/",
    youtube: "https://www.youtube.com/@Fluencyo",
    twitter: "https://x.com/fluencyo_app",
    linkedin: "https://www.linkedin.com/company/fluencyo",
  },

  // ---- FOOTER LEGAL ----
  companyName: "Fluencyo Private Limited",
  foundedYear: "2026",
};

export default siteConfig;
