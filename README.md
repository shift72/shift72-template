# shift72-template

Template repository for off-the-shelf VOD sites using our Kibble/Relish engine based on the generic core-template.

- `npm i` to install node dependencies.
- `npm start` to run everything.
- 'npm run publish' to publish the template when you are ready to deploy it to production. 

## core-template

The base site is supplied by the Shift72 [core-template NPM package](https://www.npmjs.com/package/@shift72/core-template).

## Customizing

For the most part any changes to js, css and templates in `local` will overwrite the equivalent [core files](https://github.com/shift72/core-template).

The core files and files in `local` will be merged to `output`.

## Required Changes
At the very least you will need to make the following changes:
- Images/logos
- kibble.json settings (`local/kibble.json`)
- language strings (`local/site/en_AU.all.json`)

### Images/logos

- `local/site/static/images/common/logo.png`
Used in main navbar, generally in the top left of every page.
Should be a transparent png that is visible against the main background colour.

- `local/site/static/images/common/logo@2x.png`
Same as the main logo above, but used for higher density displays like Mac Retinas, or some flagship phones.

- `local/site/static/images/common/app-logo.png`
Used if the site is to be included in one of our multi-channel apps. Should be a transparent png at 930 x 930.

- `local/site/static/images/common/facebook-image.png`
Used when sharing links on facebook. The current size of 1200 x 630 should be ok to use.
Not a transparent png, use the main body background colour instead.

- `local/site/static/images/email/logo.png`
Used in any emails we send out to users (welcome, purchase receipt, etc) as well as the logo on the admin system signin, forgot password, and accept invite pages.
Should be a transparent png, that looks visible on a white background.
Default image has some padding around the outside, but thats not required.

- `local/site/static/favicon.ico`
If the parent site of the VOD site has a favicon, you should copy that one.
If not, use the logo as a base and either personal skill or an online generator to create a new one.

### kibble.json changes
- Change the `name` property to match the name of the site. It should be less than 20 characters long, and does not need to contain the word "template"
- Change the `siteUrl` property to point to the production site url, so your local development environment will use the films created there.
- Set the correct defaultLanguage and languages for the particular site.
  - Don't add all the languages from core/kibble.json, as this will cause unnecassary load when rendering.
  - Dont delete these values from local/kibble.json as this will cause the site to use the values from core/kibble.json, as this will cause unnecassary load when rendering.

### language strings
- Change the `site_owner` property to be the name of the site/client. This is at least used on the footer for the copyright notice.

## Styling

### Logo / Images assets
For a basic styling, the things that you will want in the local files are the all the images in the common folder and the email folder.

Once you have your logos you can set your local variables for the navbar brand. you set set the width at different resolution breakpoints. you want to make sure it doesnt overlap the search bar. Once you have a width you can set the y padding to make sure the logo is visible.

### Header / Page / Carousel layout
Once you have your logo in, you can use the variables to tweak the header size to suit. If you put in a taller logo, then your going to need more padding for your page content / carousel text etc. Again there are variables for different resolution breakpoints. You can pull your browser in slowly to check that it breaks down nicely at all resolutions. You want it looking nice at mobile / tablet and desktop resolutions.

### Colours
To set the colours of the site, you can usually do most by setting the 4 core color variables:
- `$primary`
- `$secondary`
- `$body-bg`
- `$body-color`

Set those first and see if it suits. if you need to customise further you will find other variables to tweak button colors and such.

### Custom CSS
Ideally its best to avoid using custom CSS if possible as it could jeopardize updates in the future.

### manifest.json
The site is designed to be a [Progressive Web App](https://web.dev/what-are-pwas/) meaning that users can be prompted to install the website to their desktop or mobile device as they would a native app. The [`manifest.json`](https://web.dev/add-manifest/) specifies how it should behave when installed and typically includes the app name, the icons for the app and the URL that should be opened when the app is launched.

Chrome has a handy dev tool called Lighthouse that can generate a report to tell you how [progressive](https://web.dev/what-are-pwas/) the site is.
