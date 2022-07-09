
const readline = require('readline')
const fs = require('fs')


var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  })
rl.on('line', function(line){
	var m = /^\s*(\d*)\s*[\+\*]?(.*)/.exec(line),
    count = m[1],
    word = m[2],
    correct = applyRules(getDefaultData(), word, "text").replace(/`/g,""),
    reason = "",
    lcWord = word.toLowerCase(),
    lcCorrect = correct.toLowerCase()
    if (correct == word){
        correct = ""
        reason = "Unknown"
    } else if (lcCorrect == lcWord){
        reason = "Capitalization"
    } else if (lcCorrect.replace(/'/g,"") == lcWord.replace(/\s/g,"")){
        reason = "Apostrophe"
    } else if (lcCorrect.replace(/\s/g,"") == lcWord.replace(/\s/g,"")){
        reason = "Spacing"
    } else if (lcCorrect.replace(/[^a-zA-Z0-9]/g,"") == lcWord.replace(/[^a-zA-Z0-9]/g,"")){
        reason = "Punctuation"
    } else {
        reason = "Spelling"
    }
    console.log(count + " | " + word + " | " + correct + " | " + reason)
})
