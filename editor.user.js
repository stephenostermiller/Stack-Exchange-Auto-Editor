// ==UserScript==
// @name Stack Exchange Auto Editor
// @author Stephen Ostermiller
// @author Cameron Bernhardt (AstroCB)
// @developer Jonathan Todd (jt0dd)
// @developer sathyabhat
// @contributor Unihedron
// @license MIT
// @namespace https://ostermiller.org/
// @version 1.0.1
// @description Fixes common grammar and usage mistakes on Stack Exchange posts with a click
// @match https://*.stackexchange.com/posts/*
// @match https://*.stackexchange.com/questions/*
// @match https://*.stackexchange.com/review/*
// @match https://*.stackoverflow.com/*posts/*
// @match https://*.stackoverflow.com/*questions/*
// @match https://*.stackoverflow.com/review/*
// @match https://*.askubuntu.com/posts/*
// @match https://*.askubuntu.com/questions/*
// @match https://*.askubuntu.com/review/*
// @match https://*.superuser.com/posts/*
// @match https://*.superuser.com/questions/*
// @match https://*.superuser.com/review/*
// @match https://*.serverfault.com/posts/*
// @match https://*.serverfault.com/questions/*
// @match https://*.serverfault.com/review/*
// @match https://*.mathoverflow.net/posts/*
// @match https://*.mathoverflow.net/questions/*
// @match https://*.mathoverflow.net/review/*
// @match https://*.stackapps.com/posts/*
// @match https://*.stackapps.com/questions/*
// @match https://*.stackapps.com/review/*
// @grant GM_addStyle
// ==/UserScript==
(()=>{
	const CONTENT_FREE_WORDS = "(?:a|about|advance|advi[cs]e|accept|again|all|amazing|and|answers?|answered|any|anybody|anyone|" +
		  "appreciate[ds]?|attention|bad|be|been|body|can|cheers?|code|concepts?|could|days?|does|doubts?|english|errors?|every|fix|" +
		  "fixe[ds]|fixing|folks?|following|for|friends?|gives?|grammar|grateful|guys?|have|h[ea]lps?|h[ea]lping|highly|hours|" +
		  "i|i'?m|i'?ve|ideas?|in|issues?|just|kind|kindly|likely|me|missing|months?|most|much|one?|or|please|pl[sz]|problems?|provided?|" +
		  "obvious|offer|offered|offering|our|provide[ds]?|questions?|query|queries|resolve[ds]?|resolving|so|solve|solutions?|" +
		  "some|someone|somebody|something|sorry|spelling|suggestions?|sure|still|stuck|takes?|thanks?|that|the|these|" +
		  "things?|thx|time|to|trie[ds]|try|trying|ty|understand|up|us|vote[ds]?|this|very|we|weeks?|will|with|would|your?)"
	var rules = [
		{
			expr: /\b(https?)\s*:\s*\/\s*\/\s*([a-zA-Z0-9\-]+)\s*\./gi,
			replacement: "$1://$2.",
			reason: "fix URL"
		},{
			expr: /\b(?:((?:[a-zA-Z0-9\.\-]+\.)?[a-zA-Z0-9\-]+)example([a-zA-Z0-9\-]*))\.(?:com|net|org|tld|(?:(?:com?\.)?[a-zA-Z]{2}))(\s|\/|$|`)/gmi,
			replacement: "$1$2.example$3",
			reason: "use example domain",
			context: ["title","text","code","url"]
		},{
			expr: /\b(?:([a-zA-Z0-9\-\.]*)example([a-zA-Z0-9\-]+))\.(?:com|net|org|tld|(?:(?:com?\.)?[a-zA-Z]{2}))(\s|\/|$|`)/gmi,
			replacement: "$1$2.example$3",
			reason: "use example domain",
			context: ["title","text","code","url"]
		},{
			expr: /\b((?:my|your|our|new|old|foo|client)[a-zA-Z0-9\-]*)\.(?:com|net|org|tld|(?:(?:com?\.)?[a-zA-Z]{2}))(\s|\/|$|`)/gmi,
			replacement: "$1.example$2",
			reason: "use example domain",
			context: ["title","text","code","url"]
		},{
			expr: /\b([a-zA-Z0-9\-]*(?:site|domain|page|sample|test))\.(?:com|net|org|tld|(?:(?:com?\.)?[a-zA-Z]{2}))(\s|\/|$|`)/gmi,
			replacement: "$1.example$2",
			reason: "use example domain",
			context: ["title","text","code","url"]
		},{
			expr: /(^|\s)((?:(?:https?:\/\/)?(?:(?:[a-zA-Z\-\.]+\.)?example\.(?:com|net|org|tld|(?:(?:com?\.)?[a-z]{2}))|(?:[a-zA-Z\-\.]+\.example))(?:\/[^ ]*)?))(\s|$)/gmi,
			replacement: "$1`$2`$3",
			reason: "code format example URL",
			context: ["text","url"]
		},{
			// Insert spaces after commas
			expr: /,([[a-z])/g,
			replacement: ", $1",
			reason: "grammar"
		},{
			// Remove spaces before punctuation
			expr: /[ ]+([,\!\?\.\:](?:\s|$))/gm,
			replacement: "$1",
			reason: "grammar"
		},{
			// Remove double spaces after periods
			expr: /\. {2,}/gm,
			replacement: ". ",
			reason: "grammar"
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
			reason: "capitalization"
		},{
			// Always all caps
			expr: /(^|\s)(AJAX|API|CSS|DNS|HTTP|HTTPS|HTML|HTML5|I|JSON|PHP|SQL|SSL|TLS|URI|URL|XML)\b(\S|)(?!\S)/igm,
			replacement: ($0,$1,$2,$3) => $1+$2.toUpperCase()+$3,
			reason: "capitalization"
		},{
			expr: new RegExp("(?:^| +)(?:(?:" + CONTENT_FREE_WORDS + "[, \\-]+)*(any|some)\\ssuggestions?(?:[, \\-]+" + CONTENT_FREE_WORDS + ")*(?: *\\?)+(?: +|$))+","gmi"),
			replacement: m=>/^ (\s|\S) $/.exec(m)?" ":"",
			reason: "remove niceties"
		},{
			expr: new RegExp("(?:^| +)(?:(?:" + CONTENT_FREE_WORDS + "[, \\-]+)*(?:(?:(?:please|pl[sz]|kindly) +h[ea]lp)|thanks|thx|thank[ \\-]+you|ty)(?:[, \\-]+" + CONTENT_FREE_WORDS + ")*(?: *[\\.\\!\,\\?])*(?: +|$))+","gmi"),
			replacement: m=>/^ (\s|\S) $/.exec(m)?" ":"",
			reason: "remove niceties"
		},{
			expr: /(?:^|[ \t]+)(?:(?:(?:i\s)?hope\s(this|it|that)\s+h[ea]lps)|cheers|regards|my\s+first\s+question)\s*[\.\!\,\?]?(?:[ \t]+|$)/gmi,
			replacement: "",
			reason: "remove niceties"
		},{
			expr: /(?:(?:^|[ \t]+)(?:greetings|cheers|hi|hello|good\s(?:evening|morning|day|afternoon))(?:\s+(?:guys|folks|everybody|everyone))?\s*[\.\!\,]?)+(?:[ \t]+|$)/gmi,
			replacement: "",
			reason: "remove niceties"
		},{
			expr: /(^|[\.\!\?])[ \\t]*(?:^\**)(edit|edited|updated?):?(?:[\*\:]+)[ \t]*/gmi,
			replacement: "$1",
			reason: "remove niceties"
		},{
			expr: /(^|\s)c(#|\++|\s|$)/gm,
			replacement: "$1C$2",
			reason: "spelling"
		},{
			expr: /(^|\s)[Ii]'?(m|ve)\b(\S|)(?!\S)/gm,
			replacement: "$1I'$2$3",
			reason: "spelling"
		},{
			expr: /(^|\s)(arent|cant|couldnt|didnt|doesnt|dont|hadnt|hasnt|havent|hed|hes|isnt|mightnt|mustnt|shant|shes|shouldnt|thats|theres|theyd|theyll|theyre|theyve|weve|werent|whatll|whatre|whats|whatve|wheres|whod|wholl|whove|wont|wouldnt|youd|youll|youre|youve)\b(\S|)(?!\S)/gmi,
			replacement: (p0,p1,p2,p3)=>p1+p2.replace(/(d|ll|m|re|s|t|ve)$/i,"'$1")+p3,
			reason: "spelling"
		},{
			// No lower case at all
			expr: /^((?=.*[A-Z])[^a-z]*)$/g,
			replacement: ($0,$1) => $1[0] + $1.substring(1).toLowerCase(),
			reason: "capitalization"
		},{
			expr: /(hdd|harddisk)\b(\S|)(?!\S)/igm,
			replacement: "hard disk$2",
			reason: "spelling"
		},{
			expr: /\[enter image description here\]/g,
			replacement: "[]",
			reason: "formatting"
		},{
			// Capitalize first letter of each line
			expr: /^[a-z]+\s/gm,
			replacement: $0 => $0[0].toUpperCase()+$0.substring(1),
			reason: "capitalization",
			context: ["title"]
		},{
			// Remove trailing white space
			expr: /[ \t]+$/gm,
			replacement: "",
			reason: "formatting",
			context: ["fullbody","title"]
		},{
			// Remove multiple new lines
			expr: /(?:\r|\n|\r\n){3,}/gm,
			replacement: "\n\n",
			reason: "formatting",
			context: ["fullbody"]
		},{
			// Ensure body ends in a new line
			expr: /([^\n])$/g,
			replacement: "$1\n",
			reason: "formatting",
			context: ["fullbody"]
		}
	]

	// Create a rule for expanding the given abbreviation with the given replacement
	// Rule will not be case sensitive, so abbrev should be all caps
	function expandAbbrev(abbrev, replace){
		return {
			expr: new RegExp("(^|\\s)(?:"+abbrev+")\\b(\\S|)(?!\\S)","gm"),
			replacement: "$1"+replace+"$2",
			reason: "spelling"
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
			reason: "spelling"
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
			reason: "spelling"
		}
	}
	function tokenizeMarkdown(str){
		var tokens=[], m,
		startSearchRegex = new RegExp("(?:" + [
			/<[^>\r\n]+>/, // HTML tag
			/^(?: {0,3}>)* {4}/, // start of indented code
			/`/, // start of single backtick code
			/^ {0,3}(?:~{3,}|`{3,})/, // start of code fence
			/\]\([^\)\r\n]+\)/, // link
			/^ {0,3}\[[^ \t\r\n]+\]\:\s[^\r\n]*/, // link
			/https?\:\/\/[^ \t\r\n]*/ // URL
		].map(r=>r.source).join(')|(?:') + ")","gmi"),
		codeMatchRegex = new RegExp("^(?:(?:" + [
			/(?: {0,3}>)* {4}.*(?:[\r\n]+(?: {0,3}>)* {4}.*)*/, // indented block
			/`[^`\r\n]*`/, // single back ticks
			/<\s*pre(?:\s[^>]*)?>[\s\S]*?<\s*\/\s*pre\s*>/, // HTML pre tags
			/<\s*code(?:\s[^>]*)?>[\s\S]*?<\s*\/\s*code\s*>/, // HTML code tags
		].map(r=>r.source).join(')|(?:') + "))")

		while((m = str.search(startSearchRegex)) != -1){
			if (m>0) tokens.push({type:"text",content:str.substr(0,m)})
			str=str.substr(m)
			if (m = str.match(/^ {0,3}(~{3,}|`{3,})/)){
				// code fence
				var begin = m[0],
				length = begin.length,
				fence = m[1],
				end = str.substr(length)
				if ((m = end.search(new RegExp("^ {0,3}"+fence,"gm"))) != -1){
					length+=m
					end = end.substr(m)
					m = end.match(new RegExp("^ {0,3}"+fence.charAt(0)+"+"))
					length += m[0].length
					tokens.push({type:"code",content:str.substr(0,length)})
					str = str.substr(length)
				} else {
					tokens.push({type:"code",content:str})
					return tokens
				}
			} else if (m = str.match(codeMatchRegex)){
				tokens.push({type:"code",content:m[0]})
				str=str.substr(m[0].length)
			} else if (m = str.match(/^<[^>]+>/)){
				// Other HTML tags
				tokens.push({type:"html",content:m[0]})
				str=str.substr(m[0].length)
			} else if (m = str.match(/^(?:(?:\]\([^\)\r\n]+\))|(?: {0,3}\[[^ \t\r\n]+\]\:\s[^\r\n]*))/)){
				tokens.push({type:"link",content:m[0]})
				str=str.substr(m[0].length)
			} else if (m = str.match(/^https?\:\/\/[^ \t\r\n]*/i)){
				// Other HTML tags
				tokens.push({type:"url",content:m[0]})
				str=str.substr(m[0].length)
			} else if (str){
				tokens.push({type:"error",content:str})
				return tokens
			}
		}
		if (str)tokens.push({type:"text",content:str})
		return tokens
	}

	function getDefaultData(){
		return {
			editCount:0, reasons:{}, completed:0, replacements:[], summary:''
		}
	}

	function applyRules(d, input, type){
		rules.forEach(rule=>{
			var context = rule.context || ["title","text"]
			if (context.includes(type)){
				var ruleEditCount = 0
				for(let m of input.matchAll(rule.expr)){
					var a = m[0]
					var b = a.replace(rule.expr, rule.replacement)
					if (a != b){
						d.replacements.push({i:a,o:b,r:rule.reason})
						ruleEditCount++
					}
				}
				var output = input.replace(rule.expr, rule.replacement)
				if (output != input){
					d.editCount+=ruleEditCount
					// Store reasons as hash keys in a map to prevent duplicates
					d.reasons[rule.reason] = 1
					input = output
				}
			}
		})
		return input
	}

	function edit(d){
		d.bodyTokens = tokenizeMarkdown(d.body)
		for (var i=0; i<d.bodyTokens.length; i++){
			d.bodyTokens[i].content = applyRules(d, d.bodyTokens[i].content, d.bodyTokens[i].type)
		}
		d.body = d.bodyTokens.map(t=>t.content).join("")
		d.body = applyRules(d, d.body, "fullbody")

		if (d.title) d.title = applyRules(d, d.title, "title")

		// Create a summary of all the reasons
		for (var reason in d.reasons){
			if (d.reasons.hasOwnProperty(reason)) {
				// Check that summary is not getting too long
				if (d.summary.length < 200) d.summary += (d.summary.length==0?"":", ") + reason
			}
		}

		return d
	}

	function ui(){
		// Access to jQuery via dollar sign variable
		var $ = unsafeWindow.jQuery

		GM_addStyle(`
			.autoEditorButton{margin-left:0.5em;background:url("//i.imgur.com/79qYzkQ.png") center / contain no-repeat}
			.autoEditorButton:hover{background-image:url("//i.imgur.com/d5ZL09o.png")}
			button.autoEditorButton{width:2em;height:2em}
			.autoEditorInfo{height:100%;width:100%;left:0;top:0;position:fixed;background:#000A;z-index:99999;padding:1em}
			.autoEditorInfo .content{max-height:100%;max-width:1000px;margin:0 auto;overflow:auto;background:var(--white);padding:.5em}
			.autoEditorInfo table{border-spacing.5em;margin-bottom:2em;}
			.autoEditorInfo th{font-weight:bold}
			.autoEditorInfo button{float:right}
			.autoEditorInfo th,.autoEditorInfo td{border:1px solid black;padding:0.5em}
			.autoEditorInfo td{font-family:monospace;white-space:pre-wrap}
			.autoEditorInfo .diff{font-family:monospace;white-space:pre-wrap;margin-bottom:2em;max-width:600px}
			.autoEditorInfo ins{background:#cfc}
			.autoEditorInfo del{background:#fcc}
			.autoEditorInfo .ws::after{content:"∙";position:absolute;transform:translate(-8px, 0px);color:#aaa}
			.autoEditorInfo .wn::before{content:"↲";position:absolute;transform:translate(8px, 0px);color:#aaa}
			.autoEditorInfo .wn::after{content:"→";position:absolute;transform:translate(-22px, 0px);color:#aaa}
		`)

		//Preload icon alt
		new Image().src = '//i.imgur.com/79qYzkQ.png'
		new Image().src = '//i.imgur.com/d5ZL09o.png'

		$('body').keyup(e=>{
			if(e.key=="Escape"){
				var tki = $('.autoEditorInfo')
				if (tki.length){
					tki.remove()
					e.preventDefault()
					return false
				}
			}
			if(e.key=="e" && e.ctrlKey){
				var button = $(e.target).closest('.wmd-container').find('.autoEditorButton')
				if (button.length){
					e.preventDefault()
					button.trigger('click')
					return false
				}
			}
		})

		function cssColorVar(v){
			// get var then convert from hsv to rgb because passing hsv string to animate doesn't work
			return $('<div>').css("color",window.getComputedStyle(document.body).getPropertyValue(v))[0].style.color;
		}

		function addClick(button,d){
			return button.click(function(e){
				e.preventDefault()
				if (d.completed){
					// Second time button clicked, show a report
					if($('.autoEditorInfo').length) return // already open
					var td = runTests()
					var info = $('<div class=content>').append($("<button>Close</button>").click(()=>info.parent().remove())), table
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
							table.append($("<tr>").append($("<td>").html(visibleSpace(r.i))).append($("<td>").html(visibleSpace(r.o))).append($("<td>").html(visibleSpace(r.r))))
						})
						info.append(table)
						try {
							info.append($("<div class=diff>").html(diff2html(d.originalBody, d.body)))
						} catch (x){
							info.append($("<pre>").text("Diffs failed to render\n" + x.toString() + "\n\n" + x.stack))
						}
					}
					if (!td.failures.length){
						info.append($("<h1>All " + td.passed + " unit tests passed!</h1>"))
					} else {
						info.append($("<h1>" + td.failures.length + " unit test failures:</h1>"))
						table = $("<table>").append($("<tr><th>Input</th><th>Output</th><th>Expected</th></tr>"))
						$.each(td.failures, (x,f)=>{
							table.append($("<tr>").append($("<td>").html(visibleSpace(f.method+"("+f.input+")"))).append($("<td>").html(visibleSpace(f.actual))).append($("<td>").html(visibleSpace(f.expected))))
						})
						info.append(table)
						info.append($("<div>" + td.passed + " of " +td.count + " unit tests passed.</div>"))
					}
					$('body').prepend($('<div class=autoEditorInfo>').append(info).click(e=>{
						if($(e.target).is('.autoEditorInfo')){
							e.preventDefault()
							$(e.target).remove()
							return false
						}
					}))
				} else {
					// First time button clicked, do all the replacements
					d.originalTitle = d.title = d.getTitle()
					d.originalBody = d.body = d.getBody()
					edit(d)
					// Flash red or green depending on whether edits were made
					d.flashMe.animate({backgroundColor:d.editCount==0?cssColorVar('--red-100'):cssColorVar('--green-100')},10)
					// Then back to white
					d.flashMe.animate({backgroundColor:cssColorVar('--white')})
					// Update values in UI
					d.setTitle(d.title)
					d.setBody(d.body)
					if(d.summary) d.addSummary(d.summary)
					d.completed=true
				}
				return false
			})
		}

		function needsButton(editor){
			// Not for the "add new answer" box
			if (!/\d$/.exec(editor.id)) return false;
			// Already has editor
			if ($(editor).find('.autoEditorButton').length) return false;
			return true
		}

		// Continually monitor for newly created editing widgets
		setInterval(()=>{
			$('.wmd-button-bar').each(function(){
				if (needsButton(this)){
					var d = getDefaultData(),
					postId = this.id.match(/[0-9]+/)[0],
					bodyBox = $('#wmd-input-' + postId),
					titleBox = $(".js-post-title-field"),
					summaryBox = $('.js-post-edit-comment-field')
					d.getTitle = function(){
						return titleBox.length?titleBox.val():''
					}
					d.setTitle = function(s){
						if (!titleBox.length) return
						titleBox.val(s)
						titleBox[0].dispatchEvent(new Event('keypress')) // Cause title display to be updated
					}
					d.getBody = function(){
						return bodyBox.val()
					}
					d.setBody = function(s){
						bodyBox.val(s)
						bodyBox[0].dispatchEvent(new Event('keypress')) // Cause markdown re-parse
					}
					d.flashMe = bodyBox
					d.addSummary = function (s){
						summaryBox.val((summaryBox.val()?summaryBox.val()+" ":"") + s)
					}
					$(this).find('.wmd-spacer').last().before($('<li class=wmd-spacer>')).before(addClick($('<li class="wmd-button autoEditorButton" title="Auto edit Ctrl+E">'),d))
				}
			})
			$('.post-editor').each(function(){
				if (needsButton(this)){
					var d = getDefaultData(),
					postEditor = $(this),
					editArea = postEditor.find('textarea'),
					summaryBox = $('.js-post-edit-comment-field')
					d.getTitle = function(){
						return "" // This style editor only used for answers, so never a title
					}
					d.setTitle = function(s){} // no-op
					d.getBody = function(){
						return editArea.val()
					}
					d.setBody = function(s){
						editArea.val(s)
					}
					d.flashMe = postEditor.find('.js-editor')
					d.addSummary = function (s){
						summaryBox.val((summaryBox.val()?summaryBox.val()+" ":"") + s)
					}
					$(this).find('.js-editor-btn').last().before(addClick(
						$('<button class="autoEditorButton s-editor-btn js-editor-btn" title="Auto edit Ctrl+E">'),d
					)).before(($('<div class="flex--item w16 is-disabled" data-key=spacer>')))
				}
			})
		},200)

		function visibleSpace(s){
			s=escHtml(s)
			s=s.replace(/(\r)/g,"<span class=wr>$1</span>")
			s=s.replace(/(\n)/g,"<span class=wn>$1</span>")
			s=s.replace(/(\t)/g,"<span class=wt>$1</span>")
			s=s.replace(/( )/g,"<span class=ws>$1</span>")
			return s
		}
	}

	function main(){
		var results = runTests()
		console.log(results)
		process.exit(results.failures.length)
	}

	function escHtml(s) {
		return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
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
				str += '<del>' + escHtml(out.o[i]) + oSpace[i] + "</del>"
			}
		} else {
			if (out.n[0].text == null){
				for (n = 0; n < out.o.length && out.o[n].text == null; n++){
					str += '<del>' + escHtml(out.o[n]) + oSpace[n] + "</del>"
				}
			}

			for (i = 0; i < out.n.length; i++){
				if (out.n[i].text == null){
					str += '<ins>' + escHtml(out.n[i]) + nSpace[i] + "</ins>"
				} else {
					var pre = ""

					for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++){
						pre += '<del>' + escHtml(out.o[n]) + oSpace[n] + "</del>"
					}
					str += " " + escHtml(out.n[i].text) + nSpace[i] + pre
				}
			}
		}
		return str
	}

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

		function testEdit(input, output, titleOutput){
			if (!titleOutput) titleOutput = output
			if (!/\n$/.exec(output)) output+="\n"
			var d=getDefaultData(),
			testTitle = !/[\r\n`]| {4}|~~~/.exec(input) // No title tests multi-line or markdown
			if (testTitle) d.title=input
			d.body=input
			edit(d)
			if (testTitle) expectEql("editTitle", d.title, titleOutput, input)
			expectEql("editBody", d.body, output, input)
		}

		[
			{i:'Lorum ipsum. Hope it helps!',o:'Lorum ipsum.'},
			{i:'Lorum ipsum. any suggestions?',o:'Lorum ipsum.'},
			{i:'Lorum ipsum. Can anybody give me any suggestions, pls?',o:'Lorum ipsum.'},
			{i:'Lorum ipsum. Will you provide any suggestions for me, please?',o:'Lorum ipsum.'},
			{i:'Lorum ipsum. Does anybody have any suggestions?',o:'Lorum ipsum.'},
			{i:'Lorum ipsum. Any suggestions would be highly appreciated, thank you!',o:'Lorum ipsum.'},
			{i:'Lorum ipsum. thank you very much for all your help',o:'Lorum ipsum.'},
			{i:'Lorum ipsum. ty in advance',o:'Lorum ipsum.'},
			{i:'Lorum ipsum. Any help will be appreciated, thank you in advance.',o:'Lorum ipsum.'},
			{i:'Lorum ipsum. please help me understand these concepts.',o:'Lorum ipsum.'},
			{i:'Lorum ipsum. please help - any ideas would be amazing - been stuck on trying to fix this thing for a week!',o:'Lorum ipsum.'},
			{i:'Lorum ipsum. please help me about this code! thank you very much!',o:'Lorum ipsum.'},
			{i:'Hello! Lorum ipsum.',o:'Lorum ipsum.'},
			{i:'Edit: Lorum ipsum.',o:'Lorum ipsum.'},
			{i:'**Edit:** Lorum ipsum.',o:'Lorum ipsum.'},
			{i:'Edit lorum ipsum.',o:'Edit lorum ipsum.'},
			{i:'Lorum https : / / stackexchange.com ipsum',o:'Lorum https://stackexchange.com ipsum'},
			{i:'Visit site.tld',o:'Visit `site.example`',t:'Visit site.example'},
			{i:'`ourHome.net`',o:'`ourHome.example`'},
			{i:'`sub.aexample.com.au`',o:'`sub.a.example`'},
			{i:'`sub.example2.co.uk`',o:'`sub.2.example`'},
			{i:'`sub.xexample1.tld`',o:'`sub.x1.example`'},
			{i:'    fooexample.org',o:'    foo.example'},
			{i:'`examplelorum.org`',o:'`lorum.example`'},
			{i:'http://mydomain.com/',o:'`http://mydomain.example/`',t:'http://mydomain.example/'},
			{i:'Hello guys , good afternoon. Lorum ipsum',o:'Lorum ipsum'},
			{i:'Lorum git://github.com/foo/bar.git ipsum.',o:'Lorum git://github.com/foo/bar.git ipsum.'},
			{i:'See foo.html here',o:'See foo.html here'},
			{i:'NO, NEED, TO+ YELL!',o:'No, need, to+ yell!'},
			{i:'first letter upper',o:'first letter upper',t:'First letter upper'},
			{i:'What ?',o:"What?"},
			{i:'A ... b',o:"A ... b"},
			{i:'12,345',o:"12,345"},
			{i:'90% hit rate',o:"90% hit rate"},
			{i:'Missing,space,after,comma',o:"Missing, space, after, comma"},
			{i:'Double space.  After period.',o:"Double space. After period."},
			{i:'Trailing \nwhite\t\nspace \t',o:"Trailing\nwhite\nspace"},
			{i:'Multiple\n\n\nblank\n\n\n\nlines\n\n    even\n\n\n    in\n\n\n\n    code',o:"Multiple\n\nblank\n\nlines\n\n    even\n\n    in\n\n    code"}
		].forEach(io=>{
			testEdit(io.i, io.o, io.t)
		})

		var multiTests = [
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
			{i:['youve'],o:'you\'ve'}
		]
		multiTests.forEach(io=>{
			io.i.push(io.o)
			io.i.forEach(i=>{
				testEdit('Lorum ' + i + ' ipsum.', 'Lorum ' + io.o + ' ipsum.')
				testEdit('Lorum ipsum ' + i, 'Lorum ipsum ' + io.o)
				testEdit('Lorum ipsum ' + i + '.', 'Lorum ipsum ' + io.o + '.')
			})
		})

		function markdownSizes(tokens){
			return tokens.map(t => t.type+t.content.length).join(",")
		}

		var markdownParseTests = [
			{i:"lorum",o:"text5"},
			{i:"<p>",o:"html3"},
			{i:"lorum <p>\n",o:"text6,html3,text1"},
			{i:"    indented    ~~~\n    indented\n    indented",o:"code45"},
			{i:"<code>~~~~~~~~~~~~~</code>",o:"code26"},
			{i:"~~~\ncode\n	a\nfence\nhttps://incode.example/\n~~~",o:"code45"},
			{i:"Https://url.example/",o:"url20"},
			{i:"`Https://url.example/`",o:"code22"},
			{i:"[link text](https://link.example/)",o:"text10,link24"},
			{i:"```````fence\    indented\n```\n```````\ntext",o:"code36,text5"},
			{i:"`one line` text",o:"code10,text5"},
			{i:"[1]: https://link.example/",o:"link26"}
		]
		markdownParseTests.forEach(io=>{
			expectEql("tokenizeMarkdown", markdownSizes(tokenizeMarkdown(io.i)), io.o, io.i)
		})

		return td
	}

	if (typeof unsafeWindow !== 'undefined') ui()
	if (typeof process !== 'undefined') main()
})()
