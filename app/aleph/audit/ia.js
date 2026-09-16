// Content for the (currently unlinked, see page.js) IA tab: the site's
// current structure and the page-mapping sketch. Jon's own words (Sep 2026),
// lightly reformatted for the table shapes below. No F-numbers, per the same
// rule as the Finding column.
export const IA_TODAY = [
  { group: 'Core platform', pages: 'Spreadsheet add-ins, Dashboards, Security, Integrations (+4 category filters)', what: 'The data layer and its non-AI doorways' },
  { group: 'AI', pages: 'AI overview, Agent, MCP, Scan, AI mappings, Agentic Budgeting, Slack app', what: 'Seven pages for one agent and two older features' },
  { group: 'Solutions by job', pages: 'Reporting and close, Modeling and forecasting, Budgeting, Headcount', what: 'Mostly the same template with the headline swapped' },
  { group: 'Solutions by buyer', pages: 'PE-backed, PE funds, VC-backed, Fractional CFOs', what: 'The same product described for each buyer' },
  { group: 'Proof and service', pages: 'Customers, Customer success', what: 'Testimonials and the CS team' },
  { group: 'Lead gen', pages: 'Blog, podcast, webinars, guides, fitness test, /answers, AI spend calculator', what: 'Content and tools that collect emails. The spend calculator is about LLM routing for engineers and names outdated models.' },
  { group: 'Company and conversion', pages: 'About, Careers, Contact, Demo, Sign in', what: 'No pricing page (/pricing 404s). Demo is 30 minutes.' },
]

// The 7 AI-section pages (plus a few adjacent ones) mapped onto the sketch in
// delivery/ia-sketch-for-daniel.md. The "Signal" and "sketch" sections that
// used to explain the right-hand column were removed 2026-09-16; bring them
// back from that file if this table needs its context restored.
export const IA_PAGE_MAP = [
  { today: 'AI overview, Aleph Agent', sketch: 'How it works, plus the Slack and Teams page' },
  { today: 'Aleph Agent MCP', sketch: 'The Claude and ChatGPT page under How it works' },
  { today: 'Spreadsheet add-ins, Dashboards', sketch: 'Their own pages under How it works' },
  { today: 'Integrations', sketch: 'The connect layer under How it works, keeping the directory' },
  { today: 'AI mappings', sketch: 'The govern layer under How it works' },
  { today: 'AI variance analysis (Scan)', sketch: 'Close and reporting' },
  { today: 'Agentic Budgeting', sketch: 'Budgeting, and the template for the other use cases' },
  { today: 'Four job pages', sketch: 'Use cases' },
  { today: 'Four buyer pages', sketch: "Who it's for" },
  { today: 'Security', sketch: 'Trust' },
  { today: 'Customer success', sketch: 'Next to Customers' },
  { today: 'Slack app', sketch: 'Stays live as the Slack directory page, out of the nav' },
  { today: 'AI spend calculator', sketch: "Out of the nav (it's about LLM routing for engineers)" },
]

export const IA_CLOSING = [
  'Seven AI pages become about two in the nav. Keep the old URLs as search landing pages or redirect them, and look at Search Console before cutting anything, because "AI variance analysis" and similar pages may be pulling organic traffic. I don\'t have page-level traffic yet.',
  "Timing: bring it to Daniel as a sketch, then line it up with RA's Sep 21 strategy readout so positioning drives the structure.",
]
