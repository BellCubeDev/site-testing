[![Build & Deploy Site](https://github.com/BellCubeDev/site-testing/actions/workflows/github-pages-build-and-deploy.yml/badge.svg?branch=main&event=push)](https://github.com/BellCubeDev/site-testing/actions/workflows/github-pages-build-and-deploy.yml)

# BellCube.dev

This repository is the website for BellCube Dev, a mod author and occasionally a utility developer.

## About the Setup

This setup was originally cloned from [LOOT](https://github.com/LOOT), who already did a lot of the setup work for me. Huge thanks to the LOOT team!

Here are some of the technologies at play:

* [Material Design Lite](https://getmdl.io/): A ~~modern,~~ responsive, modular, and mobile-friendly UI framework for building beautiful, high-fidelity, and interactive websites. The kit was modified from its original state to take advantage of newer JavaScript technologies such as classes and to work as a module for the site instead and to correct some of the styling issues/bugs that were present in the original version.
* [TypeScript](https://www.typescriptlang.org/): A language built as *an extension* of JavaScript that compiles back into JavaScript. Using it makes it easier to write code that is more readable and easier to test. It also means fewer errors and better performance. If we're getting technical, TypeScript is a "statically-typed" language. What that means that I can't take a variable that's only supposed to hold numbers and assign it text instead.
* [Highlight.js](https://highlightjs.org/): A JavaScript library that provides code highlighting in a variety of languages. I ideally use it anywhere where code is shown to the user.
* [Jekyll](http://jekyllrb.com/): A static site generator that is (somewhat) easy to use and easy to set up. I initially chose it because it's what the LOOT site used and because that's what GitHub Pages uses. However, since I recently designed a custom GitHub Actions workflow to build the site (for that fancy TypeScript support), the only reason it's sticking around now is that, well, I don't feel like doing any more refactoring than I need to.
* [Jekyll layout that compresses HTML v3.1.0 (© 2014–2015 Anatol Broder)](http://jch.penibelst.de/): Exactly what it says on the tin.

As well as some of the assets:

* SVG icons for [GitHub](https://github.com), [Nexus Mods](https://nexusmods.com), [Vortex Mod Manager](https://www.nexusmods.com/about/vortex/), and [Mod Organizer 2](https://www.nexusmods.com/skyrimspecialedition/mods/6194)
* [Material Symbols and Icons](https://fonts.google.com/icons): An icon font for use in Material Design, which I've made use of anywhere I needed a generic icon.

# Build Instructions

To build this project, you've got three options:

## 1. The Simple Way

If you haven't already, install the latest LTS version of [Node.js & Node Package Manager](https://nodejs.org/en/) as well as the latest stable releases of both [Ruby](https://www.ruby-lang.org/) and [RubyGems](https://rubygems.org/). Additionally, if you're not on Windows, be sure to [install PowerShell](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell). Once you've done that, open a command prompt or PowerShell window in the project's root directory and run the command `.vscode\build.ps1`

## 2. The Slightly-More-Complicated Way (GitHub Actions)

Set up a repository on GitHub and run the workflow '*Build & Deploy Site*' to build the site. It will upload an artifact that includes the static site, ready to be served in any way you see fit.

## 3. The Stupidly Complex Way (DIY)

~~Figure out how the NPM packages and Ruby gems work and how to use them to build the site. Have fun!~~

Install NPM and RubyGems, then run these commands in the `site` directory:

```bash
cd site

npm install

gem install bundler
bundle install

```

From there, copy the `site` directory (optionally excluding JavaScript and TypeScript) to the folder `_generated\ts_out`. The following commands will accomplish that for you:

### Bash
```bash
rsync -t -r -v site/src/* _generated/ts_out/
```

### Windows (Batch/PowerShell)
```powershell
robocopy site\src\ _generated\ts_out\ /s /purge /xf *.js *.ts
```

After that, set the environment variable `minifyDir` to the path of the `_generated\ts_out` directory and run the `minify` script. This will minify JavaScript and compile Sass to minified CSS. The following commands will accomplish that for you:

### Bash
```bash
export minifyDir=_generated/ts_out
cd site
node minify.mjs
```

### PowerShell
```powershell
$env:minifyDir = "_generated\ts_out"
cd site
node minify.mjs
```

### Batch
```bat
set minifyDir=_generated\ts_out
cd site
node minify.mjs
```

Finally, run the `jekyll build` command in the `site` directory to build the site. The following commands will accomplish that for you:

```bash
bundle exec jekyll build --config site/_config.yml --source _generated/ts_out/ --destination _generated/_jekyll-out/ --verbose --safe --trace
```
