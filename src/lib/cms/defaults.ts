export type NavLink = { label: string; id: string };

export type SiteSettings = {
  brandGroup: string;
  brandWordmark: string;
  brandSub: string;
  logoUrl: string;
  logoHeaderHeight: string;
  logoHeaderWidth: string;
  logoFooterHeight: string;
  logoFooterWidth: string;
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  reservationsEmail: string;
  reservationsPhone: string;
  highlightEmail: string;
  highlightPhone: string;
  dineEmail: string;
  dinePhone: string;
  resideEmail: string;
  residePhone: string;
  conciergeEmail: string;
  conciergeWhatsapp: string;
  locationAddress: string;
  locationReservations: string;
  locationConcierge: string;
  locationAirport: string;
  locationRail: string;
  manageBookingLabel: string;
  signInLabel: string;
  languageLabel: string;
};

export type HeroContent = {
  eyebrow: string;
  headline: string;
  body: string;
  imageUrl: string;
  imageAlt: string;
  /** Optional background video. When set, plays over/with image as poster. */
  videoUrl: string;
};

export type AboutContent = {
  eyebrow: string;
  headline: string;
  body: string;
  stats: { value: string; label: string }[];
};

export type CategoriesContent = {
  eyebrow: string;
  headline: string;
  intro: string;
  selectLabel: string;
  selectedLabel: string;
  roomNumbersLabel: string;
  bookCta: string;
  fromLabel: string;
};

export type HighlightContent = {
  eyebrow: string;
  headline: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  imageMain: string;
  imageMainAlt: string;
  imageTop: string;
  imageTopAlt: string;
  imageBottom: string;
  imageBottomAlt: string;
  awardYear: string;
  awardName: string;
  awardSubtitle: string;
};

export type StayContent = {
  eyebrow: string;
  headline: string;
  tileSlugs: string[];
  bookNowLabel: string;
};

export type SuitesContent = {
  eyebrow: string;
  headline: string;
  intro: string;
  viewGalleryLabel: string;
  exploreGalleryLabel: string;
  hideGalleryLabel: string;
  perNightLabel: string;
  reserveLabel: string;
};

export type DineContent = {
  eyebrow: string;
  headline: string;
  body: string;
  image1: string;
  image1Alt: string;
  image2: string;
  image2Alt: string;
  discoverLabel: string;
  reserveLabel: string;
};

export type ResideContent = {
  eyebrow: string;
  headline: string;
  body: string;
  imageUrl: string;
  imageAlt: string;
  ctaLabel: string;
};

export type WellnessContent = {
  eyebrow: string;
  headline: string;
  ctaLabel: string;
  slides: { imageUrl: string; alt: string }[];
};

export type ExperienceItem = {
  tag: string;
  title: string;
  desc: string;
  imageUrl: string;
  anchor: string;
};

export type ExperienceContent = {
  eyebrow: string;
  headline: string;
  items: ExperienceItem[];
};

export type LocationContent = {
  eyebrow: string;
  headline: string;
  body: string;
  addressLabel: string;
  reservationsLabel: string;
  conciergeLabel: string;
  airportLabel: string;
  railLabel: string;
};

export type ConciergeContent = {
  eyebrow: string;
  headline: string;
  body: string;
  successMessage: string;
  enquiringAboutLabel: string;
  whatsappLinkLabel: string;
  whatsappInsteadLabel: string;
  submitLabel: string;
  submittingLabel: string;
  fieldName: string;
  fieldEmail: string;
  fieldPhone: string;
  fieldDates: string;
  fieldMessage: string;
  datesPlaceholder: string;
  messagePlaceholder: string;
  messagePlaceholderWithRoom: string;
  errorMessage: string;
};

export type FooterContent = {
  copyrightSuffix: string;
  creditLine: string;
  links: NavLink[];
};

export type NavContent = {
  links: NavLink[];
};

export type UiContent = {
  selectedPrefix: string;
  clearLabel: string;
  suitePlaceholder: string;
  datesPlaceholder: string;
  guestsPlaceholder: string;
  adultsLabel: string;
  childrenLabel: string;
  findRoomsLabel: string;
  menuAriaLabel: string;
  whatsappAriaLabel: string;
};

