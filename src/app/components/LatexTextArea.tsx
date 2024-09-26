import React, { ChangeEvent, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface LatexTextAreaProps {
  value: string | null;
  onChange: (value: string | null) => void;
  error: { message: string; errorStart: number; errorEnd: number } | null;
}

export default function LatexTextArea({
  value,
  onChange,
  error,
}: LatexTextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  const highlightedText = value && error ? (
    <>
      {value.slice(0, error.errorStart)}
      <span className="bg-red-200">{value.slice(error.errorStart, error.errorEnd)}</span>
      {value.slice(error.errorEnd)}
    </>
  ) : null;

  useEffect(() => {
    const adjustHeight = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
      if (highlightRef.current) {
        highlightRef.current.style.height = textareaRef.current?.style.height || 'auto';
      }
    };

    adjustHeight();
  }, [value]);

  return (
    <div className="relative">
      {error && (
        <div
          ref={highlightRef}
          className="absolute top-0 left-0 right-0 pointer-events-none whitespace-pre-wrap break-words overflow-hidden box-border"
          style={{
            padding: '0.5rem',
            fontFamily: 'monospace',
            fontSize: '1rem',
            lineHeight: '1.5',
            border: '1px solid transparent',
          }}
        >
          {highlightedText}
        </div>
      )}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder="Type your LaTeX here."
        className="bg-transparent relative overflow-hidden"
        style={{
          fontFamily: 'monospace',
          fontSize: '1rem',
          lineHeight: '1.5',
          boxSizing: 'border-box',
          border: '1px solid #ccc',
          padding: '0.5rem',
          width: '100%',
          resize: 'none',
          overflow: 'hidden',
        }}
      />
      {error && (
        <p className="text-red-500 mt-1">{error.message}</p>
      )}
    </div>
  );
}