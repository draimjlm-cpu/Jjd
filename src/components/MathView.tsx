import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({ math, block = false, className = '' }) => {
  const rendered = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
      });
    } catch {
      return `<span class="text-amber-400 font-mono">${math}</span>`;
    }
  }, [math, block]);

  if (block) {
    return (
      <div
        dir="ltr"
        className={`my-3 py-2 px-3 overflow-x-auto text-center font-['KaTeX_Main',sans-serif] ${className}`}
        dangerouslySetInnerHTML={{ __html: rendered }}
      />
    );
  }

  return (
    <span
      dir="ltr"
      className={`inline-block mx-1 font-['KaTeX_Main',sans-serif] ${className}`}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
};