export type RoomPublic = {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  size: string;
  price: string;
  description: string;
  image: string;
  gallery: { src: string; caption: string }[];
  numbers: string[];
};

export type PublicContent = {
  settings: SiteSettings;
  nav: NavContent;
  hero: HeroContent;
  about: AboutContent;
  categories: CategoriesContent;
  highlight: HighlightContent;
  stay: StayContent;
  suites: SuitesContent;
  dine: DineContent;
  reside: ResideContent;
  wellness: WellnessContent;
  experience: ExperienceContent;
  location: LocationContent;
  concierge: ConciergeContent;
  footer: FooterContent;
  ui: UiContent;
  rooms: RoomPublic[];
};

const U = (file: string) => `/uploads/${file}`;

export const DEFAULT_SETTINGS: SiteSettings = {
  brandGroup: "CloudView Restaurant",
  brandWordmark: "RRP",
  brandSub: "Dream Inn",
  logoUrl: "",
  logoHeaderHeight: "48",
  logoHeaderWidth: "",
  logoFooterHeight: "40",
  logoFooterWidth: "",
  seoTitle: "RRP Dream Inn — Luxury Hotel in Ishwardi, Pabna",
  seoDescription:
    "An ultra-luxury hotel in Ishwardi, Pabna — Italian-inspired suites, refined dining, and quiet hospitality on the Padma.",
  ogTitle: "RRP Dream Inn — Luxury Hotel in Ishwardi",
  ogDescription:
    "Italian-inspired interiors, signature suites, and quiet hospitality in the heart of Pabna.",
  ogImage: U("hero-suite.jpg"),
  reservationsEmail: "reservations@rrpdreaminn.com",
  reservationsPhone: "+880 1700 000000",
  highlightEmail: "reservations@rrpdreaminn.com",
  highlightPhone: "+880 1700 000000",
  dineEmail: "dine@rrpdreaminn.com",
  dinePhone: "+880 1700 000 000",
  resideEmail: "reside@rrpdreaminn.com",
  residePhone: "+880 1700 000 000",
  conciergeEmail: "concierge@rrpdreaminn.com",
  conciergeWhatsapp: "8801700000000",
  locationAddress: "RRP Dream Inn, Ishwardi, Pabna, Bangladesh",
  locationReservations: "+880 1700 000 000",
  locationConcierge: "concierge@rrpdreaminn.com",
  locationAirport: "Ishwardi Airport — 10 minutes",
  locationRail: "Ishwardi Junction — 8 minutes",
  manageBookingLabel: "Manage Booking",
  signInLabel: "Sign In",
  languageLabel: "EN",
};

