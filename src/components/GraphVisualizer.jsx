import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

cytoscape.use(dagre);

export default function GraphVisualizer({ elements, title }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !elements || elements.length === 0) {
      return;
    }

    if (!cyRef.current) {
      cyRef.current = cytoscape({
        container: containerRef.current,
        elements: elements,
        style: [
          {
            selector: 'node',
            style: {
              content: 'data(label)',
              'text-valign': 'center',
              'text-halign': 'center',
              'background-color': '#60a5fa',
              width: '50px',
              height: '50px',
              'border-width': '2px',
              'border-color': '#1e40af',
              'font-size': '14px',
              'font-weight': 'bold',
              color: '#ffffff',
            },
          },
          {
            selector: 'node.start',
            style: {
              'background-color': '#34d399',
              'border-color': '#059669',
              width: '60px',
              height: '60px',
            },
          },
          {
            selector: 'node.accept',
            style: {
              'background-color': '#f87171',
              'border-color': '#dc2626',
              'border-width': '4px',
            },
          },
          {
            selector: 'edge',
            style: {
              content: 'data(label)',
              'target-arrow-shape': 'triangle',
              'line-color': '#333333',
              'target-arrow-color': '#333333',
              width: '2px',
              'font-size': '12px',
              'text-background-color': '#ffffff',
              'text-background-opacity': 1,
              'text-background-padding': '2px',
              'curve-style': 'bezier',
            },
          },
        ],
      });

      const layout = cyRef.current.layout({
        name: 'dagre',
        directed: true,
        rankDir: 'LR',
        animate: false,
      });
      layout.run();
    } else {
      cyRef.current.elements().remove();
      cyRef.current.add(elements);

      const layout = cyRef.current.layout({
        name: 'dagre',
        directed: true,
        rankDir: 'LR',
        animate: false,
      });
      layout.run();
    }
  }, [elements]);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
      <div className="border border-gray-300 rounded-lg bg-gray-50 overflow-hidden">
        {elements && elements.length > 0 ? (
          <div
            ref={containerRef}
            style={{
              width: '100%',
              height: '400px',
            }}
          />
        ) : (
          <div className="w-full h-96 flex items-center justify-center text-gray-500">
            No states to display
          </div>
        )}
      </div>
    </div>
  );
}
