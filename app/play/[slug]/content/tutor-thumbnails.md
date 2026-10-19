Every Dojo Tutor class needs a thumbnail, and the ones coming in were all over the place. Side by side, the class listings looked like a dozen different products.

![Class thumbnails as they came in, before the generator.](/play/builds/tutor-thumbnails/before.jpg)

We'd already landed on two illustration styles for Tutor. Iridescent is soft coral-to-violet gradients with a little risograph grain, and Risograph is a strict cyan, pink and yellow palette. A good illustrator can hold either one. An image model mostly can't, not without a lot of help.

## Writing the styles down

So most of the work was writing each style up as a contract: what's allowed, what's never allowed, how figures are drawn and what the light does. Faceless figures, no clip-art, no text in the image. Each style also has a folder of reference art (11 pieces for Iridescent, 7 for Risograph) that goes along with every request so the model has something to match. The references stay on the server and never reach the browser.

On top of that is a quality bar. A hand-built Gemini Gem was beating the raw API at first, so I wrote down what made its results better, and now that goes out with every request too.

## What tutors see

A text box, three style buttons and a Generate button. Describe the class ("a friendly owl on a stack of books at golden hour"), pick a style, get a 16:9 image back at 2K. Tips and example prompts are tucked into panels for anyone who wants them.

![The generator: describe a scene, pick a style.](/play/builds/tutor-thumbnails/tool.jpg)

Gemini 3.1 Flash Image does the drawing, with 2.5 as a fallback. It runs on Vercel with a daily cap so one curious afternoon can't run up the bill.

A third style, Doodle, came later. It draws crayon line art first, then fills it with a spray-paint gradient in a second pass.
