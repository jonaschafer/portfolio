Try it above. Switch between type and dots, drag the detail slider, flip invert. Use your own photo, or drop one onto the frame. Nothing uploads anywhere, it all runs in your browser.

I made the first version in February 2025 so I could turn photos into ASCII without a plugin. It was one HTML file with a file picker and one job.

## How it works

The image gets shrunk down to a tiny grid, one pixel per character, which handles all the averaging for free. Each cell's brightness picks a character from a ramp that runs from dense to empty: `@ % # * + = - : .` and a space. Dark areas get heavy characters, light areas fade out.

Type cells are taller than they are wide, roughly 0.6 to 1, so the grid squashes the rows to match. Skip that and every face comes out stretched.

Dots use the same grid with square cells. Brightness sets the radius, so you get a halftone. That version came in September 2025, along with an SVG export so I could take the dots into Figma and keep them sharp.

## What changed for this page

The original lived in its own gray box with its own type. For this page I rebuilt it to take the page's colors, so it changes with every theme the site deals you. The controls are in the site's type, it redraws as the frame resizes, and it starts on a photo of me so there's something to look at before you upload anything.
