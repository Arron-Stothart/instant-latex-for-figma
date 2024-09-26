import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Settings, saveSetting } from '@/lib/figmaStorage';
import { cn } from '@/lib/utils';

interface SettingsMenuProps {
  settings: Settings | null;
  setSettings: React.Dispatch<React.SetStateAction<Settings | null>>;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ settings, setSettings }) => {
  const handleSettingChange = async <K extends keyof Settings>(key: K, value: Settings[K]) => {
    try {
      await saveSetting(key, value);
      setSettings(prev => prev ? { ...prev, [key]: value } : null);
      parent.postMessage({ pluginMessage: { type: 'update-settings', key, value } }, '*');
    } catch (error) {
      console.error(`Error saving setting ${key}:`, error);
    }
  };

  if (!settings) return null;

  return (
    <div className="grid gap-4">
      <h4 className="font-medium leading-none">Settings</h4>
      
      <div className="grid gap-2">
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="font-selector">Font Family</Label>
          <Select value={settings.fontFamily} onValueChange={(value) => handleSettingChange('fontFamily', value)}>
            <SelectTrigger id="font-selector" className="col-span-2">
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TeX">MathJax TeX (default)</SelectItem>
              <SelectItem value="STIX-Web">STIX General</SelectItem>
              <SelectItem value="Asana-Math">Asana Math</SelectItem>
              <SelectItem value="Neo-Euler">Neo Euler</SelectItem>
              <SelectItem value="Gyre-Pagella">Gyre Pagella</SelectItem>
              <SelectItem value="Gyre-Termes">Gyre Termes</SelectItem>
              <SelectItem value="Latin-Modern">Latin Modern</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="openai-key">OpenAI API Key</Label>
          <Input
            id="openai-key"
            type="password"
            value={settings.openAIKey}
            onChange={(e) => handleSettingChange('openAIKey', e.target.value)}
            placeholder="Enter your OpenAI API key"
            className="col-span-2"
          />
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="anthropic-key">Anthropic API Key</Label>
          <Input
            id="anthropic-key"
            type="password"
            value={settings.anthropicKey}
            onChange={(e) => handleSettingChange('anthropicKey', e.target.value)}
            placeholder="Enter your Anthropic API key"
            className="col-span-2"
          />
        </div>
      
        <Separator className="my-2" />

        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="equation-size">Equation Size</Label>
          <div className="col-span-2 flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => handleSettingChange('equationSize', 0)}>Default</Button>
            <p className="text-sm text-muted-foreground">or</p>
            <div className="flex items-center gap-2 flex-grow max-w-[150px] justify-end text-right">
              <p className="text-sm text-muted-foreground whitespace-nowrap">{settings.equationSize || 100}px</p>
              <Slider
                id="equation-size"
                value={[settings.equationSize || 100]}
                onValueChange={([value]) => handleSettingChange('equationSize', value)}
                max={200}
                min={50}
                step={1}
                className={cn("flex-grow", settings.equationSize === 0 ? 'opacity-50' : '')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;