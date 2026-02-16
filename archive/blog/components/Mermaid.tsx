'use client';

import { useEffect, useRef } from 'react';

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (ref.current && chart) {
        try {
          const mermaid = (await import('mermaid')).default;
          
          mermaid.initialize({ 
            startOnLoad: true,
            theme: 'base',
            themeVariables: {
              primaryColor: '#4a2d8f',
              primaryTextColor: '#ffffff',
              primaryBorderColor: '#ffffff',
              lineColor: '#ffffff',
              secondaryColor: '#3a2570',
              tertiaryColor: '#5a3fa0',
              background: '#2E1165',
              mainBkg: '#4a2d8f',
              secondBkg: '#3a2570',
              tertiaryBkg: '#5a3fa0',
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
              fontSize: '14px',
            },
            flowchart: {
              useMaxWidth: false,
              htmlLabels: true,
            }
          });
          
          // Generate valid CSS ID (no decimals)
          const id = 'mermaid-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
          const { svg } = await mermaid.render(id, chart);
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        } catch (error) {
          console.error('Mermaid Error Details:', error);
          if (ref.current) {
            ref.current.innerHTML = `<pre style="color: #ffffff; background: #4a2d8f; padding: 1rem; border-radius: 0.5rem; font-size: 0.875rem; overflow-x: auto;">Error rendering diagram:\n${error instanceof Error ? error.message : String(error)}\n\nChart code:\n${chart}</pre>`;
          }
        }
      }
    };

    renderDiagram();
  }, [chart]);

  return <div ref={ref} className="w-full" style={{ minHeight: '200px' }} />;
}
