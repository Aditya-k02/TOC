import Automaton from './Automaton.js';

export function epsilonClosure(stateSet, nfa) {
  const closure = new Set(stateSet);
  const stack = [...stateSet];
  
  while (stack.length > 0) {
    const state = stack.pop();
    if (nfa.transitions[state] && nfa.transitions[state]['epsilon']) {
      for (const target of nfa.transitions[state]['epsilon']) {
        if (!closure.has(target)) {
          closure.add(target);
          stack.push(target);
        }
      }
    }
  }
  
  return closure;
}

function stateSetToString(stateSet) {
  return Array.from(stateSet).sort().join(',');
}

export function subsetConstruction(nfa) {
  const dfa = new Automaton();
  
  const startClosure = epsilonClosure(new Set([nfa.startState]), nfa);
  const startStateName = stateSetToString(startClosure);
  
  dfa.setStartState(startStateName);
  
  let isAccept = false;
  for (const state of startClosure) {
    if (nfa.acceptStates.has(state)) {
      isAccept = true;
      break;
    }
  }
  if (isAccept) {
    dfa.addAcceptState(startStateName);
  }
  
  const visited = new Set();
  const queue = [startClosure];
  const stateMapping = new Map();
  stateMapping.set(startStateName, startClosure);
  
  while (queue.length > 0) {
    const currentSet = queue.shift();
    const currentName = stateSetToString(currentSet);
    
    if (visited.has(currentName)) {
      continue;
    }
    visited.add(currentName);
    
    const alphabet = Array.from(nfa.alphabet);
    
    for (const symbol of alphabet) {
      const nextSet = new Set();
      
      for (const state of currentSet) {
        if (nfa.transitions[state] && nfa.transitions[state][symbol]) {
          for (const target of nfa.transitions[state][symbol]) {
            nextSet.add(target);
          }
        }
      }
      
      if (nextSet.size > 0) {
        const nextClosure = epsilonClosure(nextSet, nfa);
        const nextName = stateSetToString(nextClosure);
        
        dfa.addTransition(currentName, symbol, nextName);
        
        if (!stateMapping.has(nextName)) {
          stateMapping.set(nextName, nextClosure);
          queue.push(nextClosure);
          
          let isAccept = false;
          for (const state of nextClosure) {
            if (nfa.acceptStates.has(state)) {
              isAccept = true;
              break;
            }
          }
          if (isAccept) {
            dfa.addAcceptState(nextName);
          }
        }
      }
    }
  }
  
  return dfa;
}
