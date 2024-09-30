import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckIcon, ClipboardIcon } from 'lucide-react';
import topHundredCommands from '@/data/top_hundred_commands';

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
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const highlightRef = React.useRef<HTMLDivElement>(null);
  const [hasCopied, setHasCopied] = React.useState(false);
  const [suggestion, setSuggestion] = React.useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    onChange(newValue);
    updateSuggestion(newValue);
  };

  const updateSuggestion = (text: string) => {
    const lastWord = text.split(/\s/).pop() || '';
    if (lastWord.length >= 2) {
      const matchingCommand = topHundredCommands.find(cmd => cmd.caption.startsWith(lastWord));
      setSuggestion(matchingCommand ? matchingCommand.caption : null);
    } else {
      setSuggestion(null);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab' && suggestion) {
      event.preventDefault();
      const textarea = event.currentTarget;
      const cursorPosition = textarea.selectionStart;
      const textBeforeCursor = textarea.value.slice(0, cursorPosition);
      const lastWord = textBeforeCursor.split(/\s/).pop() || '';
      
      const newValue = textBeforeCursor.slice(0, -lastWord.length) + suggestion + textarea.value.slice(cursorPosition);
      onChange(newValue);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = cursorPosition - lastWord.length + suggestion.length;
      }, 0);

      setSuggestion(null);
    }
  };

  const highlightedText = value && error ? (
    <>
      {value.slice(0, error.errorStart)}
      <span className="bg-red-200 rounded-sm">{value.slice(error.errorStart, error.errorEnd)}</span>
      {value.slice(error.errorEnd)}
    </>
  ) : null;

  const handleCopyToClipboard = React.useCallback(() => {
    if (value) {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  }, [value]);

  React.useEffect(() => {
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
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your LaTeX here."
          className="bg-transparent relative overflow-hidden"
          spellCheck={false}
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
        <Button
          size="icon"
          variant="ghost"
          disabled={!value}
          className="absolute top-2 right-2 h-6 w-6 text-slate-500 hover:bg-slate-100 hover:text-slate-700 [&_svg]:h-4 [&_svg]:w-4"
          onClick={handleCopyToClipboard}
        >
          <span className="sr-only">Copy</span>
          {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
        </Button>
      </div>
      {error && (
        <p className="text-red-500 mt-1">{error.message}</p>
      )}
      {suggestion && !!value && (
        <div className="text-sm text-gray-500 mt-1">
          Suggestion: {suggestion} (press Tab to complete)
        </div>
      )}
    </div>
  );
}