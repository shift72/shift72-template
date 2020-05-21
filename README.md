# shift72-template

Template repository for off-the-shelf VOD sites using our Kibble/Relish engine based on the generic core-template.

- `npm i` to install node dependencies and the [core-template](https://github.com/shift72/core-template) submodule

- `npm start` to run everything.

Assumes core-template is in a submodule called 'core' and any local changes are in 'local'. For the most part any changes to js, css and templates in local will overwrite the equivalent files in core.

kibble.json can be edited in local and will be merged with kibble.json from core into output/kibble.json. Use this to point to a different server etc.

Likewise en_AU.all.json in local/site/ will be merged into output/site/en_AU.all.json

## core-template Submodule

The submodule is installed automatically and updated to the latest version when the node dependencies are installed, but to manually install the submodule, run:

`git submodule add https://github.com/shift72/core-template.git core`

and to manually update the repo to get the latest version run:

`git submodule update --remote`

## Styling

### Logo / Images assets
For a basic styling, the things that you will want in the local files are the all the images in the common folder and the email folder.

Once you have your logos you can set your local variables for the navbar brand. you set set the width at different resolution breakpoints. you want to make sure it doesnt overlap the search bar. Once you have a width you can set the y padding to make sure the logo is visible.

### Header / Page / Carousel layout
Once you have your logo in, you can use the variables to tweak the header size to suit. If you put in a taller logo, then your going to need more padding for your page content / carousel text etc. Again there are variables for different resolution breakpoints. You can pull your browser in slowly to check that it breaks down nicely at all resolutions. You want it looking nice at mobile / tablet and desktop resolutions.

### Colours
To set the colours of the site, you can usually do most by setting the 4 core color styles. primary / secondary / body-bg and body-color. Set those first and see if it suits. if you need to customise further you will find other variables to tweak button colors and such.

### Custom css
Ideally its best to avoid using custom CSS if possible as it could jeopardize updates in the future.
