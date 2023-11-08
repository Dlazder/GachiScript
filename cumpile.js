const { log } = require('console')
const fs = require('fs')
const str = fs.readFileSync(process.argv[2] || 'test.js').toString()
const dictionary = JSON.parse(fs.readFileSync('dictionary.json'))
let output = ''
let currWord = ''
let isInString = false
let typeInString = ''

function isMatch(word, strict) {
  if (dictionary[word] !== undefined) {
    return dictionary[word]
  }
  if (strict) return ''
  else return currWord
}

for (let i = 0; i < str.length; i++) {

  if (str[i].match(/['"`]/)) {
    isInString = isInString ? false : true
    log('isInString', isInString)
    typeInString = str[i]
  }

  
  if (str[i] === '\n') {
    output += currWord
    output += '\n'
    currWord = ''
    continue
  }

  if (!isInString && !str[i].match(/['"`]/)) {
    if (str[i] === ' ') {

      // если убрать все мелкие операторы сломаются
      if (currWord) {
        output += isMatch(currWord)
      }
      currWord = ''
      output += ' '
  
    } else if (str[i] === '.') {
      if (currWord) {
        output += isMatch(currWord)
      }
      currWord = ''
      output += '.'
    } else if (str[i+1] === undefined) {
      
      currWord += str[i]
      output += isMatch(currWord)
      break
  
    } else if (str[i].match(/[a-zA-Zа-яА-Я0-9=;:{}\(\)=<>\-\+]/)) {
      currWord += str[i]
    }
  } else {
    output += str[i]
  }
  
  

}


//Final cumming
log('Output:', output)
fs.writeFileSync('output.js', output)