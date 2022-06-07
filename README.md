Stack Exchange Auto Editor
=============================

![Stack Exchange Auto Editor Logo](https://i.imgur.com/79qYzkQ.png)

## About

This user script adds a button to the post editor toolbar on Stack Exchange sites that automatically fixes many common grammar, spelling, capitalization, and usage errors.

## Usage

![Example Usage](https://i.imgur.com/zmdvCm4.gif)

## Installation
First, you'll need a user script extension for your browser. Popular options include [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/), [Tampermonkey](https://tampermonkey.net/), and [NinjaKit](https://github.com/os0x/NinjaKit) for Firefox, Chrome, and Safari respectively.

Once installed, click [here](https://github.com/AstroCB/Stack-Exchange-Editor-Toolkit/raw/master/editor.user.js) and your user script manager should prompt you to install the toolkit.

## Rules

The rules included in the standard script are as follows:

 - Corrects to proper spelling/capitalization of "Stack Overflow" and "Stack Exchange" in order to fit the legal naming requirements
 - Expands "SO" and "SE" to "Stack Overflow" and "Stack Exchange," respectively
 - Corrects to proper spelling/capitalization of...
   - AJAX
   - Android
   - AngularJS
   - Apache
   - API
   - C/C#/C++
   - CSS
   - Git
   - GitHub
   - Google
   - HTML
   - I/I'm
   - iOS
   - Java
   - JavaScript
   - jQuery
   - JSFiddle
   - JSON
   - Linux
   - MySQL
   - Oracle
   - PHP
   - SQL(ite)
   - Ubuntu
   - Windows
   - WordPress
   - URI/URL
 - Capitalizes the first letter of new lines
 - Removes common greetings
 - Removes "thanks" and similar phrases
 - Removes "Edit:" and similar modifiers
 - Replaces example domains with official approved example domains
 - Fixes improperly used contractions
 - Corrects all-caps titles

## Test Suite

A test suite is built in and runs when you click the button a second time to view a report.
