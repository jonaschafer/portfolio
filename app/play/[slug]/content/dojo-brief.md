The intake form in [Brand Studio](/play/brand-studio) asks good questions, and it's long because of that. Meanwhile, most of the answers already exist. They're sitting in a Slack thread where someone said the deadline, someone else named the audience, and legal dropped a requirement in a reply nobody pinned.

Dojo brief is a Claude skill that reads that thread for you. Run `/dojo-brief`, paste whatever you have (Slack, doc snippets, notes, a spec), and it sorts it into the same sections as the form.

## How it reads a thread

The skill has a short set of inference rules. "Urgent" or "blocking" means P0, "coming up" means P1. Anything with "must," "can't" or a legal mention becomes a requirement. "Promote to families" probably means email or social, "on the dashboard" means in-app. Pain points come from lines like "teachers keep asking."

The core message gets the most care. The skill strips features and keeps the one benefit someone should remember, because that's the field people skip most often and the one design leans on hardest.

Where the thread is missing something, it leaves a TODO rather than inventing an answer. A made-up decision maker is worse than a blank one.

## Markdown first, then the form

You get a markdown brief first, to read and fix. Once it's right, the skill writes a JSON file that matches the form's fields exactly, down to the team names and priority values the form accepts.

![The import panel on the intake. Paste the JSON, and every field fills in.](/play/builds/dojo-brief/import.jpg)

That file goes into an import page on the intake that I left unlinked on purpose. Paste it and the whole form fills in. It still runs every check the form runs, so a brief from Claude has to meet the same bar as one typed by hand. If a field fails, the error says which one and why in plain language, and scrolls you to it.

Most of the work was already done by the time I wrote the skill. The form had forced me to write down what a good brief looks like, and the skill reuses that word for word.
