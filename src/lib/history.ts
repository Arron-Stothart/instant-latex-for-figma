import { Settings } from './figmaStorage';

export interface HistoryItem {
  id: string;
  latex: string;
  svg: string;
  timestamp: number;
  settings: Partial<Settings>;
}

const HISTORY_KEY = 'latexHistory';
const MAX_HISTORY_ITEMS = 50;

export async function addToHistory(item: Omit<HistoryItem, 'timestamp'>): Promise<void> {
  const history = await getHistory();
  const newItem: HistoryItem = {
    ...item,
    timestamp: Date.now(),
  };

  const existingIndex = history.findIndex(h => h.id === newItem.id);
  if (existingIndex !== -1) {
    history.splice(existingIndex, 1);
  }

  history.unshift(newItem);

  if (history.length > MAX_HISTORY_ITEMS) {
    history.length = MAX_HISTORY_ITEMS;
  }

  await saveHistory(history);
}

export async function getHistory(): Promise<HistoryItem[]> {
  try {
    const storedHistory = await figma.clientStorage.getAsync(HISTORY_KEY);
    return storedHistory ? JSON.parse(storedHistory) : [];
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
}

async function saveHistory(history: HistoryItem[]): Promise<void> {
  try {
    await figma.clientStorage.setAsync(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving history:', error);
  }
}

export async function clearHistory(): Promise<void> {
  await figma.clientStorage.deleteAsync(HISTORY_KEY);
}