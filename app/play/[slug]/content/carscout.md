My son turns 15 next year, which means a permit, and then a car. My rules were simple: gas, AWD, under $10k, and a backup camera or room to add one. I am not a car guy. Every listing meant looking up whether that year was a good one, whether 140k miles is a lot for that model, what a CVT is and why people keep warning me about it. Then doing it again for the next car.

So I had Claude build the thing that does the looking up for me. It runs on my laptop, and I open it like a website.

## What it does on its own

1. **Searches Craigslist Portland** for every model worth considering, then reads each listing for the VIN, mileage, title status and the seller's own description.
2. **Decodes the VIN** with NHTSA's free API to confirm the car really is AWD and which engine it has.
3. **Pulls recalls and owner complaints** for that model year, and charts complaints across every year, so a bad year sticks out next to its neighbors.
4. **Scores every car 0 to 100.** Model year, miles, camera, red flags in the listing text ("needs AC recharge," "rebuilt title," financing-lot teaser prices), too much engine for a teen, and price against similar cars.
5. **Tracks what sells.** It remembers when a listing showed up, when the price drops, and when it disappears.

Facebook, Carvana and the big dealer sites block scripts, so there's a box to paste a listing and get the same grade.

## The part I actually needed

The scoring sits on a guide to about 30 models, with the good years, the years to skip and what to check on a test drive for each one. Every car term has a little ⓘ next to it with a plain-English definition. I didn't know what a PTU was. Now I do, and I know to ask about its fluid.

## How realistic is this?

This was the question I cared about most, so it's the first thing on the page, recalculated every refresh. AWD under $10k is very doable in Portland. A clean, low-mileage one with a factory camera mostly doesn't exist. The realistic version is a 2014 to 2016 Subaru with 130k to 145k miles, plus about $1,500 for what it needs in the first month.

![The landing page leads with the realistic answer, then the numbers behind it.](/play/builds/carscout/home.jpg)

It also has a printable test drive checklist, a page on how long a car like that will last, and an insurance plan for a teen boy in Oregon (spoiler: it's a lot) with a tracker for comparing quotes.

We won't buy for a while. Running it now means I'll know what a fair price looks like when we do.
