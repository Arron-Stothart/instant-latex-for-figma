import React, { ChangeEvent } from 'react';

import { LaTeXArea } from '@/components/ui/latexarea';

interface LatexTextAreaProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export default function LatexTextArea({
  value,
  onChange,
}: LatexTextAreaProps) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return <LaTeXArea value={value} onChange={handleChange} placeholder="Type your message here." />
}