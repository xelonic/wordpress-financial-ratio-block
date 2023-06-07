# Financial Ratio Block

[![Build](https://github.com/xelonic/wordpress-financial-ratio-block/actions/workflows/build.yml/badge.svg)](https://github.com/xelonic/wordpress-financial-ratio-block/actions/workflows/build.yml)

* Contributors:      xelonic capital GmbH
* Tags:              block
* Tested up to:      6.1
* Stable tag:        1.0.0

Provides a block that displays a financial ratio of a company.

## Description

This plugin enables a block in the `embed` category to display a financial ratio of a target company. There a
number of ratios to choose from, for example price/earnings, price/book or market capitalization.

The block will invoke an API from <a href="https://xelonic.com" target="_blank">xelonic.com</a> to retrieve it's data.
**There's no account required to use this data!**


## Installation

1. Upload the plugin files to the `/wp-content/plugins/financial-ratio-block` directory,
   or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. In the block editor search for `financial ratio`.

## Screenshots

![block screenshot](./screenshots/screenshot-block.png)

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

The default username is `admin` with password `password`.

* go to `Plugins`
* activate `Financial Ratio`
* go to `Appearance` -> `Editor`
* click inside the big editor
* on the upper-left click on the `+`
* search for `financ`
* drag & drop the block somewhere and edit it
