import Automaton from './Automaton.js';

export function hopcroft(dfa) {
  if (dfa.states.size === 0) {
    return dfa;
  }
  
  const minDfa = new Automaton();
  
  const nonAccept = new Set();
  const accept = new Set();
  
  for (const state of dfa.states) {
    if (dfa.acceptStates.has(state)) {
      accept.add(state);
    } else {
      nonAccept.add(state);
    }
  }
  
  let partitions = [];
  if (nonAccept.size > 0) {
    partitions.push(nonAccept);
  }
  if (accept.size > 0) {
    partitions.push(accept);
  }
  
  if (partitions.length === 0) {
    partitions.push(new Set(dfa.states));
  }
  
  const alphabet = Array.from(dfa.alphabet);
  
  let changed = true;
  while (changed) {
    changed = false;
    const newPartitions = [];
    
    for (const partition of partitions) {
      if (partition.size <= 1) {
        newPartitions.push(partition);
        continue;
      }
      
      const subPartitions = new Map();
      
      for (const state of partition) {
        let signature = '';
        
        for (const symbol of alphabet) {
          let targetPartition = -1;
          
          if (dfa.transitions[state] && dfa.transitions[state][symbol]) {
            const targets = dfa.transitions[state][symbol];
            if (targets.length > 0) {
              const target = targets[0];
              for (let i = 0; i < partitions.length; i++) {
                if (partitions[i].has(target)) {
                  targetPartition = i;
                  break;
                }
              }
            }
          } else {
            targetPartition = -1;
          }
          
          signature += targetPartition + ',';
        }
        
        if (!subPartitions.has(signature)) {
          subPartitions.set(signature, new Set());
        }
        subPartitions.get(signature).add(state);
      }
      
      const subs = Array.from(subPartitions.values());
      if (subs.length > 1) {
        changed = true;
        newPartitions.push(...subs);
      } else {
        newPartitions.push(partition);
      }
    }
    
    partitions = newPartitions;
  }
  
  const partitionMap = new Map();
  for (let i = 0; i < partitions.length; i++) {
    for (const state of partitions[i]) {
      partitionMap.set(state, i);
    }
  }
  
  const newStateNames = new Map();
  for (let i = 0; i < partitions.length; i++) {
    newStateNames.set(i, `q${i}`);
  }
  
  const startPartition = partitionMap.get(dfa.startState);
  minDfa.setStartState(newStateNames.get(startPartition));
  
  for (const acceptState of dfa.acceptStates) {
    const partition = partitionMap.get(acceptState);
    minDfa.addAcceptState(newStateNames.get(partition));
  }
  
  for (let i = 0; i < partitions.length; i++) {
    const partition = partitions[i];
    const representative = Array.from(partition)[0];
    const newState = newStateNames.get(i);
    
    minDfa.addState(newState);
    
    if (dfa.transitions[representative]) {
      const transMap = new Map();
      
      for (const symbol of alphabet) {
        if (dfa.transitions[representative][symbol]) {
          const targets = dfa.transitions[representative][symbol];
          if (targets.length > 0) {
            const target = targets[0];
            const targetPartition = partitionMap.get(target);
            const targetNewState = newStateNames.get(targetPartition);
            transMap.set(symbol, targetNewState);
          }
        }
      }
      
      for (const [symbol, targetState] of transMap) {
        minDfa.addTransition(newState, symbol, targetState);
      }
    }
  }
  
  return minDfa;
}
