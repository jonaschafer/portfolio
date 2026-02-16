# From chaos to clarity: how we built organizational infrastructure to reposition our creative team

## Setting the stage

ClassDojo is an edtech platform serving 50 million students, parents, and teachers worldwide, with a product reach of 1 in every 6 schools in the US and over 90% usage in the UK (among other countries). There are 5 core brands—ClassDojo, Dojo Sparks, Dojo Islands, Dojo Tutor, and ClassDojo Plus—all targeting K-12 students and school administrators. Yet despite that scale, the company is only ~150 people.  And our team, Brand Studio, is even smaller: a design systems lead, an illustrator, a part-time copywriter, a producer, a social lead, a creative director (me), and a head of creative who oversees both brand and product design.

Like most brand teams, Marketing is our biggest requestor. They have metrics to hit and campaigns to launch, and they need design help—lots of it. But for our team, the problem wasn't the volume. It was how we were seen and therefore treated. In short: we were a service provider when we should have been a strategic partner.

That had to do with a lot of sticky, tangled problems. Take new requests: all projects started with the requestor in control. Timelines and design rounds were already defined by the marketer, the approver was often unclear, key context was missing, and requestors had different understandings of what's possible—some briefs were verbose and helpful, others impossibly vague. Nearly every project began as a project in itself: we'd read the brief, chase down missing details, clarify who actually had approval, and push back on timelines that skipped thinking and iteration. Before we designed anything, we were negotiating the right to do the work well.

Then there were the DMs. "Can you just make this quickly?" Those small interruptions seemed simple enough, and it felt like overkill to have them submit a full request. But they added up. We'd pause in-flight work to handle something "urgent" that hadn't been vetted, often discovering it wasn't actually urgent—or that it needed the full brief process they tried to skip.

Over time, that dynamic shapes perception. We weren't brought in early to help define problems or set the bar for quality. We were reacting.

Then the company did something unusual. Leadership hit pause across all teams and gave everyone a mandate: spend time exploring how AI could transform your role, not just make incremental improvements. I decided to address our problems at scale.

## Mise en place

When I onboarded at ClassDojo, I interviewed my team as well as our most frequent requestors—marketing leads, product managers, and leadership—to understand what was working, what wasn't, and what ideas they had. Over a few weeks, I compiled everything into a comprehensive folders of docs. Then it collected dust somewhere while we fought the daily fires.

But with the company-wide pause, I unearthed these docs as the necessary foundation to build upon. That research paid off. With Cursor as my partner and a new Github repo for built-in versioning, I quickly articulated **over 25 problems across 8 major categories.**

**[IMAGE 2: Diagram showing 8 problem categories as interconnected nodes. Each category connects to "Team Positioned as Order-Takers" at the center. Categories: Intake Process, Communication, Approval Dysfunction, Invisible Constraints, Capacity & Boundaries, Knowledge & Visibility, Process & Workflow, Tool Underutilization]**

## Problems, we got 'em

The problem wasn't that we had one problem. We had many, and those problems reinforced themselves. It was a tangled web of old systems met with quick fixes and an overburdened team with little time. Here were some of our problems:

**Dual systems and invisible workload:** Requesters were creating both an Asana task and duplicating a Google Doc template, so information lived in two places. They had no visibility into our current workload or any way to understand how timeline affects process quality, so they just picked dates based on their launch needs—like requesting a full website redesign one week before it ships.

**Fragmented communication:** Communication happened across Slack, meetings, Figma comments, and Google Docs with no centralization. New project requests routed to our private team channel, meaning requestors would send us DMs that they submitted something (we knew). People requested work through DMs, completely bypassing any formal process, which felt like death by a thousand paper cuts. 

**Unclear approvals and scope creep:** Decision making on the requester side was murky at best. Surprise approvers appeared after the work had shipped, with requestors telling us how the creative process should go. Everyone seemed to be an approver, which meant no one was actually accountable. Scope creep happened silently with no mechanism to track or police changes. And things that were due "ASAP" were able to blow past deadlines in favor of more revisions. 

