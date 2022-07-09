// Example of how to run this:
// Download the data dump from https://archive.org/details/stackexchange
// then this command will get the top 50 misspellings from the first 10,000 posts
// 7zcat /stackexchange/stackoverflow.com-Posts.7z | head -n 10000 | node editor.user.js stack-exchange-words | sort | uniq -c | sort -n | tail -n 50

var readline = require('readline')
const fs = require('fs')
const { exec } = require("child_process")

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})

const ROW = /^ *<row /
const TITLE = /Title="([^"]+)"/
const BODY = /Body="([^"]+)"/
const EN_WORDS = {}
const MISSPELLINGS = {}

;(async function(){
	if (!fs.existsSync("aspell_en.txt")) {
		await exec("aspell -l en dump master > aspell_en.txt")
		if (!fs.existsSync("aspell_en.txt")) {
			console.log("aspell list does not exist.  Create it by running:")
			console.log("aspell -l en dump master > aspell_en.txt")
			process.exit(1)
		}
	}
})()

fs.readFileSync('aspell.txt', 'utf-8').split(/\r?\n/).forEach(line =>  {
	EN_WORDS[line] = 1
})

fs.readFileSync('stack-exchange-words.txt', 'utf-8').split(/\r?\n/).forEach(line =>  {
	EN_WORDS[line] = 1
})

fs.readFileSync('stack-exchange-misspellings.txt', 'utf-8').split(/\r?\n/).forEach(line =>  {
	MISSPELLINGS[line] = 1
})

const EN_NEEDS_CAPS = {}
for (const [word, value] of Object.entries(EN_WORDS)) {
	if (/[A-Z]/.test(word)){
		EN_NEEDS_CAPS[word.toLowerCase()] = 1
	}
}

rl.on('line', function(line){
	if (ROW.test(line)){
		var m, title="", body=""
		if (m=TITLE.exec(line)){
			printWords(decodeEntities(m[1]))
		}
		if (m=BODY.exec(line)){
		   body = tokenizeMarkdown(decodeEntities(m[1]))
		   for (var i=0; i<body.length; i++){
			   if (body[i].type=="text"){
				   printWords(decodeEntities(body[i].content))
			   }
		   }
		}
	}
})

function printWords(s){
	s.replaceAll(/(?<=^|\s)\w+(?:['\-]\w+)*(?=[_\*\"\'\`\;\,\.\?\:\!\)\>]*(?:\s|$))/gm, function(word){
		var normalized = word.toLowerCase().replace(/'s$/,"")
		if (word.length > 1 && !EN_WORDS.hasOwnProperty(normalized) && /[a-zA-Z]/.test(word) && !EN_WORDS.hasOwnProperty(word)){
			if (MISSPELLINGS.hasOwnProperty(word)){
				word = "+" + word
			} else if (EN_NEEDS_CAPS.hasOwnProperty(normalized)){
				word = "*" + word
			}
			console.log(word)
		}
	})
}

// https://stackoverflow.com/a/44195856
function decodeEntities(encodedString) {
	var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
	var translate = {
		"nbsp": " ",
		"amp" : "&",
		"quot": '"',
		"lt"  : "<",
		"gt"  : ">"
	};
	return encodedString.replace(translate_re, function(match, entity) {
		return translate[entity];
	}).replace(/&#(\d+);/gi, function(match, numStr) {
		var num = parseInt(numStr, 10);
		return String.fromCharCode(num);
	}).replace(/&#x([0-9A-Fa-f]+);/gi, function(match, numStr) {
		var num = parseInt(numStr, 16);
		return String.fromCharCode(num);
	})
}
