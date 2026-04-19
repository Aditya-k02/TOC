export default class Automaton {
  constructor() {
    this.states = new Set();
    this.alphabet = new Set();
    this.transitions = {};
    this.startState = null;
    this.acceptStates = new Set();
  }

  addState(state) {
    this.states.add(state);
    if (!this.transitions[state]) {
      this.transitions[state] = {};
    }
  }

  addTransition(from, symbol, to) {
    if (!this.transitions[from]) {
      this.transitions[from] = {};
    }
    if (!this.transitions[from][symbol]) {
      this.transitions[from][symbol] = [];
    }
    if (!this.transitions[from][symbol].includes(to)) {
      this.transitions[from][symbol].push(to);
    }
    this.states.add(from);
    this.states.add(to);
    if (symbol !== 'epsilon') {
      this.alphabet.add(symbol);
    }
  }

  setStartState(state) {
    this.startState = state;
    this.addState(state);
  }

  addAcceptState(state) {
    this.acceptStates.add(state);
    this.addState(state);
  }

  clone() {
    const cloned = new Automaton();
    cloned.states = new Set(this.states);
    cloned.alphabet = new Set(this.alphabet);
    cloned.acceptStates = new Set(this.acceptStates);
    cloned.startState = this.startState;
    
    for (const [state, transitions] of Object.entries(this.transitions)) {
      cloned.transitions[state] = {};
      for (const [symbol, targets] of Object.entries(transitions)) {
        cloned.transitions[state][symbol] = [...targets];
      }
    }
    
    return cloned;
  }
}
