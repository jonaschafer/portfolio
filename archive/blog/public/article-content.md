## The problem

Picture this: It's Monday morning. The Brand team gathers for our weekly review. Our Asana board is full of tasks showing "due today" even though they were submitted just a few days before. Someone just DM'd asking if we can "quickly" make a graphic for a presentation happening in two hours. 

We were drowning in process debt. Requesters had to manually create both an Asana task and duplicate a Google Doc template, leading to confusion about where information lived. We had no visibility into our actual workload, so requests came in with timelines like "I need this Friday" when we were already booked for three weeks. Brief quality was inconsistent—some were excellent, others were missing critical information like specific deliverables or realistic due dates.

**We were positioned as a reactive service provider when we needed to be a strategic creative partner.** I'm a designer, not an engineer. But I knew we needed real software to solve this—not another spreadsheet or Notion doc. So we decided to build it ourselves.

## Discovery: Uncovering 25 problems

Before touching any code, I spent two weeks consolidating documentation that was scattered across Dropbox folders, Slack conversations, and team discussions. I interviewed Claire, our producer, and Daniel, our Head of Creative. I reviewed months of project briefs—good ones, bad ones, and everything in between.

What emerged was sobering: **25 distinct problems across 8 major categories.**

<div style="width: 1080px; max-width: 90vw; margin-left: calc((650px - 1080px) / 2); height: 500px; background: #2a2d35; border-radius: 8px; margin-top: 48px; margin-bottom: 48px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">25 Problems Diagram Placeholder</div>

Some examples crystallized the problem. One brief titled "Creator Challenges: Thanksgiving/Gratitude Reminder Email" had no specific deliverables listed, a due date of "this week" submitted on a Wednesday, and one sentence of context. It took five design rounds and still missed the mark. Compare that to the BETT UK 2026 Campaign brief, which had clear deliverables (landing page, two emails, three social posts with formats specified), a three-week timeline with specific milestones, and detailed audience psychographics. That one took two design rounds and launched on time.

The difference? The good brief had everything the team needed to execute. The bad one didn't. And this wasn't an isolated case—it was the pattern.

## The strategic approach: Not just a form

Most teams would have hired engineers. We decided to see what one designer with AI could do. But this required thinking differently. I wasn't building a form—I was designing a system to solve 25 interconnected problems. The intake form was just the interface.

I mapped each feature to specific problems it would solve. A unified intake flow would eliminate dual submission confusion and catch requests trying to bypass the process. Real-time validation would guide requesters through creating quality briefs with helpful suggestions as they typed. Workload visibility would pull live Asana data showing our current capacity. A workback schedule generator would show how timeline affects process quality—two weeks gets you one design round, three weeks gets you two rounds and better results.

We also needed smart routing. Copy reviews are often ad-hoc, not tied to full briefs, and need quick turnaround. They shouldn't go through an eight-step form designed for full creative projects. So we built a separate three-question quick path that automatically routes to Richard with his Monday and Friday review schedule noted.

Every submission would get automatic boundary setting: "Thanks for your request! Our standard turnaround is 2 weeks minimum given team capacity. We'll review on Monday and confirm timeline." This wasn't about saying no—it was about setting realistic expectations from day one.

## The build: What it actually takes

Here's where I need to be honest: building this wasn't easy, but it also wasn't as hard as you might think. I used Cursor AI to help translate design requirements into working code. But let me be clear about what that means.

**I didn't write the code myself. I described what needed to happen, and Cursor helped me build it.** But the critical elements were human: understanding which problems actually mattered, designing the experience that would guide requesters effectively, making trade-offs between competing requirements, and interpreting beta feedback to prioritize fixes.

I created two key documents that became the foundation. The first was a reference manual explaining what the system was, its capabilities, and technical standards. The second was a dynamic project journal documenting what we built, why we built it, and what worked or didn't work. This became critical because Cursor was only as good as the context I provided.

We took an iterative approach. The first two weeks focused on a basic form that creates Asana tasks. Then we added Google Doc generation. Then real-time validation. Then workback schedules. Then Figma automation. Then smart routing for copy reviews. Each addition was tested with real team members before we moved forward.

Not every API did what we needed. Not every integration was straightforward. Beta testing revealed edge cases we never anticipated. But the key was staying focused on the problems we were solving, not getting stuck on technical implementation details. When one approach didn't work, we pivoted. When APIs had limitations, we found workarounds.

> I didn't write the code myself. I described what needed to happen, and Cursor helped me build it. But the human judgment—understanding the problems, designing the experience, making trade-offs—that was all critical.

## The solutions we built

The final system is an eight-step intake flow. Requesters start with project basics—name, team, project type. Then they work through the core brief with real-time validation catching vague answers and providing helpful suggestions. They add strategic context, specify deliverables with quantities and formats, and set a timeline with our two-week minimum enforced by the date picker.

