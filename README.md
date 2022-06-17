# Stack Exchange Auto Editor <img alt="Stack Exchange Auto Editor Logo" src="https://i.imgur.com/79qYzkQ.png" style="width:1em;height:1em;vertical-align:sub">

## About

This user script adds a button when editing Stack Exchange sites that automatically fixes many common grammar, spelling, capitalization, and usage errors.

## Installation

1. Install a user script extension (such as [Tampermonkey](https://www.tampermonkey.net/)) for your browser. [Greasy Fork](https://greasyfork.org/en) maintains a list of user script extensions that are available for various browsers.
2. [Click here to install editor.user.js](https://github.com/stephenostermiller/Stack-Exchange-Auto-Editor/raw/master/editor.user.js) within your user script manager.

## Usage

1. Edit a post or a comment on a Stack Exchange site.
1. Click the Auto Editor button that appears in the toolbar for posts or below comments.
1. The edit area will flash green if edits were automatically made, red if no edits were needed.
1. Click the same button again to get a report of what changed, see diffs, and view the status of the unit tests.
1. Submit the edits to Stack Exchange after making other manual edits as desired.

**Important**: You are responsible for manually reviewing all edits made with assistance from this tool. There will be cases in which it **suggests edits that make posts worse**. All edits made by this tool are created from heuristics and regular expressions. They are not infallible. The rules in this tool are designed to save you time by doing the right thing 90% of time. The rest of the time, suggestions from this tool will need to be manually fixed up or abandoned. All edits will have your name attached to them. You don't want to blindly trust this tool.

## Rules

This script performs the following actions automatically:

 - Expands some acronyms such as "SO" and "SE"
 - Corrects commonly misspelled words such as "untill" → "until"
 - Capitalizes commonly used technologies names and acronyms such as "javascript" → "JavaScript"
 - Fixes contractions with a missing apostrophe such as  such as "dont" → "don't"
 - Ensures the title starts with a capital letter but is not all caps.
 - Removes niceties such as "hello", "thanks", and "please help"
 - Removes "Edit:"
 - Replaces domains like `my-site.tld` with officially approved example domains like `my-site.example`
 - Applies code formatting to example URLs

To minimize false-auto-corrections, these rules are markdown-aware. For example, spelling corrections are not applied inside code blocks or URLs. Each rule has a list of places where it should be applied.

The rules are coded into the source code for the script. To change the rules, you would need to edit it.
