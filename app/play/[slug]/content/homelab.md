We've got a Mac mini at home that was mostly a Plex server. I wanted it to do more, and I am not a Terminal guy. So the deal was I'd buy stuff and plug it in, and Claude Code would do the setup over SSH while I watched and asked a lot of questions.

## A private model on my phone

This one started with my jaw surgery. I had recovery notes and post-op paperwork I wanted to ask questions about, and I didn't want any of it leaving the house. That's the one job where a local model beats everything else, since the text stays put.

The setup is Ollama running the model, Open WebUI for chat, and Tailscale so my phone can reach it on cellular without touching the router. The models live on an 8TB SSD so the mini's own drive stays free.

A few calls mattered more than the rest:

1. **No Docker Desktop.** On a 16GB Mac it quietly holds onto 2 to 4GB of memory, which is exactly what the model needs. Everything runs as a regular Mac app, and OrbStack covers the rare container.
2. **A 14B model with a 16k context.** Ollama's default context is about 4,000 tokens and it cuts off anything longer without telling you. On a clinical note, that's a confident answer from half the document.
3. **The plan goes in the prompt whole.** My recovery plan is about 3,000 words. Chopping it into chunks risked answering a day 4 question with a day 14 answer, so the whole thing just rides along.

Claude was pretty upfront about the limits, too. A model this size is about where chatbots were two years ago. For anything that matters I still ask Claude, and the local one handles private and offline.

## Media for the house

The same mini runs our media: Plex for movies and TV, Seerr so anyone in the house can request something from their phone, and Audiobookshelf, which remembers where you left off on any device. I also made a little Raycast extension so I can request a movie without opening a browser.

Every piece came with a plain-English guide and a runbook for when it breaks, written for someone who doesn't live in Terminal. Me!
