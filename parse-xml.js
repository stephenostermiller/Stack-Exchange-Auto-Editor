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

exports.decodeEntities = decodeEntities
exports.getAttributes = getAttributes
