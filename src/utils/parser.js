/**
 * Convert regex to postfix notation using Shunting Yard algorithm
 * Supports: * (Kleene star), | (union), () (grouping), and implicit concatenation
 */
export function addConcatenationOperators(regex) {
  let result = '';
  for (let i = 0; i < regex.length; i++) {
    result += regex[i];
    if (i < regex.length - 1) {
      const curr = regex[i];
      const next = regex[i + 1];
      
      const currIsOperand = (c) => /[a-zA-Z0-9]/.test(c);
      const currIsClosing = (c) => c === ')' || c === '*';
      const nextIsOperand = (c) => /[a-zA-Z0-9]/.test(c);
      const nextIsOpening = (c) => c === '(';
      
      if ((currIsOperand(curr) || currIsClosing(curr)) && (nextIsOperand(next) || nextIsOpening(next))) {
        result += '.';
      }
    }
  }
  return result;
}

export function toPostfix(regex) {
  const infix = addConcatenationOperators(regex);
  const precedence = {
    '|': 1,
    '.': 2,
    '*': 3,
  };
  
  const stack = [];
  const output = [];
  
  for (let i = 0; i < infix.length; i++) {
    const char = infix[i];
    
    if (/[a-zA-Z0-9]/.test(char)) {
      output.push(char);
    } else if (char === '(') {
      stack.push(char);
    } else if (char === ')') {
      while (stack.length > 0 && stack[stack.length - 1] !== '(') {
        output.push(stack.pop());
      }
      if (stack.length > 0) {
        stack.pop();
      }
    } else if (char === '*' || char === '.' || char === '|') {
      while (
        stack.length > 0 &&
        stack[stack.length - 1] !== '(' &&
        precedence[stack[stack.length - 1]] >= precedence[char]
      ) {
        output.push(stack.pop());
      }
      stack.push(char);
    }
  }
  
  while (stack.length > 0) {
    output.push(stack.pop());
  }
  
  return output.join('');
}
