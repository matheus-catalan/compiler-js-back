var LETTERS = /[a-zA-Z]/
var NEWLINE = /\n/
var BACKSLASH = /\\/
var WHITESPACE = /\s/
var NUMBERS = /[0-9]/

function tokenizer(input) {
  var current = 0
  var tokens = []
  let error = false

  while (current < input.length) {
    var char = input[current]

    if (char === "=") {
      tokens.push({
        type: "equal",
        value: "=",
      })
      console.log("=")
      current++
      continue
    }

    if (char === "*") {
      tokens.push({
        type: "star",
        value: "*",
      })

      current++
      continue
    }

    if (char === "#") {
      tokens.push({
        type: "hash",
        value: "#",
      })

      current++
      continue
    }

    if (char === "!") {
      tokens.push({
        type: "not",
        value: "!",
      })
      current++
      continue
    }

    if (char === "[" || char === "]") {
      tokens.push({
        type: "bracket",
        value: char,
      })
      current++
      continue
    }

    if (char === "-") {
      tokens.push({
        type: "minus",
        value: "-",
      })
      current++
      continue
    }

    if (char === "+") {
      tokens.push({
        type: "plus",
        value: "+",
      })
      current++
      continue
    }

    if (char === "/") {
      if (input[++current] === "/") {
        while (current < input.length && !NEWLINE.test(input[current])) {
          current++
        }
      } else if (input[current] === "*") {
        current++
        while (current < input.length) {
          if (input[current] === "*" && input[++current] === "/") {
            current++
            break
          }
          current++
        }
      } else {
        tokens.push({
          type: "forwardslash",
          value: "/",
        })
      }
      continue
    }

    if (BACKSLASH.test(char)) {
      tokens.push({
        type: "backslash",
        value: "\\",
      })
      current++
      continue
    }

    if (char === "?") {
      tokens.push({
        type: "question",
        value: "?",
      })
      current++
      continue
    }

    if (char === "<") {
      tokens.push({
        type: "less",
        value: "<",
      })
      current++
      continue
    }

    if (char === ">") {
      tokens.push({
        type: "greater",
        value: ">",
      })
      current++
      continue
    }

    if (char === "|") {
      tokens.push({
        type: "pipe",
        value: "|",
      })
      current++
      continue
    }

    if (char === "&") {
      tokens.push({
        type: "and",
        value: "&",
      })
      current++
      continue
    }

    if (char === "%") {
      tokens.push({
        type: "percent",
        value: "%",
      })
      current++
      continue
    }

    if (char === "$") {
      tokens.push({
        type: "dollar",
        value: "$",
      })
      current++
      continue
    }

    if (char === "@") {
      tokens.push({
        type: "at",
        value: "@",
      })
      current++
      continue
    }

    if (char === "^") {
      tokens.push({
        type: "caret",
        value: "^",
      })
      current++
      continue
    }

    if (char === "~") {
      tokens.push({
        type: "tilde",
        value: "~",
      })
      current++
      continue
    }

    if (char === "`") {
      tokens.push({
        type: "grave",
        value: "`",
      })
      current++
      continue
    }

    if (char === "(" || char === ")") {
      tokens.push({
        type: "paren",
        value: char,
      })
      current++
      continue
    }

    if (char === ":") {
      tokens.push({
        type: "colon",
        value: ":",
      })
      current++
      continue
    }

    if (char === ".") {
      tokens.push({
        type: "dot",
        value: ".",
      })
      current++
      continue
    }

    if (char === ",") {
      tokens.push({
        type: "comma",
        value: ",",
      })
      current++
      continue
    }

    if (char === ";") {
      tokens.push({
        type: "semi",
        value: ";",
      })
      current++
      continue
    }

    if (char === "{" || char === "}") {
      tokens.push({
        type: "curly",
        value: char,
      })
      current++
      continue
    }

    if (WHITESPACE.test(char) || NEWLINE.test(char)) {
      current++
      continue
    }

    if (NUMBERS.test(char)) {
      var value = ""

      while (NUMBERS.test(char)) {
        value += char
        char = input[++current]
      }
      tokens.push({
        type: "number",
        value: value,
      })
      continue
    }

    if (LETTERS.test(char) || char === "_") {
      var value = char
      /* need to account for potential end-of-file :D */
      if (++current < input.length) {
        char = input[current]
        /* also need to remember to take care of the last character in the buffer */
        while (
          (LETTERS.test(char) || NUMBERS.test(char) || char === "_") &&
          current + 1 <= input.length
        ) {
          value += char
          char = input[++current]
        }
      }
      tokens.push({
        type: "name",
        value: value,
      })
      continue
    }

    if (char === "'") {
      var value = ""
      char = input[++current]

      while (char !== "'") {
        value += char
        char = input[++current]
      }
      char = input[++current]
      tokens.push({
        type: "string",
        value: value,
      })
      continue
    }

    if (char === '"') {
      var value = ""
      char = input[++current]

      while (char !== '"') {
        value += char
        char = input[++current]
      }
      char = input[++current]
      tokens.push({
        type: "string",
        value: value,
      })
      continue
    }

    error = true
    break
  }

  if (error) {
    return "Caracter não reconhecido: " + char
  }

  return tokens
}

module.exports = tokenizer
