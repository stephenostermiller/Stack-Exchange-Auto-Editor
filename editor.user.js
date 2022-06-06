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
			reason: "Remove niceties"
		},{
			expr: /(?:(?:^|\s)(?:greetings|cheers|hi|hello|good\s(?:evening|morning|day|afternoon))(?:\s+(?:guys|folks|everybody|everyone))?\s*[\.\!\,]?)+(?:\s+|$)/gmi,
			replacement: "",
			reason: "Remove niceties"
		},{
			expr: /(?:^\**)(edit|update):?(?:\**):?/gmi,
			replacement: "",
			reason: "Remove edit indicator"
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
			// No lower case at all
			expr: /^((?=.*[A-Z])[^a-z]*)$/g,
			replacement: (function(d, m){
				return m[0] + m.substring(1).toLowerCase()
			}),
			reason: "Use mixed case"
		},{
			expr: /(hdd|harddisk)\b(\S|)(?!\S)/igm,
			replacement: "hard disk$2",
			reason: "Spelling"
		},{
			// Insert spaces after commas
			expr: /,([^\s])/g,
			replacement: ", $1",
			reason: "Grammar"
		},{
			// Remove spaces before punctuation
			expr: /[ ]+([,\!\?\.\:])/g,
			replacement: "$1",
			reason: "Grammar"
		},{
			expr: /\[enter image description here\]/g,
			replacement: "[]",
			reason: "Remove default alt text"
		},{
			// Capitalize first letter of each line
			expr: /^([a-z])/g,
			replacement: (function(d, m){
				return m.toUpperCase()
			}),
			reason: "Capitalization"
		}
	]

	// Create a rule for expanding the given abbreviation with the given replacement
	// Rule will not be case sensitive, so abbrev should be all caps
	function expandAbbrev(abbrev, replace){
		return {
			expr: new RegExp("(^|\\s)(?:"+abbrev+")\\b(\\S|)(?!\\S)","gm"),
			replacement: "$1"+replace+"$2",
			reason: "Spelling"
		}
	}

	// Create a rule for converting the given word into its exact given case.
	// The regex parameter is optional, if none is given, it is auto-created from the word
	// The auto created regex inserts white space for camel case words, a custom regex
	// should be created if other white space removal desired
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

	// Create a rule for word capitalization same as above, but followed by 
	// a numeric version. The separator can be used to Specify whether or 
	// not a space in included in the output: FooBar8 vs FooBar 8
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

	// Replace chunks where replacements shouldn't be made with a placeholder
	// And record removed blocks in a list so they can be reinserted later
	function omitCode(str){
		str = str.replace(new RegExp("(?:" +[
			/^(?: {0,3}>)*    .*(?:[\r\n]+(?: {0,3}>)*    .*)*/, // 4 space indented code block (also handles code in > blockquote)
			/`[^`]+`/, // backtick inline code
			/<\s*pre(?:\s[^>]*)?>[\s\S]*?<\s*\/\s*pre\s*>/, // HTML pre tags
			/<\s*code(?:\s[^>]*)?>[\s\S]*?<\s*\/\s*code\s*>/, // HTML code tags
			/<[^>]+>/, // Other HTML tags
			/`{3}[^`][\s\S]*?`{3}/, // 3 backtick code fence
			/`{4}[^`][\s\S]*?`{4}/, // 4 backtick code fence
			/`{5}[^`][\s\S]*?`{5}/,
			/`{6}[^`][\s\S]*?`{6}/,
			/`{7}[^`][\s\S]*?`{7}/,
			/`{8}[^`][\s\S]*?`{8}/,
			/`{9}[^`][\s\S]*?`{9}/,
			/`{10}[^`][\s\S]*?`{10}/,
			/~{3}[^~][\s\S]*?~{3}/, // 3 tilde code fence
			/~{4}[^~][\s\S]*?~{4}/, // 4 tilde code fence
			/~{5}[^~][\s\S]*?~{5}/,
			/~{6}[^~][\s\S]*?~{6}/,
			/~{7}[^~][\s\S]*?~{7}/,
			/~{8}[^~][\s\S]*?~{8}/,
			/~{9}[^~][\s\S]*?~{9}/,
			/~{10}[^~][\s\S]*?~{10}/ // Arbitrarily large code fences are possible, but have to stop somewhere
			// Combine all the above into a single massive regex With "or" between each piece
		].map(function(r) {return r.source}).join(')|(?:') + ")","gm"), function(match){
			replacedStrings.push(match)
			return placeHolder
		})
		return str
	}

	// Fill placeholders back in with their respective code snippets
	function replaceCode(str){
		for (var i = 0; i < replacedStrings.length; i++){
			str = str.replace(placeHolder, replacedStrings[i])
		}
		return str
	}

	// Access to jQuery via dollar sign variable
	var $ = unsafeWindow.jQuery

	//Preload icon alt
	new Image().src = '//i.imgur.com/79qYzkQ.png'
	new Image().src = '//i.imgur.com/d5ZL09o.png'

	const placeHolder = "_xCodexBlockxPlacexHolderx_"

	var editCount = 0, reasons = {}, replacedStrings = [],
		postId, bodyBox, titleBox, summaryBox, buttonBar

	function fixIt(input, expression, replacement, reason){
		if (!input) return
		var match = input.search(expression)
		if (match == -1) return // Nothing matched
		var output = input.replace(expression, replacement)
		if (output === input) return // Nothing was changed
		editCount++
		return {
			reason: reason,
			output: output
		}
	}

	function output(data){
		if (!bodyBox) return

		// Visually confirm edit - SE makes it easy because the jQuery color animation plugin seems to be there by default
		bodyBox.animate({
			// Flash red or green depending on whether edits were made
			backgroundColor: editCount==0?'#ffc8a7':'#c8ffa7'
		}, 10)
		bodyBox.animate({
			// Then back to white
			backgroundColor: '#fff'
		}, 1000)

		if (titleBox) titleBox.val(data.title)
		bodyBox.val(data.body)

		if (summaryBox.val()){
			data.summary = " " + data.summary; // Add a leading space if there's something already in the box
		}
		summaryBox.val(summaryBox.val() + data.summary)

		// Dispatching a keypress to the edit body box causes stack exchange to reparse the markdown out of it
		bodyBox[0].dispatchEvent(new Event('keypress'))
	}

	function edit(data){
		data.body = omitCode(data.body)
		// Loop through all editing rules
		$.each(editRules, function(x, rule){
			// Fix both the title and the body
			$.each(["title","body"], function(x, type){
				var fix = fixIt(data[type], rule.expr, rule.replacement, rule.reason)
				if (fix){
					// Store reasons as hash keys in a map to prevent duplicates
					if (fix.reason) reasons[fix.reason] = 1
					data[type] = fix.output
				}
			})
		})

		// Create a summary of all the reasons
		$.each(reasons, function (reason) {
			if (!data.summary) data.summary = ''
			// Check that summary is not getting too long
			if (data.summary.length < 200){
				data.summary += (data.summary.length==0?"":"; ") + reason
			}
		})

		data.body = replaceCode(data.body)
		return data
	}

	// Button styling
	GM_addStyle(`
		.toolkitfix{margin-left:0.5em;background:url("//i.imgur.com/79qYzkQ.png") center / contain no-repeat}
		.toolkitfix:hover{background-image:url("//i.imgur.com/d5ZL09o.png")}
	`)

	// Continually monitor for newly created editing widgets
	setInterval(function(){
		$('.wmd-button-bar').each(function(){
			// If this edit widget doesn't already have our button
			if (!$(this).find('.toolkitfix').length){
				// Create and add the button
				var button = $('<li class="wmd-button toolkitfix" title="Auto edit">').click(function(e){
					// button was clicked, do all the replacements
					e.preventDefault()
					buttonBar = $(this).parents('.wmd-button-bar')
					postId = buttonBar.attr('id').match(/[0-9]+/)[0]
					reasons = {}
					replacedStrings = []
					editCount = 0
					bodyBox = $('#wmd-input-' + postId)
					titleBox = $(".js-post-title-field")
					summaryBox = $('.js-post-edit-comment-field')
					output(edit({
						title: titleBox?titleBox.val():'',
						body: bodyBox.val(),
						summary: ''
					}))
				})
				$(this).find('.wmd-spacer').last().before($('<li class=wmd-spacer>')).before(button)
			}
		})
	},200)

	function runTests(){
		console.log("RUNNING TESTS")

		function expectEql(actual, expected, input){
			if (actual != expected){
				console.log("Actual:\n" + actual + "\n\nExpected:\n" + expected + "" + (input?"\n\nInput:\n" + input:""));
			}
		}

		function testEdit(i, o){
			var data={body:i}
			if (!/[\r\n]/.exec(i)) data.title=i
			edit(data)
			expectEql(data.title, o, i)
			expectEql(data.body, o, i)
		}

		$.each([
			{i:'Lorum ipsum. Hope it helps!',o:'Lorum ipsum.'},
			{i:'Hello! Lorum ipsum.',o:'Lorum ipsum.'},
			{i:'Visit site.tld',o:'Visit site.example'},
			{i:'`ourhome.net`',o:'`ourhome.example`'},
			{i:'Hello guys , good afternoon. Lorum ipsum',o:'Lorum ipsum'},
			{i:'Lorum git://github.com/foo/bar.git ipsum.',o:'Lorum git://github.com/foo/bar.git ipsum.'},
			{i:'See foo.html here',o:'See foo.html here'},
			{i:'NO, NEED, TO+ YELL!',o:'No, need, to+ yell!'},
			{i:'first letter upper',o:'First letter upper'},
		], function(x,io){
			testEdit(io.i, io.o)
		})

		$.each([
			{i:[],o:'i.e.'},
			{i:[],o:'I.E.'},
			{i:[],o:"IM"},
			{i:['Javascript','Java script','java script','javascript','Java Script'],o:'JavaScript'},
			{i:['Stackexchange','Stack exchange','stack exchange','StackExchange','stackexchange','SE'],o:'Stack Exchange'},
			{i:['Stackoverflow','Stack overflow','stack overflow','StackOverflow','stackoverflow','SO'],o:'Stack Overflow'},
			{i:['ajax'],o:'AJAX'},
			{i:['android'],o:'Android'},
			{i:['angularjs','Angularjs','angularJs','angularJS','AngularJs'],o:'AngularJS'},
			{i:['apache','Apache','APACHE'],o:'Apache'},
			{i:['c#'],o:'C#'},
			{i:['c+'],o:'C+'},
			{i:['c++'],o:'C++'},
			{i:['css','Css'],o:'CSS'},
			{i:['dont'],o:'don\'t'},
			{i:['Dont'],o:'Don\'t'},
			{i:['git','GIT'],o:'Git'},
			{i:['github','GITHUB','Github'],o:'GitHub'},
			{i:['google','gOOgle','GOOGLE'],o:'Google'},
			{i:['hdd','Hdd','HDD','harddisk','Harddisk','HardDisk','HARDDISK'],o:'hard disk'},
			{i:['html','Html'],o:'HTML'},
			{i:['html5','Html5'],o:'HTML5'},
			{i:['http://mydomain.com/'],o:'http://mydomain.example/'},
			{i:['i'],o:'I'},
			{i:['ios','iOs','ioS','IOS','Ios','IoS'],o:'iOS'},
			{i:['ios8','iOs8','ioS8','IOS8','Ios8','IoS8',"ios 8"],o:'iOS 8'},
			{i:["i'm","im"],o:"I'm"},
			{i:['java'],o:'Java'},
			{i:['jquery','Jquery','JQuery','jQuery'],o:'jQuery'},
			{i:['jsfiddle','Jsfiddle','JsFiddle','JSfiddle','jsFiddle','JS Fiddle','js fiddle'],o:'JSFiddle'},
			{i:['json','Json'],o:'JSON'},
			{i:['linux'],o:'Linux'},
			{i:['mysql','mySql','MySql','mySQL','MYSQL'],o:'MySQL'},
			{i:['oracle'],o:'Oracle'},
			{i:['php','Php'],o:'PHP'},
			{i:['sql','Sql'],o:'SQL'},
			{i:['sqlite','Sqlite'],o:'SQLite'},
			{i:['sqlite3','Sqlite3'],o:'SQLite3'},
			{i:['ubunto','ubunut','ubunutu','ubunu','ubntu','ubutnu','ubantoo','ubantooo','unbuntu','ubunt','ubutu'],o:'Ubuntu'},
			{i:['win 7','WIN 7','windows 7','WINDOWS 7'],o:'Windows 7'},
			{i:['win 95','windows 95','WIN 95','WINDOWS 95'],o:'Windows 95'},
			{i:['win vista','WIN VISTA','windows vista','windows VISTA'],o:'Windows Vista'},
			{i:['win xp','WIN XP','windows xp','windows XP'],o:'Windows XP'},
			{i:['wordpress','Wordpress'],o:'WordPress'}
		], function(x, io){
			io.i.push(io.o)
			$.each(io.i, function(x,i){
				testEdit('Lorum ' + i + ' ipsum.', 'Lorum ' + io.o + ' ipsum.')
				testEdit('Lorum ipsum ' + i, 'Lorum ipsum ' + io.o)
				testEdit('Lorum ipsum ' + i + '.', 'Lorum ipsum ' + io.o + '.')
			})
		})

		$.each([
			{s:" ",c:"`code`"},
			{s:"\n",c:"    code"},
			{s:"\n",c:"    code\n    code\n    code"},
			{s:"\n",c:">    code"},
			{s:"\n",c:" >    code\n  >    code\n  >    code"},
			{s:"\n",c:">>    code"},
			{s:"\n",c:" > >    code\n  >  >    code\n   >   >    code"},
			{s:"\n",c:"```\ncode\n```"},
			{s:"\n",c:"````\ncode\n````"},
			{s:"\n",c:"`````\ncode\n`````"},
			{s:"\n",c:"``````\ncode\n``````"},
			{s:"\n",c:"~~~\ncode\n~~~"},
			{s:"\n",c:"~~~~\ncode\n~~~~"},
			{s:"\n",c:"~~~~~\ncode\n~~~~~"},
			{s:"\n",c:"~~~~~~\ncode\n~~~~~~"},
			{s:" ",c:"<pre>code\n</pre>"},
			{s:" ",c:"< pre id='foo'>code\n< / pre >"},
			{s:" ",c:"<code>code\n</code>"},
			{s:" ",c:"< code id='foo'>code\n< / code >"},
			{s:" ",c:"<p id=a>"},
			{s:" ",c:"</p>"},
			{s:" ",c:"<a href=foo>"}
		], function(i,t){
			i = "Lorum"+t.s+t.c+t.s+"ipsum"
			expectEql(omitCode(i), "Lorum"+t.s+placeHolder+t.s+"ipsum",i)
		})
	}
	runTests()
})()