**Reactive positioning:** Since so much of the creative process was told to us, we had little time to do proactive work, such as creating templates that would ease repeatitive requests. 

In short: we needed organizational infrastructure.

## The unglamorous middle

With the problems mapped, I started building. 

Back to Cursor: after I outlined all of the problems, I got to building a sort of checklist and attacking the solution holistically. Heck, I even created a percentage of completion as I progressed ("72% solved"). But the process was far from staright forward. Our so-called team tech stack included Asana, Google docs, Figma, and Slack. Using their APIs both worked effortlessly and required a ton of workarounds. 

Take Figma, for example. Their API documentation confidently states you can duplicate files programmatically. Great! Except when you actually try to do it, you discover the duplicated file loses all component connections, text styles vanish, and layer names get mangled. After three days of troubleshooting, I had to build a workaround that copied the file, then made a second API call to restore the component library links, then a third to fix the naming structure. 

Then there was the cross-pollination problem. The intake form creates an Asana task first, which returns a task ID. That ID needs to go into the Google Doc brief so people can click back to Asana. But the Google Doc also generates a URL that needs to go back into the Asana task description. Chicken, meet egg. The solution involved creating the Asana task with placeholder text, generating the Google Doc with the real task ID, then making a second Asana API call to update the task with the real doc URL. Three API calls in sequence, any of which could fail and break the whole chain.

And sometimes it failed. Asana would timeout. Google Docs would return a 500 error for no apparent reason. Figma would rate-limit me during testing. I built error logging and analytics tracking not just to debug when things broke, but to understand usage patterns—who visits the site most, who submits the most requests, which steps people abandon. Win win. 

I went into this thinking that AI could be plug and play like a Zapier workflow, just click things together in an afternoon. But what I was creating was a few apps short of actual software with complicated edge cases, and failure modes and debugging. 

## The solutions

The vision was to create two interconnected pieces: an intake system that would guide requesters toward better briefs and set boundaries automatically, and a transparency layer that would make our constraints visible to everyone. Together, they would shift how the Brand Studio team was positioned in the organization.

### The intake form

I built a six-step flow that creates everything a project needs in 60 seconds: their responses captured in a new Google template, an associated Asana task with a link to the brief, Figma template duplicated, and all of this sent to Slack in a public channel where requestors talk. No more lost comments buried in Asana or Google Docs—a central place to discuss work. What's more, requestors can see other work being submitted in that Slack channel, reinforcing our capacity (or lack thereof).

**The team controls the timeline:** The new intake process defaults to 2 weeks out from the day of submission. No more requestors telling us when they think it should be done. Our team tells them when we can deliver it. (Of course, if someone has a pressing need we can slot that in by deprioritizing other work, but that should be the exception, not the rule).

**Real-time guidance:** As requesters type, the system guides them toward better briefs through real-time validation. If the high-level ask is too short, they see "Aim for 3-4 sentences. Include: what you need, who it's for, why it matters." Vague deliverables trigger "Be specific: How many emails? What formats? Example: 'Email header graphic 600x200px, quantity 2'"

**[IMAGE 3: Screenshot of the intake form showing real-time validation in action, specifically the deliverables field with helpful suggestion appearing]**

**No more surprise approvers:** Requesters now have to identify the final decision maker and all review stakeholders upfront, before the work even begins. That DACI section catches the invisible approver who, in the past, had "a few small changes" at the last minute. No more! 

**Streamlined copy reviews:** I also built a separate three-question copy review path for quick-turnaround copy feedback. These requests bypass the six-step form entirely and route directly to our copywriter Richard with his Monday/Friday review schedule displayed. It also surfaced our internal GPT for copy help, which was either unknown or buried in Slack channels. 

