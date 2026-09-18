// Content for the IA tab: Jon's framing question up top, what he's noticing
// in today's structure, and one way it could work. Written as curiosity, not
// conviction (per Jon, Sep 18). Source: the IA sketch for Daniel
// (`26_0910 Audit/process/share-out/ia-sketch-for-daniel.md`). `{{...}}` in a
// cell becomes an info-icon tooltip with the evidence, same as the Finding
// column. No F-numbers.
export const IA_RATIONALE = [
  "What if our site structure mirrored how people actually experience the product, moving from connecting systems and governing data to working with it anywhere, with AI operating across the layers? Right now, the current layout feels a bit fragmented across seven groups and 37 pages{{Core platform (4), AI (7), solutions by job (4), solutions by buyer (4), proof and service (2), lead gen (7), company and conversion (5), plus integration category filters.}}, where AI sits in its own separate column and a single agent goes by three different names.",
  "Since we are already migrating to aleph.ai and refreshing the platform, could this be the ideal moment to rethink the architecture from the ground up? The labels below are just early hypotheses to play with. How might Red Antler's upcoming positioning help us land on the most intuitive names and flow?",
]

export const IA_PROBLEMS = [
  { problem: 'AI lives in its own column', cost: "The Platform menu splits Core platform from AI capabilities{{Platform menu, Sep 18. Core platform: Platform overview, Data consolidation, Spreadsheet add-ins, Dashboards, Security & compliance. AI capabilities: Agentic Budgeting, Aleph Agent, Aleph Agent MCP, AI variance analysis, AI mappings.}}. The purple is gone, but for a company whose pitch is AI for finance, could a separate column still read like an add-on?" },
  { problem: 'One agent, three names', cost: 'Aleph Agent, Aleph MCP and Aleph Agent MCP look like the same agent reached through different doors{{The site uses both "Aleph MCP" and "Aleph Agent MCP," and the launch copy says "Aleph Agent… all powered by the Aleph MCP."}}. I wonder whether a buyer can tell what the agent is and where it lives.' },
  { problem: 'The job pages share a template', cost: 'Budgeting, close and reporting, forecasting and headcount read much the same with the headline swapped{{Solutions by job: Financial reporting & close, Modeling & forecasting, Collaborative budgeting, Headcount planning.}}, which may make it hard to see what the product does for each job.' },
  { problem: 'The buyer pages repeat it', cost: 'PE-backed, PE funds, VC-backed and fractional CFOs describe the same product four times. One teammate said the PE page "could be for an entirely different company" than the Agent page{{Internal brand survey, Jul 2026.}}.' },
  { problem: "Trust doesn't have a home", cost: 'Security sits under the platform, and how the AI stays accurate isn\'t explained in one place. "Trust" appears on 2 of 37 pages{{The Aleph Agent page and the AI overview page.}}, even though it may be our strongest story.' },
  { problem: 'The clearest explanation is in a video', cost: 'The plainest description of Aleph I found is in the Agent and MCP video transcripts{{The Aleph Agent and Aleph Agent MCP product videos, transcribed Sep 13.}}. Could the homepage say it that plainly?' },
  { problem: 'A few loose ends', cost: 'There\'s no pricing page (/pricing returns a 404), and the AI spend calculator talks to engineers about model routing{{It compares routing traffic across frontier models and names models that are already outdated.}}.' },
]

export const IA_SOLUTIONS = [
  { section: 'How it works', holds: 'The three layers on one page, with the places you work under it: Excel and Sheets, Claude and ChatGPT, Slack and Teams, dashboards. If the agent is how each of those works, maybe it doesn\'t need its own product page.', pages: 'Platform overview, Aleph Agent, Aleph Agent MCP, Spreadsheet add-ins, Dashboards, Data consolidation and Integrations (the connect layer), AI mappings (the govern layer)' },
  { section: 'Use cases', holds: 'Budgeting, close and reporting, forecasting, headcount, board reporting, each showing what the agent does and how you check it. Agentic Budgeting could be the template.', pages: 'Agentic Budgeting, the four job pages, AI variance analysis (into close and reporting)' },
  { section: 'Trust', holds: 'Security plus how the AI stays accurate: governed data, cited sources, checks, permissions. If trust becomes the positioning, maybe it earns a top-level spot.', pages: 'Security & compliance' },
  { section: "Who it's for", holds: 'CFO, FP&A analyst and budget owner, with PE, VC and fractional CFOs as segments.', pages: 'The four buyer pages' },
  { section: 'Customers', holds: 'Customer stories and the CX team side by side, since reviewers name their CX contact{{G2 reviewers name Michael and Henry on the CX team.}}.', pages: 'Customers, Customer success' },
  { section: 'Resources and company', holds: 'Mostly as they are.', pages: 'Blog, webinars, guides, podcast, fitness test, /answers, About, Careers, Contact' },
  { section: 'Out of the nav', holds: 'Still live for search and the app directories.', pages: 'Slack app, AI spend calculator' },
]

export const IA_CLOSING = [
  "If the AI pages became two places in the nav, what would we lose? Anything pulling search traffic could stay as a landing page or redirect, so Search Console is the first thing I'd want to look at.",
]
