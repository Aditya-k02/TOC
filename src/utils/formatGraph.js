export function formatGraph(automaton) {
  const elements = [];
  
  const nodeSet = new Set();
  
  for (const state of automaton.states) {
    nodeSet.add(state);
    
    const classes = [];
    if (state === automaton.startState) {
      classes.push('start');
    }
    if (automaton.acceptStates.has(state)) {
      classes.push('accept');
    }
    
    elements.push({
      data: { id: state, label: state },
      classes: classes.join(' '),
    });
  }
  
  const edgeMap = new Map();
  
  for (const [from, transitions] of Object.entries(automaton.transitions)) {
    for (const [symbol, targets] of Object.entries(transitions)) {
      if (symbol === 'epsilon') {
        continue;
      }
      
      for (const to of targets) {
        const edgeKey = `${from}->${to}`;
        
        if (!edgeMap.has(edgeKey)) {
          edgeMap.set(edgeKey, { source: from, target: to, labels: [] });
        }
        
        if (!edgeMap.get(edgeKey).labels.includes(symbol)) {
          edgeMap.get(edgeKey).labels.push(symbol);
        }
      }
    }
  }
  
  for (const edgeData of edgeMap.values()) {
    const label = edgeData.labels.sort().join(', ');
    elements.push({
      data: {
        source: edgeData.source,
        target: edgeData.target,
        label: label,
      },
    });
  }
  
  return elements;
}
