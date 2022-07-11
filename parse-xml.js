function getAttributes(tag){
	var ATTR = /([a-zA-Z0-9]+)="([^"]+)"/g,
	m,
	attrs = {}
	while(m = ATTR.exec(tag)){
		attrs[m[1]] = decodeEntities(m[2])
	}
	return attrs
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


function tokenizeHTML(str){
	var tokens=[], m,
	startRx = new RegExp("(" + [
		/\<(?:[^\>\r\n]+)[\>\r\n]/, // HTML tag (group 1)
	].map(r=>r.source).join(')|(') + ")","gim"),
	codeRx = new RegExp("((?:" + [
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
			// html tag OR indented code OR single backtick code
			codeRx.lastIndex = lastEnd
			var codeM=codeRx.exec(str)
			if (codeM && codeM.index == lastEnd){
				tokens.push({type:"code",content:codeM[1]})
				lastEnd+=codeM[1].length
			} else {
				// Other HTML tags
				tokens.push({type:"tag",content:m[1]})
				lastEnd+=m[1].length
			}
		}
		startRx.lastIndex=lastEnd
	}
	if (lastEnd<str.length)tokens.push({type:"text",content:str.substr(lastEnd,str.length)})
	return tokens
}

exports.decodeEntities = decodeEntities
exports.getAttributes = getAttributes
exports.tokenizeHTML = tokenizeHTML
