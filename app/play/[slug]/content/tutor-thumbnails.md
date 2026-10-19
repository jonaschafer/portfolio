Every Dojo Tutor class needs a thumbnail. Tutors were making their own, so the class listings looked like a dozen different products sitting side by side.

![Class thumbnails as they came in, before the generator.](/play/builds/tutor-thumbnails/before.jpg)

We'd already settled on two illustration styles for Tutor. Iridescent is soft coral-to-violet gradients with a bit of risograph grain. Risograph is a strict cyan, pink and yellow palette. Good illustrators can hold those styles, and image models mostly can't without a lot of help.

## Writing the style down

So the real work was writing each style up as a contract: what's allowed, what's never allowed, how figures are drawn, what the light does. Faceless figures, no clip-art, no text in the image. Each style also gets a folder of reference art, 11 pieces for Iridescent and 7 for Risograph, and the server sends those along with every request so the model has something to match. The references stay on the server and never reach the browser.

On top of that sits a quality bar. A hand-built Gemini Gem was beating the raw API at first, so I wrote down what made its results better and now send that with every request.

## What tutors see

A text box, three style buttons and a Generate button. Describe a scene ("a friendly owl on a stack of books at golden hour"), pick a style, get a 16:9 image at 2K. There are tips and example prompts tucked into collapsed panels for anyone who wants them.

Gemini 3.1 Flash Image does the drawing, with 2.5 as a fallback. It lives on Vercel with a daily cap, so one curious afternoon can't run up the bill.

A third style, Doodle, came later. It draws crayon line art first, then fills it with a spray-paint gradient in a second pass.
