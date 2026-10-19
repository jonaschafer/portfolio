Go ahead and play with it. Switch between type and dots, drag the detail slider, flip invert. You can use your own photo or just drop one on the frame, and nothing gets uploaded anywhere, it all runs in your browser.

I made the first version in February 2025 so I could turn photos into ASCII without a plugin. It was one HTML file with a file picker that did one thing.

## How it works

The image gets shrunk down to a tiny grid, one pixel per character, which does all the averaging for free. Each cell's brightness picks a character off a ramp that runs from dense to empty (`@ % # * + = - : .` and then a space), so dark areas get heavy characters and light areas fade out.

Type cells are taller than they are wide, about 0.6 to 1, so the grid squashes the rows to match. Skip that and every face comes out stretched.

Dots use the same grid with square cells, and brightness sets the size of each dot, so you get a halftone. That version came in September 2025 along with an SVG export, so I could pull the dots into Figma and keep them crisp.

## What changed for this page

The original lived in its own gray box with its own type. For this page I rebuilt it to pick up the page's colors, so it changes with whatever theme the site deals you. The controls are in the site's type, it redraws when the frame resizes, and it starts on one of my photos so there's something to look at before you upload your own.