**Everything created automatically:** When someone hits submit, progressive status messages keep them informed: "Creating Figma file... Creating Asana task... Creating brief in Google Docs..." Everything gets created in the right place, linked together, with the right people notified.

**[IMAGE 3.5: Screenshot showing the submission success state with all the automated outputs: Asana task created, Google Doc brief generated, Figma file duplicated, and Slack notification sent]**

### The "how we work" page

While the intake form solved submission chaos, the "How We Work" page made our constraints impossible to ignore.

**Real-time capacity visualization:** The page shows our live capacity pulled directly from Asana. When someone asks "can you squeeze this in?", we simply point to the page and ask "what should we deprioritize?" No saved text snippets. No elaborate system to copy/paste our workload. No need to defend what we're working on. In fact, no room for someone to say "well, Mark is only working on 4 projects, can't he do 5?" Sizing was the biggest unlock: projects are color-coded by size (XS/S/M/L/XL) and explicitly show trade-offs at each capacity level: quality, turnaround time, and team health.

**[IMAGE 4: Screenshot of the capacity section showing real-time project cards with color-coded sizing and capacity status (Optimal: 6 projects, Stretched: 7-8, Overloaded: 9+)]**

**Workback schedule calculator:** Two weeks gets you one design round. That's it. Three weeks gets you two rounds and better work. The slider shows exactly how timeline affects process quality, transforming what used to be subjective negotiation into mathematical reality that anyone can understand. Having this visible gave our team authority to say when something would be done rather than enduring endless revision rounds.

