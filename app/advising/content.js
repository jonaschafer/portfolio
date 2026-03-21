// Content for the design advising page. Sourced from docs/advising (my-pitch, to-do).

export const hero = {
  eyebrow: 'Fractional creative leadership',
  headline:
    'Brand clarity for companies between where they are and where they want to be.',
  subhead:
    'I work with founders, marketing, and creative staff at companies of all sizes to turn unclear brand instincts into decisions the whole team can execute from.',
}

export const otherWaysICanHelp = {
  bullets: [
    'You just rebranded and need help translating it into product, marketing, and hiring decisions',
    `You're hiring your first creative person and don't know what "good" looks like for your company`,
    "You have a founder with strong brand instincts who can't articulate them to the team",
    'You need strategic brand thinking without the cost of a full-time Creative Director',
    'Your team debates creative decisions without connecting them to business implications',
    'You need someone who turns "make it feel premium" into budget, hiring, and product choices',
    'You need help finding a creative partner, be it brand, product, motion, illustration, etc',
  ],
}

export const howItWorks = {
  text: `Most engagements start with a single conversation. I'll ask what's breaking down, what you've already tried, and what "better" looks like in 6 months. From there we figure out if a short-term project, ongoing advisory, or a full fractional engagement is the right fit — and what that actually costs. No predefined packages, no retainers before relationships.`,
  note: 'Usually responds within a day.',
}

/** Opens in browser — no Calendly badge widget (avoids fixed bottom-right button). */
export const calendlyBookingUrl = 'https://calendly.com/jonaschafer/35min'

export const caseStudyEndorsed = {
  title: 'Case Study: Brand architecture',
  situation: {
    label: 'Situation',
    text: 'The CEO used "house of brands" constantly in design reviews, leadership meetings, and Slack threads. But the team had no idea what that meant operationally or what the tradeoffs were.',
    caption: 'What the team heard: "We\'re a house of brands" (??)',
    image: '/advising/context.png',
  },
  translation: {
    label: 'Translation',
    text: 'I created a teaching deck explaining different brand architecture models in simple terms, showing what "house of brands" would mean for brand, marketing, and product strategy. Included budgetary implications, hiring priorities, naming considerations, and why an "endorsed" model made more sense for their stage.',
    caption: 'What I delivered: A framework that made abstract strategy actionable',
    image: '/advising/deck.png',
  },
  outcome: {
    label: 'Outcome',
    text: 'The CEO shifted to using "endorsed" in conversations and confidently hired a naming agency one month later with clear direction. Prevented months of expensive misalignment between vision and execution.',
    caption: 'From confusion to clarity in 4 weeks',
    image: null, // Add path e.g. /images/advising/endorsed-outcome.png
  },
}

export const about = {
  bio: "22 years building brands at agencies (Nike, RGA, AKQA) and startups (Clockwise, Zapier, ClassDojo). I know how to build from 0→1 and scale through growth.",
}

/** Advising page case studies (links to /case-studies/[slug]) */
export const caseStudies = [
  {
    title: 'From order-takers to strategic partners',
    description:
      "Repositioned a brand team's role inside a Series D company — changing how leadership used design, not just what it produced.",
    readTime: '5 min',
    slug: 'organizational-infrastructure',
  },
  {
    title: 'Replacing production help with senior creative partnership',
    description:
      'A founder swapped agency retainers for a part-time strategic partner — same budget, meaningfully different output.',
    readTime: '5 min',
    slug: 'resourcing-ivy',
  },
]

export const nextSteps = {
  intro: 'Ready to talk?',
  cta: 'Schedule a call',
  email: 'hello@jonschafer.com',
}
