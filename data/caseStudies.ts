export type CaseStudy = {
  slug: string;
  overview: string;
  built: string[];
  challenge: { title: string; paragraphs: string[]; bullets?: string[] };
  result?: string;
  note?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "happy-camera",
    overview:
      "Happy Camera is a Kuala Lumpur retailer of new and preloved camera gear. I designed and built their whole online store, from the catalog customers browse to the dashboard staff use to run orders. It has been live in production for about a month.",
    built: [
      "Storefront: a catalog filterable by brand, condition and price, with Brand New and Preloved grading, a quick-view window, cart and wishlist drawers, Google sign-in and order history.",
      "Order tracking: customers look up an order by number and email, with a progress ribbon that refreshes automatically.",
      "Order system: unique order numbers, a status flow from Pending to Delivered, automatic stock updates on payment, and automatic confirmation and shipping emails.",
      "Admin dashboard: sales metrics and low-stock alerts, product management with image cropping, CSV bulk upload, manual (offline) orders, review moderation and password reset.",
      "SEO: a dynamic sitemap and per-product metadata.",
    ],
    challenge: {
      title: "Choosing the right payment setup",
      paragraphs: [
        "The hardest part of this project was not writing code, it was deciding how the shop should get paid. The owner had two clear goals: keep transaction fees as low as possible, since camera margins are thin, and let customers pay in instalments through buy-now-pay-later, because a single camera or lens can cost thousands of ringgit.",
        "I compared the main Malaysian gateways, including toyyibPay, Fiuu (Razer Merchant Services) and CHIP, on transaction fees, setup and annual costs, supported payment methods, settlement time and how well they integrate with a custom-built store. I chose CHIP because it offered the lowest percentage rates among the full-featured options and supports BNPL, with a developer API and signed webhooks that fit a custom checkout.",
        "The result is a checkout where customers pay on CHIP’s secure hosted page by card, FPX online banking, DuitNow QR or ShopeePay Later, with manual bank transfer and receipt upload as a zero-fee option. Atome instalments are also available through the shop’s own merchant QR code.",
      ],
      bullets: [
        "Prices are always recalculated on the server from the database, never trusted from the browser.",
        "Every payment notification from the gateway is verified by cryptographic signature before an order is marked as paid.",
        "Confirmation is idempotent, so a repeated notification does not process an order twice.",
        "If the gateway fails mid-checkout, the half-created order is removed.",
        "Bank-transfer orders accept a receipt upload, and an admin confirms payment, which then updates stock.",
      ],
    },
  },
  {
    slug: "hexagon-game",
    overview:
      "Hexagon Games 2026 is a three-day functional fitness festival (4 to 6 December 2026) at Hextar World, Empire City, Petaling Jaya, organized by the Malaysia Obstacle Race Sports Association (MORSA). The organizers came to me with a draft design and a 24-hour deadline, and I turned it into the live official event site.",
    built: [
      "A single-page site that guides visitors from the hero video through event details, a build-up timeline, a race-course video, a photo gallery and partner logos, to the ticket section.",
      "A live countdown to the event start, set to Malaysia time, and statistics that animate as they scroll into view.",
      "A race-course section with a custom video player showing a drone fly-through of the venue.",
      "A ticket button and scannable QR code that send visitors to the organizer’s ticketing partner.",
      "Responsive layouts with a mobile menu, scroll animations that respect reduced-motion settings, social-sharing previews and search metadata.",
    ],
    challenge: {
      title: "24 hours, and a design to follow",
      paragraphs: [
        "The organizers needed the site urgently and had already settled on a design. My job was to reproduce it faithfully, quickly. I started from an AI-generated template (Lovable) to get the page structure in place, then spent the day reshaping it to match their draft: layout, sections, branding, partner logos and event details, using my own AI coding assistant for the edits.",
        "I deployed on Vercel so the site could go live without waiting for a custom domain. The site is a static marketing page with no database or login, and ticketing and payments are handled separately by the organizer’s ticketing partner.",
      ],
    },
    note: "My role was implementation of the organizer’s design, not the visual design itself.",
  },
  {
    slug: "plastify-app",
    overview:
      "Plastify was my first real project. A team of friends at Universiti Sains Malaysia, working on an environment-related course project, asked me to build a system for their entry to TI NATUREX 3.0, a project showcase. They gave me the requirements, and I designed and built the whole app: a website that raises awareness about waste, helps people find the nearest recycling and disposal points, and identifies waste with the camera.",
    built: [
      "Scroll-driven storytelling: a 3D globe that rotates as you scroll, a counter animating to Malaysia’s daily waste figure, and five pinned stat cards with video backgrounds, built with React Three Fiber, GSAP and Lenis.",
      "AI waste scanner: point the camera at an item, or upload a photo, to get its material type (plastic, paper, metal, glass, e-waste or organic), whether it is recyclable and how to dispose of it. I trained the image-classification model myself with my own photos in Google Teachable Machine, and ran it in the browser with TensorFlow.js.",
      "Recycling map: search a city or use your location to find nearby recycling centres from OpenStreetMap data, filter by material, and open directions in Waze or Google Maps.",
      "Bilingual: English and Bahasa Melayu at the tap of a button.",
    ],
    challenge: {
      title: "Learning Leaflet and fixing a blank map",
      paragraphs: [
        "I had never used a mapping library before, so I learned Leaflet while building, and it fought me. At first the map rendered blank. I traced it to the map container having no height, and then to the page’s animations and smooth scrolling changing the container’s size after the map had already measured it.",
        "The fixes: give the container an explicit height, create the map by hand so React could not initialize it twice, tell Leaflet to re-measure itself once the layout settled, and add compositing hints so the map tiles stayed visible inside the pinned, scrolling layout.",
      ],
    },
    result: "The team received a prize and a certificate at the showcase.",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
