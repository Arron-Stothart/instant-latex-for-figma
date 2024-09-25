import React from 'react';
import { Textarea } from '@/components/ui/textarea';

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
      <Textarea placeholder="Type your message here." />
    </div>
  );
}

export default App;
