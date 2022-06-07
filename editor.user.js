// ==UserScript==
// @name Stack Exchange Auto Editor
// @author Stephen Ostermiller
// @author Cameron Bernhardt (AstroCB)
// @developer Jonathan Todd (jt0dd)
// @developer sathyabhat
// @contributor Unihedron
// @license MIT
// @namespace https://ostermiller.org/
// @version 1.0.0
// @description Fixes common grammar and usage mistakes on Stack Exchange posts with a click
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

    // Rules for making edits in code
    var editCodeRules = [
        {
			expr: /\b(?:((?:[a-z0-9\.\-]+\.)?[a-z0-9\-]+)example([a-z0-9\-]*))\.(?:com|net|org|tld|(?:(?:com?\.)?[a-z]{2}))(\s|\/|$|`)/gm,
			replacement: "$1$2.example$3",
			reason: "Use example domain"
		},{
			expr: /\b(?:([a-z0-9\-\.]*)example([a-z0-9\-]+))\.(?:com|net|org|tld|(?:(?:com?\.)?[a-z]{2}))(\s|\/|$|`)/gm,
			replacement: "$1$2.example$3",
			reason: "Use example domain"
		},{
			expr: /\b((?:my|your|our|new|old|foo|client)[a-z]*)\.(?:com|net|org|tld|(?:(?:com?\.)?[a-z]{2}))(\s|\/|$|`)/gm,
			replacement: "$1.example$2",
			reason: "Use example domain"
		},{
			expr: /\b([a-z]*(?:site|domain|page|sample|test))\.(?:com|net|org|tld|(?:(?:com?\.)?[a-z]{2}))(\s|\/|$|`)/gm,
			replacement: "$1.example$2",
			reason: "Use example domain"
		}
    ]

    // Rules for making edits in text (not code)
	var editRules = [
		{
			expr: /\b(https?)\s*:\s*\/\s*\/\s*([a-zA-Z0-9\-]+)\s*\./gi,
			replacement: "$1://$2.",
			reason: "Fix URL"
		},
        capitalizeWord("AngularJS"),
		capitalizeWord("GitHub"),
		capitalizeWord("iOS"),
		capitalizeWordAndVersion("iOS", null, " "),
		capitalizeWord("JavaScript"),
		capitalizeWord("jQuery"),
		capitalizeWord("JSFiddle", "js\\s*fiddle"),
		capitalizeWord("MySQL"),
		expandAbbrev("SE", "Stack Exchange"),
		expandAbbrev("SO", "Stack Overflow"),
		capitalizeWord("Stack Exchange"),
		capitalizeWord("Stack Overflow"),
		capitalizeWord("SQLite"),
		capitalizeWordAndVersion("SQLite"),
		capitalizeWord("Ubuntu","ubunt[ou]*|ubunut[ou]*|ubun[ou]+|ubnt[ou]+|ubutn[ou]*|ubant[ou]*|unbunt[ou]*|ubunt|ubut[ou]+"),
		capitalizeWordAndVersion("Windows", "win|windows", " "),
		capitalizeWord("Windows Vista","(?:win|windows)\\s*vista"),
		capitalizeWord("Windows XP", "(?:win|windows)\\s*xp"),
		capitalizeWord("WordPress"),
        {
			// Proper nouns
			expr: /(^|\s)(Android|Apache|Git|Google|Java|Linux|Oracle|Windows)\b(\S|)(?!\S)/igm,
			replacement: ($0,$1,$2,$3) => $1+$2[0].toUpperCase()+$2.substring(1).toLowerCase()+$3,
			reason: "Capitalization"
		},{
			// Always all caps
			expr: /(^|\s)(AJAX|API|CSS|HTTP|HTTPS|HTML|HTML5|I|JSON|PHP|SQL|SSL|TLS|URI|URL|XML)\b(\S|)(?!\S)/igm,
			replacement: ($0,$1,$2,$3) => $1+$2.toUpperCase()+$3,
			reason: "Capitalization"
		},{
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
		},
        editCodeRules[0],
        editCodeRules[1],
        editCodeRules[2],
        editCodeRules[3],
        {
			expr: /(^|\s)((?:(?:https?:\/\/)?(?:(?:[a-zA-Z\-\.]+\.)?example\.(?:com|net|org|tld|(?:(?:com?\.)?[a-z]{2}))|(?:[a-zA-Z\-\.]+\.example))(?:\/[^ ]*)?))(\s|$)/gmi,
			replacement: "$1`$2`$3",
			reason: "Code format example URL"
		},{
			expr: /(^|\s)c(#|\++|\s|$)/gm,
			replacement: "$1C$2",
			reason: "Spelling"
		},{
			expr: /(^|\s)[Ii]'?(m|ve)\b(\S|)(?!\S)/gm,
			replacement: "$1I'$2$3",
			reason: "Spelling"
		},{
			expr: /(^|\s)(arent|cant|couldnt|didnt|doesnt|dont|hadnt|hasnt|havent|hed|hes|isnt|mightnt|mustnt|shant|shes|shouldnt|thats|theres|theyd|theyll|theyre|theyve|weve|werent|whatll|whatre|whats|whatve|wheres|whod|wholl|whove|wont|wouldnt|youd|youll|youre|youve)\b(\S|)(?!\S)/gmi,
			replacement: (p0,p1,p2,p3)=>p1+p2.replace(/(d|ll|m|re|s|t|ve)$/i,"'$1")+p3,
			reason: "Spelling"
		},{
			// No lower case at all
			expr: /^((?=.*[A-Z])[^a-z]*)$/g,
			replacement: ($0,$1) => $1[0] + $1.substring(1).toLowerCase(),
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
			expr: /[ ]+([,\!\?\.\:](?:\s|$))/gm,
			replacement: "$1",
			reason: "Grammar 1"
		},{
			expr: /\[enter image description here\]/g,
			replacement: "[]",
			reason: "Remove default alt text"
		},{
			// Capitalize first letter of each line
			expr: /^[a-z]+\s/gm,
			replacement: $0 => $0[0].toUpperCase()+$0.substring(1),
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

	// Put placeholders in for chunks like code blocks where replacements shouldn't be made
	// And record removed blocks in a list so they can be reinserted later
	function omitCode(d, str){
		str = str.replace(new RegExp("(?:" +[
			/^(?: {0,3}>)*    .*(?:[\r\n]+(?: {0,3}>)*    .*)*/, // 4 space indented code block (also handles code in > blockquote)
			/`[^\r\n`]+`/, // backtick inline code
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
			d.placeholderActuals.push(editCode(d, match))
			return placeHolder
		})
		return str
	}

    function editCode(d, code){
		$.each(editCodeRules, function(x, rule){
            var fix = fixIt(d, code, rule.expr, rule.replacement, rule.reason)
            if (fix) code = fix.output
        })
        return code
    }

	// Fill placeholders back in with their respective code snippets
	function replaceCode(d, str){
		for (var i = 0; i < d.placeholderActuals.length; i++){
			str = str.replace(placeHolder, d.placeholderActuals[i])
		}
		return str
	}

	// Access to jQuery via dollar sign variable
	var $ = unsafeWindow.jQuery

	const placeHolder = "_xCodexBlockxPlacexHolderx_"

	function getDefaultData(){
		return {
			editCount:0, reasons:{}, placeholderActuals:[], completed:0,
			postId:0, bodyBoxA:0, titleBox:0, summaryBox:0, buttonBar:0,
			replacements:[]
		}
	}

	function fixIt(d, input, expression, replacement, reason){
		if (!input) return
        var ruleEditCount = 0
		for(let m of input.matchAll(expression)){
			var a = m[0]
			var b = a.replace(expression, replacement)
			if (a != b){
				d.replacements.push({i:a,o:b,r:reason})
                ruleEditCount++
			}
		}
		var output = input.replace(expression, replacement)
		if (output === input) return // Nothing was changed
		d.editCount+=ruleEditCount
        // Store reasons as hash keys in a map to prevent duplicates
        if (reason) d.reasons[reason] = 1
		return {
			reason: reason,
			output: output
		}
	}

	function edit(d){
		d.body = omitCode(d, d.body)
		// Loop through all editing rules
		$.each(editRules, (x, rule)=>{
			// Fix both the title and the body
			$.each(["title","body"], (x, type)=>{
				var fix = fixIt(d, d[type], rule.expr, rule.replacement, rule.reason)
				if (fix) d[type] = fix.output
			})
		})

		// Create a summary of all the reasons
		$.each(d.reasons, function (reason) {
			if (!d.summary) d.summary = ''
			// Check that summary is not getting too long
			if (d.summary.length < 200){
				d.summary += (d.summary.length==0?"":"; ") + reason
			}
		})

		d.body = replaceCode(d, d.body)
		return d
	}

	function output(d){
		if (!d.bodyBox) return

		d.bodyBox.animate({
			// Flash red or green depending on whether edits were made
			backgroundColor: d.editCount==0?'#ffc8a7':'#c8ffa7'
		}, 10)
		d.bodyBox.animate({
			// Then back to white
			backgroundColor: '#fff'
		}, 1000)

		if (d.titleBox) d.titleBox.val(d.title)
		d.bodyBox.val(d.body)

		if (d.summaryBox.val()){
			d.summary = " " + d.summary; // Add a leading space if there's something already in the box
		}
		d.summaryBox.val(d.summaryBox.val() + d.summary)

		// Dispatching a keypress to the edit body box causes stack exchange to reparse the markdown out of it
		d.bodyBox[0].dispatchEvent(new Event('keypress'))
	}

	GM_addStyle(`
		.toolkitfix{margin-left:0.5em;background:url("//i.imgur.com/79qYzkQ.png") center / contain no-repeat}
		.toolkitfix:hover{background-image:url("//i.imgur.com/d5ZL09o.png")}
		.toolkitinfo{height:100%;width:100%;left:0;top:0;position:fixed;background:#fff;z-index:99999;padding:1em}
		.toolkitinfo .content{max-height:100%;max-width:1000px;margin:0 auto;overflow:auto}
		.toolkitinfo table{border-spacing.5em;margin-bottom:2em;}
		.toolkitinfo th{font-weight:bold}
		.toolkitinfo button{float:right}
		.toolkitinfo th,.toolkitinfo td{border:1px solid black;padding:0.5em}
		.toolkitinfo td{font-family:monospace;white-space:pre}
		.toolkitinfo .diff{white-space:pre-wrap;margin-bottom:2em;max-width:600px}
		.toolkitinfo ins{background:#cfc}
		.toolkitinfo del{background:#fcc}
	`)

	//Preload icon alt
	new Image().src = '//i.imgur.com/79qYzkQ.png'
	new Image().src = '//i.imgur.com/d5ZL09o.png'

	// Continually monitor for newly created editing widgets
	setInterval(function(){
		$('.wmd-button-bar').each(function(){
			// If this edit widget isn't the "add new answer box" and doesn't already have our button
			if ($(this).attr('id')!='wmd-button-bar' && !$(this).find('.toolkitfix').length){
				// Create and add the button
				var d = getDefaultData()
				var button = $('<li class="wmd-button toolkitfix" title="Auto edit">').click(function(e){
					e.preventDefault()
					if (d.completed){
						// Second time button clicked, show a report
						var td = runTests()
						var info = $('<div class=content>').append($("<button>Close</button>").click(function(){
							info.parent().remove()
						})), table
						if (!d.replacements.length){
							info.append($("<h1>No edits made!</h1>"))
						} else {
							info.append($("<h1>Edits made:</h1>"))
							table = $("<table>").append($("<tr><th>Found</th><th>Replaced</th><th>Reason</th></tr>"))
							$.each(d.replacements, (x,r)=>{
                                if (r.i.search(/^\s+/)!=-1 && r.o.search(/^\s+/)!=-1){
                                    r.i=r.i.replace(/^\s+/,"")
                                    r.o=r.o.replace(/^\s+/,"")
                                }
								table.append($("<tr>").append($("<td>").text(r.i)).append($("<td>").text(r.o)).append($("<td>").text(r.r)))
							})
							info.append(table).append($("<div class=diff>").html(diff2html(d.origbody, d.body)))
						}
						if (!td.failures.length){
							info.append($("<h1>All " + td.passed + " unit tests passed!</h1>"))
						} else {
							info.append($("<h1>" + td.failures.length + " unit test failures:</h1>"))
							table = $("<table>").append($("<tr><th>Input</th><th>Output</th><th>Expected</th></tr>"))
							$.each(td.failures, (x,f)=>{
								table.append($("<tr>").append($("<td>").text(f.method+"("+f.input+")")).append($("<td>").text(f.actual)).append($("<td>").text(f.expected)))
							})
							info.append(table)
							info.append($("<div>" + td.passed + " of " +td.count + " unit tests passed.</div>"))
						}
						$('body').prepend($('<div class=toolkitinfo>').append(info))
					} else {
						// First time button clicked, do all the replacements
						d.buttonBar = $(this).parents('.wmd-button-bar')
						d.postId = d.buttonBar.attr('id').match(/[0-9]+/)[0]
						d.bodyBox = $('#wmd-input-' + d.postId)
						d.titleBox = $(".js-post-title-field")
						d.summaryBox = $('.js-post-edit-comment-field')
						d.origtitle = d.title = d.titleBox?d.titleBox.val():''
						d.origbody = d.body = d.bodyBox.val()
						output(edit(d))
						d.completed=true
					}
				})
				$(this).find('.wmd-spacer').last().before($('<li class=wmd-spacer>')).before(button)
			}
		})
	},200)

	function runTests(){
		var td = {failures:[],count:0,passed:0}

		function expectEql(method, actual, expected, input){
            td.count++
			if (actual != expected){
				td.failures.push({method:method,actual:actual,expected:expected,input:input})
			} else {
                td.passed++
            }
		}

		function testEdit(i, o){
			var d=getDefaultData()
			d.body=i
			if (!/[\r\n]/.exec(i)) d.title=i
			edit(d)
			expectEql("edit", d.title, o, i)
			expectEql("edit", d.body, o, i)
		}

		$.each([
			{i:'Lorum ipsum. Hope it helps!',o:'Lorum ipsum.'},
			{i:'Lorum ipsum. any suggestions?',o:'Lorum ipsum.'},
			{i:'Hello! Lorum ipsum.',o:'Lorum ipsum.'},
			{i:'Lorum https : / / stackexchange.com ipsum',o:'Lorum https://stackexchange.com ipsum'},
			{i:'Visit site.tld',o:'Visit `site.example`'},
			{i:'`ourhome.net`',o:'`ourhome.example`'},
			{i:'`sub.aexample.com.au`',o:'`sub.a.example`'},
			{i:'`sub.example2.co.uk`',o:'`sub.2.example`'},
			{i:'`sub.xexample1.tld`',o:'`sub.x1.example`'},
			{i:'`fooexample.org`',o:'`foo.example`'},
			{i:'`examplelorum.org`',o:'`lorum.example`'},
			{i:'http://mydomain.com/',o:'`http://mydomain.example/`'},
			{i:'Hello guys , good afternoon. Lorum ipsum',o:'Lorum ipsum'},
			{i:'Lorum git://github.com/foo/bar.git ipsum.',o:'Lorum git://github.com/foo/bar.git ipsum.'},
			{i:'See foo.html here',o:'See foo.html here'},
			{i:'NO, NEED, TO+ YELL!',o:'No, need, to+ yell!'},
			{i:'first letter upper',o:'First letter upper'},
			{i:'What ?',o:"What?"},
			{i:'A ... b',o:"A ... b"},
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
			{i:['wordpress','Wordpress'],o:'WordPress'},
			{i:['youve'],o:'you\'ve'},
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
			expectEql("omitCode", omitCode(getDefaultData(), i), "Lorum"+t.s+placeHolder+t.s+"ipsum",i)
		})
		return td
	}

	/*
	 * Javascript Diff Algorithm
	 *	By John Resig (http://ejohn.org/)
	 *	Modified by Chu Alan "sprite"
	 *
	 * Released under the MIT license.
	 *
	 * More Info:
	 *	http://ejohn.org/projects/javascript-diff-algorithm/
	 */
	function diff2html(o, n){
        function diff(o, n){
			var ns = {}, os = {}, i

			for (i = 0; i < n.length; i++){
				if (ns[n[i]] == null) ns[n[i]] = {rows:[], o: null}
				ns[n[i]].rows.push(i)
			}

			for (i = 0; i < o.length; i++){
				if (os[o[i]] == null) os[o[i]] = {rows:[], n: null}
				os[o[i]].rows.push(i)
			}

			for (i in ns){
				if (ns[i].rows.length == 1 && typeof(os[i]) != "undefined" && os[i].rows.length == 1){
					n[ns[i].rows[0]] = {text: n[ns[i].rows[0]], row: os[i].rows[0]}
					o[os[i].rows[0]] = {text: o[os[i].rows[0]], row: ns[i].rows[0]}
				}
			}

			for (i = 0; i < n.length - 1; i++){
				if (n[i].text != null && n[i+1].text == null && n[i].row + 1 < o.length && o[n[i].row + 1].text == null && n[i+1] == o[n[i].row + 1]){
					n[i+1] = {text: n[i+1], row: n[i].row + 1}
					o[n[i].row+1] = {text: o[n[i].row+1], row: i + 1}
				}
			}

			for (i = n.length - 1; i > 0; i--){
				if (n[i].text != null && n[i-1].text == null && n[i].row > 0 && o[n[i].row - 1].text == null &&	 n[i-1] == o[n[i].row - 1]){
					n[i-1] = {text: n[i-1], row: n[i].row - 1}
					o[n[i].row-1] = {text: o[n[i].row-1], row: i - 1}
				}
			}

			return {o: o, n: n}
		}

        function eschtml(s) {
            return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
        }

		o = o.replace(/\s+$/, '')
		n = n.replace(/\s+$/, '')

		var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/)),
		str = "", i,
		oSpace = o.match(/\s+/g) || [],
        nSpace = n.match(/\s+/g) || []
		oSpace.push("\n")
        nSpace.push("\n")

		if (out.n.length == 0){
            for (i = 0; i < out.o.length; i++){
                str += '<del>' + eschtml(out.o[i]) + oSpace[i] + "</del>"
            }
		} else {
			if (out.n[0].text == null){
				for (n = 0; n < out.o.length && out.o[n].text == null; n++){
					str += '<del>' + eschtml(out.o[n]) + oSpace[n] + "</del>"
				}
			}

			for (i = 0; i < out.n.length; i++){
				if (out.n[i].text == null){
					str += '<ins>' + eschtml(out.n[i]) + nSpace[i] + "</ins>"
				} else {
					var pre = ""

					for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++){
						pre += '<del>' + eschtml(out.o[n]) + oSpace[n] + "</del>"
					}
					str += " " + eschtml(out.n[i].text) + nSpace[i] + pre
				}
			}
		}
		return str
	}
})()
