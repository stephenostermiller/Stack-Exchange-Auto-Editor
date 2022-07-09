// ==UserScript==
// @name Stack Exchange Auto Editor
// @author Stephen Ostermiller
// @author Cameron Bernhardt (AstroCB)
// @developer Jonathan Todd (jt0dd)
// @developer sathyabhat
// @contributor Unihedron
// @license MIT
// @version 1.0.16
// @namespace https://github.com/stephenostermiller/Stack-Exchange-Auto-Editor
// @updateURL https://github.com/stephenostermiller/Stack-Exchange-Auto-Editor/raw/master/editor.meta.js
// @downloadURL https://github.com/stephenostermiller/Stack-Exchange-Auto-Editor/raw/master/editor.user.js
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
	const MISSPELLINGS = Object.assign({},...(
		"1D|1's:1s|2D|301's:301s|3D|404's:404s|alot:a lot|abcense,absance,absense,absentse:absence|acceptible:acceptable|accesable,accesible,accessable:accessible|accomodate,acommodate:accommodate|accomodation:accommodation|acheive,achive:achieve|acknowlege,aknowledge:acknowledge|acquaintence,aquaintance:acquaintance|adquire,aquire:acquire|aquit:acquit|acerage,acrage:acreage|accross:across|ActionScript|adress:address|AdSense|adultary:adultery|advertisment:advertisement|advices:advice|adviseable,advizable:advisable|AdWords|agression:aggression|agressive:aggressive|AJAX|alegiance,allegaince,allegience:allegiance|allmost:almost|amatuer,amature:amateur|angular js,angularjs:AngularJS|annualy,anually:annually|Ansible|Apache|Apache2|API|api's,apis:APIs|APK|appaling:appalling|aparent,aparrent,apparant,apparrent:apparent|apparantly:apparently|appearence:appearance|artic:arctic|arent:aren't|arguement:argument|ArrayList|aswell:as well|ASCII|assasination:assassination|assesment:assessment|atleast:at least|athiest,athist:atheist|aweful,awfull:awful|akward:awkward|AWS|Axios|basicly:basically|beatiful:beautiful|becuase:because|becomeing:becoming|begining:beginning|beleive,belive:believe|bellweather:bellwether"+
		"|benifit:benefit|big query,bigquery:BigQuery|Bing|biogrophay:biography|bizzare:bizarre|Blogspot|blue host:Bluehost|blue tooth:Bluetooth|binded:bound|BTW|bouy:buoy|bouyant:buoyant|buisness:business|cake php:CakePHP|calender:calendar|camoflage,camoflague:camouflage|cant:can't|Carribean:Caribbean|Cassandra|catagory:category|caugt,cauhgt:caught|cemetary:cemetery|cent os:CentOS|changable:changeable|chek:check|cheks:checks|cheif:chief|Cisco|CLI|Clojure|Cloudflare|CloudFront|CMake|CMS|Cocos2d|code igniter,code ignitor,codeignitor:CodeIgniter|cold fusion:ColdFusion|collaegue,collegue:colleague|colum:column|comming:coming|comission,commision:commission|comitted,commited:committed|commitee:committee|comparsion:comparison|compell:compel|completly:completely|conceed:concede|congradulate:congratulate|concience:conscience|consciencious:conscientious|concious,consious:conscious|concensus:consensus|contraversy:controversy|convinient:convenient|cooly:coolly|Cordova|CORS|couldnt:couldn't|cPanel|CPU|CSS|CSV|curiousity:curiosity|Cygwin|D3|dacquiri,daquiri:daiquiri|datas:data|DataFrame|DataGridView|DB2|DBML|Debian|decieve:deceive|definate:definite|definately,definatly,definitly:definitely|Delphi|desparate:desperate"+
		"|DHCP|didnt:didn't|diffrence:difference|digital ocean:DigitalOcean|dilema:dilemma|dissapear:disappear|dissapoint:disappoint|disasterous:disastrous|desease:disease|devide:divide|Django|DLL|DLLs|DNS|Dockerfile|doesnt:doesn't|DOM|dont:don't|Dovecot|dream host:DreamHost|DropDownList|drunkeness:drunkenness|Drupal|dumbell:dumbbell|dynamo db:DynamoDB|EC2|ecma script:ECMAScript|ecstacy:ecstasy|Emacs|embarass:embarrass|embarassed,embarrased:embarrassed|endevour:endeavour|English|enterpreneur:entrepreneur|enviroment:environment|equiptment:equipment|everytime:every time|excede:exceed|Excel|exilerate:exhilarate|existance:existence|experiance:experience|extreem:extreme|face book:Facebook|familar:familiar|facinating:fascinating|firey:fiery|finaly:finally|fire base:Firebase|fire fox:Firefox|florescent,flourescent:fluorescent|foriegn:foreign|Fortran|fourty:forty|foward:forward|free bsd:FreeBSD|freind:friend|FTP|fullfil,fullfill:fulfil|futher:further|guage:gauge|GCC|GIF|Git|git hub:GitHub|git lab:GitLab|glamourous:glamorous|go daddy:GoDaddy|Google|google bot:Googlebot|goverment:government|Gradle|Grails|grammer:grammar|graph ql:GraphQL|gratefull,greatful:grateful|grat:great|garantee,garanty,garentee:guarantee"+
		"|gaurd:guard|GUI|guidence:guidance|GWT|H1|H2|H3|H4|H5|H6|hadnt:hadn't|Hadoop|happend:happened|ha proxy,haproxy:HAProxy|harrass:harass|harrassment:harassment|harddisk,hdd:hard disk|Haskell|hasnt:hasn't|havent:haven't|hed:he'd|hes:he's|heighth,heigth:height|halp:help|halping:helping|halps:helps|heres:here's|Heroku|hetzneronline:Hetzner Online|heirarchy:hierarchy|high charts:Highcharts|honourary:honorary|host gator:HostGator|HTML|HTML5|HTTP|HTTPS|humerous,humourous:humorous|higeine,hiygeine,hygeine,hygene,hygine:hygiene|hipocrit:hypocrite|I|I'd|I'll|i o,io:I/O|ignorence:ignorance|IIS|immitate:imitate|imediately,immediatly:immediately|incidently:incidentally|independant:independent|indite:indict|indispensible:indispensable|innoculate:inoculate|inteligence,intelligance:intelligence|IntelliJ|interupt:interrupt|IONOS|iOS|IP|iPad|iPhone|iPod|IPv4|IPv6|irresistable:irresistible|isnt:isn't|Jakarta|Java|Javadoc|java script:JavaScript|JBoss|JDBC|Jenkins|jewelery:jewelry|JMeter|Joomla|JPA|JPEG|JPG|jQuery|JS|js fiddle:JSFiddle|JSON|JSP|judgement:judgment|JUnit|Jupyter|JWT|Kafka|Keras|kernal:kernel|Kivy|knowlege:knowledge|Kotlin|Kubernetes|KVM|Laravel|LDAP|liesure:leisure|lenght:length|liason:liaison"+
		"|lib gdx,libgdx:libGDX|libary,liberry:library|lisence:license|lightening:lightning|LINQ|Linux|liquidweb:Liquid Web|ListView|Logcat|Lua|Lucene|LVM|mac os:macOS|Magento|maintainance,maintnance:maintenance|maria db:MariaDB|marshmellow:marshmallow|mat lab:MATLAB|Matplotlib|Maven|MediaWiki|medecine:medicine|medeval,medevil,mideval:medieval|momento:memento|MFC|Microsoft|mightnt:mightn't|millenia:millennia|milennium,millenium:millennium|miniture:miniature|miniscule:minuscule|mischevious,mischevous,mischievious:mischievous|mispell,misspel:misspell|Mockito|Mongo|mongo db:MongoDB|MP4|ms build:MSBuild|MSDN|mustnt:mustn't|MVC|MVVM|my sql:MySQL|Nagios|name cheap:Namecheap|NAT|neccessary,necessery:necessary|nieghbor:neighbor|net beans:NetBeans|networksolutions:Network Solutions|NFS|Nginx|NHibernate|neice:niece|NLP|nodejs:Node.js|no sql:NoSQL|noticable:noticeable|NuGet|num py:NumPy|OAuth|Objective-C|ocassion,occassion:occasion|occasionaly,occassionally:occasionally|occure:occur|occured:occurred|occurance,occurence,occurrance:occurrence|occuring:occurring|OK|omision,ommision:omission|OOP|open cv:OpenCV|open gl:OpenGL|open ldap:OpenLDAP|open ssl:OpenSSL|open vpn:OpenVPN|orignal:original|ORM|OS|our's:ours"+
		"|outragous:outrageous|PageRank|Pandas|paralel,parralel:parallel|parliment:parliament|passtime,pasttime:pastime|pay pal:PayPal|PC|PDF|PDO|percieve:perceive|Perl|perseverence:perseverance|persistant:persistent|personel,personell:personnel|Phillipines:Philippines|PhoneGap|PHP|phpMyAdmin|peice:piece|plagerize:plagiarize|playright,playwrite:playwright|pls,plz,plze:please|PNG|politican:politician|POP3|posession,possesion:possession|Postgres|PostgreSQL|potatos:potatoes|power shell:PowerShell|preceed:precede|prefered:preferred|prefering:preferring|presance:presence|prime faces:PrimeFaces|privelege,priviledge:privilege|professer:professor|programatically:programmatically|Prolog|promiss:promise|pronounciation:pronunciation|prufe:proof|protestor:protester|PS|publically:publicly|persue:pursue|py charm:PyCharm|py game:Pygame|py qt:PyQt|PyQt5|py spark:PySpark|py torch:PyTorch|Qt|quarentine:quarantine|questionaire,questionnair:questionnaire|que:queue|rabbit mq:RabbitMQ|readible:readable|realy:really|reciept:receipt|recieve:receive|reccommend,recomend:recommend|referance,refrence:reference|refered:referred|refering:referring|rehersal:rehearsal|relevent,revelant:relevant|religius,religous:religious"+
		"|rember,remeber:remember|repitition:repetition|resistence:resistance|responsability:responsibility|restarant,restaraunt:restaurant|rime:rhyme|rythem,rythm:rhythm|RSpec|RxJS|Samba|SAS|Scala|SciPy|SDK|secratary,secretery:secretary|sieze:seize|Selenium|sence:sense|SEO|seperate:separate|seperated:separated|sargent:sergeant|SERPs|serverfault,SF:Server Fault|shant:shan't|share point:SharePoint|shes:she's|Shopify|shouldnt:shouldn't|silver light:Silverlight|similer:similar|skilfull:skilful|SMS|SMTP|Solr|speach,speeche:speech|sprite kit:SpriteKit|SQL|sql alchemy:SQLAlchemy|SQLite|square space:Squarespace|SSH|SSIS|SSL|SE,stackexchange:Stack Exchange|SO,stackoverflow:Stack Overflow|STL|strenght:strength|strech:stretch|succesful,successfull,sucessful:successful|succesfully:successfully|succint:succinct|supercede:supersede|supress:suppress|suprise,surprize:surprise|SVG|SVN|SWF|swift ui:SwiftUI|Symfony|TCP|tendancy:tendency|tensor flow:TensorFlow|TextView|ty:thank you|thanx,thx:thanks|thats:that's|theres:there's|therefor:therefore|theyd:they'd|theyll:they'll|theyre:they're|theyve:they've|threshhold:threshold|throught:through|TLS|tomatos:tomatoes|tommorow,tommorrow:tomorrow|tounge:tongue|tryed:tried"+
		"|truely:truly|Tucows|twelth:twelfth|Twitter|type script:TypeScript|tyrany:tyranny|ubant,ubanto,ubantoo,ubantu,ubantuu,ubnto,ubntoo,ubntu,ubntuu,ubuno,ubunoo,ubunt,ubunto,ubuntoo,ubuntuu,ubunu,ubunut,ubunuto,ubunutoo,ubunutu,ubunutuu,ubunuu,ubutn,ubutno,ubutnoo,ubutnu,ubutnuu,ubuto,ubutoo,ubutu,ubutuu,unbunt,unbunto,unbuntoo,unbuntu,unbuntuu:Ubuntu|UI|UICollectionView|ui kit:UIKit|UITableView|ui view:UIView|UIViewController|underate:underrate|unforseen:unforeseen|unfortunatly:unfortunately|Unicode|Unix|untill:until|upto:up to|upholstry:upholstery|URI|uri's,uris:URIs|URL|url's,urls:URLs|USB|usible:useable|usefull:useful|UWP|vaccum,vaccuum,vacume:vacuum|VBA|vb script,vbscript:VBScript|vehical:vehicle|viscious,visious:vicious|ViewModel|ViewState|VPN|VPS|WCF|weve:we've|waether:weather|webbrowser:web browser|WebKit|WebView|wierd:weird|welfair,wellfare:welfare|werent:weren't|whatll:what'll|whatre:what're|whats:what's|whatve:what've|wheres:where's|whereever:wherever|wether:whether|wich:which|whod:who'd|wholl:who'll|whove:who've|wi fi,wifi:WiFi|Wikipedia|willfull:willful|Win32|Win64|win 10,win10,windows 10,windows10:Windows 10|win 11,win11,windows 11,windows11:Windows 11|win 2000,win2000,windows 2000,windows2000:Windows 2000"+
		"|win 7,win7,windows 7,windows7:Windows 7|win 8,win8,windows 8,windows8:Windows 8|win 95,win95,window95,windows 95:Windows 95|win 98,win98,window98,windows 98:Windows 98|windows me,windowsme:Windows Me|win nt,windows nt:Windows NT|win vista,windows vista:Windows Vista|win xp,windows xp:Windows XP|win forms:WinForms|withold:withhold|wont:won't|woo commerce:WooCommerce|word press:WordPress|wouldnt:wouldn't|wpengine:WP Engine|WPF|writeing,writting:writing|WSDL|Xamarin|XAML|XAMPP|Xcode|XIB|XML|XPath|XSLT|YAML|Yii|youd:you'd|youll:you'll|youre:you're|youve:you've|your's:yours|you tube:YouTube|Zend|ZFS"
	).split("|").map(l=>{
		var r = l.split(/:/)
		if(r.length>2) throw "Extra colons in " + l
		var toc = [], cor=r[r.length-1]
		if (!toc) throw "Empty correction: " + l
		if (r.length==2) toc = r[0].split(/,/)
		if (/[A-Z]/.test(cor)) toc.push(cor.toLowerCase())
		if (!toc.length) throw "No correction for " + cor
		return Object.assign({},...toc.map(w=>({[w]:cor})))
	}))

	const CONTENT_FREE_WORDS = "(?:\\:\\-?\\)|a|able|about|advance|advi[cs]e|accept|again|all|am|amazing|and|answers?|answered|any|anybody|anyone|appreciate[ds]?|assist|assistance|are|attention|bad|be|being|been|below|body|can|cheers?|code|concepts?|could|days?|directions?|does|doubts?|english|errors?|every|everybody|everyone|examples?|first|fix|fixe[ds]|fixing|folks?|following|for|friends?|get|gives?|good|grammar|grateful|great|greatly|guys?|guidance|have|helps?|helping|here|highly|hint|hopes?|hoping|hours|how|i|i'?[md]|i'?ve|ideas?|if|illuminate|illumination|in|is|issues?|it|just|kind|kindly|know|let|likely|little|look|looking|lucky?|many|may|me|might|" +
	"missing|months?|most|much|need|new|no|one?|or|over|obvious|offer|offered|offering|our|out|over|please|point|pointers?|post|problems?|provide[ds]?|questions?|query|queries|really|regarding|regards|resolve[ds]?|resolving|right|seek|small|so|solve|solutions?|some|someone|somebody|something|sorry|spelling|suggestions?|sure|still|stuck|takes?|thanks?|that|the|these|things?|that|that's|this|time|tiny|tips?|to|towards?|trie[ds]|try|trying|understand|up|us|vote[ds]?|useful|very|we|well|weeks?|what|will|with|works?|would|your?)"

	// Top 100 from https://dnsinstitute.com/research/popular-tld-rank/ plus "tld"
	const TLD = /(?:\\?\.com?)?\\?\.(?:tld|com|net|ru|org|info|in|ir|uk|au|de|ua|ca|tr|co|jp|vn|cn|gr|fr|tk|tw|id|br|io|xyz|it|nl|pl|za|us|eu|mx|ch|biz|me|il|es|online|by|xn--p1ai|nz|kr|cz|ro|cf|ar|club|my|tv|kz|cl|pk|pro|site|th|se|sg|cc|be|rs|top|ga|ma|hu|ae|su|dk|hk|at|ml|shop|store|ng|np|no|app|live|pe|ph|ie|lk|gq|edu|fi|ai|sa|pw|tech|bd|sk|ke|pt|az|space|mk|ge|tn|lt|dev|to|gov)/

	const SUBDOM = /(?:(?:[a-zA-Z0-9\-]+|[\*\%])\\?\.)*/
	const REST_OF_URL = /(?:[\/\$\{][^ ]*?)?/
	const PORT_OPT = /(?:\:[0-9]+)?/
	const USER_OPT = /(?:[a-zA-Z\-\.]+\@)?/
	const PRE_CODE_FORMAT = /(^|\s)([_\*\"\'\(\<]*)/
	const POST_CODE_FORMAT = /([_\*\"\'\`\;\,\.\?\:\!\)\>]*(?=\s|$))/
	const ANSWER_WORDS = /(?:answers?|assistance|advice|examples?|fix|help|hints?|guidance|ideas?|point|pointers?|tips?|suggestions?)/
	const BETWEEN_WORDS = "[, \\-\\/]+"
	const EXAMPLE_DOMAIN = new RegExp(
		'((?:^|[^A-Za-z0-9\\-\\.])' + SUBDOM.source + ')(' +
			// Made entirely of example-like words
			// Followed by an optional number or single letter
			/(?:(?:(?:1st|2nd|3rd|4th|a{3,}|an|abcd?|abcdef?|address|admin|another|any|apps?|back|bad|bah|banks?|bar|blah?|cdns?|clients?|company|companies|child|children|custom|customers?|def|default|dev|development|domains?|emails?|end|ever|evil|examples?|fake|fallback|first|foo|fourth|front|ghi|good|guys?|hacks?|hackers?|harm|harmless|hello|her|hi|his|home|hosts?|hosters?|info|information|last|list|local|mail|mailing|main|malicious|mine|more|my|names?|new|no|of|old|other|our|package|pages?|parents?|places?|primary|private|production|protected|proxy|public|recipients?|safe|samples?|second|secondary|servers?|services?|sites?|shops?|special|some|ssl|stores?|stuff|tertiary|tests?|that|the|their|things?|third|this|tls|unique|unsafe|urls?|web|what|where|x{3,}|xyz|your|(?:(?<=[a-zA-Z\-])co)|(?:a(?=[a-zA-Z\-]{3,})))-?)+(?:-?(?:[0-9]+|[A-Za-z]))?)/.source +
		')('+TLD.source +')'+
		/((?=\.?(?:[\;\,\:\/_\"\*'\)\<\>\?\!\` \t\$]|$)))/.source
	,'gmi')
	const WORD_OR_NON = /(?:[A-Za-z0-9]+)|(?:[^A-Za-z0-9]+)/gmi
	const WORD= /[A-Za-z0-9]+/gmi

	var rules = [
		{
			expr: /\b(https?)[ \t]*:[ \t]*\/[ \t]*\/[ \t]*([a-zA-Z0-9\-]+)[ \t]*\./gi,
			replacement: "$1://$2.",
			reason: "fix URL",
			context: ["fullbody","title"]
		},{
			// Remove blank lines from beginning
			expr: /^[\n\r]+/gi,
			replacement: "",
			reason: "formatting",
			context: ["fullbody"]
		},{
			expr: EXAMPLE_DOMAIN,
			replacement: (m,pre,name,tld,post)=>{
				var escape = "";
				if (/^\\/.test(tld)){
					escape="\\"
					tld = tld.substr(1)
				}
				if (!/^example$/i.test(name)){
					if (context.exampleDomains[normalizeDomain(tld)] != 1){
						name = name.replace(/-example-/gi,'-').replace(/-?example-?/gi,'')
						tld='.example'
					} else {
						name = "example"
					}
				}
				return pre+name+escape+tld+post
			},
			reason: "use example domain",
			context: ["title","text","code","url"]
		},{
			// https://meta.stackexchange.com/questions/1777/what-html-tags-are-allowed-on-stack-exchange-sites
			expr: /.+/g,
			replacement: m=>{
				if (/^<\s*\/?\s*(?:a|b|blockquote|br|code|del|dd|dl|dt|em|h1|h2|h3|h4|h5|h6|hr|i|img|kbd|li|ol|p|pre|s|strike|strong|sub|sup|ul)(?:\s|\>|\/)/i.test(m)){
					// allowed tags
					return m
				}
				if(/^<\!\-\-\s*(?:language|language-all|begin snippet|end snippet|summary|End of automatically inserted text)/.test(m)){
					// Special comments
					return m
				}
				return "`"+m+"`"
			},
			reason: 'Code format HTML',
			context: ["html"]
		},{
			expr: /^``$/g,
			replacement: "",
			reason: "Remove empty code",
			context: ["code"]
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
			expr: /([,\!\?\.\:]) {2,}/gm,
			replacement: "$1 ",
			reason: "grammar"
		},
		capitalizeWord(".htaccess","\\.?htacc?ess?"),
		capitalizeWordAndVersion("iOS", null, " "),
		capitalizeWord("Node.js","node\\.js"),
		capitalizeWordAndVersion("SQLite"),
		capitalizeWord("UTF-8"),
		{
			expr: new RegExp(/((?:^|\s)\(?)([A-Za-z0-9'\-]+)/.source + POST_CODE_FORMAT.source, "gm"),
			replacement: (p0,p1,w,p3)=>{
				if (MISSPELLINGS.hasOwnProperty(w)){
					w = MISSPELLINGS[w] // abbreviations or all lower case
				} else {
					var lc = w.toLowerCase()
					if (MISSPELLINGS.hasOwnProperty(lc)){
						var correct = MISSPELLINGS[lc]
						if (/[A-Z]/.test(correct)) w = correct // Always use capitalization proper noun corrections
						else if (/^(?:[A-Z][a-z]+)+$/.test(w)) w = correct[0].toUpperCase() + correct.substr(1) // Match capitalizization of misspelling
						else w = correct // Use lower case correction
					}
				}
				return p1+w+p3
			},
			reason: "spelling"
		},{
			edit: s=>{
				var m, tokens=[], replacements = []
				while (m = WORD_OR_NON.exec(s)){
					tokens.push(m[0])
				}
				for (var i=0; i<tokens.length-2; i++){
					if (WORD.test(tokens[i]) && /^[ \/\-]+$/.test(tokens[i+1])){
						var lc = (tokens[i] + " " + tokens[i+2]).toLowerCase()
						if (MISSPELLINGS.hasOwnProperty(lc)){
							var original = tokens[i] + tokens[i+1] + tokens[i+2]
							var correct = MISSPELLINGS[lc]
							if (!/[A-Z]/.test(correct) && /^(?:[A-Z][a-z]+)+$/.test(original)) correct = correct[0].toUpperCase() + correct.substr(1) // Match capitalizization of misspelling
							if (correct != original){
								tokens[i] = correct
								tokens[i+1] = ""
								tokens[i+2] = ""
								replacements.push({i:original,o:correct})
							}
						}
					}
				}
				return [replacements.length==0?s:tokens.join(""),replacements]
			},
			reason: "spelling"
		},{
			expr: /((?:^|\s)\(?)c(#|\++|\s|$)/gm,
			replacement: "$1C$2",
			reason: "spelling"
		},{
			expr: new RegExp(/((?:^|\s)\(?)[Ii]'?(m|ve)/.source + POST_CODE_FORMAT.source, "gm"),
			replacement: "$1I'$2$3",
			reason: "spelling"
		},{
			expr: new RegExp(
				"(?:[\\.\\!\\?]|\n\n|\r\r|\r\n\r\n|^)[\r\n\t ]*(?:"+ // Required start of sentence or paragraph
					"(?:" + CONTENT_FREE_WORDS + BETWEEN_WORDS + ")*(?:(?:"+[
						"thanks",
						"thank[ \\-]+you"
					].join(")|(?:")+"))"+
					"(?:" + BETWEEN_WORDS + CONTENT_FREE_WORDS + ")*"+
					" *(?:[\\.\\!\\?]|\n\n|\r\r|\r\n\r\n|$)"+ // Required end of sentence or paragraph
					"[ \r\n\t]*"+
				")+","gi"
			),
			replacement: removeLeaveSpace,
			reason: "remove niceties"
		},{
			expr: new RegExp(
				// any help?
				"(?:^| +)(?:"+
					"(?:" + CONTENT_FREE_WORDS + BETWEEN_WORDS + ")*"+
					"(?:any|some)\\s"+ANSWER_WORDS.source+
					"(?:" + BETWEEN_WORDS + CONTENT_FREE_WORDS + ")*"+
					"(?: *\\?)+"+ // Required ending question mark
					"(?: +|$)"+
				")+","gmi"
			),
			replacement: removeLeaveSpace,
			reason: "remove niceties"
		},{
			expr: new RegExp(
				"(?:^| +)(?:"+
					"(?:" + CONTENT_FREE_WORDS + BETWEEN_WORDS + ")*(?:(?:"+[
						// thanks ... answer
						"(?:thanks|(?:thank[ \\-]+you)|hoping|look|looking|someone|somebody|please|kindly|appreciate|need|seek|seeking)(" + BETWEEN_WORDS + CONTENT_FREE_WORDS + ")*" + BETWEEN_WORDS + ANSWER_WORDS.source,
						// hope ... helps
						"(?:hope|hopefully)(" + BETWEEN_WORDS + CONTENT_FREE_WORDS + ")*" + BETWEEN_WORDS + "(?:helps?|helped|fix|fixes|useful)",
						// thanks ... advance
						"(?:thanks|(?:thank[ \\-]+you))(" + BETWEEN_WORDS + CONTENT_FREE_WORDS + ")*" + BETWEEN_WORDS + "(?:advance)",
						// answer ... please
						ANSWER_WORDS.source+"(" + BETWEEN_WORDS + CONTENT_FREE_WORDS + ")*" + BETWEEN_WORDS + "(?:appreciated|good|great|please)",
					].join(")|(?:")+"))"+
					"(?:" + BETWEEN_WORDS + CONTENT_FREE_WORDS + ")*"+
					"(?: *[\\:\\.\\!\\,\\?])*"+ // Optional end of a phrase or sentence
					"(?: +|$)"+
				")+","gmi"
			),
			replacement: removeLeaveSpace,
			reason: "remove niceties"
		},{
			expr: new RegExp(
				"(?:^|(?<=[\\:\\.\\!\\?\\n] *))(?:"+ // end of previous phrase or sentence
					"(?:" + CONTENT_FREE_WORDS + BETWEEN_WORDS + ")*(?:"+
						"(?:help|please|thanks|(?:thank[ \\-]+you))" +
					")(?:" + BETWEEN_WORDS + CONTENT_FREE_WORDS + ")*"+
					"(?: *(?:[\\:\\.\\!\\?\\n]|$)) *"+ // end of a phrase or sentence
				")+","gmi"
			),
			replacement: removeLeaveSpace,
			reason: "remove niceties"
		},{
			expr: /(?:^|[ \t]+)(?:my\s+first\s+question)\s*[\.\!\,\?]?(?:[ \t]+|$)/gmi,
			replacement: removeLeaveSpace,
			reason: "remove niceties"
		},{
			expr: /(?:(?:^|[ \t]+)(?:greetings|cheers|hi|hello|regards|good\s(?:evening|morning|day|afternoon))(?:\s+(?:guys|folks|everybody|everyone|all))?\s*[\.\!\,]?)+(?:[ \t]+|$)/gmi,
			replacement: removeLeaveSpace,
			reason: "remove niceties"
		},{
			expr: /(^|[\.\!\?])[ \\t]*(?:^\**)(edit|edited|updated?):?(?:[\*\:]+)[ \t]*/gmi,
			replacement: "$1",
			reason: "remove niceties"
		},{
			// No lower case at all
			expr: /^((?=.*[A-Z])[^a-z]*)$/g,
			replacement: ($0,$1) => $1[0] + $1.substring(1).toLowerCase(),
			reason: "capitalization",
			context: ["title"]
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
			expr: new RegExp(
				PRE_CODE_FORMAT.source +
				'(' +
					'(?:' +
						'(?:' +
							'(?:' +
								'(?:https?:\\/\\/)?'+ // Optional protocol
								USER_OPT.source +
								'(?:'+
									// example.tld style domains
									'(?:'+SUBDOM.source+'example'+TLD.source +')|'+
									// some.example style domains
									'(?:'+SUBDOM.source+'[a-zA-Z0-9\\-]+\\.(?:example|localhost|invalid|test))|' +
									// IPV6 IP addresses
									/(?:(?:(?:[A-Fa-f0-9]{1,4}:){2,7}[A-Fa-f0-9]{1,4})|(?:[A-Fa-f0-9]{0,4}::[A-Fa-f0-9]{1,4}(?::[A-Fa-f0-9]{1,4}){0,6}))/.source + '|' +
									// IPV4 IP addresses
									/(?:(?:[0-9]{1,3}\.){3}[0-9]{1,3})/.source +
								')'+
							')|(?:' +
								// domains without TLD (like localhost) formatted in URL
								'(?:https?:\\/\\/)' + // Required protocol
								USER_OPT.source +
								'[a-zA-Z0-9]+' + // Host name with no dots
							')' +
						')' +
						PORT_OPT.source +
						REST_OF_URL.source +
					')|(?:' +
						// domains without TLD (like localhost) with port number
						USER_OPT.source +
						'(?:[a-zA-Z0-9\-]*[a-zA-Z]+[a-zA-Z0-9\-]*\\:[0-9]+)' +
						REST_OF_URL.source +
					')|(?:' +
						// email addresses
						'[a-zA-Z0-9\\-_]+\\@(?:[a-zA-Z0-9\\-]+\\.)*[a-zA-Z]+' +
					')' +
				')'+
				POST_CODE_FORMAT.source
			,'gmi'),
			replacement: applyCodeFormat,
			reason: "code format example URL",
			context: ["text","url"]
		},{
			expr: new RegExp(
				PRE_CODE_FORMAT.source +
				'(' +
					'(?:' +
						// File name with common file extension
						'[a-zA-Z0-9\\._\\-\\/\\~\\\\]*'+
						// Extension list from https://fileinfo.com/filetypes/common
						// and https://gist.github.com/ppisarczyk/43962d06686722d26d176fad46879d41
						'\\.(?:1in|1m|1x|3dm|3ds|3g2|3gp|3in|3m|3qt|3x|4th|6pl|6pm|7z|E|ML|_coffee|_js|_ls|a51|abap|accdb|ada|adb|ado|adoc|adp|ads|agda|ahk|ahkl|ai|aif|aj|al|als|ampl|anim|ant|apacheconf|apib|apk|apl|app|applescript|arc|arpa|as|asax|asc|asciidoc|ascx|asd|asf|ash|ashx|asm|asmx|asp|aspx|asset|au3|aug|auk|aux|avi|aw|awk|axd|axi|axml|axs|b|bak|bas|bash|bat|bats|bb|bbx|befunge|bf|bib|bin|bison|bmp|bmx|bones|boo|boot|brd|bro|brs|bsv|builder|bzl|c|c\\+\\+|c\\+\\+-objdump|c\\+\\+objdump|c-objdump|cab|cake|capnp|cats|cbl|cbr|cbx|cc|ccp|ccxml|cdf|cer|ceylon|cfc|cfg|cfm|cfml|cgi|ch|chpl|chs|cirru|cjsx|ck|cl|'
						+'cl2|class|click|clixml|clj|cljc|cljs|cljscm|cljx|clp|cls|clw|cmake|cmd|cob|cobol|coffee|com|command|conf|config|coq|cp|cpl|cpp|cpp-objdump|cppobjdump|cproject|cps|cpy|cql|cr|crdownload|creole|crx|cs|csh|cshtml|csl|cson|csproj|csr|css|csv|csx|ct|ctp|cu|cue|cuh|cur|cw|cxx|cxx-objdump|cy|d|d-objdump|darcspatch|dart|dat|dats|db|db2|dbf|dcl|dcr|ddl|dds|deb|decls|deface|dem|deskthemepack|desktop|dfm|di|diff|dist|dita|ditamap|ditaval|djs|dll|dlm|dm|dmg|dmp|do|doc|dockerfile|docx|doh|dot|dotsettings|dpatch|dpr|druby|drv|dtd|dtx|duby|dwg|dxf|dyalog|dyl|dylan|e|ebuild|ec|ecl|eclass|eclxml|edn|eex|'+
						'eh|el|eliom|eliomi|elm|em|emacs|emberscript|epj|eps|erb|erl|es|es6|escript|ex|exe|exs|f|f03|f08|f77|f90|f95|factor|fan|fancypack|fcgi|feature|filters|fish|fla|flex|flux|flv|fnt|fon|for|forth|fp|fpp|fr|frag|frg|frm|frt|frx|fs|fsh|fshader|fsi|fsproj|fsx|fth|ftl|fun|fx|fxh|fxml|fy|g|g4|gadget|gam|gap|gawk|gco|gcode|gd|ged|gemspec|geo|geojson|geom|gf|gi|gif|glade|glf|glsl|glslv|gml|gms|gnu|gnuplot|go|god|golo|gp|gpx|grace|gradle|graphql|groovy|grt|grxml|gs|gshader|gsp|gst|gsx|gtpl|gv|gvy|gyp|gz|h|h\\+\\+|haml|handlebars|hats|hb|hbs|hcl|heic|hh|hic|hl|hlean|hlsl|hlsli|hpp|hqf|hqx|hrl|hs|hsc|htaccess|htm|html|http|hx|hxsl|hxx|hy|i7x|iced|icl|icns|ico|ics|idc|'+
						'idr|iff|ihlp|ijs|ik|ily|iml|in|inc|indd|ini|inl|ino|ins|intr|io|ipf|ipp|ipynb|irbrc|irclog|iso|iss|ivy|j|jade|jake|jar|java|jbuilder|jelly|jflex|jinja|jl|jpg|jq|js|jsb|jscad|jsfl|jsm|json|json5|jsonld|jsp|jsproj|jss|jsx|key|keychain|kicad_pcb|kid|kit|kml|kmz|krl|ksh|kt|ktm|kts|l|lagda|las|lasso|lasso8|lasso9|latte|launch|lbx|ld|ldml|lds|lean|less|lex|lfe|lgt|lhs|lid|lidr|liquid|lisp|litcoffee|ll|lmi|lnk|lock|log|logtalk|lol|lookml|lpr|ls|lsl|lslp|lsp|ltx|lua|lvproj|ly|m|m3u|m4|m4a|m4v|ma|mak|mako|man|mao|markdown|mask|mat|mata|matah|mathematica|matlab|mawk|max|maxhelp|maxpat|'+
						'maxproj|mcr|md|mdb|mdf|mdpolicy|me|mediawiki|meta|metadata|metal|mid|mim|minid|mir|mirah|mk|mkd|mkdn|mkdown|mkfile|mkii|mkiv|mkvi|ml|ml4|mli|mll|mly|mm|mmk|mms|mo|mod|monkey|moo|moon|mov|mp3|mp4|mpa|mpg|ms|msg|msi|mspec|mss|mt|mtml|mu|muf|mumps|mustache|mxml|mxt|myt|n|nasm|nawk|nb|nbp|nc|ncl|nes|nginxconf|ni|nim|nimrod|ninja|nit|nix|njs|nl|nlogo|no|nproj|nqp|nse|nsh|nsi|nu|numpy|numpyw|numsc|nuspec|nut|ny|obj|objdump|odd|odt|omgrofl|ooc|opa|opal|opencl|org|osm|otf|owl|ox|oxh|oxo|oxygene|oz|p|p6|p6l|p6m|pac|pages|pan|parrot|part|pas|pasm|pat|patch|pb|pbi|pck|pct|pd|pd_lua|pdb|pde|pdf|perl|ph|php|php3|php4|php5|phps|phpt|phtml|pig|pike|pir|pkb|pkg|pkl|pks|pl|pl6|'+
						'plb|plist|plot|pls|plsql|plt|plugin|pluginspec|plx|pm|pm6|pmod|png|po|pod|podsl|podspec|pogo|pony|pot|pov|pp|ppk|ppt|pptx|prc|prefab|prefs|prf|prg|pri|pro|prolog|properties|props|proto|prw|ps|ps1|ps1xml|psc|psc1|psd|psd1|psgi|psm1|pspimage|pt|pub|purs|pwn|pxd|pxi|py|pyde|pyp|pyt|pytb|pyw|pyx|qbs|qml|r|r2|r3|rabl|rake|raml|rar|raw|rb|rbbas|rbfrm|rbmnu|rbres|rbtbar|rbuild|rbuistate|rbw|rbx|rbxs|rd|rdf|rdoc|reb|rebol|red|reds|reek|rest|rg|rhtml|rkt|rktd|rktl|rl|rm|rmd|rno|robot|roff|rom|ron|rpm|rpy|rq|rs|rsh|rss|rst|rsx|rtf|ru|ruby|rviz|s|sage|sagews|sas|sass|sats|sav|sbt|sc|scad|scala|scaml|scd|sce|sch|sci|scm|scpt|scrbl|scss|scxml|sdf|self|sexp|sh|'+
						'sh-session|shader|shen|sig|sitx|sj|sjs|sl|sld|slim|sln|sls|sma|smali|sml|smt|smt2|sp|sparql|spin|sps|sqf|sql|srdf|srt|ss|ssjs|st|stTheme|stan|sthlp|ston|storyboard|sty|styl|sublime-build|sublime-commands|sublime-completions|sublime-keymap|sublime-macro|sublime-menu|sublime-mousemap|sublime-project|sublime-settings|sublime-syntax|sublime-theme|sublime-workspace|sublime_metrics|sublime_session|sv|svg|svh|swf|swift|syntax|sys|t|tab|tac|tar|targets|targz|tcc|tcl|tcsh|tea|tex|textile|tf|tga|tgz|thm|thor|thrift|thy|tif|tiff|tm|tmCommand|tmLanguage|tmPreferences|tmSnippet|tmTheme|tml|tmp|tmux|toast|toc|toml|tool|topojson|torrent|tpl|tpp|'+
						'ts|tst|tsx|ttf|ttl|tu|twig|txl|txt|uc|udf|ui|unity|uno|upc|ur|urdf|urs|uue|ux|v|vala|vapi|vark|vb|vba|vbhtml|vbproj|vbs|vcd|vcf|vcl|vcxproj|veo|vert|vh|vhd|vhdl|vhf|vhi|vho|vhost|vhs|vht|vhw|vim|viw|vob|volt|vrx|vsh|vshader|vssettings|vue|vxml|w|watchr|wav|webidl|weechatlog|wiki|wisp|wl|wlt|wlua|wma|wmv|wpd|wps|wsdl|wsf|wsgi|wxi|wxl|wxs|x10|x3d|xacro|xaml|xc|xcodeproj|xht|xhtml|xi|xib|xlf|xliff|xlr|xls|xlsx|xm|xmi|xml|xojo_code|xojo_menu|xojo_report|xojo_script|xojo_toolbar|xojo_window|xpl|xproc|xproj|xpy|xq|xql|xqm|xquery|xqy|xrl|xs|xsd|xsjs|xsjslib|xsl|xslt|xsp-config|xtend|xul|y|yacc|yaml|yaml-tmlanguage|yang|yap|yml|yrl|yuv|yy|zcml|zep|zimpl|zip|zipx|zmpl|zone|zpl|zsh)'+
					')|(?:'+
						// Directory ending in slash (or backslash)
						'[a-zA-Z0-9\\._\\-\\~]*[\\/\\\\](?:[a-zA-Z0-9\\._\\-\\~]+[\\/\\\\])+'+
					')|(?:'+
						// Directory starting in slash
						'(?:\\/[a-zA-Z0-9\\._\\-\\~]+){2,}'+
					')|(?:'+
						// Windows file starting with drive letter
						'(?:[A-Z]\\:\\\\)[a-zA-Z0-9\\._\\-\\~\\\\]+'+
					')' +
				')' +
				POST_CODE_FORMAT.source
			,"gmi"),
			replacement: applyCodeFormat,
			reason: "code format file name",
			context: ["text"]
		},{
			// Remove trailing white space
			expr: /[ \t]+(\r\n|\n|$)/gm,
			replacement: "$1",
			reason: "formatting",
			context: ["fullbody","title"]
		},{
			// Remove multiple new lines
			expr: /(?:\r|\n|\r\n){3,}/gm,
			replacement: "\n\n",
			reason: "formatting",
			context: ["fullbody"]
		}
	]

	function applyCodeFormat (m,prefix,start,url,suffix){
		start=start||''
		suffix=suffix||''
		var code='`'
		if ((m = url.search(/[_\*\"\'\`\;\,\.\?\:\!\)\>]+$/)) != -1){
			suffix = url.substr(m) + suffix
			url = url.substr(0,m)
		}
		if (start && /[\_\*\"\']+/.test(start) && suffix.startsWith(start)){
			suffix=suffix.substr(start.length)
			start = ""
		} else if (url.length<=4 && !url.match(/::/)){
			code=""
		} else if (url.match(/^node\.js$/i)){
			code=""
		}
		return prefix+start+code+url+code+suffix
	}

	function normalizeDomain(d){
		return d.replace(/\\/g,"").toLowerCase()
	}

	function removeLeaveSpace(s){
		var start = "", end=""
		if (/^[\.\!\?]/.test(s)){
			start = s[0]
			s = s.substr(1)
		}
		if(/^(?:\r\r|\n\n|\r\n\r\n)(\s|\S)*[ \t\r\n]$/.test(s)) end="\n\n"
		else if(/^[ \t\r\n](\s|\S)*(?:\r\r|\n\n|\r\n\r\n)$/.test(s)) end="\n\n"
		else if(/^[\r\n](\s|\S)*[ \t\r\n]$/.test(s)) end="\n"
		else if(/^[ \t\r\n](\s|\S)*(?:\r|\n|\r\n)$/.test(s)) end="\n"
		else if(/^[ \t\r\n](\s|\S)*[ \t\r\n]$/.test(s)) end=" "
		return start+end
	}

	// Create a rule for converting the given word into its exact given case.
	// The regex parameter is optional, if none is given, it is auto-created from the word
	// The auto created regex inserts white space for camel case words, a custom regex
	// should be created if other white space removal desired
	function capitalizeWord(word, re){
		if (!re) re = word
		re = re.replace(/[ \-]+/g, "[\\s\\-]*")
		re = re.replace(/([A-Z][a-z]+)([A-Z])/g, "$1\\s*$2")
		return {
			expr: new RegExp("((?:^|\\s)\\(?)(?:"+re+")"+POST_CODE_FORMAT.source,"igm"),
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
			expr: new RegExp("((?:^|\\s)\\(?)(?:"+re+")"+(separator==" "?"\\s*":"")+"([0-9]+)"+POST_CODE_FORMAT.source,"igm"),
			replacement: "$1"+word+separator+"$2$3",
			reason: "spelling"
		}
	}
	function tokenizeMarkdown(str){
		var tokens=[], m,
		startRx = new RegExp("(" + [
			/^ {0,3}([\~]{3,}|[\`]{3,})/, // start of code fence (group 1 and 2)
			/\<(?:[^\>\r\n]+)[\>\r\n]/, // HTML tag (group 3)
			/^(?: {0,3}>)*(?: {4}|\t)/, // start of indented code (group 4)
			/`/, // start of single backtick code (group 5)
			/\]\([^\)\r\n]+\)/, // link (group 6)
			/^ {0,3}\[[^ \t\r\n]+\]\:\s[^\r\n]*/, // footnote link (group 7)
			/(?:_+|\*+|[\'\"\(])?https?\:\/\/[^ \t\r\n]*/ // URL (group 8)
		].map(r=>r.source).join(')|(') + ")","gim"),
		codeRx = new RegExp("((?:" + [
			/(?: {0,3}>)*(?: {4}|\t).*(?:[\r\n]+(?: {0,3}>)*(?: {4}|\t).*)*/, // indented block
			/`[^`\r\n]*`/, // single back ticks
			/<\s*pre(?:\s[^>]*)?>[\s\S]*?<\s*\/\s*pre\s*>/, // HTML pre tags
			/<\s*code(?:\s[^>]*)?>[\s\S]*?<\s*\/\s*code\s*>/, // HTML code tags
		].map(r=>r.source).join(')|(?:') + "))","gi"),
		lastEnd=0
		while(m = (startRx.exec(str))){
			var thisStart=m.index
			if (m.index-lastEnd>0){
				tokens.push({type:"text",content:str.slice(lastEnd,m.index)})
				lastEnd=m.index
			}
			if (m[1]){
				// code fence
				var fence = m[2],
				endRx = new RegExp("^ {0,3}"+fence,"gm")
				endRx.lastIndex = lastEnd+fence.length
				if (m=(endRx.exec(str))){
					var end = m.index+fence.length
					tokens.push({type:"code",content:str.slice(lastEnd,end)})
					lastEnd=end
				} else {
					tokens.push({type:"code",content:str.substr(lastEnd)})
					return tokens
				}
			} else if (m[3] || m[4] || m[5]){
				// html tag OR indented code OR single backtick code
				codeRx.lastIndex = lastEnd
				var codeM=codeRx.exec(str)
				if (codeM && codeM.index == lastEnd){
					tokens.push({type:"code",content:codeM[1]})
					lastEnd+=codeM[1].length
				} else if (m[3]) {
					// Other HTML tags
					tokens.push({type:"html",content:m[3]})
					lastEnd+=m[3].length
				} else {
					tokens.push({type:"error",content:str.substr(lastEnd)})
					return tokens
				}
			} else if (m[6] || m[7]){
				var link = m[6] || m[7]
				tokens.push({type:"link",content:link})
				lastEnd+=link.length
			} else if (m[8]){
				tokens.push({type:"url",content:m[8]})
				lastEnd+=m[8].length
			} else {
				tokens.push({type:"error",content:str.substr(lastEnd)})
				return tokens
			}
			startRx.lastIndex=lastEnd
		}
		if (lastEnd<str.length)tokens.push({type:"text",content:str.substr(lastEnd,str.length)})
		return tokens
	}

	function getDefaultData(){
		return {
			editCount:0, reasons:[], replacements:[]
		}
	}

	function applyRules(d, input, type){
		rules.forEach(rule=>{
			var context = rule.context || ["title","text"]
			if (context.includes(type)){
				var ruleEditCount = 0,
				output = input
				if (rule.edit){
					var o = rule.edit(input)
					output = o[0]
					for (var i=0; i<o[1].length; i++){
						o[1][i].r = rule.reason;
						d.replacements.push(o[1][i])
					}
				} else {
					for(let m of input.matchAll(rule.expr)){
						var a = m[0]
						var b = a.replace(rule.expr, rule.replacement)
						if (a != b){
							d.replacements.push({i:a,o:b,r:rule.reason})
							ruleEditCount++
						}
					}
					output = input.replace(rule.expr, rule.replacement)
				}
				if (output != input){
					d.editCount+=ruleEditCount
					d.reasons.push(rule.reason)
					input = output
				}
			}
		})
		return input
	}

	function recordExampleDomainsInput(d,input){
		if (!input) return;
		for(let m of input.matchAll(EXAMPLE_DOMAIN)){
			var name=normalizeDomain(m[2]), tld=normalizeDomain(m[3]),domain=name+tld
			if (!d.exampleDomains.hasOwnProperty(domain)){
				d.exampleDomains[domain] = 1
				if (!d.exampleDomains.hasOwnProperty(tld)) d.exampleDomains[tld]=0
				d.exampleDomains[tld]++
			}
		}
	}

	function recordExampleDomains(d){
		for (var i=0; i<d.bodyTokens.length; i++){
			if (/^(?:text|code|url)$/.test(d.bodyTokens[i].type)){
				recordExampleDomainsInput(d,d.bodyTokens[i].content)
			}
		}
		if (d.title) recordExampleDomainsInput(d, d.title)
	}

	var context

	function edit(d){
		context = d
		d.exampleDomains = {}
		do {
			var editsMade = d.replacements.length

			d.body = applyRules(d, d.body, "fullbody")
			d.bodyTokens = tokenizeMarkdown(d.body)
			if (!Object.keys(d.exampleDomains).length) recordExampleDomains(d)
			for (var i=0; i<d.bodyTokens.length; i++){
				d.bodyTokens[i].content = applyRules(d, d.bodyTokens[i].content, d.bodyTokens[i].type)
			}
			d.body = d.bodyTokens.map(t=>t.content).join("")

			if (d.title) d.title = applyRules(d, d.title, "title")

			editsMade = d.replacements.length - editsMade
		} while(editsMade>0)

		return d
	}

	function buildSummary(summary, reasons){
		var used={}
		summary.split(/, */).map(i=>{if(i)used[i]=1})
		for (var i=0; i<reasons.length; i++){
			// If this reason not already added, and overall summary not getting too long
			if (!used.hasOwnProperty(reasons[i]) && summary.length < 200) {
				summary += (summary.length==0?"":", ") + reasons[i]
				used[reasons[i]]=1
			}
		}
		return summary
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
			.autoEditorInfo *+h1{margin-top: 1em}
			.autoEditorInfo table{border-spacing.5em;margin-bottom:2em;}
			.autoEditorInfo th{font-weight:bold}
			.autoEditorInfo button.close{float:right}
			.autoEditorInfo th,.autoEditorInfo td{border:1px solid black;padding:0.5em}
			.autoEditorInfo td:not(:last-child){font-family:monospace;white-space:pre-wrap}
			.autoEditorInfo .diff{font-family:monospace;white-space:pre-wrap;margin-bottom:2em;max-width:600px}
			.autoEditorInfo ins{background:#cfc}
			.autoEditorInfo del{background:#fcc}
			.autoEditorInfo .editsMade{position:relative}
			.autoEditorInfo .ws::after{content:"∙";position:absolute;transform:translate(-8px, 0px);color:var(--yellow-400)}
			.autoEditorInfo .wn::before{content:"↲";position:absolute;color:var(--yellow-400)}
			.autoEditorInfo .wt::after{content:"→";position:absolute;transform:translate(-22px, 0px);color:var(--yellow-400)}
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
				if (d.lastrun){
					// Second time button clicked, show a report
					if($('.autoEditorInfo').length) return // already open
					var info = $('<div class=content>').append($("<button class=close>Close</button>").click(()=>info.parent().remove())), table
					d.info=info
					if(d.getBody() != d.lastrun.body || d.getTitle() != d.lastrun.title){
						info.append("<h1>Manual edits detected</h1>").append($("<button>Re-run auto-edits</button>").click(()=>replaceFromUi(d)))
					}
					if (!d.replacements.length){
						info.append($("<h1>No auto-edits</h1>"))
					} else {
						info.append($("<h1>Auto-edits</h1>"))
						table = $("<table class=editsMade>").append($("<tr><th>Found</th><th>Replaced</th><th>Reason</th></tr>"))
						$.each(d.replacements, (x,r)=>{
							if (r.i.search(/^[ \t]+/)!=-1 && r.o.search(/^[ \t]+/)!=-1){
								r.i=r.i.replace(/^[ \t]+/,"")
								r.o=r.o.replace(/^[ \t]+/,"")
							}
							table.append($("<tr>").append($("<td>").html(visibleSpace(r.i))).append($("<td>").html(visibleSpace(r.o))).append($("<td>").html(r.r)))
						})
						info.append(table)
					}
					d.diffsfrom=$("<select class=diffsfrom><option value=initial>Before all edits</option><option selected value=before>Before last auto-edit</option></select>").on("change",(()=>doDiffs(d)))
					d.diffsto=$("<select class=diffsto><option value=lastrun>After last auto-edit</option><option value=now>Now</option></select>").on("change",(()=>doDiffs(d)))
					info.append($("<h1>Diffs from </h1>").append(d.diffsfrom).append(" to ").append(d.diffsto))
					info.append(d.diffs = $("<div class=diff>"))
					doDiffs(d)
					$('body').prepend($('<div class=autoEditorInfo>').append(info).click(e=>{
						if($(e.target).is('.autoEditorInfo')){
							e.preventDefault()
							$(e.target).remove()
							return false
						}
					}))
				} else {
					// First time button clicked, do all the replacements
					replaceFromUi(d)
				}
				return false
			})
		}

		function doDiffs(d){
			recordText(d, "now")
			var diffsfrom=d.diffsfrom.val(),
			diffsto=d.diffsto.val()
			try {
				var title = ""
				if(d[diffsfrom].title) title += "<h1>" + diff2html(d[diffsfrom].title, d[diffsto].title) + "</h1>"
				d.diffs.html(title + diff2html(d[diffsfrom].body, d[diffsto].body))
			} catch (x){
				d.diffs.html("")
				d.diffs.append($("<pre>").text("Diffs failed to render\n" + x.toString() + "\n\n" + x.stack))
			}
		}

		function replaceFromUi(d){
			if (d.info) d.info.parent().remove()
			recordText(d, "before")
			d.body = d.before.body
			d.title = d.before.title
			edit(d)
			// Flash red or green depending on whether edits were made
			d.flashMe.animate({backgroundColor:d.editCount==0?cssColorVar('--red-100'):cssColorVar('--green-100')},10)
			// Then back to white
			d.flashMe.animate({backgroundColor:cssColorVar('--white')})
			// Update values in UI
			d.setTitle(d.title)
			d.setBody(d.body)
			d.setSummary(buildSummary(d.getSummary(),d.reasons))
			recordText(d,"lastrun")

		}

		function needsButton(editor){
			if (!$(editor).is(':visible')) return false // not showing up
			if ($(editor).find('.autoEditorButton').length > 0) return false // Already has editor
			return true
		}

		function recordText(d,name){
			d[name]={
				title: d.getTitle(),
				body: d.getBody()
			}
		}

		// Continually monitor for newly created editing widgets
		setInterval(()=>{
			$('.wmd-button-bar').each(function(){
				if (needsButton(this)){
					var d = getDefaultData(),
					editContainer = $(this).parents('.inline-editor, .post-form, .post-editor').last(),
					bodyBox = editContainer.find('.js-post-body-field'),
					summaryBox = editContainer.find('.js-post-edit-comment-field'),
					titleBox = editContainer.find('.js-post-title-field')
					d.getTitle = function(){
						return titleBox.length?titleBox.val():''
					}
					d.setTitle = function(s){
						if (!titleBox.length) return
						titleBox.val(s)
						titleBox[0].dispatchEvent(new Event('keyup')) // Cause title display to be updated
					}
					d.getBody = function(){
						return bodyBox.val()
					}
					d.setBody = function(s){
						bodyBox.val(s)
						bodyBox[0].dispatchEvent(new Event('keypress')) // Cause markdown re-parse
					}
					d.flashMe = bodyBox
					d.getSummary = function(){
						return summaryBox.val()
					}
					d.setSummary = function(s){
						summaryBox.val(s)
					}
					editContainer.find('.wmd-spacer').last().before($('<li class=wmd-spacer>')).before(addClick($('<li class="wmd-button autoEditorButton" title="Auto edit Ctrl+E">'),d))
					recordText(d,"initial")
				}
			})
			$('.js-stacks-editor-container').each(function(){
				if (needsButton(this)){
					var d = getDefaultData(),
					editContainer = $(this).parents('.inline-editor, .post-form, .post-editor').last(),
					editArea = editContainer.find('.js-post-body-field'),
					summaryBox = editContainer.find('.js-post-edit-comment-field')
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
					d.flashMe = editContainer.find('.js-editor')
					d.getSummary = function(){
						return summaryBox.val()
					}
					d.setSummary = function(s){
						summaryBox.val(s)
					}
					editContainer.find('.js-editor-btn').last().before(addClick(
						$('<button class="autoEditorButton s-editor-btn js-editor-btn" title="Auto edit Ctrl+E">'),d
					)).before(($('<div class="flex--item w16 is-disabled" data-key=spacer>')))
					recordText(d,"initial")
				}
			})
			$('.js-edit-comment-form, .comment-form').each(function(){
				if (needsButton(this)){
					var d = getDefaultData(),
					postEditor = $(this),
					editArea = postEditor.find('textarea')
					d.getTitle = function(){
						return "" // This style editor only used for comments, so never a title
					}
					d.setTitle = function(s){} // no-op
					d.getBody = function(){
						return editArea.val()
					}
					d.setBody = function(s){
						editArea.val(s)
					}
					d.flashMe = editArea
					d.getSummary = function(){
						return ""
					}
					d.setSummary = function(){} // no-op, no summary for comment edits
					$(this).find('.form-error').before(addClick(
						$('<button class="autoEditorButton s-editor-btn js-editor-btn" title="Auto edit">'),d
					))
					recordText(d,"initial")
				}
			})
		},200)

		function visibleSpace(s){
			s=escHtml(s)
			s=s.replace(/( )/g,"<span class=ws>$1</span>")
			s=s.replace(/(\r)/g,"<span class=wr>$1</span>")
			s=s.replace(/(\n)/g,"<span class=wn>$1</span>")
			s=s.replace(/(\t)/g,"<span class=wt>$1</span>")
			return s
		}
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

	function main(){
		process.argv.shift()
		process.argv.shift()
		var command = process.argv.shift() || "test"
		eval(require('fs').readFileSync(command+'.js')+'')
	}

	if (typeof unsafeWindow !== 'undefined') ui() // Running as user script
	if (typeof process !== 'undefined') main() // Running from command line
})()
