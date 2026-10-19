When I got to ClassDojo, a creative request meant two things: an Asana task and a separate brief doc, filed wherever the requester remembered to file them. Half the time we got one, the other half we got a Slack DM. Briefs came in thin, timelines came in yesterday, and feedback ran five rounds because nobody agreed on the goal up front.

So before I wrote any code I wrote the problems down. There were 25 of them across eight buckets, from intake to approvals to how we said no. Brand Studio is what came out of that list. I built it with Claude Code starting in January 2026, and it's been the team's front door since the end of that month.

## The intake coaches the brief

The form asks the questions a good kickoff would. What do you need, who is it for, what's the one thing people should remember, who makes the final call. As you type, it checks your answers and tells you what's missing.

![Typing a vague ask into the intake. The form flags what's missing as you go.](/play/builds/brand-studio/intake.mp4)

The checks are plain rules, no model involved. Vague words get flagged. So does telling us how instead of what ("make it bigger," "use blue"). Jargon gets a nudge to write it for someone outside the team. Each field has a minimum length and a live count. Nothing blocks you from submitting, because I wanted people to learn the shape of a good brief rather than fight a validator.

There's one hard rule. Design handoff has to be at least two weeks after the Monday kickoff, and the form won't take an earlier date. That single line ended most of our "can we have it Friday" threads.

When you hit submit, it creates the Asana task, writes the brief into a Google Doc from our template, links the Figma template, and posts to our requests channel with the right people tagged. One submission, everything in its place.

## The gallery

The second piece I'm proud of is the gallery: everything the team has shipped across the Dojo brands, filterable by brand and type. I add a piece by pasting a Figma link. The app pulls the frame through the Figma API, turns it into a WebP and files it.

Every card has a Customize button that opens the intake with the brand and type already filled in. A lot of requests start as "something like that one," so now they literally can.

## Where it runs

It started on Vercel. A week in, engineering helped me move it onto ClassDojo's internal infrastructure behind the VPN, deployed the same way as every other internal app. It's grown since then into guidelines, QR codes, email templates and one-pagers, more than 350 commits so far.