The DACI section identifies the final decision maker and review stakeholders, solving one of our biggest pain points where projects would get derailed by surprise approvers appearing in round five. The audience and success section ensures requesters think through who they're targeting and how success will be measured. Finally, they review everything before submitting.

When someone hits submit, a lot happens in 60 to 70 seconds. The system creates an Asana task with all fields populated, generates a formatted Google Doc brief with their answers, duplicates the Figma template file, sends a Slack notification to our creative requests channel with proper @mentions, and adds appropriate collaborators to the task. Progressive status messages keep requesters informed: "Creating Figma file... Creating Asana task... Creating brief in Google Docs..." Small detail, huge UX improvement.

<div style="width: 1080px; max-width: 90vw; margin-left: calc((650px - 1080px) / 2); height: 400px; background: #2a2d35; border-radius: 8px; margin-top: 48px; margin-bottom: 48px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">Architecture Flow Diagram Placeholder</div>

The copy review path is deliberately simpler. Three questions: link to the copy, context about what it's for, and timeline with automatic Monday and Friday review schedule alignment. The system detects copy-related requests and automatically @mentions Richard and Claire in Slack, adds them as Asana collaborators, and includes a prominent reminder that Richard must review all copy before it goes out.

Real-time validation was crucial. As requesters type their high-level ask, if it's too short, they see: "Aim for 3-4 sentences. Include: what you need, who it's for, why it matters." If deliverables are unclear: "Be specific: How many emails? What formats? Example: 'Email header graphic 600x200px, quantity 2'" If the timeline is unrealistic, the date picker enforces our two-week minimum and suggests the earliest available date.

## The results: Transformation in action

We shipped a production system deployed internally with all four API integrations working. Beta testing with the marketing team revealed real issues we quickly fixed. The first beta tester, Andrew, found that Claire was being added as a collaborator on all tasks when it should only be copy-related ones. We fixed that same day by adding detection logic for copy work. Context fields were marked as required when they should be optional—fixed. The Google Doc URL was showing placeholder text in Asana—fixed. Each issue revealed in testing made the system better.

The transformation was measurable. Submission time dropped from 5 to 10 minutes of manual work down to 60 to 70 seconds automated. Brief quality improved from roughly 40% good to 80% good thanks to real-time validation catching issues before submission. Timeline expectations shifted from unrealistic requests to 100% compliance with our two-week minimum. Workload became transparent with real-time Asana data shown upfront.

| Metric | Before | After |
|--------|--------|-------|
| Submission time | 5-10 minutes | 60-70 seconds |
| Brief quality | 40% good | 80% good |
| Timeline expectations | Unrealistic | 2-week minimum enforced |
| Workload visibility | None | Real-time data |

We solved 18 out of 25 identified problems. Eight are fully solved, like dual submission confusion and poor brief quality. Ten are partially solved, like conversation fragmentation and capacity management. Seven are in our Phase 2 roadmap, including enhanced analytics and performance tracking.

## Key lessons for design teams

You don't need to be an engineer, but you do need to think systematically. The hardest part wasn't the code—it was identifying all 25 problems, understanding their interconnections, designing a solution that addressed root causes, and making trade-offs between ideal and practical. These are design skills. Technical implementation is a detail.

Clear problem definition matters more than technical knowledge. I spent two weeks just documenting problems before writing a single line of code. That upfront work meant every feature mapped to specific problems, we could prioritize ruthlessly, beta testers could evaluate if solutions actually worked, and the system had clear success metrics. If you can't explain what problem you're solving, no amount of code will help.

Start with MVP and iterate based on real usage. We didn't build all eight steps on day one. We started with a basic form that creates Asana tasks, then added Google Doc creation, then validation, then workback schedules, then Figma automation, then smart routing. Each addition was tested on proven foundation.

The human element remains essential. AI helped me build faster, but it couldn't identify which problems actually mattered, design the UX that would guide requesters effectively, make trade-offs between competing requirements, or interpret beta feedback and prioritize fixes. The designer's judgment is still the critical piece. AI is a capability multiplier, not a replacement.

## The bigger picture

This project taught me that process design is product design. Designing how a team works requires the same approach as designing products: understand user needs, map workflows and pain points, design solutions that guide toward success, iterate based on real usage, and measure impact. The canvas is different, but the principles are identical.

The intake system solved 25 problems we'd been living with for years. But the real unlock was realizing designers can build the solutions we need. We don't have to wait for engineering bandwidth or settle for spreadsheets. With the right AI tools, we can ship real software that transforms how our teams work.

Requesters now submit better briefs. Our team reviews them efficiently on Monday mornings. Timelines are realistic. Boundaries are set from day one. Conversations are consolidated in the right places. We can focus on strategic creative work instead of process chaos. That transformation is worth celebrating.

---

Interested in joining a team that empowers designers to build real solutions? [Explore careers at ClassDojo →](https://www.classdojo.com/careers)
