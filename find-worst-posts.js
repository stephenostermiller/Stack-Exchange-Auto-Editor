
const readline = require('readline')
const fs = require('fs')
const xml = require('./parse-xml')


const ROW = /^ *<row /

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
  })
rl.on('line', function(line){
	if (ROW.test(line)){
		var attrs = xml.getAttributes(line)
		if(attrs.Body){
			var d=getDefaultData()
			d.bodyTokens = xml.tokenizeHTML(attrs.Body)
			//console.log(d.bodyTokens)
			if (attrs.Title) d.title=attrs.Title
			edit(d)
			var summary = buildSummary("",d.reasons)
			var score = Math.ceil(Math.max(Math.log10(parseInt(attrs.Score)),1)*d.score)
			if (score >= 15) {
				console.log(score + " /"+(attrs.ParentId?'a':'q')+'/'+attrs.Id + " " + summary)
				//console.log(d.replacements)
			}
		}
	}
})
