import React from 'react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Menu } from 'lucide-react';
import SettingsMenu from './SettingsMenu';
import IntroductionCard from './IntroductionCard';
import LatexTextArea from './LatexTextArea';
import { renderLatex, validateLatexWithKaTeX } from '@/lib/latexRendering';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function App() {
  const [latexInput, setLatexInput] = React.useState<string | null>(null);
  const [latexError, setLatexError] = React.useState<{
    message: string;
    errorStart: number;
    errorEnd: number;
  } | null>(null);

  React.useEffect(() => {
    window.onmessage = (event) => {
      const { type, message, latex } = event.data.pluginMessage;
      if (type === 'render-latex-complete') {
        console.log(`Figma Says: ${message}`);
        setLatexError(null);
      } else if (type === 'render-latex-error') {
        console.error(`Figma Error: ${message}`);
        setLatexError({
          message: message,
          errorStart: 0,
          errorEnd: latexInput?.length || 0
        });
      } else if (type === 'latex-frame-selected') {
        setLatexInput(latex);
      } else if (type === 'latex-frame-deselected') {
        setLatexInput('');
      }
    };
  }, [latexInput]);

  const handleLatexChange = async (newLatex: string) => {
    setLatexInput(newLatex);
    const validationError = validateLatexWithKaTeX(newLatex);
    
    if (validationError) {
      setLatexError(validationError);
    } else {
      setLatexError(null);
      try {
        const svgString = await renderLatex(newLatex);
        parent.postMessage({ pluginMessage: { type: 'render-latex-request', svg: svgString, latex: newLatex } }, '*');
      } catch (renderError) {
        console.error('Error rendering LaTeX:', renderError);
        setLatexError({
          message: renderError instanceof Error ? renderError.message : 'Unknown error rendering LaTeX',
          errorStart: 0,
          errorEnd: newLatex.length,
        });
      }
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-row space-x-2 items-center justify-between">
        <div className="flex flex-row space-x-2 items-center">
          <Avatar className="w-6 h-6">
            <AvatarImage src="https://github.com/Arron-Stothart.png" />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <p className="text-lg font-medium">Instant LaTeX</p>
        </div>

        <div className="flex flex-row space-x-2 items-center justify-end">
          <Button variant="default" size="icon" asChild>
            <a href="https://github.com/Arron-Stothart/real-time-latex" target="_blank" rel="noopener noreferrer">
              <GitHubLogoIcon className="h-4 w-4" />
            </a>
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-100">
              <SettingsMenu />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <IntroductionCard />

      <LatexTextArea
        value={latexInput}
        onChange={handleLatexChange}
        error={latexError}
      />
      
    </div>
  );
}

export default App;
