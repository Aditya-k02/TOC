import React, { useState } from 'react';
import GraphVisualizer from './components/GraphVisualizer';
import { toPostfix } from './utils/parser';
import { thompsonsConstruction } from './utils/thompson';
import { subsetConstruction } from './utils/subset';
import { hopcroft } from './utils/hopcroft';
import { formatGraph } from './utils/formatGraph';

export default function App() {
  const [regex, setRegex] = useState('(a|b)*abb');
  const [nfaElements, setNfaElements] = useState([]);
  const [dfaElements, setDfaElements] = useState([]);
  const [minDfaElements, setMinDfaElements] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVisualize = () => {
    setError('');
    setLoading(true);

    try {
      if (!regex.trim()) {
        throw new Error('Please enter a regular expression');
      }

      const postfix = toPostfix(regex);
      
      if (!postfix) {
        throw new Error('Invalid regular expression');
      }

      const nfa = thompsonsConstruction(postfix);
      
      if (!nfa || !nfa.startState) {
        throw new Error('Failed to construct NFA from regex');
      }

      const dfa = subsetConstruction(nfa);
      
      if (!dfa || !dfa.startState) {
        throw new Error('Failed to construct DFA from NFA');
      }

      const minDfa = hopcroft(dfa);
      
      if (!minDfa || !minDfa.startState) {
        throw new Error('Failed to minimize DFA');
      }

      setNfaElements(formatGraph(nfa));
      setDfaElements(formatGraph(dfa));
      setMinDfaElements(formatGraph(minDfa));
    } catch (err) {
      setError(err.message || 'An error occurred during visualization');
      setNfaElements([]);
      setDfaElements([]);
      setMinDfaElements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleVisualize();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Regular Expression to Minimized DFA Visualizer
          </h1>
          <p className="text-gray-600 mb-6">
            Visualize the complete compilation pipeline: Regex → NFA → DFA → Minimized DFA
          </p>

          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Regular Expression
              </label>
              <input
                type="text"
                value={regex}
                onChange={(e) => setRegex(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., (a|b)*abb"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">
                Supported: a-z, 0-9, * (Kleene star), | (union), () (grouping)
              </p>
            </div>
            <button
              onClick={handleVisualize}
              disabled={loading}
              className="mt-7 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 cursor-pointer"
            >
              {loading ? 'Visualizing...' : 'Visualize'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-semibold">Error:</p>
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {(nfaElements.length > 0 || dfaElements.length > 0 || minDfaElements.length > 0) && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <GraphVisualizer 
                elements={nfaElements}
                title="1. NFA (Non-deterministic Finite Automaton)"
              />
            </div>

            <div className="mb-8">
              <GraphVisualizer 
                elements={dfaElements}
                title="2. DFA (Deterministic Finite Automaton)"
              />
            </div>

            <div>
              <GraphVisualizer 
                elements={minDfaElements}
                title="3. Minimized DFA (Hopcroft's Algorithm)"
              />
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Legend:</strong> Green nodes are start states, red nodes are accept states. 
                Edges are labeled with transition symbols.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