export const DEFAULT_SECTIONS: Record<string, Record<string, unknown>> = {
  nav: {
    links: [
      { label: "Stay", id: "stay" },
      { label: "Suites", id: "suites" },
      { label: "Dine", id: "dine" },
      { label: "Reside", id: "reside" },
      { label: "Wellness", id: "wellness" },
      { label: "Location", id: "location" },
      { label: "Concierge", id: "concierge" },
    ],
  } satisfies NavContent,
  hero: {
    eyebrow: "Ishwardi · Pabna · Bangladesh",
    headline: "A quiet kind\nof luxury.",
    body: "RRP Dream Inn is a sanctuary of considered design and Italian craftsmanship — composed for the traveller who measures a stay in feeling, not in floors.",
    imageUrl: U("hero-suite.jpg"),
    imageAlt: "Signature suite at RRP Dream Inn",
    videoUrl: "",
  } satisfies HeroContent,
  about: {
    eyebrow: "The House",
    headline: "An address composed in quiet.",
    body: "Set on the soft banks of Ishwardi, RRP Dream Inn brings Italian sensibility to Pabna — a house where Carrara marble meets handwoven Bengali silk, and where every detail is the work of someone who took their time.",
    stats: [
      { value: "42", label: "Suites & Rooms" },
      { value: "3", label: "Restaurants" },
      { value: "24h", label: "Concierge" },
      { value: "1", label: "Address in Ishwardi" },
    ],
  } satisfies AboutContent,
  categories: {
    eyebrow: "Room Categories",
    headline: "Choose your suite",
    intro:
      "Each category is composed of a handful of individually numbered rooms. Select a category to preselect it in the booking bar.",
    selectLabel: "Select →",
    selectedLabel: "Selected",
    roomNumbersLabel: "Room Numbers",
    bookCta: "Book →",
    fromLabel: "From",
  } satisfies CategoriesContent,
  highlight: {
    eyebrow: "Highlight",
    headline: "RRP Dream Inn Ishwardi",
    body: "Set along the quiet edge of Ishwardi in Pabna, RRP Dream Inn is a testament to a singular vision of understated elegance and refined luxury. Every element — from the forty-two guest rooms and signature suites to the three restaurants and the serene RRP Spa — has been personally composed to create a seamless living experience of the highest calibre. The house offers an unparalleled address, steps from the Padma and the cultural heart of Pabna, making it the ideal base for both leisure and considered travel.",
    ctaLabel: "Discover More",
    ctaHref: "#suites",
    imageMain: U("hero-suite.jpg"),
    imageMainAlt: "RRP Dream Inn façade at dusk",
    imageTop: U("dining.jpg"),
    imageTopAlt: "RRP dining room",
    imageBottom: U("lobby.jpg"),
    imageBottomAlt: "RRP Dream Inn lobby",
    awardYear: "2026",
    awardName: "Forbes",
    awardSubtitle: "TRAVEL GUIDE",
  } satisfies HighlightContent,
  stay: {
    eyebrow: "Stay",
    headline: "Luxury Hospitality at RRP Dream Inn",
    tileSlugs: [
      "rrp-deluxe-room",
      "rrp-premiere-twin-room",
      "rrp-executive-suite",
      "rrp-signature-suite",
    ],
    bookNowLabel: "Book Now",
  } satisfies StayContent,
  suites: {
    eyebrow: "The Collection",
    headline: "Suites & Rooms",
    intro:
      "Five categories. Each composed around stillness, light, and the soft authority of fine materials.",
    viewGalleryLabel: "View gallery",
    exploreGalleryLabel: "Explore gallery",
    hideGalleryLabel: "Hide gallery",
    perNightLabel: "Per Night",
    reserveLabel: "Reserve",
  } satisfies SuitesContent,
  dine: {
    eyebrow: "Dine",
    headline: "DINE at RRP Dream Inn",
    body: "Embark on a culinary journey that spans continents — from Italy's enchanting landscapes and Japan's vibrant flavours to the cultural richness of Bengal and the coastal delights of the Mediterranean. Three signature kitchens, each composed with the same quiet precision as the house itself.",
    image1: U("dining.jpg"),
    image1Alt: "Saffron risotto",
    image2: U("lobby.jpg"),
    image2Alt: "Plated course",
    discoverLabel: "Discover More",
    reserveLabel: "Reserve a Table",
  } satisfies DineContent,
  reside: {
    eyebrow: "Reside",
    headline: "RRP Residences",
    body: "Contemporary and understated, our one and two-bedroom luxury residences were composed with the same approach to elegance and quiet style as the house — a direct reflection of a singular philosophy and inimitable taste.",
    imageUrl: U("residence.jpg"),
    imageAlt: "RRP Residences interior",
    ctaLabel: "Enquire Now",
  } satisfies ResideContent,
  wellness: {
    eyebrow: "Wellness",
    headline: "Unwind With RRP Dream Inn",
    ctaLabel: "Book a Treatment",
    slides: [
      { imageUrl: U("hero-suite.jpg"), alt: "City skyline at dawn" },
      { imageUrl: U("spa.jpg"), alt: "Infinity pool with skyline reflection" },
      { imageUrl: U("lobby.jpg"), alt: "Spa treatment room" },
      { imageUrl: U("dining.jpg"), alt: "Wellness ritual" },
      { imageUrl: U("residence.jpg"), alt: "Quiet lounge" },
    ],
  } satisfies WellnessContent,
  experience: {
    eyebrow: "The Experience",
    headline: "Quiet rituals,\nkept with precision.",
    items: [
      {
        tag: "Dining",
        title: "Three signature kitchens",
        desc: "From a quiet morning room to candlelit fine dining — a culinary house built on Italian technique and Bengali ingredients.",
        imageUrl: U("dining.jpg"),
        anchor: "dining",
      },
      {
        tag: "Wellness",
        title: "The Spa & Pool",
        desc: "A serene wellness floor with infinity pool, hammam, and treatments curated by master therapists.",
        imageUrl: U("spa.jpg"),
        anchor: "wellness",
      },
      {
        tag: "Arrival",
        title: "The Lobby",
        desc: "A sculpted hush of charcoal stone and brass light — the first chapter of every stay.",
        imageUrl: U("lobby.jpg"),
        anchor: "arrival",
      },
    ],
  } satisfies ExperienceContent,
  location: {
    eyebrow: "The Address",
    headline: "Ishwardi,\non the Padma.",
    body: "A short drive from Ishwardi Airport and the Hardinge Bridge, RRP Dream Inn sits where the quiet of Pabna meets the timeless drift of the river.",
    addressLabel: "Address",
    reservationsLabel: "Reservations",
    conciergeLabel: "Concierge",
    airportLabel: "Airport",
    railLabel: "Rail",
  } satisfies LocationContent,
  concierge: {
    eyebrow: "Concierge",
    headline: "At your service, always.",
    body: "Tell us how to compose your stay. Our concierge replies within the hour — for reservations, private dining, transfers, or anything quietly arranged.",
    successMessage: "Thank you — your enquiry has been received. We'll be in touch shortly.",
    enquiringAboutLabel: "Enquiring about",
    whatsappLinkLabel: "WhatsApp the concierge",
    whatsappInsteadLabel: "WhatsApp Instead",
    submitLabel: "Send Enquiry",
    submittingLabel: "Sending…",
    fieldName: "Name",
    fieldEmail: "Email",
    fieldPhone: "Phone",
    fieldDates: "Preferred dates",
    fieldMessage: "Message",
    datesPlaceholder: "e.g. 12–15 Oct",
    messagePlaceholder: "How may we compose your stay?",
    messagePlaceholderWithRoom: "I'd like to enquire about the {room}…",
    errorMessage: "Something went wrong. Please try again or use WhatsApp.",
  } satisfies ConciergeContent,
  footer: {
    copyrightSuffix: "RRP Dream Inn · Ishwardi, Pabna",
    creditLine: "Developed by : Ahanaf Adud & Rakibul Hassan",
    links: [
      { label: "Suites", id: "suites" },
      { label: "Dining", id: "dine" },
      { label: "Wellness", id: "wellness" },
      { label: "Location", id: "location" },
      { label: "Concierge", id: "concierge" },
      { label: "Book", id: "book" },
    ],
  } satisfies FooterContent,
  ui: {
    selectedPrefix: "Selected:",
    clearLabel: "Clear",
    suitePlaceholder: "Select a Suite",
    datesPlaceholder: "Check In - Check Out",
    guestsPlaceholder: "Guests",
    adultsLabel: "Adults",
    childrenLabel: "Children",
    findRoomsLabel: "Find Rooms",
    menuAriaLabel: "Menu",
    whatsappAriaLabel: "WhatsApp",
  } satisfies UiContent,
};

