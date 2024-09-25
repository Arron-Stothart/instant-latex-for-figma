import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

const SettingsMenuContent: React.FC = () => {
  return (
    <div className="grid gap-4">
      <h4 className="font-medium leading-none">Settings</h4>
      
      <div className="grid gap-2">
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="font-selector">Font Family</Label>
          <Select>
            <SelectTrigger id="font-selector" className="col-span-2">
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="arial">Arial</SelectItem>
              <SelectItem value="helvetica">Helvetica</SelectItem>
              <SelectItem value="times-new-roman">Times New Roman</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="openai-key">OpenAI API Key</Label>
          <Input
            id="openai-key"
            type="password"
            placeholder="Enter your OpenAI API key"
            className="col-span-2"
          />
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="anthropic-key">Anthropic API Key</Label>
          <Input
            id="anthropic-key"
            type="password"
            placeholder="Enter your Anthropic API key"
            className="col-span-2"
          />
        </div>
      
        <Separator className="my-2" />

        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="equation-size">Equation Size</Label>
          <div className="col-span-2 flex items-center gap-2">
            <Button variant="secondary" size="sm">Dynamic</Button>
            <p className="text-sm text-muted-foreground">or</p>
            <div className="flex items-center gap-2 flex-grow max-w-[150px]">
              <p className="text-sm text-muted-foreground whitespace-nowrap">24px</p>
              <Slider
                id="equation-size"
                defaultValue={[100]}
                max={200}
                min={50}
                step={1}
                className="flex-grow"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsMenuContent;