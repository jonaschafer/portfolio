# From chaos to strategy: how we built software to reposition our creative team

Picture this: it's Monday morning. The Brand team gathers for our weekly review. Our Asana board is full of tasks showing "due today" even though they were submitted just a few days before. Someone just DM'd asking if we can "quickly" make a graphic for a presentation happening in two hours.

We were drowning in bad requests. Bad requests are a symptom of being seen as a service department instead of strategic partners.

**[IMAGE 1: Screenshot of chaotic Asana board with overlapping due dates and vague task names. Caption: "What Monday mornings used to look like"]**

## The real problem

Brief quality was wildly inconsistent. One request titled "Creator Challenges: Thanksgiving/Gratitude Reminder Email" had no specific deliverables, a due date of "this week" submitted on a Wednesday, and one sentence of context. It took five design rounds and still missed the mark.

Compare that to the BETT UK 2026 Campaign brief: clear deliverables (landing page, two emails, three social posts with formats specified), a three-week timeline with specific milestones, and detailed audience psychographics. That one took two design rounds and launched on time.

The difference was the brief. Better Slack reminders or another process doc buried in Notion wouldn't solve this. We needed organizational infrastructure that would shift how the team was positioned. So we decided to build it.

## The bet

I'm a designer. I used Cursor AI to help me build what our team needed without waiting for engineering bandwidth. Staying stuck as order-takers indefinitely felt worse than learning to build software myself.

I spent two weeks consolidating scattered documentation across Dropbox folders, Slack conversations, and months of project briefs. I interviewed our producer Claire and Daniel, our Head of Creative. What emerged was sobering: 25 distinct problems across submission process, brief quality, timeline expectations, workload visibility, feedback quality, and organizational positioning.

The challenging part was understanding which problems actually mattered and how they connected.

**[IMAGE 2: Simple diagram showing problem categories as connected nodes: "Submission Chaos" → "Bad Briefs" → "Unrealistic Timelines" → "Team Positioned as Order-Takers"]**

## What we built: the intake form

An eight-step flow that creates everything a project needs: Asana task, Google Doc brief, Figma template file, and Slack notification. All in 60 seconds.

The real innovation was real-time validation. As requesters type, the system guides them:

- High-level ask too short? "Aim for 3-4 sentences. Include: what you need, who it's for, why it matters."
- Vague deliverables? "Be specific: How many emails? What formats? Example: 'Email header graphic 600x200px, quantity 2'"
- Unrealistic timeline? The date picker enforces our two-week minimum and suggests the earliest available date.

**[IMAGE 3: Screenshot of the intake form showing real-time validation in action, specifically the deliverables field with helpful suggestion appearing]**

The DACI section solves one of our biggest pain points: surprise approvers appearing in round five. Now requesters identify the final decision maker and all review stakeholders upfront.

We also built a separate three-question copy review path. Copy reviews are often ad-hoc and need quick turnaround. They shouldn't go through an eight-step form designed for full creative projects. This path automatically routes to our copywriter Richard and shows his Monday/Friday review schedule.

When someone hits submit, progressive status messages keep them informed: "Creating Figma file... Creating Asana task... Creating brief in Google Docs..." Small detail, huge UX improvement.

## The strategic play: making constraints visible

The intake form solved submission chaos. The "How We Work" page addressed something equally important: making our constraints visible without positioning ourselves as gatekeepers.

The page shows live capacity pulled from Asana. When someone asks "can you squeeze this in?", we point to the page instead of defending our workload.

**[IMAGE 4: Screenshot of the capacity section showing real-time project cards with color-coded sizing (XS/S/M/L/XL) and capacity status]**

It includes a workback schedule calculator that shows trade-offs: 2 weeks gets you one design round, 3 weeks gets you two rounds and better work. The calculator makes this mathematical reality tangible instead of arbitrary.

**[IMAGE 5: Interactive workback schedule slider showing how timeline affects process quality]**

The page also teaches effective feedback with real examples:

**Good feedback:**
- "This feels too playful for district administrators. Can we explore a more professional direction?"
- "The CTA isn't prominent enough for our conversion goals. Can we test larger sizing?"

**Unhelpful feedback:**
- "I don't like the colors"
- "Can we make it pop more?"

**[IMAGE 6: Side-by-side comparison of good vs unhelpful feedback examples from the page]**

The page does something subtle: it positions the Brand team as strategic partners who deserve thoughtful requests rather than order-takers who should accommodate everything.

## The unglamorous middle

Not every API did what we needed. Beta testing revealed edge cases we never anticipated. The first beta tester, Andrew, found that our producer was being added as a collaborator on all tasks when it should only happen for copy-related ones. We fixed that same day by adding detection logic.

Context fields were marked as required when they should be optional. The Google Doc URL was showing placeholder text in Asana. Each issue that beta testers found made the system better.

We had to give up features I wanted: enhanced analytics, performance tracking, integration with our email tool. Shipping something that solved the core problems felt more valuable than building everything.

The moment I knew it was working? A requester submitted a brief, got the automated "2-week minimum" response, and replied: "You're right, we should have started earlier. What if we push launch by a week?" That had never happened before.

## What changed

Submission time dropped from 5 to 10 minutes of manual work to 60 seconds automated. Brief quality improved because the system guides requesters to success.

Timeline expectations shifted. We now have 100% compliance with our two-week minimum because the date picker enforces it. No more "I need this Friday" requests submitted on Wednesday.

Workload became transparent. Stakeholders can see exactly how full we are before asking us to add something.

Most importantly: requesters now think through their ask before hitting send. We have evidence for every boundary we set. The Brand Studio team gets to do brand work instead of managing process chaos.

**[IMAGE 7: Before/after comparison table showing key metrics:
- Submission time: 5-10 min → 60 sec
- Timeline compliance: Variable → 100% (2-week minimum)
- Workload visibility: None → Real-time
- Team positioning: Order-takers → Strategic partners]**

## What this taught us

Process design is product design. Designing how a team works requires the same approach as designing products: understand user needs, map workflows and pain points, design solutions that guide toward success, iterate based on real usage, measure impact.

The hardest part was understanding which problems actually mattered, how they connected, and what solutions would shift organizational dynamics rather than just add efficiency. AI was critical. Cursor helped me build faster than I could alone. But it couldn't identify which problems to solve, design the experience that guides requesters effectively, make trade-offs between competing requirements, or interpret beta feedback. The designer's judgment remains essential.

If your creative team is stuck being order-takers, tools alone won't fix it. But the right infrastructure can shift organizational dynamics. The question is whether you understand the problems well enough to know what to build.

We solved this with one designer and AI. You can too.

---

**[FINAL IMAGE 8: Clean screenshot of the current intake form homepage or the How We Work page showing the polished final state]**

---

*Interested in joining a team that empowers designers to build real solutions? [Explore careers at ClassDojo →](https://www.classdojo.com/careers)*

---

## Image specifications

**IMAGE 1:** Actual Asana board screenshot (anonymize project names if needed). Show density and chaos with overlapping dates and vague titles.

**IMAGE 2:** Simple node diagram. Clean, minimal. Could be illustrated or just text boxes with arrows. Focus on showing connection, not complexity.

**IMAGE 3:** Intake form screenshot. Capture moment when validation appears, maybe red outline around field plus helpful suggestion text. Should feel "in progress."

**IMAGE 4:** Capacity section showing 6 to 8 project cards in grid view. Color code by size (green=XS, yellow=S, orange=M, red=L/XL). Include capacity status indicator.

**IMAGE 5:** Workback schedule slider. Show at 2-week position with "1 design round" visible, hint at what changes at 3 plus weeks.

**IMAGE 6:** Two-column layout. Left = good feedback examples, Right = unhelpful examples. Keep text large enough to read.

**IMAGE 7:** Simple comparison table or before/after cards. Focus on 3 to 4 key metrics maximum. Visual over numbers.

**IMAGE 8:** Hero shot of either intake form start page or How We Work page header. Should feel polished and inviting.

**Design notes:** Match Figma blog aesthetic if possible with blue backgrounds, white text, clean typography. Keep screenshots functional, not decorative. Every image should teach something specific.

**Read time:** approximately 5 minutes
