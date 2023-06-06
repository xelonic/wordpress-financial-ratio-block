# Xelonic Financial Ratio Block

* Contributors:      xelonic capital GmbH
* Tags:              block
* Tested up to:      6.1
* Stable tag:        0.1.0
* License:           GPL-2.0-or-later
* License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Provides a block that displays a financial ratio of a company.

## Description

**TODO**

## Installation


1. Upload the plugin files to the `/wp-content/plugins/financial-ratio-block` directory,
   or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Use the block in the block editor.


## Screenshots

**TODO**

1. This screen shot description corresponds to screenshot-1.(png|jpg|jpeg|gif). Note that the screenshot is taken from
the /assets directory or the directory that contains the stable readme.txt (tags or trunk). Screenshots in the /assets
directory take precedence. For example, `/assets/screenshot-1.png` would win over `/tags/4.3/screenshot-1.png`
(or jpg, jpeg, gif).
2. This is the second screen shot

## Local Development

This plugin is based on the code skeleton `@wordpress/create-block` and was initially generated with

```bash
npx @wordpress/create-block financial-ratio-block --wp-env
```

### Manage the dev environment

Make sure you use node version 14. This can be done by using the tool `nvm` (a corresponding `.nvmrc`
is in the project directory). And then:

```bash
nvm install
nvm use
```

Inside the project directory:
```bash
npm install
```

Then start the wordpress instance:

```bash
npm run env -- start
```

Then start the hot-update mechanism for development:

```bash
npm run start
```

When you're done, stop the environment:

```bash
npm run env -- stop
```

To get fully rid of the state (including docker volumes) run:

```bash
npm run env -- destroy
```

### Configure Wordpress

Then you can navigate to wordpress, by default on `http://localhost:8888`. There you have to activate the plugin
for the block.

* go to `Plugins`
* activate `Financial Ratio`
* go to `Appearance` -> `Editor`
* click inside the big editor
* on the upper-left click on the `+`
* search for `financ`
* drag & drop the block somewhere and edit it
