Dojo Tutor runs a lot of paid social, and every ad needs to land in a dozen sizes. Generating finished ads with an image model looks fast until you check the details. The logo comes out wrong, the type is a near miss, and the button has a 3px border where ours has 2px.

So I split the job in two. The model makes the picture, and code sets everything that has to be exact.

## The art director

The first half is an art-director skill for image generation. It knows the Tutor brand system, the channels, and how layouts breathe. People in the scene are always AI-generated, never photos of real kids or tutors. Tutor portraits face the camera. It ships with negative examples too, seven ads that look plausible and are wrong, each annotated with why.

The one rule it never breaks: generate the scene with no text and no logo. Nothing brand-critical gets drawn by a model.

## The builder

The second half is a tool in [Brand Studio](/play/brand-studio). Pick a template, drop in the generated scene, write the copy. It sets the headline in Melun, body and button in Ginto, and uses the exact Tutor button from our design system, fill, border and hard shadow included.

![The rules the builder applied to an ad, listed under the canvas for whoever reviews it.](/play/builds/tutor-ads/rules.jpg)

Pick a panel color and the logo and button flip to the right version on their own. Spacing comes from the brand rules: 40px from logo to headline, 22px to the support line, 52px to the button. The bottom of the screen lists every rule applied, so a reviewer can see why the ad looks the way it does.

There are a dozen size presets: Meta feed, Stories, six display units, an email header and a landing hero. Export is a PNG.

No AI runs in the builder itself. Everything it sets is the real asset, so there's nothing to check letter by letter.
