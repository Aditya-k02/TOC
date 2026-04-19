# Regular Expression to Minimized DFA Visualizer

A complete React web application that visually simulates the compilation pipeline of a Regular Expression into a Minimized DFA (Deterministic Finite Automaton).

## Features

- **Regex Parsing**: Converts regular expressions to postfix notation using the Shunting Yard algorithm
- **Thompson's Construction**: Builds an NFA (Non-deterministic Finite Automaton) from the postfix regex
- **Subset Construction**: Converts the NFA to a DFA (Deterministic Finite Automaton)
- **Hopcroft's Algorithm**: Minimizes the DFA to its optimal form
- **Interactive Visualization**: See all three stages (NFA, DFA, Min-DFA) as directed graphs with Cytoscape.js
- **Error Handling**: Graceful error messages for invalid regex syntax

## Supported Regex Syntax

- Symbols: `a-z`, `0-9`
- Kleene Star: `*` (zero or more)
- Union: `|` (alternation)
- Concatenation: implicit (e.g., `ab` means `a` followed by `b`)
- Grouping: `()` (parentheses)

### Example Expressions

- `(a|b)*abb` - Strings of a and b ending with "abb"
- `a*b*` - Zero or more a's followed by zero or more b's
- `(01|10)*` - Alternating 01 or 10
- `a` - Single symbol
- `a*` - Zero or more a's

## Project Structure

```
toc-visualizer/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx
│   ├── index.css
│   ├── App.jsx
│   ├── components/
│   │   └── GraphVisualizer.jsx
│   └── utils/
│       ├── Automaton.js        (Core data structure)
│       ├── parser.js           (Regex to Postfix - Shunting Yard)
│       ├── thompson.js         (Postfix to NFA - Thompson's Construction)
│       ├── subset.js           (NFA to DFA - Subset Construction)
│       ├── hopcroft.js         (DFA Minimization - Hopcroft's Algorithm)
│       └── formatGraph.js      (Automaton to Cytoscape format)
```

## Installation & Setup

### Prerequisites

- Node.js 16+ and npm

### Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# The app will be available at http://localhost:5173
```

### Building for Production

```bash
npm run build
npm run preview
```

## How It Works

### 1. **Parser** (`src/utils/parser.js`)
- Uses the **Shunting Yard algorithm** to convert infix regex to postfix notation
- Adds explicit concatenation operators (`.`) for easier processing
- Handles operator precedence: `|` (lowest) < `.` < `*` (highest)

### 2. **Thompson's Construction** (`src/utils/thompson.js`)
- Builds an NFA from postfix regex using recursive rules:
  - Single symbol: `a` → simple two-state machine
  - Concatenation: `N1.N2` → connect N1's accept to N2's start via epsilon
  - Union: `N1|N2` → new start with epsilon to both N1 and N2
  - Kleene Star: `N*` → new start/end with epsilon loops

### 3. **Subset Construction** (`src/utils/subset.js`)
- Converts NFA to DFA by exploring all possible state combinations
- Computes epsilon closures to handle non-determinism
- Each DFA state represents a set of NFA states
- Eliminates epsilon transitions

### 4. **Hopcroft's Algorithm** (`src/utils/hopcroft.js`)
- Minimizes the DFA by partitioning states based on equivalence
- Initial partition: Accept vs. Non-accept states
- Iteratively refines partitions based on transition behavior
- Merges equivalent states to reduce complexity

### 5. **Visualization** (`src/components/GraphVisualizer.jsx`)
- Uses **Cytoscape.js** with **Dagre layout** for directed graphs
- Left-to-right (LR) layout for clear data flow
- Color-coded states:
  - **Green**: Start state
  - **Red**: Accept/final state
  - **Blue**: Regular states

## Tech Stack

- **React 18.2** - UI framework
- **Vite 5** - Build tool
- **Cytoscape.js 3.28** - Graph visualization
- **Cytoscape Dagre 2.5** - Directed graph layout
- **Tailwind CSS 3.3** - Styling
- **React Cytoscape 1.3** - React wrapper for Cytoscape

## Algorithm Complexity

- **Parser**: O(n) - single pass through regex
- **Thompson's**: O(n) - linear in regex length
- **Subset Construction**: O(2^|Q|) worst case - exponential in NFA states
- **Hopcroft's**: O(|Q|² log |Q|) - near-linear for practical cases
- **Overall**: Dominated by subset construction for large NFAs

## Limitations & Notes

- Currently supports only basic regex syntax (*, |, concatenation, parentheses)
- Does not support: character classes, escapes, anchors, lookahead, etc.
- Large regex patterns may create complex graphs
- Epsilon transitions are shown in NFA but eliminated in DFA

## Debugging Tips

If a specific stage looks incorrect, you can:

1. Check the browser console for any error messages
2. Verify your regex syntax matches the supported format
3. Try simpler examples first: `a`, `ab`, `a*`, `(a|b)`
4. The error alert will show parsing or construction failures

## Example Walkthroughs

### Example 1: `a*b`

**Regex**: `a*b`

1. **Postfix**: `a*b.`
2. **NFA**: Thompson builds:
   - State for `a`, wraps with Kleene star (loop on `a`)
   - Epsilon connect to state for `b`
3. **DFA**: Subset construction merges overlapping states
4. **Min-DFA**: Already minimal (no equivalent states to merge)

### Example 2: `(a|b)*`

**Regex**: `(a|b)*`

1. **Postfix**: `ab|*`
2. **NFA**: Union of `a` and `b`, wrapped with Kleene star
3. **DFA**: Subset construction expands states to handle both branches
4. **Min-DFA**: Hopcroft's may merge some redundant states

## License

This project is provided as-is for educational purposes.
