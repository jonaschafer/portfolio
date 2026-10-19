We have a Mac mini that was mostly a Plex server. I wanted it to do more, and I'm not someone who enjoys Terminal. So the split was simple: I buy and plug in the hardware, and Claude Code does the setup over SSH while I watch and ask questions.

## A private model I can ask from my phone

This started with my jaw surgery. I had recovery notes and post-op paperwork I wanted to ask questions about, and I didn't want them going anywhere. That's the one job where a local model beats everything else, because the text never leaves the house.

The setup is Ollama running the model, Open WebUI for chat, and Tailscale so my phone reaches it on cellular with no router changes. The models live on an 8TB SSD so the mini's own drive stays free.

A few decisions mattered more than the rest:

- **No Docker Desktop.** On a 16GB Mac it quietly holds 2 to 4GB of memory, which is exactly what the model needs. Everything runs as a normal Mac app, and OrbStack covers the rare container.
- **A 14B model with a 16k context.** Ollama's default context is about 4,000 tokens and it cuts off anything longer without saying so. On a clinical note, that means a confident answer from half a document.
- **A system prompt beats retrieval for small docs.** My recovery plan is about 3,000 words. Splitting it into chunks risked answering a day-4 question with a day-14 answer, so it just goes into the prompt whole.

Claude was also clear about the limits, which I appreciated. A model this size is a decent chatbot from two years ago. For anything that matters I still ask Claude, and the local one handles private and offline.

## Media for the house

The same mini runs our media. Plex for movies and TV, Seerr so anyone in the house can request something from their phone, and Audiobookshelf, which keeps your place across devices. I built a small Raycast extension so I can request a movie without opening a browser.

Every piece came with a plain-English guide and a runbook for when it breaks, written for someone who does not live in Terminal.
