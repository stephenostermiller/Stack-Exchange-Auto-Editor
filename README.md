# Stack Exchange Auto Editor ![Stack Exchange Auto Editor Logo](https://i.imgur.com/79qYzkQ.png | width=100)

## About

This user script adds a button to the post editor toolbar on Stack Exchange sites that automatically fixes many common grammar, spelling, capitalization, and usage errors.

## Installation

1. Install a user script extension (such as [Tampermonkey](https://www.tampermonkey.net/)) for your browser. [Greasy Fork](https://greasyfork.org/en) maintains a list of user script extensions that are available for various browsers.
2. [Click here to install editor.user.js](https://github.com/stephenostermiller/Stack-Exchange-Auto-Editor/raw/master/editor.user.js) within your user script manager.

## Usage

1. Edit a post on a Stack Exchange site
1. Click the Auto Editor button in the edit tool bar (to the right of the redo button)
1. The edit area will flash green if edits were automatically made, red if no edits were needed
1. Click the same button again to get a report of what changed, see diffs, and view the status of the unit tests
1. Submit the edits to Stack Exchange after making other manual edits as desired

## Rules

This script performs the following actions automatically:

 - Corrects to proper spacing and capitalization of "Stack Overflow" and "Stack Exchange"
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
   - Java/JavaScript
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
 - Applies code formatting to example URLs
 - Fixes improperly used contractions
 - Corrects all-caps titles

The rules are coded into the source code for the script. To change the rules, you would need to edit it.

Each rule is applied to specific contexts within markdown. Most rules are applied in the title and in plain text, but not in markdown for code, links, or URLs.