export type SeedRoom = {
  name: string;
  slug: string;
  tagline: string;
  size: string;
  price: string;
  description: string;
  primaryImage: string;
  gallery: { file: string; caption: string }[];
  numbers: string[];
};

export const SEED_ROOMS: SeedRoom[] = [
  {
    name: "RRP Deluxe Room",
    slug: "rrp-deluxe-room",
    tagline: "A composed beginning",
    size: "42 m²",
    price: "From ৳ 9,500",
    description:
      "A study in restraint — walnut paneling, a sculpted king bed, and the quiet warmth of ambient cove lighting.",
    primaryImage: "room-deluxe.jpg",
    gallery: [
      { file: "room-deluxe.jpg", caption: "Bedroom · evening composition" },
      { file: "room-deluxe-2.jpg", caption: "Walnut headboard wall" },
      { file: "room-deluxe-3.jpg", caption: "Marble bathroom with brass fixtures" },
    ],
    numbers: ["201", "202", "203", "204", "205", "206", "207", "208"],
  },
  {
    name: "RRP Classic Room",
    slug: "rrp-classic-room",
    tagline: "Considered comfort",
    size: "46 m²",
    price: "From ৳ 11,000",
    description:
      "Warm grays, a sitting area dressed in linen, and gold-leaf details — a room that feels collected, never decorated.",
    primaryImage: "room-classic.jpg",
    gallery: [
      { file: "room-classic.jpg", caption: "Sitting area · twilight" },
      { file: "room-classic-2.jpg", caption: "Linen sofa, gold-leaf cornices" },
      { file: "room-classic-3.jpg", caption: "Writing desk and reading nook" },
    ],
    numbers: ["301", "302", "303", "304", "305", "306", "307", "308"],
  },
  {
    name: "RRP Premiere Twin Room",
    slug: "rrp-premiere-twin-room",
    tagline: "For two, in parallel",
    size: "54 m²",
    price: "From ৳ 13,500",
    description:
      "Twin platform beds beneath floor-to-ceiling windows. Designed for travellers who arrive together, but rest apart.",
    primaryImage: "room-twin.jpg",
    gallery: [
      { file: "room-twin.jpg", caption: "Twin platform beds" },
      { file: "room-twin-2.jpg", caption: "Dusk view across the city" },
      { file: "room-twin-3.jpg", caption: "Lounge corner with brass floor lamp" },
    ],
    numbers: ["401", "402", "403", "404", "405", "406"],
  },
  {
    name: "RRP Executive Suite",
    slug: "rrp-executive-suite",
    tagline: "A private chapter",
    size: "78 m²",
    price: "From ৳ 22,000",
    description:
      "A separate living salon, dining nook, and a panoramic dusk view across Ishwardi. Italian furniture, polished stone.",
    primaryImage: "room-executive.jpg",
    gallery: [
      { file: "room-executive.jpg", caption: "Living salon" },
      { file: "room-executive-2.jpg", caption: "Sculptural sofa, panoramic windows" },
      { file: "room-executive-3.jpg", caption: "Private dining nook" },
    ],
    numbers: ["805", "806", "810", "811", "812", "814", "905", "906", "910", "911", "912", "914"],
  },
  {
    name: "RRP Signature Suite",
    slug: "rrp-signature-suite",
    tagline: "The Dream Inn signature",
    size: "120 m²",
    price: "From ৳ 38,000",
    description:
      "Our defining suite. Vast living quarters, sculptural lighting, and an outlook that makes the city feel like an heirloom.",
    primaryImage: "room-signature.jpg",
    gallery: [
      { file: "room-signature.jpg", caption: "Grand entry view" },
      { file: "room-signature-2.jpg", caption: "Master bedroom · sculpted chandelier" },
      { file: "room-signature-3.jpg", caption: "Double-height living quarters" },
    ],
    numbers: ["801", "901", "1001", "1007", "1008"],
  },
];

export const SEED_MEDIA_FILES = [
  "hero-suite.jpg",
  "lobby.jpg",
  "dining.jpg",
  "spa.jpg",
  "residence.jpg",
  "room-deluxe.jpg",
  "room-deluxe-2.jpg",
  "room-deluxe-3.jpg",
  "room-classic.jpg",
  "room-classic-2.jpg",
  "room-classic-3.jpg",
  "room-twin.jpg",
  "room-twin-2.jpg",
  "room-twin-3.jpg",
  "room-executive.jpg",
  "room-executive-2.jpg",
  "room-executive-3.jpg",
  "room-signature.jpg",
  "room-signature-2.jpg",
  "room-signature-3.jpg",
];
