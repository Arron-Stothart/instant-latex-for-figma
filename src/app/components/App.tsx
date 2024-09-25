import React from 'react';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Menu } from 'lucide-react';
import SettingsMenuContent from './SettingsMenuContent';

function App() {
  React.useEffect(() => {
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      if (type === 'create-rectangles') {
        console.log(`Figma Says: ${message}`);
      }
    };
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-row space-x-2 items-center justify-between">
        <p className="text-lg font-medium">Real-time LaTeX</p>

        <div className="flex flex-row space-x-2 items-center justify-end">
          <Button variant="default">
            <p className="text-sm">View docs</p>
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

      <Textarea placeholder="Type your message here." />
    </div>
  );
}

export default App;
