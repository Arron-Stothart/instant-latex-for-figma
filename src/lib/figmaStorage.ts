export interface Settings {
  fontFamily: string;
  openAIKey: string;
  anthropicKey: string;
  equationSize: number;
}

export const defaultSettings: Settings = {
  fontFamily: 'TeX',
  openAIKey: '',
  anthropicKey: '',
  equationSize: 0,
};

export async function loadSettings(): Promise<Settings> {
  const settings: Partial<Settings> = {};

  try {
    const fontFamily = await figma.clientStorage.getAsync('fontFamily');
    if (fontFamily !== undefined) settings.fontFamily = fontFamily as string;

    const openAIKey = await figma.clientStorage.getAsync('openAIKey');
    if (openAIKey !== undefined) settings.openAIKey = openAIKey as string;

    const anthropicKey = await figma.clientStorage.getAsync('anthropicKey');
    if (anthropicKey !== undefined) settings.anthropicKey = anthropicKey as string;

    const equationSize = await figma.clientStorage.getAsync('equationSize');
    if (equationSize !== undefined) settings.equationSize = equationSize as number;
  } catch (error) {
    console.error('Error loading settings from Figma storage:', error);
  }

  return { ...defaultSettings, ...settings };
}

export async function saveSetting<K extends keyof Settings>(key: K, value: Settings[K]): Promise<void> {
  try {
    await figma.clientStorage.setAsync(key, value);
  } catch (error) {
    console.error(`Error saving ${key} to Figma storage:`, error);
  }
}