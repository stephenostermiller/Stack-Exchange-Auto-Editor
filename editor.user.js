// ==UserScript==
// @name           Stack-Exchange-Editor-Toolkit
// @author         Cameron Bernhardt (AstroCB)
// @developer      Jonathan Todd (jt0dd)
// @developer      sathyabhat
// @contributor    Unihedron
// @license        MIT
// @namespace      http://github.com/AstroCB
// @version        1.5.2
// @description    Fix common grammar/usage annoyances on Stack Exchange posts with a click
// @match          *://*.stackexchange.com/questions/*
// @match          *://stackoverflow.com/questions/*
// @match          *://stackoverflow.com/review/helper/*
// @match          *://meta.stackoverflow.com/questions/*
// @match          *://serverfault.com/questions/*
// @match          *://meta.serverfault.com/questions/*
// @match          *://superuser.com/questions/*
// @match          *://meta.superuser.com/questions/*
// @match          *://askubuntu.com/questions/*
// @match          *://meta.askubuntu.com/questions/*
// @match          *://stackapps.com/questions/*
// @match          *://*.stackexchange.com/posts/*
// @match          *://stackoverflow.com/posts/*
// @match          *://meta.stackoverflow.com/posts/*
// @match          *://serverfault.com/posts/*
// @match          *://meta.serverfault.com/posts/*
// @match          *://superuser.com/posts/*
// @match          *://meta.superuser.com/posts/*
// @match          *://askubuntu.com/posts/*
// @match          *://meta.askubuntu.com/posts/*
// @match          *://stackapps.com/posts/*
// @exclude        *://*.stackexchange.com/questions/tagged/*
// @exclude        *://stackoverflow.com/questions/tagged/*
// @exclude        *://meta.stackoverflow.com/questions/tagged/*
// @exclude        *://serverfault.com/questions/tagged/*
// @exclude        *://meta.serverfault.com/questions/*
// @exclude        *://superuser.com/questions/tagged/*
// @exclude        *://meta.superuser.com/questions/tagged/*
// @exclude        *://askubuntu.com/questions/tagged/*
// @exclude        *://meta.askubuntu.com/questions/tagged/*
// @exclude        *://stackapps.com/questions/tagged/*
// @grant          GM_addStyle
// ==/UserScript==
(function(){
	GM_addStyle(`
		#toolkitfix{margin-left:0.5em;background:url("//i.imgur.com/79qYzkQ.png") center / contain no-repeat}
		#toolkitfix:hover{background-image:url("//i.imgur.com/d5ZL09o.png")}
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

	// Place "helper" functions here
	App.funcs = {}

	//Preload icon alt
	new Image().src = '//i.imgur.com/79qYzkQ.png'
	new Image().src = '//i.imgur.com/d5ZL09o.png'

	// Populate global data
	// Get url for question id used in id and class names
	App.globals.URL = window.location.href

	// Get question num from URL
	App.globals.questionNum = App.globals.URL.match(/\/(\d+)\//g)
	if (App.globals.questionNum){
		App.globals.questionNum = App.globals.questionNum[0].split("/").join("")
	}

	// Define variables for later use
	App.globals.barReady = false
	App.globals.editsMade = false
	App.globals.editCount = 0
	App.globals.infoContent = ''

	App.globals.buttonFix = $('<li class=wmd-button id=toolkitfix title="Auto edit"></li>').click(function(e){
		e.preventDefault()
		if (!App.globals.editsMade){
			// Refresh item population
			App.funcs.popItems()

			// Pipe data through editing modules
			App.pipe(App.items, App.globals.pipeMods, App.globals.order)
			App.globals.editsMade = true
		}
	})

	App.globals.reasons = []
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

	function capitalizeWord(word, re){
		if (!re) re = word
		re = re.replace(/ /g, "\\s*")
		re = re.replace(/([a-z])([A-Z])/g, "$1\\s*$2")
		return {
			expr: new RegExp("(^|\\s)(?:"+re+")\\b(\\S|)(?!\\S)","igm"),
			replacement: "$1"+word+"$2",
			reason: "capitalize " + word
		}
	}

	function capitalizeWordAndVersion(word, re, separator){
		if (!separator) separator = ""
		if (!re) re = word
		re = re.replace(/ /g, "\\s*")
		re = re.replace(/([a-z])([A-Z])/g, "$1\\s*$2")
		return {
			expr: new RegExp("(^|\\s)(?:"+re+")"+(separator==" "?"\\s+":"")+"([0-9]+)\\b(\\S|)(?!\\S)","igm"),
			replacement: "$1"+word+separator+"$2$3",
			reason: "capitalize " + word
		}
	}

	// Define edit rules
	App.edits = {
		expansionSO: {
			expr: /(^|\s)SO(\s|,|\.|!|\?|;|\/|\)|$)/gm,
			replacement: "$1Stack Overflow$2",
			reason: "'SO' expansion"
		},
		expansionSE: {
			expr: /(^|\s)SE(\s|,|\.|!|\?|;|\/|\)|$)/gm,
			replacement: "$1Stack Exchange$2",
			reason: "'SE' expansion"
		},
		caps: {
			expr: /^(?!https?)([a-z])/gm,
			replacement: "$1",
			reason: "copy edited"
		},
		thanks: {
			expr: /(thanks|pl(?:ease|z|s)\s+h[ea]lp|cheers|regards|thx|thank\s+you|my\s+first\s+question|kindly\shelp).*$/gmi,
			replacement: "",
			reason: "'$1' is unnecessary noise"
		},
		commas: {
			expr: /,([^\s])/g,
			replacement: ", $1",
			reason: "punctuation & spacing"
		},
		hello: {
			expr: /(?:^|\s)(?:greetings|cheers|hi|hello|good\s(?:evening|morning|day|afternoon))(?:\s+(?:guys|folks|everybody|everyone))?[\.\!\,](?:\s+|$)/gmi,
			replacement: "",
			reason: "Remove greeting"
		},
		edit: {
			expr: /(?:^\**)(edit|update):?(?:\**):?/gmi,
			replacement: "",
			reason: "Stack Exchange has an advanced revision history system: 'Edit' or 'Update' is unnecessary"
		},
		exampleDom1: {
			expr: /\b((?:my|your|our|new|old|foo|client)[a-z]*)\.(?:com|net|org|tld|(?:(?:co\.)?[a-z]{2}))\b/g,
			replacement: "$1.example",
			reason: "approved example domain"
		},
		exampleDom2: {
			expr: /\b([a-z]*(?:site|domain|page|sample|test))\.(?:com|net|org|tld|(?:(?:co\.)?[a-z]{2}))\b/g,
			replacement: "$1.example",
			reason: "approved example domain"
		},
		c: {
			expr: /(^|\s)c(#|\++|\s|$)/gm,
			replacement: "$1C$2",
			reason: "C$2 is the proper capitalization"
		},
		im: {
			expr: /(^|\s)[Ii]'?m\b(\S|)(?!\S)/gm,
			replacement: "$1I'm$2",
			reason: "capitalize I'm"
		},
		apostrophes: {
			expr: /(^|\s)(can|doesn|don|won|hasn|isn|didn)t\b(\S|)(?!\S)/gmi,
			replacement: "$1$2't$3",
			reason: "English contractions use apostrophes"
		},
		ios: {
			expr: /\b(?:ios|iOs|ioS|IOS|Ios|IoS|ioS)\b(\S|)(?!\S)/gm,
			replacement: "iOS$1",
			reason: "the proper usage is 'iOS'"
		},
		iosnum: {
			expr: /\b(?:ios|iOs|ioS|IOS|Ios|IoS|ioS)([0-9]?)\b(\S|)(?!\S)/gm,
			replacement: "iOS $1$2",
			reason: "the proper usage is 'iOS' followed by a space and the version number"
		},
		caps: {
			expr: /^((?=.*[A-Z])[^a-z]*)$/g,
			replacement: "$1",
			reason: "no need to yell"
		},
		harddisk: {
			expr: /(hdd|harddisk)\b(\S|)(?!\S)/igm,
			replacement: "hard disk$2",
			reason: "Hard disk is the proper usage"
		},
		ajax: capitalizeWord("AJAX"),
		android: capitalizeWord("Android"),
		angular: capitalizeWord("AngularJS"),
		apache: capitalizeWord("Apache"),
		api: capitalizeWord("API"),
		css: capitalizeWord("CSS"),
		git: capitalizeWord("Git"),
		github: capitalizeWord("GitHub"),
		google: capitalizeWord("Google"),
		html: capitalizeWord("HTML"),
		htmlfive: capitalizeWord("HTML5"),
		i: capitalizeWord("I"),
		java: capitalizeWord("Java"),
		javascript: capitalizeWord("JavaScript"),
		jquery: capitalizeWord("jQuery"),
		jsfiddle: capitalizeWord("JSFiddle", "js\\s*fiddle"),
		json: capitalizeWord("JSON"),
		linux: capitalizeWord("Linux"),
		mysql: capitalizeWord("MySQL"),
		oracle: capitalizeWord("Oracle"),
		php: capitalizeWord("PHP"),
		se: capitalizeWord("Stack Exchange"),
		so: capitalizeWord("Stack Overflow"),
		sql: capitalizeWord("SQL"),
		sqlite: capitalizeWord("SQLite"),
		sqliteVersion: capitalizeWordAndVersion("SQLite"),
		ubuntu: capitalizeWord("Ubuntu","ubunt[ou]*|ubunut[ou]*|ubun[ou]+|ubnt[ou]+|ubutn[ou]*|ubant[ou]*|unbunt[ou]*|ubunt|ubut[ou]+"),
		uri: capitalizeWord("URI"),
		url: capitalizeWord("URL"),
		windows: capitalizeWord("Windows"),
		windowsVersion: capitalizeWordAndVersion("Windows", "win|windows", " "),
		windowsVista: capitalizeWord("Windows Vista","(?:win|windows)\\s*vista"),
		windowsXP: capitalizeWord("Windows XP", "(?:win|windows)\\s*xp"),
		wordpress: capitalizeWord("WordPress")
	}

	// Populate funcs
	App.popFuncs = function(){
		// This is where the magic happens: this function takes a few pieces of information and applies edits to the post with a couple exceptions
		App.funcs.fixIt = function(input, expression, replacement, reasoning){
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
		App.funcs.omitCode = function(str, type){
			str = str.replace(App.globals.checks[type], function(match){
				App.globals.replacedStrings[type].push(match)
				return App.globals.placeHolders[type]
			})
			return str
		}

		// Replace code
		App.funcs.replaceCode = function(str, type){
			for (var i = 0; i < App.globals.replacedStrings[type].length; i++){
				str = str.replace(App.globals.placeHolders[type],
					App.globals.replacedStrings[type][i])
			}
			return str
		}

		// Eliminate duplicates in array (awesome method I found on SO, check it out!)
		// From AstroCB: the original structure of the edit formation prevents duplicates.
		// Unless you changed that structure somehow, this shouldn't be needed.
		App.funcs.eliminateDuplicates = function(arr){
			var i, len = arr.length,
				out = [],
				obj = {}

			for (i = 0; i < len; i++){
				obj[arr[i]] = 0
			}
			for (i in obj){
				if (obj.hasOwnProperty(i)){ // Prevents messiness of for..in statements
					out.push(i)
				}
			}
			return out
		}

		// Wait for relevant dynamic content to finish loading
		App.funcs.dynamicDelay = function(callback, id, inline){
			setTimeout(function(){
				App.selections.buttonBar = $('#wmd-button-bar-' + id)
				App.selections.buttonBar.unbind()
				setTimeout(function(){
					callback()
				}, 0)
			}, 500)
		}

		// Populate or refresh DOM selections
		App.funcs.popSelections = function(){
			App.selections.redoButton = $('#wmd-redo-button-' + App.globals.questionNum)
			App.selections.bodyBox = $(".js-post-body-field")
			App.selections.titleBox = $(".js-post-title-field")
			App.selections.summaryBox = $('.js-post-edit-comment-field')
			App.selections.tagField = $($(".tag-editor")[0])
		}

		// Populate edit item sets from DOM selections
		App.funcs.popItems = function(){
			App.items[0] = {
				title: App.selections.titleBox.val(),
				body: App.selections.bodyBox.val(),
				summary: ''
			}
		}

		// Insert editing button(s)
		App.funcs.createButton = function(){
			// Insert button
			App.selections.redoButton.after(App.globals.buttonFix)
		}

		// Figure out the last selected element before pressing the button so we can return there after focusing the summary field
		App.funcs.setLastFocus = function(){
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
		App.funcs.output = function(data){
			App.selections.titleBox.val(data[0].title)
			App.selections.bodyBox.val(data[0].body)

			if (App.selections.summaryBox.val()){
				data[0].summary = " " + data[0].summary; // Add a leading space if there's something already in the box
			}
			App.selections.summaryBox.val(App.selections.summaryBox.val() + data[0].summary)

			// Update the comment: focusing on the input field to remove placeholder text, but scroll back to the user's original location
			App.globals.currentPos = document.body.scrollTop
			if ($("#wmd-input")){
				$("#wmd-input").focus()
				$("#edit-comment").focus()
				$("#wmd-input").focus()
			} else {
				$(".wmd-input")[0].focus()
				$(".edit-comment")[0].focus()
				$(".wmd-input")[0].focus()
			}

			window.scrollTo(0, App.globals.currentPos)
			App.globals.infoContent = App.globals.editCount + ' changes made'
		}
	}

	// Pipe data through modules in proper order, returning the result
	App.pipe = function(data, mods, order){
		var modName
		for (var i in order){
			if (order.hasOwnProperty(i)){
				modName = order[i]
				data = mods[modName](data)
			}
		}
		App.funcs.output(data)
	}

	// Init app
	App.init = function(inline, targetID){
		// Check if there was an ID passed (if not, use question ID from URL)
		if (!targetID){
			targetID = App.globals.questionNum
		}

		App.popFuncs()
		App.funcs.dynamicDelay(function(){
			App.funcs.popSelections()
			App.funcs.createButton()
			App.funcs.popItems()
			App.funcs.setLastFocus()
		}, targetID, inline)
	}

	App.globals.pipeMods.omit = function(data){
		data[0].body = App.funcs.omitCode(data[0].body, "block")
		data[0].body = App.funcs.omitCode(data[0].body, "inline")
		return data
	}

	App.globals.pipeMods.replace = function(data){
		data[0].body = App.funcs.replaceCode(data[0].body, "block")
		data[0].body = App.funcs.replaceCode(data[0].body, "inline")
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
		for (var j in App.edits){
			if (App.edits.hasOwnProperty(j)){
				// Check body
				var fix = App.funcs.fixIt(data[0].body, App.edits[j].expr,
					App.edits[j].replacement, App.edits[j].reason)
				if (fix){
					App.globals.reasons[App.globals.numReasons] = fix.reason
					data[0].body = fix.fixed
					App.globals.numReasons++
					App.edits[j].fixed = true
				}

				// Check title
				fix = App.funcs.fixIt(data[0].title, App.edits[j].expr,
					App.edits[j].replacement, App.edits[j].reason)
				if (fix){
					data[0].title = fix.fixed
					if (!App.edits[j].fixed){
						App.globals.reasons[App.globals.numReasons] =
							fix.reason
						App.globals.numReasons++
						App.edits[j].fixed = true
					}
				}
			}
			// Quickly focus the summary field to show generated edit summary, and then jump back
			if (App.selections.summaryBox) App.selections.summaryBox.focus()

			// Asynchronous to get in both focuses
			setTimeout(function(){
				if (App.globals.lastSelectedElement){
					App.globals.lastSelectedElement.focus()
				} else {
					window.scrollTo(0, 0)
				}
			}, 0)
		}

		// Eliminate duplicate reasons
		App.globals.reasons = App.funcs.eliminateDuplicates(App.globals.reasons)

		for (var z = 0; z < App.globals.reasons.length; z++){
			// Check that summary is not getting too long
			if (data[0].summary.length < 200){

				// Capitalize first letter
				if (z === 0){
					data[0].summary += App.globals.reasons[z][0].toUpperCase() +
						App.globals.reasons[z].substring(1)

					// Post rest of reasons normally
				} else {
					data[0].summary += App.globals.reasons[z]
				}

				// Not the last reason
				if (z !== App.globals.reasons.length - 1){
					data[0].summary += "; "

					// If at end, punctuate
				} else {
					data[0].summary += "."
				}
			}
		}

		return data
	}

	if ($(".js-edit-post")[0]){ // User has editing privileges; wait until edit link is used
		$(".js-edit-post").click(function(e){
			App.init(true, e.target.href.match(/\d+/g))
		})
	} else if ($(".reviewable-post")[0]){ // H&I review queue
		App.globals.questionNum = $(".reviewable-post")[0].getAttribute("class").match(/\d+/g)
		$($(".review-actions")[0].children[0]).click(function(e){
			App.init(true, App.globals.questionNum)
		})
	}

	function runTests(){
		console.log("RUNNING TESTS")

		App.init(false)

		var compareEdits = [
			//{ input: 'Lorum ipsum. Hope it helps!', expected: 'Lorum ipsum.', desc: 'Remove "hope it helps"' },
			{ input: 'Hello! Lorum ipsum.', expected: 'Lorum ipsum.', desc: 'Remove greeting' },
			{ input: 'http://mydomain.com/', expected: 'http://mydomain.example/', desc: 'Example domain' },
			{ input: 'visit site.tld', expected: 'visit site.example', desc: 'Example domain' },
			{ input: '`ourhome.net`', expected: '`ourhome.example`', desc: 'Example domain' },
			{ input: 'Dont you?', expected: 'Don\'t you?', desc: 'Contraction' },
			{ input: 'I dont.', expected: 'I don\'t.', desc: 'Contraction' },
		]

		var compareNoEdits = [
			{ input: 'I am using git://github.com/foo/bar.git to work.', expected: 'I am using git://github.com/foo/bar.git to work.', desc: 'git URLs' },
			{ input: 'a foo.html b', expected: 'a foo.html b', desc: '.html suffix' },
			{ input: 'send IM to', expected: 'send IM to', desc: 'IM all caps instant message' },
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
			App.globals.reasons = []
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
			App.globals.reasons = []
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
