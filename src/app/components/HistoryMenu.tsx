import React from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HistoryItem } from '@/lib/history';

interface HistoryMenuProps {
  onClose: () => void;
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
}

const HistoryMenu: React.FC<HistoryMenuProps> = ({ onClose, history, onSelectItem }) => (
  <div className="h-full w-full p-4 space-y-4">
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-medium">History</h2>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
    <div className="h-[calc(100vh-100px)] overflow-y-auto">
      {history.map((item) => (
        <div
          key={item.id}
          className="p-2 hover:bg-gray-100 cursor-pointer rounded flex justify-between items-center"
        >
          <div className="flex-grow" onClick={() => {}}>
            <p className="font-mono text-sm truncate">{item.latex}</p>
            <p className="text-xs text-gray-500">
              {new Date(item.timestamp).toLocaleString()}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={() => onSelectItem(item)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default HistoryMenu;