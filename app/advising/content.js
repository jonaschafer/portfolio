// Content for the design advising page. Sourced from docs/advising (my-pitch, to-do).

export const hero = {
  headline: "I help Seed to Series B founders translate unclear brand instincts into decisions their teams can execute—without hiring a full-time Creative Director.",
}

export const whenToCallMe = {
  bullets: [
    'Just rebranded and need help translating it into product, marketing, and hiring decisions',
    'Are hiring your first creative person and don\'t know what "good" looks like for your company',
    'Have a founder with strong brand instincts who can\'t articulate them to the team',
    'Need strategic brand thinking without the cost of a full-time Creative Director',
    'Watch your team debate creative decisions without understanding the business implications',
    'Need someone who translates "make it feel premium" into concrete budget, hiring, and product choices',
  ],
}

export const howItWorks = {
  cards: [
    {
      planName: 'Option A',
      subtitle: 'Strategic Partner',
      youWillLoveThisIf: 'Strategic guidance and frameworks without hands-on execution or contractor management.',
      whatDoIGet: [
        'Bi-weekly 90-min strategy sessions with founder/leadership',
        'Strategic frameworks delivered (positioning, messaging hierarchy, brand architecture)',
        'Async review of key creative work (48hr turnaround)',
        'Quarterly brand audits',
      ],
      notIncluded: 'Not included: Hands-on execution, contractor management, unlimited access',
      price: '$8,000–10,000/m',
      hours: '8–12 hours per month',
      ctaText: "Let's talk",
    },
    {
      planName: 'Option B',
      subtitle: 'Fractional Creative Director',
      youWillLoveThisIf: 'Strategic direction plus art direction—I direct and QA work from your team or contractors; you pay them separately.',
      whatDoIGet: [
        'Everything in Option A',
        'I direct and QA work from your existing team/contractors (you pay them separately)',
        'Monthly design system check-ins',
        'On-call for hiring decisions, pitch decks, fundraising moments',
      ],
      notIncluded: 'Not included: Building deliverables myself, managing contractor payments',
      price: '$12,000–15,000/m',
      hours: '15–20 hours per month',
      ctaText: "Let's talk",
    },
  ],
  customEngagements: 'For full creative buildouts (rebrand, product launch), project-based pricing starting at $25k.',
}

export const caseStudyEndorsed = {
  title: 'Case Study: Brand architecture',
  situation: {
    label: 'The Situation',
    text: 'The CEO used "house of brands" constantly in design reviews, leadership meetings, and Slack threads. But the team had no idea what that meant operationally or what the tradeoffs were.',
    caption: 'What the team heard: "We\'re a house of brands" (??)',
    image: '/advising/context.png',
  },
  translation: {
    label: 'The Translation',
    text: 'I created a teaching deck explaining different brand architecture models in simple terms, showing what "house of brands" would mean for brand, marketing, and product strategy. Included budgetary implications, hiring priorities, naming considerations, and why an "endorsed" model made more sense for their stage.',
    caption: 'What I delivered: A framework that made abstract strategy actionable',
    image: '/advising/deck.png',
  },
  outcome: {
    label: 'The Outcome',
    text: 'The CEO shifted to using "endorsed" in conversations and confidently hired a naming agency one month later with clear direction. Prevented months of expensive misalignment between vision and execution.',
    caption: 'From confusion to clarity in 4 weeks',
    image: null, // Add path e.g. /images/advising/endorsed-outcome.png
  },
}

export const about = {
  bio: "22 years building brands at agencies (Nike, RGA, AKQA) and startups (Clockwise, Zapier, ClassDojo). I know how to build from 0→1 and scale through growth.",
}

export const caseStudies = [
  {
    title: 'Clockwise Rebrand',
    description: 'Led full rebrand from strategy through launch. 29% increase in search visibility, 600+ reactivations on launch day.',
    folder: '05 Clockwise Rebrand',
    images: ['cw-rebrand-14.gif', 'cw-rebrand-5.gif', 'cw-rebrand-1.png', 'cw-rebrand-2.png', 'cw-rebrand-3.png', 'cw-rebrand-4.png', 'cw-rebrand-6.png', 'cw-rebrand-7.png', 'cw-rebrand-8.png', 'cw-rebrand-9.png', 'cw-rebrand-10.png', 'cw-rebrand-11.png', 'cw-rebrand-12.png', 'cw-rebrand-13.png'],
  },
  {
    title: 'Novo',
    description: 'Refreshed visual identity and redesigned marketing site. 3% increase in engagement, NPS rose from 9 to 32.',
    folder: '02 Novo',
    images: ['novo-stina-compressed.mp4', 'novo-1.png', 'novo-2.png', 'novo-3.png', 'novo-4.png', 'novo-5.png', 'novo-6.png', 'novo-7.png', 'novo-8.png'],
  },
  {
    title: 'Zapier',
    description: 'Built the brand design team from 0 to 1, creating scalable design systems across email, social, and web. Collaborated with Instrument on rebrand, led in-house brand work.',
    folder: '07 Zapier',
    images: ['zapier-1.png', 'zapier-2.png', 'zapier-3.png', 'zapier-4.png', 'zapier-5.png', 'zapier-6.png', 'zapier-7.png', 'zapier-8.png', 'zapier-9.png', 'zapier-10.png'],
  },
]

export const nextSteps = {
  intro: 'Ready to talk?',
  cta: 'Schedule a call',
  email: 'hello@jonschafer.com',
}
