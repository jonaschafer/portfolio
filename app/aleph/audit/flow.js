// Content for the Conversion flow tab: what a buyer sees from the site to a
// booked meeting, what we expected vs what held up (with the HubSpot
// baseline), and a possible path. Written as curiosity, not conviction (per
// Jon, Sep 18). Sources: `26_0910 Audit/process/conversion-flow/flow-map.md`
// and `recon/hubspot-2026-09-18.md`. `{{...}}` in a cell becomes an
// info-icon tooltip with the evidence, same as the Finding column. No
// F-numbers, and nothing that grades the owners of the flow.
export const FLOW_INTRO = [
  'What does it feel like to go from our site to a booked meeting? I mapped every path the way a buyer would, logged out and stopping at the submit button, then looked in HubSpot for what happens after. The site makes a strong case, and it looks like the brand fades once someone fills out a form: the look changes, the promises disagree, and HubSpot doesn\'t send anything after they submit.',
  "Most of this sits outside Red Antler's scope, and we now have a baseline to measure against. What would it take for the moment after someone raises their hand to feel as considered as the homepage?",
]

export const FLOW_REALITY = [
  { step: 'Any page', sees: 'A top banner for Agentic Budgeting{{HubSpot banner, "NEW · Run budgeting with agents · See it in action," on every page except the demo, trial and Agentic Budgeting demo pages. It links to /agentic-budgeting.}}. On the way out (desktop), a pop-up{{HubSpot exit-intent pop-up on 29 pages, once per 7 days per browser. "Talk to our experts" opens /demo.}}.', promise: '"See your FP&A upside in 15 minutes."{{The exit pop-up. Intro calls are 30 minutes (Jack, Sep 8), and both demo pages ask for 30.}} The demo goes by six names across the site{{"Book a demo" (109 uses), "Get a Demo" (85), "Get a demo" (13), "Schedule a personalized demo" (4), "Talk to an expert" (2), and the pop-up\'s "Talk to our experts." Counted across 36 pages.}}.' },
  { step: 'Demo page', sees: 'Its own shell with no nav, and three required fields{{Company email, main use case, and how you heard about Aleph. "To assist clients or portfolio companies" adds a fourth.}}. Personal email addresses are blocked{{"Please enter a different email address. This form does not accept addresses from gmail.com."}}.', promise: '"Give us 30 minutes."' },
  { step: 'Trial page', sees: 'A full-access pitch and a seven-field form{{Required: first name, last name, company email, job title, main use case. Optional: how you heard about Aleph, questions or use cases. A company-size field appears for internal finance teams.}}.', promise: '"Start your free, full access trial today." "Up-and-running in minutes."' },
  { step: 'After submit', sees: 'One line of HubSpot text, then a scheduler for qualified leads{{Default routes and schedules after submit. In Jack\'s Sep 8 tests, qualified submits booked and others went through without a booking.}}. HubSpot sends no email{{HubSpot, Sep 18: no confirmation, nurture, trial or welcome email among 198 marketing emails, and no onboarding or nurture workflow among 378.}}.', promise: '"Someone will be in touch shortly." Same line for demo and trial.' },
  { step: 'Fitness test', sees: 'Six profile questions, then name, work email and job title before the first real question{{25 questions follow the gate. The gate submission goes to HubSpot, and its workflow tags the contact without sending anything.}}.', promise: 'Results "in 5 minutes," with insights "delivered to your inbox."' },
  { step: 'Contact', sees: 'Six required fields, including a LinkedIn URL, plus reCAPTCHA{{Name, email, contact reason, LinkedIn URL and "How can we help?" are all required. It\'s the only form that accepts gmail, and it isn\'t connected to Default.}}.', promise: '"One business day" on the page, "1-2 business days" after submit.' },
  { step: 'Sign in', sees: 'A stock Auth0 page with no way to sign up{{getaleph.us.auth0.com: Google, Microsoft or SSO, with a blue button the site doesn\'t use.}}.', promise: '' },
  { step: 'After the sale', sees: 'No first-run in the app and no onboarding email. A CSM does the teaching{{Daniel: "It\'s not self-serve. So onboarding is all done by our CX team."}}.', promise: '' },
]

