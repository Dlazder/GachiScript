const { log } = require('console')
const fs = require('fs')
const path = require('path')

const fileName = path.extname(process.argv[2] || 'test.js')
const str = fs.readFileSync(process.argv[2] || 'test.js').toString()
const dictionary = JSON.parse(fs.readFileSync('dictionary.json'))
let output = ''
let currWord = ''
let isInString = false

function isMatch(word, strict) {
	if (dictionary[word] !== undefined) {
		return dictionary[word]
	}
	if (strict) return ''
	else return currWord
}

function reset(s) {
	output += s
	currWord = ''
}

for (let i = 0; i < str.length; i++) {

	if (str[i + 1] === undefined) {
		currWord += str[i]
		output += isMatch(currWord)
		break
	}

	if (str[i].match(/['"`]/)) {
		isInString = isInString ? false : true
		// log('isInString', isInString)
		reset(currWord)
		output += str[i]
		continue
	}

	if (str[i] === '\n') {
		if (isMatch(currWord)) {
			output += isMatch(currWord)
		} else output += currWord
		reset('\n')
		continue
	}

	if (!isInString) {


		if (str[i] === ' ') {
			// если убрать все мелкие операторы сломаются
			if (currWord) {
				output += isMatch(currWord)
			}
			reset(' ')

		} else if (str[i] === '.') {

		if (currWord) {
			output += isMatch(currWord)
		}
		reset('.')

		} else if (str[i] === '(') {
			if (currWord) {
				output += isMatch(currWord)
			}
			reset('(')
		} else if(str[i] === ')') {
			output += currWord
			reset(')')
		} else if (str[i] === '{' || str[i] === '}') {
			output += currWord
			reset(str[i])
		} else if (str[i].match(/\d/)) {
			output += currWord;
			reset(str[i])
		} else if (str[i].match(/[a-zA-Zа-яА-Я0-9=;:{}\(\)=<>\-\+]/)) {
			currWord += str[i]
		}

	} else {
		output += str[i]
	}

}


//Final cuming
log('Output:\n' + output)
fs.writeFileSync(`output.js`, output)