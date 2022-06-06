// ==UserScript==
// @name Stack-Exchange-Editor-Toolkit
// @author Stephen Ostermiller
// @author Cameron Bernhardt (AstroCB)
// @developer Jonathan Todd (jt0dd)
// @developer sathyabhat
// @contributor Unihedron
// @license MIT
// @namespace http://github.com/AstroCB
// @version 1.5.2
// @description Fix common grammar/usage annoyances on Stack Exchange posts with a click
// @match https://*.stackexchange.com/questions/*
// @match https://*.stackexchange.com/review/*
// @match https://*.stackoverflow.com/*questions/*
// @match https://*.stackoverflow.com/review/*
// @match https://*.askubuntu.com/questions/*
// @match https://*.askubuntu.com/review/*
// @match https://*.superuser.com/questions/*
// @match https://*.superuser.com/review/*
// @match https://*.serverfault.com/questions/*
// @match https://*.serverfault.com/review/*
// @match https://*.mathoverflow.net/questions/*
// @match https://*.mathoverflow.net/review/*
// @match https://*.stackapps.com/questions/*
// @match https://*.stackapps.com/review/*
// @grant GM_addStyle
// ==/UserScript==
(function(){
	var editRules = [
		capitalizeWord("AJAX"),
		capitalizeWord("Android"),
		capitalizeWord("AngularJS"),
		capitalizeWord("Apache"),
		capitalizeWord("API"),
		capitalizeWord("CSS"),
		capitalizeWord("Git"),
		capitalizeWord("GitHub"),
		capitalizeWord("Google"),
		capitalizeWord("HTML"),
		capitalizeWord("HTML5"),
		capitalizeWord("I"),
		capitalizeWord("iOS"),
		capitalizeWordAndVersion("iOS", null, " "),
		capitalizeWord("Java"),
		capitalizeWord("JavaScript"),
		capitalizeWord("jQuery"),
		capitalizeWord("JSFiddle", "js\\s*fiddle"),
		capitalizeWord("JSON"),
		capitalizeWord("Linux"),
		capitalizeWord("MySQL"),
		capitalizeWord("Oracle"),
		capitalizeWord("PHP"),
		expandAbbrev("SE", "Stack Exchange"),
		expandAbbrev("SO", "Stack Overflow"),
		capitalizeWord("Stack Exchange"),
		capitalizeWord("Stack Overflow"),
		capitalizeWord("SQL"),
		capitalizeWord("SQLite"),
		capitalizeWordAndVersion("SQLite"),
		capitalizeWord("Ubuntu","ubunt[ou]*|ubunut[ou]*|ubun[ou]+|ubnt[ou]+|ubutn[ou]*|ubant[ou]*|unbunt[ou]*|ubunt|ubut[ou]+"),
		capitalizeWord("URI"),
		capitalizeWord("URL"),
		capitalizeWord("Windows"),
		capitalizeWordAndVersion("Windows", "win|windows", " "),
		capitalizeWord("Windows Vista","(?:win|windows)\\s*vista"),
		capitalizeWord("Windows XP", "(?:win|windows)\\s*xp"),
		capitalizeWord("WordPress"),
		{
			expr: /(thanks|pl(?:ease|z|s)\s+h[ea]lp|cheers|regards|thx|thank\s+you|my\s+first\s+question|kindly\shelp).*$/gmi,
			replacement: "",
			reason: "Remove fluff"
		},{
			expr: /(?:(?:^|\s)(?:greetings|cheers|hi|hello|good\s(?:evening|morning|day|afternoon))(?:\s+(?:guys|folks|everybody|everyone))?\s*[\.\!\,]?)+(?:\s+|$)/gmi,
			replacement: "",
			reason: "Remove fluff"
		},{
			expr: /(?:^\**)(edit|update):?(?:\**):?/gmi,
			replacement: "",
			reason: "Stack Exchange has an advanced revision history system: 'Edit' or 'Update' is unnecessary"
		},{
			expr: /\b((?:my|your|our|new|old|foo|client)[a-z]*)\.(?:com|net|org|tld|(?:(?:com?\.)?[a-z]{2}))\b/g,
			replacement: "$1.example",
			reason: "Use example domain"
		},{
			expr: /\b([a-z]*(?:site|domain|page|sample|test))\.(?:com|net|org|tld|(?:(?:com?\.)?[a-z]{2}))\b/g,
			replacement: "$1.example",
			reason: "Use example domain"
		},{
			expr: /(^|\s)c(#|\++|\s|$)/gm,
			replacement: "$1C$2",
			reason: "Spelling"
		},{
			expr: /(^|\s)[Ii]'?m\b(\S|)(?!\S)/gm,
			replacement: "$1I'm$2",
			reason: "Spelling"
		},{
			expr: /(^|\s)(can|doesn|don|won|hasn|isn|didn)t\b(\S|)(?!\S)/gmi,
			replacement: "$1$2't$3",
			reason: "Spelling"
		},{
			expr: /^((?=.*[A-Z])[^a-z]*)$/g,
			replacement: "$1",
			reason: "no need to yell"
		},{
			expr: /(hdd|harddisk)\b(\S|)(?!\S)/igm,
			replacement: "hard disk$2",
			reason: "Spelling"
		},{
			expr: /,([^\s])/g,
			replacement: ", $1",
			reason: "Grammar"
		},{
			expr: /[ ]+([,\!\?\.\:])/g,
			replacement: "$1",
			reason: "Grammar"
		},{
			expr: /\[enter image description here\]/g,
			replacement: "[]",
			reason: "Remove default alt text"
		}
	]

	function expandAbbrev(abbrev, replace){
		return {
			expr: new RegExp("(^|\\s)(?:"+abbrev+")\\b(\\S|)(?!\\S)","gm"),
			replacement: "$1"+replace+"$2",
			reason: "Spelling"
		}
	}

	function capitalizeWord(word, re){
		if (!re) re = word
		re = re.replace(/ /g, "\\s*")
		re = re.replace(/([A-Z][a-z]+)([A-Z])/g, "$1\\s*$2")
		return {
			expr: new RegExp("(^|\\s)(?:"+re+")\\b(\\S|)(?!\\S)","igm"),
			replacement: "$1"+word+"$2",
			reason: "Spelling"
		}
	}

	function capitalizeWordAndVersion(word, re, separator){
		if (!separator) separator = ""
		if (!re) re = word
		re = re.replace(/ /g, "\\s*")
		re = re.replace(/([A-Z][a-z]+)([A-Z])/g, "$1\\s*$2")
		return {
			expr: new RegExp("(^|\\s)(?:"+re+")"+(separator==" "?"\\s*":"")+"([0-9]+)\\b(\\S|)(?!\\S)","igm"),
			replacement: "$1"+word+separator+"$2$3",
			reason: "Spelling"
		}
	}

	GM_addStyle(`
		.toolkitfix{margin-left:0.5em;background:url("//i.imgur.com/79qYzkQ.png") center / contain no-repeat}
		.toolkitfix:hover{background-image:url("//i.imgur.com/d5ZL09o.png")}
	`)

	// Access to jQuery via dollar sign variable
	var $ = unsafeWindow.jQuery

	// Define app namespace
	var App = {}

	// Place edit items here
	App.items = []

	// Place selected jQuery items here
	App.selections = {}

	// Place "global" app data here
	App.globals = {}

	//Preload icon alt
	new Image().src = '//i.imgur.com/79qYzkQ.png'
	new Image().src = '//i.imgur.com/d5ZL09o.png'

	// Populate global data
	// Get url for question id used in id and class names
	App.globals.URL = window.location.href

	// Get question num from URL
	App.globals.questionNum = App.globals.URL.match(/\/(\d+)\//g)
	App.globals.questionNum = App.globals.questionNum?App.globals.questionNum[1]:null

	// Define variables for later use
	App.globals.barReady = false
	App.globals.editsMade = false
	App.globals.editCount = 0
	App.globals.infoContent = ''

	App.globals.reasons = {}
	App.globals.numReasons = 0

	App.globals.replacedStrings = {
		"block": [],
		"inline": []
	}
	App.globals.placeHolders = {
		"block": "_xCodexBlockxPlacexHolderx_",
		"inline": "_xCodexInlinexPlacexHolderx_"
	}
	App.globals.checks = {
		"block": /(    )+.*/gm,
		"inline": /`.*`/gm
	}

	// Assign modules here
	App.globals.pipeMods = {}

	// Define order in which mods affect here
	App.globals.order = ["omit", "edit", "replace"]

	// This is where the magic happens: this function takes a few pieces of information and applies edits to the post with a couple exceptions
	function fixIt(input, expression, replacement, reasoning){
		if (!input) return
		// Scan the post text using the expression to see if there are any matches
		var match = input.search(expression)
		// If so, increase the number of edits performed (used later for edit summary formation)
		if (match !== -1){
			App.globals.editCount++

			// Later, this will store what is removed for the first case
			var phrase

			// Store the original input text
			var originalInput = input

			// Then, perform the edits using replace()
			// What follows is a series of exceptions, which I will explain below; I perform special actions by overriding replace()
			// This is used for removing things entirely without giving a replacement; it matches the expression and then replaces it with nothing
			if (replacement === ""){
				input = input.replace(expression, function(data, match1){
					// Save what is removed for the edit summary (see below)
					phrase = match1

					// Replace with nothing
					return ""
				})

				// This is an interesting tidbit: if you want to make the edit summaries dynamic, you can keep track of a match that you receive
				// from overriding the replace() function and then use that in the summary
				reasoning = reasoning.replace("$1", phrase)
				// Fix all caps
			} else if (reasoning === "no need to yell"){
				input = input.replace(expression, function(data, match1){
					return match1.substring(0, 1).toUpperCase() + match1.substring(1).toLowerCase()
				})
				// This is used to capitalize letters; it merely takes what is matched, uppercases it, and replaces what was matched with the uppercased version
			} else if (replacement === "$1"){
				input = input.replace(expression, function(data, match1){
					return match1.toUpperCase()
				})

				// I can use C, C#, and C++ capitalization in one rule
			} else if (replacement === "$1C$2"){
				var newPhrase
				input = input.replace(expression, function(data, match1, match2){
					newPhrase = match2
					return match1 + "C" + match2
				})
				reasoning = reasoning.replace("$2", newPhrase)

				// iOS numbering/spacing fixes
			} else if (replacement === "iOS $2"){
				input = input.replace(expression, function(data, match1){
					if (match1.match(/\d/)){ // Is a number
						return "iOS " + match1
					}

					return "iOS" + match1
				})
				// Check for "i.e." edge case
			} else if (replacement === "$1I$2"){
				input = input.replace(expression, function(data, match1, match2){
					if (match2 === "." && input.charAt(input.indexOf(data) + 3) === "e"){ // Is an "i.e." case
						return match1 + "i" + match2
					} else { // Regular "i" case
						return match1 + "I" + match2
					}
				})
				// Default: just replace it with the indicated replacement
			} else {
				input = input.replace(expression, replacement)
			}

			// Check whether anything was changed
			if (input === originalInput){
				return null
			} else {
				// Return a dictionary with the reasoning for the fix and what is edited (used later to prevent duplicates in the edit summary)
				return {
					reason: reasoning,
					fixed: input
				}
			}
		} else {
			// If nothing needs to be fixed, return null
			return null
		}
	}

	// Omit code
	function omitCode(str, type){
		str = str.replace(App.globals.checks[type], function(match){
			App.globals.replacedStrings[type].push(match)
			return App.globals.placeHolders[type]
		})
		return str
	}

	// Replace code
	function replaceCode (str, type){
		for (var i = 0; i < App.globals.replacedStrings[type].length; i++){
			str = str.replace(App.globals.placeHolders[type],
							  App.globals.replacedStrings[type][i])
		}
		return str
	}

	// Populate or refresh DOM selections
	function popSelections(){
		App.selections.bodyBox = $('#wmd-input-' + App.globals.postId)
		App.selections.titleBox = $(".js-post-title-field")
		App.selections.summaryBox = $('.js-post-edit-comment-field')
		App.selections.tagField = $($(".tag-editor")[0])
	}

	// Populate edit item sets from DOM selections
	function popItems(){
		App.items[0] = {
			title: App.selections.titleBox?App.selections.titleBox.val():'',
			body: App.selections.bodyBox.val(),
			summary: ''
		}
	}

	// Figure out the last selected element before pressing the button so we can return there after focusing the summary field
	function setLastFocus(){
		App.selections.titleBox.click(function(){
			App.globals.lastSelectedElement = $(this)
		})

		App.selections.bodyBox.click(function(){
			App.globals.lastSelectedElement = $(this)
		})

		App.selections.summaryBox.click(function(){
			App.globals.lastSelectedElement = $(this)
		})

		App.selections.tagField.click(function(){
			App.globals.lastSelectedElement = $(this)
		})
	}

	// Handle pipe output
	function output(data){
		if (!App.selections.bodyBox) return

		if (App.selections.titleBox) App.selections.titleBox.val(data[0].title)
		App.selections.bodyBox.val(data[0].body)

		if (App.selections.summaryBox.val()){
			data[0].summary = " " + data[0].summary; // Add a leading space if there's something already in the box
		}
		App.selections.summaryBox.val(App.selections.summaryBox.val() + data[0].summary)

		App.globals.infoContent = App.globals.editCount + ' changes made'
		App.selections.bodyBox[0].dispatchEvent(new Event('keypress', {which:17}))
		if (App.globals.lastSelectedElement) App.globals.lastSelectedElement.focus()
	}

	// Pipe data through modules in proper order, returning the result
	App.pipe = function(data, mods, order){
		for (var i=0; i<order.length; i++){
			data = mods[order[i]](data)
		}
		output(data)
	}

	App.globals.pipeMods.omit = function(data){
		data[0].body = omitCode(data[0].body, "block")
		data[0].body = omitCode(data[0].body, "inline")
		return data
	}

	App.globals.pipeMods.replace = function(data){
		data[0].body = replaceCode(data[0].body, "block")
		data[0].body = replaceCode(data[0].body, "inline")
		return data
	}

	App.globals.pipeMods.edit = function(data){
		// Visually confirm edit - SE makes it easy because the jQuery color animation plugin seems to be there by default
		if(App.selections.bodyBox){
			App.selections.bodyBox.animate({
				backgroundColor: '#c8ffa7'
			}, 10)
			App.selections.bodyBox.animate({
				backgroundColor: '#fff'
			}, 1000)
		}

		// Loop through all editing rules
		for (var j=0; j<editRules.length; j++){
			var fix = fixIt(data[0].body, editRules[j].expr, editRules[j].replacement, editRules[j].reason)
			if (fix){
				if (fix.reason) App.globals.reasons[fix.reason] = 1
				data[0].body = fix.fixed
				App.globals.numReasons++
				editRules[j].fixed = true
			}

			// Check title
			fix = fixIt(data[0].title, editRules[j].expr,	editRules[j].replacement, editRules[j].reason)
			if (fix){
				data[0].title = fix.fixed
				if (!editRules[j].fixed){
				if (fix.reason) App.globals.reasons[fix.reason] = 1
					App.globals.numReasons++
					editRules[j].fixed = true
				}
			}
		}

		$.each(App.globals.reasons, function (reason) {
			// Check that summary is not getting too long
			if (data[0].summary.length < 200){

				if (data[0].summary.length){
					data[0].summary += "; " + reason
				} else {
					// Capitalize first letter
					data[0].summary += reason[0].toUpperCase() + reason.substring(1)
				}
			}
		})

		return data
	}

	setInterval(function(){
		// Continually monitor for newly created editing widgets
		$('.wmd-button-bar').each(function(){
			// If this edit widget doesn't already have our button
			if (!$(this).find('.toolkitfix').length){
				// Create and add the button
				var button = $('<li class="wmd-button toolkitfix" title="Auto edit">').click(function(e){
					e.preventDefault()
					App.selections.buttonBar = $(this).parents('.wmd-button-bar')
					App.globals.postId = App.selections.buttonBar.attr('id').match(/[0-9]+/)[0]
					console.log(App.globals.postId)
					popSelections()
					popItems()
					setLastFocus()
					popItems()
					App.pipe(App.items, App.globals.pipeMods, App.globals.order)
					App.globals.editsMade = true
				})
				$(this).find('.wmd-spacer').last().before(button)
			}
		})
	},200)

	function runTests(){
		console.log("RUNNING TESTS")

		var compareEdits = [
			//{ input: 'Lorum ipsum. Hope it helps!', expected: 'Lorum ipsum.', desc: 'Remove "hope it helps"' },
			{ input: 'Hello! Lorum ipsum.', expected: 'Lorum ipsum.', desc: 'Remove greeting' },
			{ input: 'http://mydomain.com/', expected: 'http://mydomain.example/', desc: 'Example domain' },
			{ input: 'Visit site.tld', expected: 'Visit site.example', desc: 'Example domain' },
			{ input: '`ourhome.net`', expected: '`ourhome.example`', desc: 'Example domain' },
			{ input: 'Dont you?', expected: 'Don\'t you?', desc: 'Contraction' },
			{ input: 'I dont.', expected: 'I don\'t.', desc: 'Contraction' },
			{ input: 'Hello guys , good afternoon. Lorum ipsum', expected: 'Lorum ipsum', desc: 'Greeting' },
		]

		var compareNoEdits = [
			{ input: 'I am using git://github.com/foo/bar.git to work.', expected: 'I am using git://github.com/foo/bar.git to work.', desc: 'git URLs' },
			{ input: 'See foo.html here', expected: 'See foo.html here', desc: '.html suffix' },
			{ input: 'Send IM to', expected: 'Send IM to', desc: 'IM all caps instant message' },
		]

		// Add additional combinations to test here:
		var combos = [
			{ in: ['Javascript', 'Java script', 'java script', 'javascript', 'Java Script'], out: 'JavaScript'},
			{ in: ['Stackexchange', 'Stack exchange', 'stack exchange', 'StackExchange', 'stackexchange', 'SE'], out: 'Stack Exchange'},
			{ in: ['Stackoverflow', 'Stack overflow', 'stack overflow', 'StackOverflow', 'stackoverflow', 'SO'], out: 'Stack Overflow'},
			{ in: ['ajax'], out: 'AJAX'},
			{ in: ['android'], out: 'Android'},
			{ in: ['angularjs', 'Angularjs', 'angularJs', 'angularJS', 'AngularJs'], out: 'AngularJS'},
			{ in: ['apache', 'Apache', 'APACHE'], out: 'Apache'},
			{ in: ['c#'], out: 'C#'},
			{ in: ['c+'], out: 'C+'},
			{ in: ['c++'], out: 'C++'},
			{ in: ['css', 'Css'], out: 'CSS'},
			{ in: ['git', 'GIT'], out: 'Git'},
			{ in: ['github', 'GITHUB', 'Github'], out: 'GitHub'},
			{ in: ['google', 'gOOgle', 'GOOGLE'], out: 'Google'},
			{ in: ['hdd', 'Hdd', 'HDD', 'harddisk', 'Harddisk', 'HardDisk', 'HARDDISK'], out: 'hard disk'},
			{ in: ['html', 'Html'], out: 'HTML'},
			{ in: ['html5', 'Html5'], out: 'HTML5'},
			{ in: ['ios', 'iOs', 'ioS', 'IOS', 'Ios', 'IoS'], out: 'iOS'},
			{ in: ['ios8', 'iOs8', 'ioS8', 'IOS8', 'Ios8', 'IoS8'], out: 'iOS 8'},
			{ in: ["i'm","im"], out: "I'm"},
			{ in: ['java'], out: 'Java'},
			{ in: ['jquery', 'Jquery', 'JQuery', 'jQuery'], out: 'jQuery'},
			{ in: ['jsfiddle', 'Jsfiddle', 'JsFiddle', 'JSfiddle', 'jsFiddle', 'JS Fiddle', 'js fiddle'], out: 'JSFiddle'},
			{ in: ['json', 'Json'], out: 'JSON'},
			{ in: ['linux'], out: 'Linux'},
			{ in: ['mysql', 'mySql', 'MySql', 'mySQL', 'MYSQL'], out: 'MySQL'},
			{ in: ['oracle'], out: 'Oracle'},
			{ in: ['php', 'Php'], out: 'PHP'},
			{ in: ['sql', 'Sql'], out: 'SQL'},
			{ in: ['sqlite', 'Sqlite'], out: 'SQLite'},
			{ in: ['sqlite3', 'Sqlite3'], out: 'SQLite3'},
			{ in: ['ubunto', 'ubunut', 'ubunutu', 'ubunu', 'ubntu', 'ubutnu', 'ubantoo', 'ubantooo', 'unbuntu', 'ubunt', 'ubutu'], out: 'Ubuntu'},
			{ in: ['win 7', 'WIN 7', 'windows 7', 'WINDOWS 7'], out: 'Windows 7'},
			{ in: ['win 95', 'windows 95', 'WIN 95', 'WINDOWS 95'], out: 'Windows 95'},
			{ in: ['win vista', 'WIN VISTA', 'windows vista', 'windows VISTA'], out: 'Windows Vista'},
			{ in: ['win xp', 'WIN XP', 'windows xp', 'windows XP'], out: 'Windows XP'},
			{ in: ['wordpress', 'Wordpress'], out: 'WordPress'},
		]

		function addOneComparison(collection, item, word, desc){
			collection.push({
				input: 'I am using ' + word + ' to work.',
				expected: 'I am using ' + item.out + ' to work.',
				desc: desc + item.out
			 })

			collection.push({
				input: 'I am using ' + word + '.',
				expected: 'I am using ' + item.out + '.',
				desc: desc + item.out + ' at the end of a sentence'
			 })
		}

		function addComparisons (item){
			item.in.forEach(function (word){
				addOneComparison(compareEdits, item, word, word + '/')
			})

			addOneComparison(compareNoEdits, item, item.out, 'false positive for ')

			if (item.exclude){
				item.exclude.forEach(function (word){
					addOneComparison(compareNoEdits, item, word, word + '/')
				})
			}
		}

		combos.forEach(function (item){
			addComparisons(item)
		})

		function expectEql(actual, expected){
			if (actual != expected){
				console.log("Actual: '" + actual + "' Expected: '" + expected + "'");
			}
		}

		function compareOne (item, attribute){
			App.globals.reasons = {}
			var data = [{
				body: '',
				title: '',
				summary: ''
			}]

			data[0][attribute] = item.input
			App.globals.pipeMods.edit(data)
			expectEql(data[0][attribute], item.expected)
		}

		function compareOneExclusion (item, attribute){
			App.globals.reasons = {}
			var data = [{
				body: '',
				title: '',
				summary: ''
			}]

			data[0][attribute] = item.input
			App.globals.pipeMods.edit(data)
			expectEql(data[0][attribute], item.expected)
			expectEql(data[0].summary, '')
		}

		compareEdits.forEach(function (item){
			compareOne(item, 'body')
			compareOne(item, 'title')
		})

		compareNoEdits.forEach(function (item){
			compareOneExclusion(item, 'body')
			compareOneExclusion(item, 'title')
		})
	}
	runTests()
})()
