When I started at ClassDojo, asking brand for something meant filing an Asana task *and* writing a separate brief doc, and most people did one or the other (or just DM'd someone). Briefs showed up thin, deadlines showed up yesterday, and feedback could go five rounds because nobody had agreed on the goal up front.

Before writing any code I wrote down everything that was broken. It came to 25 problems across eight buckets, from intake to approvals to how we say no. Brand Studio is what came out of that list. I started building it with Claude Code in January 2026, and by the end of that month it was the team's front door.

## The intake coaches the brief

The form asks what a good kickoff would ask: what you need, who it's for, the one thing people should remember, and who makes the final call. As you type, it tells you what's missing.

![Typing a vague ask into the intake. It flags what's missing as you go.](/play/builds/brand-studio/intake.mp4)

No AI in there, just rules. It flags vague words, it flags telling us how instead of what ("make it bigger," "use blue"), and it nudges jargon toward plain English. Every field has a minimum length and a live count. None of it blocks you from submitting, because I wanted people to learn what a good brief looks like instead of fighting a validator. Andrew, our first beta tester, filed the first real request, and his notes turned into eight fixes that same week.

The one hard rule is timing. Design handoff has to be at least two weeks after the Monday kickoff, and the form won't take an earlier date. That one line killed most of our "can we have it Friday?" threads.

Hit submit and it makes the Asana task, writes the brief into a Google Doc from our template, links the Figma template and posts in the requests channel with the right people tagged (Claire gets looped in when there's copy). One submission and everything's where it should be.

## The gallery

My favorite piece is the gallery, everything the team's shipped across the Dojo brands, filterable by brand and type. Adding something is pasting a Figma link. The app grabs the frame through the Figma API, turns it into a WebP and files it.

Every card has a Customize button that opens the intake with the brand and type already filled in, since so many requests start as "something like that one" anyway.

## Where it lives

It started on Vercel. About a week in, Werle helped me move it onto ClassDojo's internal infrastructure behind the VPN, deployed like any other internal app. Since then it's picked up guidelines, QR codes, email templates and one-pagers, and it's past 350 commits.
