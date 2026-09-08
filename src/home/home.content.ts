/**
 * All homepage copy lives here, structured and typed, rather than
 * scattered across templates. Swapping this file (or replacing it with
 * a CMS/database call inside HomeController) is the intended way to
 * change content — the .hbs templates should stay copy-agnostic.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface CtaLink {
  label: string;
  href: string;
}

export interface ContentImage {
  src: string;
  alt: string;
}

export interface ContentVideo {
  src: string;
  type: string;
}

export interface SanctuaryItem {
  index: string;
  title: string;
  body: string;
  image: ContentImage;
}

export interface DestinationTag {
  label: string;
  body: string;
}

export interface MaterialSwatch {
  key: 'glass' | 'timber' | 'stone' | 'concrete';
  label: string;
  caption: string;
  tag: string;
  image: ContentImage;
}

export interface TimelineItem {
  time: string;
  title: string;
  body: string;
  image: ContentImage;
}

export interface FooterLinkGroup {
  heading: string;
  links: NavLink[];
}

export const homeContent = {
  meta: {
    title: 'Amandaria — Vanya Nadi',
    description:
      "A private boutique retreat woven into the jungle canopy and wild river landscape of Sri Lanka's Knuckles Mountain Range.",
  },

  nav: {
    logoName: 'Amandaria',
    logoSubtitle: 'Vanya Nadi',
    logoSrc: '/images/logo/AmandariaLogo.webp',
    logoIconSrc: '/images/logo/amandaria-logo-icon.webp',
    logoTextSrc: '/images/logo/AmandariaLogo-text.webp',
    links: [
      { label: 'The Sanctuary', href: '#sanctuary' },
      { label: 'Architecture & Design', href: '#architecture' },
      { label: 'The Experience', href: '#experience' },
      { label: 'Culinary Journey', href: '#culinary' },
      { label: 'Private Inquiry', href: '#inquiry' },
    ] as NavLink[],
    cta: { label: 'Inquire', href: '#inquiry' } as CtaLink,
    menuLabel: 'Menu',
    closeLabel: 'Close',
    mobileExtra: { label: 'Contact', href: '#footer' } as CtaLink,
  },

  hero: {
    eyebrow: 'The Knuckles · Sri Lanka',
    titleLines: ['Silence, Space,', 'and the Soul of the River.'],
    subtitle:
      'An intimate boutique retreat, thoughtfully woven into the canopy. Experience minimalist luxury, breathtaking vistas, and a world entirely your own.',
    primaryCta: { label: 'Discover Amandaria', href: '#brand' } as CtaLink,
    secondaryCta: { label: 'Private Inquiry', href: '#inquiry' } as CtaLink,
    coordsLine1: '7.4675° N, 80.7911° E',
    coordsLine2: 'Knuckles Mountain Range',
    image: {
      src: '/images/Restaurant/Restaurant_Exterior_3.webp',
      alt: 'The hillside pavilion at golden hour, looking out across misted Knuckles valleys.',
    } as ContentImage,
    video: {
      src: '/videos/Mist_rolls_around_bamboo_pavilion_202609080129.mp4',
      type: 'video/mp4',
    } as ContentVideo,
  },

  brandIntro: {
    eyebrow: 'Our Story',
    headingLines: ['Beyond the map.', 'Within the canopy.'],
    paragraphs: [
      'Deep in the heart of Sri Lanka, where the misty, ancient peaks of the Knuckles Mountain Range meet the whispering canopy of the jungle, time slows down. Amandaria — Vanya Nadi was born from a desire to create something rare: a sanctuary that honours the untamed majesty of the landscape without ever compromising on refined, barefoot luxury.',
      'Amandaria evokes a vision of peaceful grace and secluded beauty, while Vanya Nadi — meaning "wild river" — anchors the retreat to the organic, flowing pulse of the surrounding wilderness. Here, architecture does not conquer nature; it converses with it.',
    ],
    imageLandscape: {
      src: '/images/Villa/Villa_bed.webp',
      alt: 'A bedroom opening through floor-to-ceiling glass onto misted forested hills.',
    } as ContentImage,
    image: {
      src: '/images/Reception/Reception_Exterior.webp',
      alt: 'The arrival pavilion, set into the forested hillside of the Knuckles Range.',
    } as ContentImage,
  },

  sanctuary: {
    eyebrow: 'The Philosophy',
    headingLines: ['A Private World,', 'Woven Into the Wild.'],
    intro:
      'We believe true luxury is found in space, silence, and absolute privacy. Our intimate collection of Aranya’s — thoughtfully designed with minimalist jungle aesthetics and inspired by the effortless flow of Tropical Modernism — are woven seamlessly into the forest.',
    items: [
      {
        index: '01',
        title: 'The Canopy',
        body: 'Elevated spaces immersed in jungle, where every room opens onto the forest rather than shutting it out.',
        image: {
          src: '/images/Pods/Pods_Exterior_2.webp',
          alt: 'A private pavilion with a circular plunge pool, nested in misty jungle canopy.',
        },
      },
      {
        index: '02',
        title: 'The River',
        body: 'The wild Vanya Nadi flows through the experience — heard before it is seen, felt long after it is left.',
        image: {
          src: '/images/Villa/Villa_upper_deck.webp',
          alt: 'A curved plunge pool and timber deck overlooking the mountain valley.',
        },
      },
      {
        index: '03',
        title: 'The View',
        body: 'Floor-to-ceiling vistas frame the dramatic mountain terrain, dissolving the boundary between shelter and sky.',
        image: {
          src: '/images/Villa/Villa_bed.webp',
          alt: 'A bedroom opening through floor-to-ceiling glass onto misted forested hills.',
        },
      },
      {
        index: '04',
        title: 'The Silence',
        body: 'A retreat designed around stillness and privacy — unhurried, unscheduled, entirely your own.',
        image: {
          src: '/images/Pool-Spa/interior.webp',
          alt: 'The spa’s circular rain shower falling into a still, shadowed pool.',
        },
      },
    ] as SanctuaryItem[],
  },

  destination: {
    eyebrow: 'The Destination',
    headingLines: ['The Mist-Laden Heart', 'of the Knuckles.'],
    intro:
      'Bordering the UNESCO World Heritage-listed Knuckles Mountain Range in central Sri Lanka, Amandaria — Vanya Nadi sits entirely apart from the typical coastal or crowded tourist trail. Misty peaks. Ancient forests. Cascading waterfalls. The organic rhythm of a wild river.',
    tags: [
      {
        label: 'The Landscape',
        body: 'An untouched theatre of misty peaks, dense cloud forests, cascading waterfalls, and the organic, flowing rhythm of the wild river.',
      },
      {
        label: 'The Atmosphere',
        body: 'A secluded micro-climate where mornings roll in with a blanket of quiet fog, and the modern world feels millions of miles away.',
      },
    ] as DestinationTag[],
    image: {
      src: '/images/Owner-Residence/Exterior-2.webp',
      alt: 'The hillside residence looking out across misted Knuckles valleys.',
    } as ContentImage,
  },

  architecture: {
    eyebrow: 'Architecture & Design',
    heading: 'Architecture That Breathes With the Wild.',
    statement: 'Architecture does not tame the landscape; it frames it.',
    body: 'Built on principles of Tropical Modernism and minimalist jungle aesthetics, our structures — ranging from elevated river pavilion sanctuaries to sculptural, stump-inspired private villas — dissolve the barrier between inside and out.',
    materials: [
      {
        key: 'glass',
        label: 'Glass',
        caption: 'The Framed View',
        tag: 'Study 01',
        image: {
          src: '/images/Pods/Pods_Bedroom_2.webp',
          alt: 'A canopy bedroom framed in glass, looking out through the forest.',
        },
      },
      {
        key: 'timber',
        label: 'Timber',
        caption: 'Sculptural Villa',
        tag: 'Study 04',
        image: {
          src: '/images/Villa/Villa_exterior.webp',
          alt: 'The cylindrical timber villa on its hillside, reached by a lantern-lit bridge.',
        },
      },
      {
        key: 'stone',
        label: 'Stone',
        caption: 'Stone Sanctum',
        tag: 'Study 03',
        image: {
          src: '/images/Pool-Spa/interior.webp',
          alt: 'The spa’s circular rain shower falling into a still, shadowed stone chamber.',
        },
      },
      {
        key: 'concrete',
        label: 'Concrete',
        caption: 'Sunken Lounge',
        tag: 'Study 02',
        image: {
          src: '/images/Villa/Villa_sunken_lounge.webp',
          alt: 'A concrete sunken lounge with a wave ceiling, opening onto a mountain balcony.',
        },
      },
    ] as MaterialSwatch[],
    panelCaption: 'The Framed View',
    panelTag: 'Study 01',
    image: {
      src: '/images/Pods/Pods_Bedroom_2.webp',
      alt: 'A canopy bedroom framed in glass, looking out through the forest.',
    } as ContentImage,
  },

  aranya: {
    eyebrow: 'The Aranya',
    heading: 'Aranya',
    subheading: 'Your sanctuary above the river.',
    body: 'Inside your river pavilion, clean lines, organic textures, and tropical modernism take centre stage. Floor-to-ceiling glass frames untamed green vistas, blurring the boundary between indoor luxury and the wild river rushing past below. Unwind on oversized daybeds, or soak in a private plunge pool suspended under the open jungle canopy.',
    features: ['Private Deck', 'River Views', 'Plunge Pool', 'Canopy Immersion'],
    cta: { label: 'Explore Your Sanctuary', href: '#experience' } as CtaLink,
    panelCaption: 'Aranya · River Pavilion',
    image: {
      src: '/images/Villa/Villa_sunken_lounge.webp',
      alt: 'A sunken lounge with a wave ceiling, opening onto a mountain balcony.',
    } as ContentImage,
  },

  experience: {
    eyebrow: 'The Experience',
    heading: 'A Day Without a Schedule',
    subheading: 'Let the rhythm of the wild decide the pace.',
    hint: 'Slide to follow the day',
    items: [
      {
        time: '06:00',
        title: 'Awaken in the Canopy',
        body: 'Mist rolls across the mountains. Step onto your private floating deck as the cool breeze carries the scent of wild pepper and earth.',
        image: {
          src: '/images/Owner-Residence/Bedroom-1.webp',
          alt: 'Morning light in a private bedroom looking out into the forest.',
        },
      },
      {
        time: '09:00',
        title: 'Morning Stillness',
        body: 'Locally harvested Ceylon tea on your private deck, as the valley slowly emerges from the fog below.',
        image: {
          src: '/images/Owner-Residence/Terrace.webp',
          alt: 'A private terrace set above the canopy, ready for a quiet morning.',
        },
      },
      {
        time: '13:00',
        title: 'Into the Wild',
        body: 'Discover the surrounding landscape at the unhurried pace of your own choosing.',
        image: {
          src: '/images/Pods/Pods_Exterior_1_dark.webp',
          alt: 'A forest pavilion stepping out into the surrounding jungle.',
        },
      },
      {
        time: '17:30',
        title: 'Golden Hour',
        body: 'Watch the mountains disappear into mist as the light turns low and amber.',
        image: {
          src: '/images/Pool-Spa/exterior-1.webp',
          alt: 'The infinity pool terrace looking toward the hills at late light.',
        },
      },
      {
        time: '20:00',
        title: 'Under the Stars',
        body: 'Contemporary Sri Lankan dining beneath a vast, unpolluted night sky.',
        image: {
          src: '/images/Restaurant/Restaurant_Exterior _2-dark.webp',
          alt: 'The dining pavilion at dusk, lit for an evening under the open sky.',
        },
      },
    ] as TimelineItem[],
  },

  culinary: {
    eyebrow: 'Culinary Journey',
    heading: 'Savor the Soul of the Island.',
    subheading: 'Contemporary Sri Lankan Fusion.',
    body: 'As day turns to dusk, experience a culinary journey that redefines tradition — where time-honoured spices, hyper-local organic produce, and modern techniques are paired with fine wines, all enjoyed under a blanket of unpolluted starlight.',
    cta: { label: 'Discover the Culinary Journey', href: '#inquiry' } as CtaLink,
    themes: ['Time-honoured Spices', 'Local Organic Produce', 'Modern Techniques', 'Fine Wines'],
    image: {
      src: '/images/Restaurant/Restaurant_Exterior_4.webp',
      alt: 'Open-air dining and a sunken fire-pit lounge on the hillside pavilion.',
    } as ContentImage,
  },

  privacy: {
    eyebrow: 'Absolute Privacy',
    heading: 'Your time is entirely your own.',
    body: 'With a strictly limited collection of keys ensuring total seclusion, your stay is defined by complete freedom. No crowded spaces. No rigid itineraries. No unnecessary noise. Just unhurried stillness and intuitive hospitality.',
  },

  finalCta: {
    headingLines: ['Perhaps it is time', 'to disappear.'],
    body: 'Discover a private world where the ancient mist of the Knuckles meets minimalist architectural poetry.',
    primaryCta: { label: 'Private Inquiry', href: '#inquiry' } as CtaLink,
    secondaryCta: { label: 'Contact Amandaria', href: 'mailto:info@amandaria.com' } as CtaLink,
    callout: 'Where every moment moves at the unhurried rhythm of the wild.',
    image: {
      src: '/images/Pool-Spa/exterior-2.webp',
      alt: 'The infinity pool at sunset, looking toward the Knuckles peaks.',
    } as ContentImage,
  },

  inquiryForm: {
    eyebrow: 'Private Inquiry',
    heading: 'Begin a Private Inquiry',
    note: 'A member of the Amandaria team will respond personally within two days. No booking or payment is required at this stage.',
    fields: {
      name: 'Full Name',
      email: 'Email',
      arrival: 'Arrival',
      departure: 'Departure',
      message: 'Your Vision for the Stay',
    },
    submitLabel: 'Submit Inquiry',
    successHeading: 'Thank you.',
    successBody:
      'Your inquiry has been received. A member of the Amandaria team will be in touch personally to help shape your stay.',
  },

  footer: {
    brandTagline: 'The Knuckles Mountain Range, Sri Lanka.',
    closingStatement: 'Beyond the map. Within the canopy.',
    email: 'info@amandaria.com',
    groups: [
      {
        heading: 'Navigation',
        links: [
          { label: 'The Sanctuary', href: '#sanctuary' },
          { label: 'Architecture & Design', href: '#architecture' },
          { label: 'The Experience', href: '#experience' },
          { label: 'Culinary Journey', href: '#culinary' },
          { label: 'Private Inquiries', href: '#inquiry' },
        ],
      },
      {
        heading: 'Contact & Inquiries',
        links: [
          { label: 'info@amandaria.com', href: 'mailto:info@amandaria.com' },
          { label: 'Private Inquiry Form', href: '#inquiry' },
        ],
      },
      {
        heading: 'Legal',
        links: [
          { label: 'Privacy Policy', href: '#footer' },
          { label: 'Terms of Stay', href: '#footer' },
          { label: 'Media & Press Kit', href: '#footer' },
        ],
      },
    ] as FooterLinkGroup[],
  },
};

export type HomeContent = typeof homeContent;
