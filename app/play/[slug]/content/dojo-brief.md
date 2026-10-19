The intake form in [Brand Studio](/play/brand-studio) asks good questions, which is also why it's long. Most of the answers already exist somewhere, usually in a Slack thread where someone mentioned the deadline, someone else named the audience, and the real requirement is buried in a reply.

So I made a Claude skill that reads the thread for you. Run `/dojo-brief`, paste in whatever you've got (Slack, doc snippets, notes, a spec) and it sorts everything into the same sections as the form.

The example up top is a real one, with the names changed. A product team was white-labeling a partner's AI math tutor and wanted to know whose look to use. Six messages in, the brief was mostly there, it just wasn't written down anywhere.

## How it reads a thread

It runs on a short set of rules. "Urgent" or "blocking" means P0 and "coming up" means P1. Anything with "must," "can't" or a legal mention becomes a requirement. "Promote to families" probably means email or social, and "on the dashboard" means in-app.

The core message gets the most care. That's the field people skip most and the one design leans on hardest, so the skill drops the features and keeps the one benefit someone should walk away with.

When the thread is missing something, it leaves a TODO. A made-up decision maker is worse than a blank one. In the example, nobody ever said when it launches or who signs off, so those come back flagged.

## Markdown first, then the form

You get a markdown brief first, to read and fix. Once it's right, the skill writes a JSON file that matches the form field for field, down to the exact team names and priority values the form expects.

![The import panel on the intake. Paste the JSON and every field fills in.](/play/builds/dojo-brief/import.jpg)

That goes into an import page on the intake that I left unlinked on purpose. Paste it and the whole form fills in, and it still runs every check the form runs, so a Claude brief has to clear the same bar as a hand-typed one. If something fails, the error says which field and why in plain English and scrolls you to it.

Most of the work was done before I wrote the skill. The form had already made me write down what a good brief looks like, and the skill reuses that word for word.
