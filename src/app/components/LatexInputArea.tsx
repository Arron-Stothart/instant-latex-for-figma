import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckIcon, ClipboardIcon, UploadCloud } from 'lucide-react';

interface LatexTextAreaProps {
  value: string | null;
  onChange: (value: string | null) => void;
  error: { message: string; errorStart: number; errorEnd: number } | null;
  onImageUpload: (file: File) => void;
}

export default function LatexInputArea({
  value,
  onChange,
  error,
  onImageUpload,
}: LatexTextAreaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const highlightRef = React.useRef<HTMLDivElement>(null);
  const [hasCopied, setHasCopied] = React.useState(false);
  const [suggestion, setSuggestion] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    onChange(newValue);
    updateSuggestion(newValue);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = React.useCallback((acceptedFiles: File[]) => {
    setIsDragging(false);
    handleFiles(acceptedFiles);
  }, []);

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = event.clipboardData.items;
    const files = Array.from(items)
      .filter(item => item.type.indexOf('image') !== -1)
      .map(item => item.getAsFile())
      .filter((file): file is File => file !== null);
    
    if (files.length > 0) {
      event.preventDefault();
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/webp', 'image/tiff'];
    const validFiles = files.filter(file => allowedTypes.includes(file.type));
    validFiles.forEach(file => {
      onImageUpload(file);
    });
  };

  const updateSuggestion = (text: string) => {
    text
    // const lastWord = text.split(/\s/).pop() || '';
    // if (lastWord.length >= 2) {
    //   const matchingCommand = topHundredCommands.find(cmd => cmd.caption.startsWith(lastWord));
    //   setSuggestion(matchingCommand ? matchingCommand.caption : null);
    // } else {
    //   setSuggestion(null);
    // }
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
    <div className="space-y-4">
      <div 
        className={`relative ${isDragging ? 'bg-gray-100' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => {
          e.preventDefault();
          handleDrop(Array.from(e.dataTransfer.files));
        }}
      >
        <div
          ref={highlightRef}
          className="absolute top-0 left-0 right-0 pointer-events-none whitespace-pre-wrap break-words overflow-hidden box-border opacity-0 transition-opacity duration-150 ease-in-out"
          style={{
            padding: '0.5rem',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            lineHeight: '1.5',
            border: '1px solid transparent',
            opacity: error ? 1 : 0, // Add this line
          }}
        >
          {highlightedText}
        </div>
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Type your LaTeX here or drag and drop a screenshot."
            className="bg-transparent relative overflow-hidden min-h-[100px]"
            spellCheck={false}
            style={{
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              lineHeight: '1.5',
              boxSizing: 'border-box',
              border: '1px solid #ccc',
              padding: '0.5rem',
              width: '100%',
              resize: 'vertical',
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
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90">
            <div className="text-center">
              <div className="border p-2 rounded-md max-w-min mx-auto">
                <UploadCloud size={20} />
              </div>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold">Drop image here</span>
              </p>
            </div>
          </div>
        )}
      </div>
      <p className="text-red-400 mt-1 text-sm opacity-0 transition-opacity duration-150 ease-in-out" style={{ opacity: error ? 1 : 0 }}>
        {error?.message.replace(/^KaTeX parse error:\s*/i, '') || ""}
      </p>
      {suggestion && !!value && (
        <div className="text-sm text-gray-500 mt-1">
          Suggestion: {suggestion} (press Tab to complete)
        </div>
      )}
    </div>
  );
}