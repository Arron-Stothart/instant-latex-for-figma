import React from 'react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Menu } from 'lucide-react';
import SettingsMenuContent from './SettingsMenuContent';
import IntroductionCard from './IntroductionCard';
import LatexTextArea from './LatexTextArea';
import { renderLatex, validateLatex } from '@/lib/latexRendering';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

function App() {
  const [latexInput, setLatexInput] = React.useState<string | null>(null);
  const [latexError, setLatexError] = React.useState<string | null>(null);

  React.useEffect(() => {
    window.onmessage = (event) => {
      const { type, message, latex } = event.data.pluginMessage;
      if (type === 'render-latex-complete') {
        console.log(`Figma Says: ${message}`);
        setLatexError(null);
      } else if (type === 'render-latex-error') {
        console.error(`Figma Error: ${message}`);
        setLatexError(message);
      } else if (type === 'latex-frame-selected') {
        setLatexInput(latex);
      } else if (type === 'latex-frame-deselected') {
        setLatexInput('');
      }
    };
  }, []);

  const handleLatexChange = async (newLatex: string) => {
    setLatexInput(newLatex);
    const validationError = await validateLatex(newLatex);
    
    if (validationError) {
      setLatexError(validationError);
    } else {
      setLatexError(null);
      renderLatex(newLatex)
        .then((svgString) => {
          parent.postMessage({ pluginMessage: { type: 'render-latex-request', svg: svgString, latex: newLatex } }, '*');
        })
        .catch((renderError) => {
          console.error('Error rendering LaTeX:', renderError);
          setLatexError(renderError instanceof Error ? renderError.message : 'Unknown error rendering LaTeX');
        });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-row space-x-2 items-center justify-between">
        <p className="text-lg font-medium">Real-time LaTeX</p>

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
              <SettingsMenuContent />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <IntroductionCard />

      <LatexTextArea value={latexInput} onChange={handleLatexChange} />
      {latexError && <p className="text-red-500">{latexError}</p>}
      
    </div>
  );
}

export default App;
