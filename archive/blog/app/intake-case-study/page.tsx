'use client';

import BlogHeader from '@/components/BlogHeader';
import ArticleHero from '@/components/ArticleHero';
import Mermaid from '@/components/Mermaid';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useEffect, useState } from 'react';

export default function IntakeCaseStudy() {
  const [content, setContent] = useState('');

  useEffect(() => {
    // Load the markdown content
    fetch('/article-content.md')
      .then(res => res.text())
      .then(text => setContent(text))
      .catch(err => console.error('Error loading article:', err));
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-500" style={{ backgroundColor: 'var(--bg-color, #2E1165)', overflow: 'visible' }}>
      <BlogHeader />
      
      <ArticleHero
        title="Building an AI-Powered Creative Intake System"
        subtitle="How we transformed Brand Studio operations"
        author="Jon Schafer, Design Lead"
        date="February 13, 2026"
        readTime="6 min read"
        tags={['Case Study', 'Design Systems', 'Operations', 'AI']}
      />

      <article className="max-w-[650px] mx-auto px-6 pb-20" style={{ overflow: 'visible' }}>
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              // Custom rendering for different elements
              h2: ({node, ...props}) => (
                <h2 className="text-[36px] font-bold mt-16 mb-0 leading-[50px] transition-colors duration-500" style={{ color: 'var(--text-color, #ffffff)', letterSpacing: '0px' }} {...props} />
              ),
              h3: ({node, ...props}) => (
                <h3 className="text-2xl font-semibold mt-12 mb-5 leading-tight transition-colors duration-500" style={{ color: 'var(--text-color, #ffffff)', letterSpacing: '-0.01em' }} {...props} />
              ),
              p: ({node, ...props}) => (
                <p className="text-[18px] leading-[25.2px] my-6 transition-colors duration-500" style={{ color: 'var(--text-color, #ffffff)' }} {...props} />
              ),
              ul: ({node, ...props}) => (
                <ul className="list-disc pl-6 my-6 space-y-3 text-[18px] transition-colors duration-500" style={{ color: 'var(--text-color, #ffffff)' }} {...props} />
              ),
              ol: ({node, ...props}) => (
                <ol className="list-decimal pl-6 my-6 space-y-3 text-[18px] transition-colors duration-500" style={{ color: 'var(--text-color, #ffffff)' }} {...props} />
              ),
              blockquote: ({node, ...props}) => (
                <blockquote className="text-center text-2xl md:text-3xl font-medium my-16 py-8 leading-snug transition-colors duration-500 opacity-50" style={{ color: 'var(--text-color, #ffffff)' }} {...props} />
              ),
              a: ({node, ...props}) => (
                <a className="font-medium hover:underline transition-all" style={{ color: 'var(--text-color, #ffffff)', textDecoration: 'underline' }} {...props} />
              ),
              strong: ({node, ...props}) => (
                <strong className="font-semibold transition-colors duration-500" style={{ color: 'var(--text-color, #ffffff)' }} {...props} />
              ),
              code: ({node, inline, ...props}: any) => {
                const match = /language-(\w+)/.exec(props.className || '');
                const isMermaid = match && match[1] === 'mermaid';
                
                if (!inline && isMermaid) {
                  // Get the full chart code - children can be an array or string
                  const chartCode = Array.isArray(props.children) 
                    ? props.children.join('') 
                    : String(props.children || '');
                  return (
                    <div style={{ 
                      width: '1080px',
                      maxWidth: '90vw',
                      marginLeft: 'calc((650px - 1080px) / 2)',
                      marginTop: '48px',
                      marginBottom: '48px',
                      background: '#2a2d35',
                      padding: '40px',
                      borderRadius: '8px'
                    }}>
                      <Mermaid chart={chartCode} />
                    </div>
                  );
                }
                
                return inline ? (
                  <code className="bg-[#4a2d8f] px-2 py-1 rounded text-base font-mono transition-colors duration-500" style={{ color: 'var(--text-color, #ffffff)' }} {...props} />
                ) : (
                  <code className="block bg-[#4a2d8f] p-6 rounded-lg text-base font-mono overflow-x-auto my-8 transition-colors duration-500" style={{ color: 'var(--text-color, #ffffff)' }} {...props} />
                );
              },
              table: ({node, ...props}) => (
                <div className="overflow-x-auto my-10">
                  <table className="min-w-full transition-colors duration-500" style={{ borderColor: 'var(--border-color, #4a2d8f)' }} {...props} />
                </div>
              ),
              thead: ({node, ...props}) => (
                <thead className="transition-colors duration-500" style={{ backgroundColor: 'var(--table-header-bg, #4a2d8f)' }} {...props} />
              ),
              th: ({node, ...props}) => (
                <th className="px-6 py-4 text-left text-sm font-semibold border transition-colors duration-500" style={{ color: 'var(--text-color, #ffffff)', borderColor: 'var(--border-color, #4a2d8f)' }} {...props} />
              ),
              td: ({node, ...props}) => (
                <td className="px-6 py-4 text-base border transition-colors duration-500" style={{ color: 'var(--text-color, #ffffff)', borderColor: 'var(--border-color, #4a2d8f)' }} {...props} />
              ),
              hr: ({node, ...props}) => (
                <hr className="my-16 transition-colors duration-500" style={{ borderColor: 'var(--border-color, #4a2d8f)' }} {...props} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