**[IMAGE 5: Interactive workback schedule slider showing how timeline affects process quality, with copy review calendar showing Richard's Monday/Friday availability]**

**Teaching effective feedback:** The page includes real examples of good versus unhelpful feedback. "This feels too playful for district administrators" versus "I don't like the colors." Problem-based and goal-aligned versus vague and subjective. Having this information centralized gives our team one link to share when we envivitably get feedback that isn't actionable. 

**[IMAGE 6: Side-by-side comparison of good vs unhelpful feedback examples]**

**Future home for brand assets:** This entire site also serves as the foundation for future brand assets—templates, guidelines, component libraries. It's not just an intake process, a tool for boundary-setting, a detailed view of ideal feedback; it's where the brand lives.

## All praise the beta tester

When we launched internally, the reception was immediate. The #creative-requests Slack channel that had been quiet for months suddenly came alive. Requests started flowing in with complete information. People were using the DACI section. The capacity page got bookmarked. It was working. Then the beta testers made it even better.

Andrew, our first beta tester and head of email, pointed out that many of the deliverables in the form were things he needed to know about too. So I updated the request to @ mention him and include him as a collaborator when a requestor added email as a deliverable. I did the same for any deliverables for web, social, illustration, and the like. Another tester caught that the form was using word count for validation, which meant a pasted Google Doc URL counted as "one word" and triggered the "your answer is too short" error. Switched to character count. Problem solved.

Beta testing wasn't just bug fixes. It was watching the infrastructure work in real conditions and learning where it needed to flex.

## What changed

In the end, we addressed 18 of our initial 25 problems. Here's what that gave us:

**Intake Process:** Fully solved dual submission confusion, poor brief quality, lack of visibility into workload, missing boundary setting, and information scattered across channels.

**Communication & Collaboration:** Fully solved wrong channel notifications and people bypassing the process. Partially solved conversation fragmentation and feedback quality through teaching examples.

**Approval & Quality Control:** Fully solved unclear decision making through the DACI section. Scope creep remains partially solved—we can track it better but still need better mechanisms to police mid-project changes.

**Knowledge & Visibility:** The "How We Work" page fully solved the lack of central source of truth. Understanding what "good" looks like is partially solved through feedback examples.

**Capacity & Boundaries:** All three are partially solved. We can say no more effectively with evidence. We have transparent capacity status. But reactive work still dominates because we need better forecasting tools.

**Strategic Positioning:** This was the biggest win. The infrastructure repositioned the team from service provider to strategic partner. We still don't have a tier system for work, but the positioning shift fundamentally changed how requesters approach us.

The moment I knew it was working? A requester submitted a brief, got the automated "2-week minimum" response, and replied: "You're right, we should have started earlier. What if we push launch by a week?" That had never happened before. The infrastructure gave them context to make better decisions rather than just pushing back on our constraints.

**[IMAGE 7: Visual showing 25 problems with 8 marked "fully solved" in green, 10 marked "partially solved" in yellow, and 7 marked "phase 2" in gray. Group by category.]**

## What I learned

Building infrastructure taught me that the hardest problems aren't technical—they're organizational. Understanding what would shift team positioning mattered more than debugging API calls. AI amplified my ability to build, but it couldn't identify which problems actually mattered or recognize when a feature would change power dynamics versus just add efficiency.

I also learned that shipping infrastructure that solves core problems beats building everything at once. We gave up features like enhanced analytics, performance tracking, and email tool integration to ship something that worked. And I relied on off-the-shelf frameworks like Tailwind to create something usable, if plain. Now that the foundation exists and proves the approach, we can add those features when they make sense.

What's left to accomplish? Better forecasting so reactive work stops dominating. A tier system that treats complex projects differently than quick-turn graphics. More sophisticated scope change tracking. And honestly, just letting this infrastructure settle in and seeing what new problems emerge now that the old ones are solved.

---

**[FINAL IMAGE 8: Clean screenshot of the "How We Work" page showing polished capacity visualization and workback calculator]**

---

*Interested in joining a team that empowers designers to build real solutions? [Explore careers at ClassDojo →](https://www.classdojo.com/careers)*

---

## Image specifications

**IMAGE 1:** Split-screen comparison. Left side shows attempted solutions (screenshots of framework docs, Asana color labels, unused templates). Right side shows reality (chaotic Asana board with overlapping dates, Slack DMs, surprise feedback comments). Should feel like "we tried everything, nothing worked."

**IMAGE 2:** Network diagram showing 8 problem categories as outer nodes all connecting to central node "Team Positioned as Order-Takers." Show the systemic nature of the problems. Keep it clean and minimal with simple connecting lines.

**IMAGE 3:** Intake form screenshot. Capture moment when validation appears—red outline around field plus helpful suggestion text. Should feel "in progress."

**IMAGE 3.5:** Submission success screen showing the automation results. Display all four outputs created: Asana task card, Google Doc preview, Figma file thumbnail, and Slack notification message. Should feel like a "ta-da" moment showing everything working together.

**IMAGE 4:** Capacity section showing 6 to 8 project cards in grid view. Color code by size (green=XS, yellow=S, orange=M, red=L/XL). Include capacity status indicator showing "Stretched: 7 projects."

**IMAGE 5:** Workback schedule slider. Show at 2-week position with "1 design round" visible, hint at what changes at 3+ weeks. Include copy review calendar showing Richard's Monday/Friday availability.

**IMAGE 6:** Two-column layout. Left = good feedback examples with green checkmarks, Right = unhelpful examples with red X marks. Keep text large enough to read. Show the contrast clearly.

**IMAGE 7:** Status grid showing all 25 problems organized by 8 categories. Use color coding: green (fully solved), yellow (partially solved), gray (phase 2). Could be a checklist-style layout or card-based grid. Make it scannable to show comprehensive impact.

**IMAGE 8:** Hero shot of "How We Work" page showing capacity visualization section with live project cards and workback calculator. Should feel polished, professional, and inviting—this is the crown jewel.

**Design notes:** Match Figma blog aesthetic if possible—blue backgrounds, white text, clean typography. Keep screenshots functional, not decorative. Every image should teach something specific.

**Read time:** approximately 7-8 minutes