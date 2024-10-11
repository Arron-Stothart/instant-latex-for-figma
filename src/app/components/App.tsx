import React from 'react';
import { Menu } from 'lucide-react';
import SettingsMenu from './SettingsMenu';
import LatexInputArea from './LatexInputArea';
import { renderLatex, validateLatexWithKaTeX } from '@/lib/latexRendering';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import avatarImage from '@/assets/avatar.svg';
import { Settings } from '@/lib/figmaStorage';

function App() {
  const [latexInput, setLatexInput] = React.useState<string | null>(null);
  const [latexError, setLatexError] = React.useState<{
    message: string;
    errorStart: number;
    errorEnd: number;
  } | null>(null);
  const [stateSettings, setStateSettings] = React.useState<Settings | null>(null);

  React.useEffect(() => {
    window.onmessage = (event) => {
      const { type, message, latex, settings } = event.data.pluginMessage;
      if (type === 'settings-updated' || type === 'latex-frame-selected' || type === 'latex-frame-deselected') {
        if (settings) {
          setStateSettings(settings);
        }
      }
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
      }
      if (type === 'latex-frame-selected') {
        setLatexInput(latex);
      } else if (type === 'latex-frame-deselected') {
        setLatexInput('');
        setLatexError(null);
      }
    };

    parent.postMessage({ pluginMessage: { type: 'request-settings' } }, '*');
  }, []);

  const handleLatexChange = async (newLatex: string) => {
    setLatexInput(newLatex);
    const validationError = validateLatexWithKaTeX(newLatex);
        
        if (validationError) {
          setLatexError(validationError);
        } else {
          setLatexError(null);
          try {
        const svgString = await renderLatex(newLatex, stateSettings);
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

  const handleImageUpload = (file: File) => {
    console.log('Uploading file:', file.name);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-row space-x-2 items-center justify-between">
        <div className="flex flex-row space-x-2 items-center">
          <Avatar className="w-4 h-4 rounded-none">
            <AvatarImage src={avatarImage} alt="Avatar" />
          </Avatar>
          <p className="text-lg font-medium">Instant LaTeX</p>
        </div>

        <div className="flex flex-row space-x-2 items-center justify-end">
          <Button variant="default" size="icon" className="bg-[#1E1E1E] hover:bg-[#2E2E2E]" asChild>
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
              <SettingsMenu settings={stateSettings} setSettings={setStateSettings} />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <LatexInputArea
        value={latexInput}
        onChange={handleLatexChange}
        onImageUpload={handleImageUpload}
        error={latexError}
      />
      
    </div>
  );
}

export default App;