// verdict: 'yes' confirmed, 'part' partly, 'no' didn't hold up
export const FLOW_FLAGS = [
  { expected: 'The brand stops at the form', verdict: 'yes', evidence: 'Seven visual systems before anyone submits{{The site, HubSpot\'s banner and pop-up, the demo page shell, HubSpot forms, the Agentic Budgeting demo page, the fitness test app (Replit) and the Auth0 login.}}, and HubSpot sends no email after a demo or trial request.' },
  { expected: "The trial promises something we don't offer", verdict: 'yes', evidence: 'HubSpot logs a trial request as a demo request and routes it to a meeting{{A trial submission sets the "Demo Request Submission Date," runs the same workflows as a demo, and a booked meeting creates a sales deal.}}. Nothing creates an account.' },
  { expected: 'The story drifts between steps', verdict: 'part', evidence: 'The headline changes at every step{{Homepage: "AI-native FP&A." Banner: "Run budgeting with agents." Demo page: "the full upside of AI in FP&A." Trial page title: "strategic FP&A platform."}} and the demo has six names. After submit there\'s almost nothing left to drift.' },
  { expected: 'An algorithm is picking our headlines', verdict: 'no', evidence: 'Intellimize is installed and served no variants in 24 test visits{{Fresh browsers on the homepage, demo and trial pages, including 4 visits with paid-social tags, Sep 11.}}.' },
  { expected: 'Too many visual systems', verdict: 'yes', evidence: 'The site, the HubSpot banner and pop-up, the demo page shell, HubSpot forms, the Agentic Budgeting demo, the fitness test app and the Auth0 login.' },
  { expected: "It's fast", verdict: 'part', evidence: 'The form is short and qualified leads book on the spot, but most people leave before starting it{{79% of people who see the demo form never interact with it (HubSpot, Aug 20 to Sep 18).}}.' },
  { expected: "It's measured", verdict: 'yes', evidence: 'HubSpot, Default, Dub and Intellimize are all live, so a baseline exists (below).' },
  { expected: "There's a way in that isn't a sales call", verdict: 'no', evidence: 'The fitness test asks for contact details first, and the trial routes to a meeting.' },
]

export const FLOW_BASELINE = [
  { form: 'Demo (demo page and Agentic Budgeting demo)', views: '723', subs: '112', rate: '15.5%' },
  { form: 'Trial', views: '325', subs: '55', rate: '16.9%' },
  { form: 'Contact', views: '151', subs: '23', rate: '15.2%' },
]
export const FLOW_BASELINE_NOTE = 'Last 30 days (Aug 20 to Sep 18), from HubSpot form analytics. 79% of people who see the demo form never start it{{707 people saw the demo form, 149 interacted with it, and 112 submitted.}}, which makes me think the drop happens on the page, before anyone types.'

export const FLOW_PROPOSAL_LEDE = 'What if we treated the path from click to first call as one surface, with an owner and a number?'

export const FLOW_PROPOSAL = [
  { move: 'Keep every promise', means: 'Decide the trial: make it self-serve, or call it what it is. Then one name for the demo, one meeting length and one reply time everywhere.', who: 'Leadership (the trial), Jack and brand (the copy)', when: 'Now, no rebrand needed' },
  { move: 'Carry the brand past the form', means: "Rebuild the demo, trial and contact pages on the Agentic Budgeting demo page's pattern, and bring the scheduler and sign-in into the new identity.", who: 'Brand, Jack, product', when: 'With the rebrand' },
  { move: 'Fill the silence', means: "A confirmation email and a short pre-call sequence (what to expect, who you'll meet, one customer story), then an onboarding drip for new customers.", who: 'Brand, Jack, CX', when: 'Pre-call emails now, onboarding with the rebrand' },
  { move: 'Give value before the ask', means: 'Try showing fitness test results before asking for an email, and test changes to the demo page itself, since most people leave before typing.', who: 'Brand, Miles', when: 'Test in Q4' },
  { move: 'Measure it', means: 'Hold the Aug 20 to Sep 18 baseline, and look at demo conversion, form starts, show rate and trial activation at launch and 30, 60 and 90 days after.', who: 'Miles, Jack', when: 'Baseline set, reviews start at launch' },
]

export const FLOW_CLOSING = 'A lot of this seems to hinge on one question: is a self-serve trial ever on the roadmap?'
