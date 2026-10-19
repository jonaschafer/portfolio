Dojo Tutor runs a lot of paid social, and every ad has to land in a dozen sizes. Having an image model make the whole ad looks fast until you zoom in. The logo's a little off, the type is a near miss, and the button has a 3px border where ours has 2px.

So I split it in two. The model makes the picture, and code sets everything that has to be exact.

## The art director

The first half is an art-director skill for image generation. It knows the Tutor brand system, the channels, and how our layouts breathe. People in the scene are always AI-generated, never photos of real kids or tutors, and tutor portraits face the camera. It also ships with seven ads that look plausible and are wrong, each with a note on why.

The one rule it never breaks is to generate the scene with no text and no logo. Nothing brand-critical gets drawn by a model.

## The builder

The second half lives in [Brand Studio](/play/brand-studio). Pick a template, drop in the scene, write the copy. Headlines get Melun, body and button get Ginto, and the button is the actual Tutor button from our design system, fill, border and hard shadow included.

Pick a panel color and the logo and button flip to the right version on their own. Spacing comes straight from the brand rules: 40px from logo to headline, 22px to the support line, 52px to the button. Every rule it applied is listed under the canvas, so whoever's reviewing can see why the ad looks the way it does.

![The rules the builder applied, listed under the canvas for the reviewer.](/play/builds/tutor-ads/rules.jpg)

There are presets for Meta feed, Stories, six display sizes, an email header and a landing hero, and it exports a PNG.

No AI runs in the builder itself. Everything it places is the real asset, so there's nothing to squint at letter by letter.
