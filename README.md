# Stack Exchange Auto Editor <img alt="Stack Exchange Auto Editor Logo" src="https://i.imgur.com/79qYzkQ.png" style="width:1em;height:1em;vertical-align:sub">

## About

This user script adds a button to the post editor toolbar on Stack Exchange sites that automatically fixes many common grammar, spelling, capitalization, and usage errors.

## Installation

1. Install a user script extension (such as [Tampermonkey](https://www.tampermonkey.net/)) for your browser. [Greasy Fork](https://greasyfork.org/en) maintains a list of user script extensions that are available for various browsers.
2. [Click here to install editor.user.js](https://github.com/stephenostermiller/Stack-Exchange-Auto-Editor/raw/master/editor.user.js) within your user script manager.

## Usage

1. Edit a post or a comment on a Stack Exchange site
1. Click the Auto Editor button in the edit tool bar (to the right of the redo button)
1. The edit area will flash green if edits were automatically made, red if no edits were needed
1. Click the same button again to get a report of what changed, see diffs, and view the status of the unit tests
1. Submit the edits to Stack Exchange after making other manual edits as desired

## Rules

This script performs the following actions automatically:

 - Expands some acronyms such as "SO" and "SE"
 - Corrects commonly misspelled words such as `untill` → `until`
 - Capitalizes commonly used technologies names and acronyms such as `javascript` → `JavaScript`
 - Fixes contractions with a missing apostrophe such as  such as `dont` → `don't`
 - Capitalizes the first letter of the title
 - Corrects all-caps titles
 - Removes niceties such as "hello", "thanks", and "please help"
 - Removes "Edit:"
 - Replaces domains like `my-site.tld` with officially approved example domains like `my-site.example`
 - Applies code formatting to example URLs

The rules are coded into the source code for the script. To change the rules, you would need to edit it.

Each rule is applied to specific contexts within markdown. Most rules are applied in the title and in plain text, but not in markdown for code, links, or URLs.
