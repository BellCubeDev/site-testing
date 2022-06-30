# BellCubeDev.GitHub.IO

This repository is the website for BellCube Dev, a mod author and occasionally a utility developer.

## About the Setup

This setup was originally cloned from [LOOT](https://github.com/LOOT), who already did a lot of the setup work for me. Huge thanks to the LOOT team!

Here are some of the technologies at play:

* [Material Design Lite](https://getmdl.io/): A ~~modern, responsive,~~ modular, and mobile-friendly UI framework for building beautiful, high-fidelity, and interactive websites. The kit was modified from its original state to take advantage of newer JavaScript technologies such as classes and to work as a module for the site instead and to correct some of the styling issues/bugs that were present in the original version.
* [TypeScript](https://www.typescriptlang.org/): A language built as *an extension* of JavaScript that compiles back into JavaScript. Using it makes it easier to write code that is more readable and easier to test. It also means fewer errors and better performance. If we're getting technical, TypeScript is a "statically-typed" language. What that means that I can't take a variable that's only supposed to hold numbers and assign it text instead.
* [Highlight.js](https://highlightjs.org/): A JavaScript library that provides code highlighting in a variety of languages. I ideally use it anywhere where code is shown to the user.
* [Jekyll](http://jekyllrb.com/): A static site generator that is (somewhat) easy to use and easy to set up. I initially chose it because it's what the LOOT site used and because that's what GitHub Pages uses. However, since I recently designed a custom GitHub Actions workflow to build the site (for that fancy TypeScript support), the only reason it's sticking around now is that, well, I don't feel like doing any more refactoring than I need to.
* [Jekyll layout that compresses HTML v3.1.0 (© 2014–2015 Anatol Broder)](http://jch.penibelst.de/): Exactly what it says on the tin.

As well as some of the assets:

* SVG icons for [GitHub](https://github.com), [Nexus Mods](https://nexusmods.com), [Vortex Mod Manager](https://www.nexusmods.com/about/vortex/), and [Mod Organizer 2](https://www.nexusmods.com/skyrimspecialedition/mods/6194)
* [Material Symbols and Icons](https://fonts.google.com/icons): An icon font for use in Material Design, which I've made use of anywhere I needed a generic icon.

# Build Instructions

To build this project, you've got three options:

## 1. The Simple Way (Windows Only)

If you haven't already, install Node Package Manager (NPM) and RubyGems. Once you've done that, open a command prompt in the project's root directory and run the command `.vscode\build.bat`

## 2. The Slightly-More-Complicated Way (GitHub Actions)

Set up a repository on GitHub and run the workflow '*Build & Deploy Site*' to build the site. It will upload an artifact that includes the static site, ready to be served in any way you see fit.

## 3. The Stupidly Complex Way (DIY)

Figure out how the NPM packages and Ruby gems work and how to use them to build the site. Have fun!

Actually, here. Install NPM and RubyGems, then run these commands in the `site` directory:```bash
npm install

gem install bundler
bundle install

```
