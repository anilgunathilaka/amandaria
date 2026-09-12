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

export interface AranyaFeature {
  label: string;
  image: ContentImage;
  caption: string;
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

export interface SocialLink {
  platform: 'facebook' | 'instagram';
  href: string;
}

export interface StatementLine {
  text: string;
  emphasis?: string;
}

export interface FooterLinkGroup {
  heading: string;
  links: NavLink[];
  social?: SocialLink[];
}

export const homeContent = {
  meta: {
    title: 'Amandaria — Vanya Nadi',
    description:
      'A private world beyond the map, where the raw poetry of the Knuckles wilderness meets the pinnacle of thoughtful, modern design.',
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
      { label: 'Private Inquiries', href: '#inquiry' },
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
    // Shown large over the video once it opens to full-bleed on scroll.
    wordmark: {
      src: '/images/logo/Amandaria-white-text.webp',
      alt: 'Amandaria',
    } as ContentImage,
  },

  brandIntro: {
    eyebrow: 'Our Story',
    headingLines: ['The Genesis:', 'A Return to the Wild.'],
    paragraphs: [
      'Deep in the heart of Sri Lanka, where the misty, ancient peaks of the Knuckles Mountain Range meet the whispering canopy of the jungle, time slows down. Amandaria — Vanya Nadi was born from a desire to create something rare: a sanctuary that honours the untamed majesty of the landscape without ever compromising on refined, barefoot luxury.',
      'The name itself tells the story of our home. Amandaria evokes a vision of peaceful grace and secluded beauty, while Vanya Nadi — meaning "wild river" — anchors the retreat to the organic, flowing pulse of the surrounding wilderness. Here, architecture does not conquer nature; it converses with it.',
      'Amandaria — Vanya Nadi is not merely a destination; it is an immersion. It is morning mist rolling over the mountain ridge as the jungle wakes, quiet afternoons suspended in the canopy, and evenings under a vast, starlit Sri Lankan sky.',
      'Operated as an exclusive, all-inclusive boutique retreat, every detail of your stay is intuitively curated. From the privacy of your secluded villa to the rich culinary expressions that celebrate the soul of the island, we offer a deeply personal brand of hospitality where your time is entirely your own.',
      'Our Promise: To offer a private world beyond the map, where the raw poetry of the Knuckles wilderness meets the pinnacle of thoughtful, modern design.',
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
    headingLines: ['Tropical Modernism', '& Absolute Privacy.'],
    introParagraphs: [
      'We believe true luxury is found in space, silence, and absolute privacy. Our intimate collection of Aranya’s — thoughtfully designed with minimalist jungle aesthetics and inspired by the effortless flow of Tropical Modernism — are woven seamlessly into the forest.',
      'Every structure, from our elevated river pavilion sanctuaries to our private spaces, is crafted to dissolve the boundary between indoors and out. Floor-to-ceiling vistas frame the dramatic mountain terrain, while natural textures, warm ambient lighting, and bespoke design invite you to exhale deeply and disconnect from the noise of the world.',
    ],
    items: [
      {
        index: '01',
        title: 'The Canopy',
        body: 'Quiet afternoons suspended in the canopy — a private world woven into the wild.',
        image: {
          src: '/images/Pods/Pods_Exterior_2.webp',
          alt: 'A private pavilion with a circular plunge pool, nested in misty jungle canopy.',
        },
      },
      {
        index: '02',
        title: 'The River',
        body: 'Vanya Nadi — the wild river — anchors every sanctuary to the flowing pulse of the wilderness.',
        image: {
          src: '/images/Villa/Villa_exterior-river-view.webp',
          alt: 'A curved timber villa on a forested hillside at dawn, the wild river winding through the misted valley below.',
        },
      },
      {
        index: '03',
        title: 'The View',
        body: 'Floor-to-ceiling vistas frame the dramatic mountain terrain of the Knuckles.',
        image: {
          src: '/images/Villa/Villa_bed.webp',
          alt: 'A bedroom opening through floor-to-ceiling glass onto misted forested hills.',
        },
      },
      {
        index: '04',
        title: 'The Silence',
        body: 'Space, silence, and absolute privacy — unhurried stillness, entirely yours.',
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
      'Bordering the UNESCO World Heritage-listed Knuckles Mountain Range in central Sri Lanka, Amandaria — Vanya Nadi sits entirely apart from the typical coastal or crowded tourist trail.',
    tags: [
      {
        label: 'The Landscape',
        body: 'An untouched theatre of misty peaks, dense cloud forests, cascading waterfalls, and the organic, flowing rhythm of the wild river (Vanya Nadi).',
      },
      {
        label: 'The Atmosphere',
        body: 'A secluded micro-climate where the air is crisp, mornings roll in with a blanket of quiet fog, and the chaos of the modern world feels millions of miles away. It is an environment designed for absolute stillness, deep breath, and total privacy.',
      },
      {
        label: 'Architecture in Dialogue with Nature',
        body: 'Built on principles of Tropical Modernism and minimalist jungle aesthetics, our structures — ranging from elevated river pavilion sanctuaries (Aranya’s) to sculptural, stump-inspired private villas — dissolve the barrier between inside and out. Architecture does not tame the landscape; it frames it.',
      },
      {
        label: 'An Immersive Pace',
        body: 'The concept centres on unhurried luxury. Guests trade schedules for the cadence of the wild — private mornings overlooking the canopy, bespoke culinary expressions celebrating contemporary Sri Lankan fusion, and an uncompromised standard of barefoot hospitality.',
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
    introHeadingLines: [
      'Architecture That',
      'Breathes With',
      'The Wild.',
    ],
    statement: 'Architecture does not tame the landscape; it frames it.',
    body: 'Built on principles of Tropical Modernism and minimalist jungle aesthetics, our structures — ranging from elevated river pavilion sanctuaries (Aranya’s) to sculptural, stump-inspired private villas — dissolve the barrier between inside and out.',
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
    heading: 'Minimalist Sanctuary',
    subheading: 'Architecture that breathes with the wild.',
    body: 'Inside your river pavilion, clean lines, organic textures, and tropical modernism take centre stage. Floor-to-ceiling glass frames untamed green vistas, blurring the boundary between indoor luxury and the wild river (Vanya Nadi) rushing past below. Unwind on oversized daybeds or soak in a private plunge pool suspended under the open jungle canopy.',
    // Each feature swaps the panel photograph on click — see
    // initAranya (main.js) and [data-aranya-image].
    features: [
      {
        label: 'Private Deck',
        image: {
          src: '/images/Villa/Villa_upper_deck.webp',
          alt: 'A curved private deck with loungers beside an infinity-edge plunge pool at sunset.',
        },
        caption: 'Aranya · Private Deck',
      },
      {
        label: 'River Views',
        image: {
          src: '/images/Pods/Pods_Exterior_2_riwer_view.webp',
          alt: 'A pavilion with a plunge pool overlooking the river winding through the misted valley.',
        },
        caption: 'Aranya · River Views',
      },
      {
        label: 'Plunge Pool',
        image: {
          src: '/images/Pods/Pods_Exterior_2.webp',
          alt: 'A private pavilion with a circular plunge pool, nested in misty jungle canopy.',
        },
        caption: 'Aranya · Plunge Pool',
      },
      {
        label: 'Canopy Immersion',
        image: {
          src: '/images/Owner-Residence/Terrace.webp',
          alt: 'A woven-canopy terrace lounge open to the forested mountain view.',
        },
        caption: 'Aranya · Canopy Immersion',
      },
    ] as AranyaFeature[],
    cta: { label: 'Explore Your Sanctuary', href: '#experience' } as CtaLink,
    panelCaption: 'Aranya · River Pavilion',
    image: {
      src: '/images/Villa/Villa_sunken_lounge.webp',
      alt: 'A sunken lounge with a wave ceiling, opening onto a mountain balcony.',
    } as ContentImage,
  },

  experience: {
    eyebrow: 'The Experience',
    heading: 'Untamed, Unrivaled, Uncompromised',
    subheading: 'Let the rhythm of the wild decide the pace.',
    hint: 'Slide to follow the day',
    items: [
      {
        time: '06:00',
        title: 'Awaken in the Canopy',
        body: 'Wake to the gentle rustle of the mist-laden Knuckles cloud forest. Step onto your private, elevated floating deck as the cool mountain breeze carries the scent of wild pepper and earth.',
        image: {
          src: '/images/Owner-Residence/Bedroom-1.webp',
          alt: 'Morning light in a private bedroom looking out into the forest.',
        },
      },
      {
        time: '09:00',
        title: 'The Morning Ritual',
        body: 'A steaming cup of locally harvested high-grown Ceylon tea awaits, as the valley below slowly emerges from the morning fog.',
        image: {
          src: '/images/Owner-Residence/Terrace.webp',
          alt: 'A private terrace set above the canopy, ready for a quiet morning.',
        },
      },
      {
        time: '13:00',
        title: 'Suspended in the Canopy',
        body: 'Quiet afternoons suspended in the canopy, where the modern world feels millions of miles away.',
        image: {
          src: '/images/Pods/Pods_Exterior_1_dark.webp',
          alt: 'A forest pavilion stepping out into the surrounding jungle.',
        },
      },
      {
        time: '17:30',
        title: 'As Day Turns to Dusk',
        body: 'A culinary journey that redefines tradition — contemporary Sri Lankan fusion under soft evening light.',
        image: {
          src: '/images/Pool-Spa/exterior-1.webp',
          alt: 'The infinity pool terrace looking toward the hills at late light.',
        },
      },
      {
        time: '20:00',
        title: 'Under a Starlit Sky',
        body: 'Evenings under a vast, unpolluted Sri Lankan night sky — fine wines and the soul of the island.',
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
    subheading: 'Elevated Fusion Dining',
    body: 'As day turns to dusk, experience a culinary journey that redefines tradition. Indulge in contemporary Sri Lankan fusion — where time-honoured spices, hyper-local organic produce, and modern techniques are paired with fine wines, all enjoyed under a blanket of unpolluted starlight.',
    cta: { label: 'Discover the Culinary Journey', href: '#inquiry' } as CtaLink,
    themes: [
      'Time-honoured Spices',
      'Local Organic Produce',
      'Modern Techniques',
      'Fine Wines',
    ],
    image: {
      src: '/images/Restaurant/CulinaryJourney_2.webp',
      alt: 'A plated dish of seared scallops with local spices and a glass of white wine, set against a mountain sunset.',
    } as ContentImage,
    secondaryImage: {
      src: '/images/Restaurant/Restaurant_Exterior_1.webp',
      alt: 'The sweeping bamboo-roofed pavilion at dawn, overlooking misted mountain forest.',
    } as ContentImage,
  },

  privacy: {
    eyebrow: 'Total Sovereignty Over Time',
    heading: 'Absolute Privacy',
    body: 'With a strictly limited collection of keys ensuring total seclusion, your stay is defined by complete freedom. There are no crowded spaces, no rigid itineraries — just unhurried stillness, intuitive barefoot hospitality, and a private world that belongs entirely to you.',
  },

  finalCta: {
    headingLines: ['Perhaps it is time', 'to disappear.'],
    body: 'Where the ancient mist of the Knuckles meets minimalist architectural poetry. Discover a private world crafted for the few.',
    primaryCta: { label: 'Private Inquiry', href: '#inquiry' } as CtaLink,
    secondaryCta: { label: 'Contact Amandaria', href: 'mailto:info@amandaria.com' } as CtaLink,
    callout: 'Where every moment moves at the unhurried rhythm of the wild.',
    image: {
      src: '/images/Pool-Spa/exterior-2.webp',
      alt: 'The infinity pool at sunset, looking toward the Knuckles peaks.',
    } as ContentImage,
  },

  inquiryForm: {
    eyebrow: 'Private Inquiries',
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

  journeyStatement: {
    headingLines: [
      { text: 'Beyond the map.' },
      { text: 'Within the ', emphasis: 'canopy.' },
    ] as StatementLine[],
    cta: { label: 'Begin a Private Inquiry', href: '#inquiry' } as CtaLink,
    image: {
      src: '/images/Owner-Residence/Exterior-1.webp',
      alt: 'An aerial view of a river pavilion nestled among misted jungle canopy in the Knuckles Mountain Range.',
    } as ContentImage,
    video: {
      src: '/videos/footer-video.mp4',
      type: 'video/mp4',
    } as ContentVideo,
  },

  footer: {
    ctaLines: ['Ready to disappear into the wild?', 'Begin your private inquiry.'],
    cta: { label: 'Private Inquiry', href: '#inquiry' } as CtaLink,
    contactCta: { label: 'Contact Amandaria', href: 'mailto:info@amandaria.com' } as CtaLink,
    brandTagline: 'The Knuckles Mountain Range, Sri Lanka.',
    closingStatement: 'Beyond the map. Within the canopy.',
    email: 'info@amandaria.com',
    copyrightName: 'Amandaria — Vanya Nadi',
    groups: [
      {
        heading: 'Contact & Inquiries',
        links: [
          { label: 'info@amandaria.com', href: 'mailto:info@amandaria.com' },
          { label: 'Private Inquiry Form', href: '#inquiry' },
        ],
        social: [
          { platform: 'facebook', href: '#' },
          { platform: 'instagram', href: '#' },
        ],
      },
      {
        heading: 'Legal & Privacy',
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
