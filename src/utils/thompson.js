import Automaton from './Automaton.js';

let stateCounter = 0;

function resetStateCounter() {
  stateCounter = 0;
}

function newState() {
  return `q${stateCounter++}`;
}

function basicSymbol(symbol) {
  const nfa = new Automaton();
  const start = newState();
  const end = newState();
  
  nfa.setStartState(start);
  nfa.addAcceptState(end);
  nfa.addTransition(start, symbol, end);
  
  return nfa;
}

function concat(nfa1, nfa2) {
  const result = new Automaton();
  
  result.states = new Set([...nfa1.states, ...nfa2.states]);
  result.alphabet = new Set([...nfa1.alphabet, ...nfa2.alphabet]);
  result.startState = nfa1.startState;
  result.acceptStates = new Set(nfa2.acceptStates);
  
  for (const [state, trans] of Object.entries(nfa1.transitions)) {
    result.transitions[state] = {};
    for (const [symbol, targets] of Object.entries(trans)) {
      result.transitions[state][symbol] = [...targets];
    }
  }
  
  for (const [state, trans] of Object.entries(nfa2.transitions)) {
    if (!result.transitions[state]) {
      result.transitions[state] = {};
    }
    for (const [symbol, targets] of Object.entries(trans)) {
      result.transitions[state][symbol] = [...targets];
    }
  }
  
  for (const acceptState of nfa1.acceptStates) {
    if (!result.transitions[acceptState]) {
      result.transitions[acceptState] = {};
    }
    if (!result.transitions[acceptState]['epsilon']) {
      result.transitions[acceptState]['epsilon'] = [];
    }
    result.transitions[acceptState]['epsilon'].push(nfa2.startState);
  }
  
  result.acceptStates.delete(nfa1.acceptStates);
  
  return result;
}

function union(nfa1, nfa2) {
  const result = new Automaton();
  const newStart = newState();
  const newEnd = newState();
  
  result.states = new Set([...nfa1.states, ...nfa2.states, newStart, newEnd]);
  result.alphabet = new Set([...nfa1.alphabet, ...nfa2.alphabet]);
  result.setStartState(newStart);
  result.addAcceptState(newEnd);
  
  for (const [state, trans] of Object.entries(nfa1.transitions)) {
    result.transitions[state] = {};
    for (const [symbol, targets] of Object.entries(trans)) {
      result.transitions[state][symbol] = [...targets];
    }
  }
  
  for (const [state, trans] of Object.entries(nfa2.transitions)) {
    if (!result.transitions[state]) {
      result.transitions[state] = {};
    }
    for (const [symbol, targets] of Object.entries(trans)) {
      result.transitions[state][symbol] = [...targets];
    }
  }
  
  result.transitions[newStart]['epsilon'] = [nfa1.startState, nfa2.startState];
  
  for (const acceptState of nfa1.acceptStates) {
    if (!result.transitions[acceptState]) {
      result.transitions[acceptState] = {};
    }
    if (!result.transitions[acceptState]['epsilon']) {
      result.transitions[acceptState]['epsilon'] = [];
    }
    result.transitions[acceptState]['epsilon'].push(newEnd);
  }
  
  for (const acceptState of nfa2.acceptStates) {
    if (!result.transitions[acceptState]) {
      result.transitions[acceptState] = {};
    }
    if (!result.transitions[acceptState]['epsilon']) {
      result.transitions[acceptState]['epsilon'] = [];
    }
    result.transitions[acceptState]['epsilon'].push(newEnd);
  }
  
  return result;
}

function kleeneStar(nfa) {
  const result = new Automaton();
  const newStart = newState();
  const newEnd = newState();
  
  result.states = new Set([...nfa.states, newStart, newEnd]);
  result.alphabet = new Set(nfa.alphabet);
  result.setStartState(newStart);
  result.addAcceptState(newEnd);
  
  for (const [state, trans] of Object.entries(nfa.transitions)) {
    result.transitions[state] = {};
    for (const [symbol, targets] of Object.entries(trans)) {
      result.transitions[state][symbol] = [...targets];
    }
  }
  
  result.transitions[newStart]['epsilon'] = [nfa.startState, newEnd];
  
  for (const acceptState of nfa.acceptStates) {
    if (!result.transitions[acceptState]) {
      result.transitions[acceptState] = {};
    }
    if (!result.transitions[acceptState]['epsilon']) {
      result.transitions[acceptState]['epsilon'] = [];
    }
    result.transitions[acceptState]['epsilon'].push(newEnd);
    result.transitions[acceptState]['epsilon'].push(nfa.startState);
  }
  
  return result;
}

export function thompsonsConstruction(postfix) {
  resetStateCounter();
  const stack = [];
  
  for (let i = 0; i < postfix.length; i++) {
    const char = postfix[i];
    
    if (char === '*') {
      if (stack.length > 0) {
        const nfa = stack.pop();
        stack.push(kleeneStar(nfa));
      }
    } else if (char === '|') {
      if (stack.length >= 2) {
        const nfa2 = stack.pop();
        const nfa1 = stack.pop();
        stack.push(union(nfa1, nfa2));
      }
    } else if (char === '.') {
      if (stack.length >= 2) {
        const nfa2 = stack.pop();
        const nfa1 = stack.pop();
        stack.push(concat(nfa1, nfa2));
      }
    } else {
      stack.push(basicSymbol(char));
    }
  }
  
  return stack.length > 0 ? stack[0] : new Automaton();
}
